import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Keyboard } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false);

  const shortcuts = [
    { keys: ["1–9"], action: "Load preset 0–8" },
    { keys: ["D"], action: "Toggle dark mode" },
    { keys: ["T"], action: "Toggle RGB triplet" },
    { keys: ["S"], action: "Trigger shutter (shoot)" },
    { keys: ["J"], action: "Move motor backward (travel)" },
    { keys: ["L"], action: "Move motor forward (travel)" },
    { keys: ["K"], action: "Stop motor" },
    { keys: ["←"], action: "Jog backward" },
    { keys: ["→"], action: "Jog forward" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="xs"
          className="bg-none border-none text-neutral-400 px-0 mt-0.5"
        >
          <Keyboard size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-neutral-200 text-sm">
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <Table className="text-xs">
          <TableHeader>
            <TableRow className="border-neutral-800">
              <TableHead className="w-32 text-neutral-400 font-normal">
                Key
              </TableHead>
              <TableHead className="text-neutral-400 font-normal">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shortcuts.map((sc) => (
              <TableRow key={sc.action} className="border-neutral-800">
                <TableCell className="font-mono text-neutral-300 flex gap-1">
                  {sc.keys.map((k) => (
                    <kbd
                      key={k}
                      className="px-2 py-0.5 rounded-sm border border-neutral-700 bg-neutral-900 text-[10px] uppercase"
                    >
                      {k}
                    </kbd>
                  ))}
                </TableCell>
                <TableCell className="text-neutral-300">{sc.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
