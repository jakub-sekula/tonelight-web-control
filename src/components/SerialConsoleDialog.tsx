import { useSerial } from "@/SerialDeviceProvider";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SerialConsoleSettingsDialog from "./SerialConsoleSettingsDialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { TerminalIcon } from "lucide-react";

export default function SerialConsoleDialog() {
  const { log, clearLog, send, status } = useSerial();
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const historyIndex = useRef<number | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTimeout(clearLog, 50);
  }, []);

  async function sendManual(e: React.FormEvent) {
    e.preventDefault();
    const cmd = command.trim();
    if (!cmd) return;

    if (cmd.toLowerCase() === "clear") {
      setHistory((h) => [...h, cmd]);
      historyIndex.current = null;
      setCommand("");
      clearLog();
      return;
    }

    send(cmd);
    setHistory((h) => [...h, cmd]);
    historyIndex.current = null;
    setCommand("");
  }

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    const newIndex =
      historyIndex.current === null
        ? history.length - 1
        : Math.max(historyIndex.current - 1, 0);
    setCommand(history[newIndex] ?? command);
    historyIndex.current = newIndex;
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIndex.current === null) return;
    const newIndex = historyIndex.current + 1;
    if (newIndex >= history.length) {
      setCommand("");
      historyIndex.current = null;
      return;
    }
    setCommand(history[newIndex]);
    historyIndex.current = newIndex;
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
    if (line.startsWith(">")) return "text-neutral-400";
    return "text-neutral-300";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="xs"
          className="bg-none border-none hover:text-emerald-500 text-neutral-400 aspect-square p-1 mt-0.5"
          title="Open serial console"
        >
          <TerminalIcon size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl bg-neutral-950 border border-neutral-800">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold text-neutral-200">
            Serial Console
          </DialogTitle>
          <SerialConsoleSettingsDialog />
        </DialogHeader>

        {status === "connected" ? (
          <>
            <div
              ref={logRef}
              className="h-96 overflow-y-auto bg-black p-4 mt-2 rounded text-xs font-mono whitespace-pre-wrap leading-5 border border-neutral-800"
            >
              {log.map((line, i) => (
                <div key={i} className={getLogColor(line)}>
                  {line}
                </div>
              ))}
            </div>

            <DialogFooter className="mt-4 flex gap-2">
              <form onSubmit={sendManual} className="flex gap-2 w-full">
                <Input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type command..."
                  className="w-full text-xs h-min rounded-sm border-neutral-800 bg-black selection:bg-neutral-600"
                />
                <Button type="submit" size="xs">
                  Send
                </Button>
              </form>
            </DialogFooter>
          </>
        ) : (
          <div className="text-neutral-400 text-sm mt-4">
            Device not connected
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
