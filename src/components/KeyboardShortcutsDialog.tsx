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
    { keys: ["1–9"], action: "Load preset 1-9" },
    { keys: ["D"], action: "Toggle dark mode" },
    { keys: ["T"], action: "Toggle RGB triplet mode" },
    { keys: ["S"], action: "Trigger shutter" },
    { keys: ["J"], action: "Move to previous frame" },
    { keys: ["L"], action: "Move to next frame" },
    { keys: ["←"], action: "Fine adjust left" },
    { keys: ["→"], action: "Fine adjust right" },
    { keys: ["K"], action: "Stop motor" },
    { keys: ["Z"], action: "Motor manual mode" },
    { keys: ["X"], action: "Motor semi-auto mode" },
    { keys: ["C"], action: "Motor auto mode" },
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

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className="text-lg text-left font-semibold text-neutral-200 mr-auto">
              Keyboard shortcuts
            </h2>
          </DialogTitle>
        </DialogHeader>

        <Table className="text-xs">
          <TableHeader className="border-neutral-900">
            <TableRow>
              <TableHead className="w-16 text-center border-r h-fit pb-2 border-neutral-900 text-neutral-400 font-normal">
                Key
              </TableHead>
              <TableHead className="text-neutral-400 h-fit pb-2 font-normal pl-4">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>{" "}
          <TableBody>
            {shortcuts.map((sc) => (
              <TableRow
                key={sc.action}
                className="border-b border-neutral-900 gap-0"
              >
                <TableCell className="font-mono border-r px-4 border-neutral-900 text-neutral-300 flex justify-center gap-1">
                  {sc.keys.map((k) => (
                    <kbd
                      key={k}
                      className="px-3 py-2 rounded-sm border border-neutral-800 bg-neutral-900 uppercase"
                    >
                      {k}
                    </kbd>
                  ))}
                </TableCell>
                <TableCell className="text-neutral-300 pl-4">
                  {sc.action}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
