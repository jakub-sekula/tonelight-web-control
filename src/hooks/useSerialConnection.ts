import { useCallback, useRef, useEffect, useState } from "react";

function useThrottledCallback(
  callback: (arg: string) => void | Promise<void>,
  delay: number
) {
  const lastCall = useRef(0);
  const timeout = useRef<number | null>(null);

  return useCallback(
    (arg: string) => {
      const now = performance.now();
      const remaining = delay - (now - lastCall.current);
      const invoke = () => {
        lastCall.current = performance.now();
        void callback(arg);
      };
      if (remaining <= 0) invoke();
      else {
        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = window.setTimeout(invoke, remaining);
      }
    },
    [callback, delay]
  );
}

export function useSerialDevice() {
  const [port, setPort] = useState<SerialPort | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [portInfo, setPortInfo] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error" | "reconnecting"
  >("disconnected");
  const [deviceData, setDeviceData] = useState<State>({});

  const readerRef = useRef<ReadableStreamDefaultReader<string> | null>(null);
  const writerRef = useRef<WritableStreamDefaultWriter<Uint8Array> | null>(
    null
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  const stripAnsi = (t: string) => t.replace(/\x1B\[[0-9;]*m/g, "");
  const appendLog = useCallback(
    (line: string) => setLog((p) => [...p.slice(-400), line]),
    []
  );

  // -------------------------------
  // SEND COMMAND
  // -------------------------------
  const send = useThrottledCallback(async (cmd: string) => {
    if (!writerRef.current) return;
    const encoder = new TextEncoder();
    await writerRef.current.write(encoder.encode(cmd.trim() + "\n"));
    appendLog("> " + cmd.trim());
  }, 50);

  // -------------------------------
  // COMMAND QUEUE SYSTEM
  // -------------------------------
  const commandQueue = useRef<string[]>([]);
  const queueBusy = useRef(false);

  const processQueue = async () => {
    if (queueBusy.current) return;
    queueBusy.current = true;

    try {
      while (commandQueue.current.length > 0 && writerRef.current) {
        const cmd = commandQueue.current.shift();
        if (!cmd) continue;

        const encoder = new TextEncoder();
        await writerRef.current.write(encoder.encode(cmd.trim() + "\n"));
        appendLog("> " + cmd.trim());

        // small inter-command delay to prevent merging
        await new Promise((res) => setTimeout(res, 5));
      }
    } finally {
      queueBusy.current = false;
    }
  };

  /**
   * Adds a command to the send queue.
   * Commands are guaranteed to be sent sequentially.
   */
  const sendToQueue = (cmd: string) => {
    commandQueue.current.push(cmd);
    void processQueue();
  };

  // -------------------------------
  // CONNECT
  // -------------------------------
  const connect = useCallback(async () => {
    try {
      setStatus("connecting");

      //@ts-expect-error temporarily not using this
      const filters = [
        { usbVendorId: 12346, usbProductId: 2 }, // Espressif VID/PID
      ];

      const selected = await navigator.serial.requestPort();
      await selected.open({ baudRate: 115200 });

      console.log(selected);

      // --- Wait for readable/writable streams ---
      const start = performance.now();
      while (
        (!selected.readable || !selected.writable) &&
        performance.now() - start < 1000
      ) {
        await new Promise((res) => setTimeout(res, 100));
      }
      if (!selected.readable || !selected.writable) {
        throw new Error("Serial port streams not available after open()");
      }

      // --- Port info ---
      const info = selected.getInfo();
      setPortInfo(
        info.usbVendorId || info.usbProductId
          ? `VID:${info.usbVendorId?.toString(16) ?? "?"} PID:${
              info.usbProductId?.toString(16) ?? "?"
            }`
          : "Unknown Port"
      );

      console.log(info);
      console.log(selected);

      // --- Reader ---
      const dec = new TextDecoderStream();
      const readerStream = selected.readable!.pipeThrough(
        dec as unknown as TransformStream<Uint8Array, string>
      );
      const reader = readerStream.getReader();
      const writer = selected.writable!.getWriter();

      readerRef.current = reader;
      writerRef.current = writer;
      abortControllerRef.current = new AbortController();

      setPort(selected);
      setStatus("connected");

      // --- Read loop ---
      (async () => {
        let buf = "";
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (!value) continue;
            if (abortControllerRef.current?.signal.aborted) break;

            buf += value;
            const lines = buf.split(/\r?\n/);
            buf = lines.pop() ?? "";
            for (const raw of lines) {
              const line = stripAnsi(raw).trim();
              if (!line) continue;
              if (line.startsWith("[API]")) {
                const txt = line.replace("[API]", "").trim();
                const [k, v] = txt.split("=");

                let val: unknown = v;

                if (k !== "led.presets") {
                  const num = parseFloat(v);

                  if (v === "true") {
                    val = true;
                  } else if (v === "false") {
                    val = false;
                  } else if (!isNaN(num)) {
                    val = num;
                  } else {
                    val = v;
                  }
                }

                // Firmware has a bug, w channel controls ir so need to swap responses
                let key = k;
                if (key.startsWith("led.")) {
                  if (key.includes(".w")) key = key.replace(".w", ".ir");
                  else if (key.includes(".ir")) key = key.replace(".ir", ".w");
                }

                setDeviceData((prev) => {
                  const next = structuredClone(prev);
                  const parts = k.split(".");
                  let obj: Record<string, unknown> = next;

                  // Special-case LED presets
                  if (k === "led.presets" && typeof val === "string") {
                    const presets: Record<number, LedPresetState> = {};

                    console.log(val);

                    val.split(";").forEach((entry) => {
                      const [idxPart, valuesPart] = entry.split(":");
                      const idx = Number(idxPart);
                      const nums = valuesPart?.split(".").map(Number);
                      if (!Number.isFinite(idx) || !nums || nums.length < 6)
                        return;

                      const [r, g, b, ir, w, channel] = nums;
                      presets[idx] = { r, g, b, ir, w, channel };
                    });

                    if (!next.led) next.led = {} as LedState;
                    next.led.presets = presets;
                    return next;
                  }

                  // Default nested assignment
                  for (let i = 0; i < parts.length - 1; i++) {
                    if (
                      typeof obj[parts[i]] !== "object" ||
                      obj[parts[i]] === null
                    )
                      obj[parts[i]] = {};
                    obj = obj[parts[i]] as Record<string, unknown>;
                  }

                  obj[parts[parts.length - 1]] = val;
                  return next;
                });
              }

              appendLog(line);
            }
          }
        } catch (err) {
          if (!abortControllerRef.current?.signal.aborted)
            console.warn("[Serial] read loop error", err);
        } finally {
          console.log("[Serial] Port reader finished");
          readerRef.current = null;
        }
      })();

      send("status");
    } catch (err) {
      console.error("[Serial] connection failed", err);
      setStatus("error");
      setPort(null);
    }
  }, [appendLog, send]);

  // -------------------------------
  // DISCONNECT
  // -------------------------------
  const disconnect = useCallback(async () => {
    console.log("[Serial] Disconnect requested");
    abortControllerRef.current?.abort();

    try {
      if (readerRef.current) {
        try {
          await readerRef.current.cancel();
        } catch (err) {
          console.warn("[Serial] Reader cancel error", err);
        }

        const reader = readerRef.current; // capture before potential nulling
        if (reader && typeof reader.releaseLock === "function") {
          try {
            reader.releaseLock();
          } catch (err) {
            console.warn("[Serial] Reader release error", err);
          }
        } else {
          console.log("[Serial] Reader already released");
        }

        readerRef.current = null;
      }

      if (writerRef.current) {
        try {
          await writerRef.current.close();
        } catch (err) {
          console.warn("[Serial] Writer close error", err);
        }
        try {
          writerRef.current.releaseLock();
        } catch (err) {
          console.warn("[Serial] Writer release error", err);
        }
        writerRef.current = null;
      }

      if (port) {
        try {
          await port.close();
          console.log("[Serial] Port closed");
        } catch (err) {
          console.warn("[Serial] Port close error", err);
        }
        setPort(null);
      }
    } catch (err) {
      console.error("[Serial] Disconnect failed", err);
    } finally {
      abortControllerRef.current = null;
      setStatus("disconnected");
    }
  }, [port]);

  // -------------------------------
  // CLEAN-UP ON DISCONNECT
  // -------------------------------
  useEffect(() => {
    const handleDisconnect = () => {
      console.warn("[Serial] Device disconnected");
      setStatus("disconnected");
      setPort(null);
      readerRef.current = null;
      writerRef.current = null;
    };

    navigator.serial.addEventListener("disconnect", handleDisconnect);

    return () => {
      navigator.serial.removeEventListener("disconnect", handleDisconnect);
    };
  }, [status, send, appendLog]);

  // helper functions
  const toggleDark = () => {
    console.log("Toggled dark mode");
    send("led dark");
  };

  const toggleTriplet = () => {
    console.log("Triggered shutter triplet");
    send("shutter triplet");
  };

  const moveMotor = (dir: "forward" | "backward", jog: boolean = false) => {
    const state = deviceData.motor?.state;
    if (state !== "IDLE") {
      console.warn("Motor not ready for another move!");
      return;
    }

    const steps = jog
      ? deviceData.motor?.jog_steps
      : deviceData.motor?.travel_steps;

    if (typeof steps !== "number" || steps <= 0) {
      console.warn("Invalid step count!");
      return;
    }

    console.log(`Motor ${jog ? "jogging" : "moving"} ${dir}`);
    send(`motor ${dir} ${steps}`);
  };

  const stopMotor = () => {
    console.log("Motor stopped");
    send("motor stop");
    send("status");
  };

  const setMotorMode = (val: "MANUAL" | "SEMI_AUTO" | "AUTO") => {
    const cmd =
      val === "SEMI_AUTO"
        ? "motor mode semi"
        : `motor mode ${val.toLowerCase()}`;
    send(cmd);
  };

  const shoot = () => {
    console.log("Releasing shutter");
    send("shutter shoot");
  };

  const loadPreset = (preset: number) => {
    if (preset > 8 || preset < 0) {
      console.warn("Incorrect preset number! Allowed 0-8");
      return;
    }
    console.log(`Loading preset slot ${preset}`);
    sendToQueue(`led preset load ${preset}`);
  };

  const savePreset = (preset: number) => {
    if (preset > 8 || preset < 0) {
      console.warn("Incorrect preset number! Allowed 0-8");
      return;
    }
    console.log(`Saving current panel state to preset slot ${preset}`);
    sendToQueue(`led preset save ${preset}`);
  };


  const pushPreset = (index: number, preset: LedPresetState) => {
    if (index > 8 || index < 0) {
      console.warn("Incorrect preset number! Allowed 0-8");
      return;
    }

    const presetString = `r.${preset.r} g.${preset.g} b.${preset.b} ir.${preset.ir} w.${preset.w} ch.${preset.channel}`;

    console.log(`Pushing preset to  slot ${index}`);
    sendToQueue(`led preset push ${index} ${presetString}`);
  };

  const clearLog = () => {
    setLog([]);
  };

  return {
    port,
    portInfo,
    status,
    log,
    deviceData,
    connect,
    disconnect,
    send,
    sendToQueue,
    toggleDark,
    toggleTriplet,
    moveMotor,
    stopMotor,
    setMotorMode,
    shoot,
    loadPreset,
    savePreset,
    pushPreset,
    clearLog,
  };
}
