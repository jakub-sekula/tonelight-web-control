import { useCallback, useEffect, useRef, useState } from "react";
import { useSerial } from "@/SerialDeviceProvider";

export interface LedPanelState {
  r: number;
  g: number;
  b: number;
  w: number;
  ir: number;
}

export interface LedPreset {
  name: string;
  slots: LedPanelState[]; // exactly 3
}

const STORAGE_KEY = "toneLedPresets";

export function useLedPresets() {
  const { deviceData, sendToQueue } = useSerial();
  const deviceRef = useRef(deviceData);

  useEffect(() => {
    deviceRef.current = deviceData;
  }, [deviceData]);

  const [presets, setPresets] = useState<LedPreset[]>([]);
  const [activePreset, setActivePreset] = useState<LedPreset>({
    name: "default",
    slots: [
      { r: 0, g: 0, b: 0, w: 0, ir: 0 },
      { r: 0, g: 0, b: 0, w: 0, ir: 0 },
      { r: 0, g: 0, b: 0, w: 0, ir: 0 },
    ],
  });

  // Load presets from storage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed: LedPreset[] = JSON.parse(raw);
      if (Array.isArray(parsed)) setPresets(parsed);
    } catch {
      console.warn("Invalid preset storage, resetting");
    }
  }, []);

  const persist = useCallback((list: LedPreset[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    setPresets(list);
  }, []);

  const selectPreset = (name: string) => {
    const found = presets.find((p) => p.name === name);
    if (found) setActivePreset(structuredClone(found));
  };

  // --- Save slot to current active preset ---
  const saveSlot = async (index: number) => {
    sendToQueue("status");
    await new Promise((r) => setTimeout(r, 150));
    const led = deviceRef.current?.led;
    if (!led) return;

    setActivePreset((prev) => {
      const updated = structuredClone(prev);
      updated.slots[index] = {
        r: led.r ?? 0,
        g: led.g ?? 0,
        b: led.b ?? 0,
        w: led.w ?? 0,
        ir: led.ir ?? 0,
      };
      return updated;
    });
  };

  // --- Save active preset as a new or updated named preset ---
  const savePreset = (name: string) => {
    const snapshot = structuredClone(activePreset);
    snapshot.name = name;

    const existingIndex = presets.findIndex((p) => p.name === name);
    const updatedList =
      existingIndex >= 0
        ? presets.map((p, i) => (i === existingIndex ? snapshot : p))
        : [...presets, snapshot];

    persist(updatedList);
    setActivePreset(snapshot);
  };

  const applySlot = (index: number) => {
    const slot = activePreset.slots[index];
    if (!slot) return;
    sendToQueue(`led set r ${slot.r}`);
    sendToQueue(`led set g ${slot.g}`);
    sendToQueue(`led set b ${slot.b}`);
    sendToQueue(`led set w ${slot.w}`);
    sendToQueue(`led set ir ${slot.ir}`);
    sendToQueue("status");
  };

  return {
    presets,
    activePreset,
    selectPreset,
    savePreset,
    saveSlot,
    applySlot,
  };
}
