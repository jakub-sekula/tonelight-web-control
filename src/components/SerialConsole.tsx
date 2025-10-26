import { useSerial } from "@/SerialDeviceProvider";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card";
import { Input } from "./ui/input";
import SerialConsoleSettingsDialog from "./SerialConsoleSettingsDialog";

export default function SerialConsole(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  const { log, clearLog, send, status } = useSerial();
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);

  // Clear console on first load to hide initial state message
  useEffect(() => {
    setTimeout(clearLog, 50);
  }, []);

  async function sendManual(e: React.FormEvent) {
    e.preventDefault();
    const cmd = command.trim();
    if (!cmd) return;

    // Intercept the "clear" command
    if (cmd.toLowerCase() === "clear") {
      setHistory((h) => [...h, cmd]);
      setHistoryIndex(null);
      setCommand("");
      clearLog(); // <-- clear the console
      return;
    }

    send(cmd);
    setHistory((h) => [...h, cmd]);
    setHistoryIndex(null);
    setCommand("");
  }

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistoryIndex((i) => {
        const newIndex = i === null ? history.length - 1 : Math.max(i - 1, 0);
        setCommand(history[newIndex] ?? command);
        return newIndex;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistoryIndex((i) => {
        if (i === null) return null;
        const newIndex = i + 1;
        if (newIndex >= history.length) {
          setCommand("");
          return null;
        }
        setCommand(history[newIndex]);
        return newIndex;
      });
    }
  };

  const getLogColor = (line: string): string => {
    const lower = line.toLowerCase();
    if (lower.includes("[error]")) return "text-red-500";
    if (lower.includes("[warn]")) return "text-amber-400";
    if (lower.includes("[api]")) return "text-emerald-400";
    if (lower.includes("[info]")) return "text-green-400";
    if (lower.includes("[debug]")) return "text-purple-400";
    if (lower.includes("[verbose]")) return "text-gray-500";
    if (line.startsWith(">")) return "text-neutral-400"; // user command
    return "text-neutral-300";
  };

  return (
    <Card className={props.className}>
      {status === "connected" ? (
        <>
          <div className="flex pb-4 mb-4 items-center border-b border-neutral-800">
            <h2 className="text-lg font-semibold text-neutral-200 mr-2">
              Serial console
            </h2>
            <SerialConsoleSettingsDialog />
          </div>
          <div
            ref={logRef}
            className="h-80 overflow-y-auto bg-black  p-4 mt-4 rounded text-xs font-mono whitespace-pre-wrap leading-5"
          >
            {log.map((line, i) => (
              <div key={i} className={getLogColor(line)}>
                {line}
              </div>
            ))}
          </div>

          <form onSubmit={sendManual} className="mt-4 flex gap-2">
            <Input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type command..."
              className="w-full pr-4 text-left text-xs h-min rounded-sm border-neutral-800 bg-black selection:bg-neutral-600"
            />
            <Button type="submit" size="xs">
              Send
            </Button>
          </form>
        </>
      ) : (
        "Device not connected"
      )}
    </Card>
  );
}
