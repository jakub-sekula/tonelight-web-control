import { useLedPresets } from "@/hooks/useLedPresets";
import { useSerial } from "@/SerialDeviceProvider";
import Card from "./Card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { useState } from "react";

export default function PresetSlots(props: React.HTMLAttributes<HTMLDivElement>) {
  const { status } = useSerial();
  const { presets, activePreset, selectPreset, savePreset, saveSlot, applySlot } =
    useLedPresets();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");

  if (status !== "connected") return <Card {...props}>Device not connected</Card>;

  return (
    <Card {...props}>
      <div className="flex pb-4 mb-4 items-center border-b border-neutral-800 justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-neutral-200">Presets</h2>
          <Select
            value={activePreset.name}
            onValueChange={(v) => selectPreset(v)}
          >
            <SelectTrigger className="w-32 h-7 text-xs bg-black border-neutral-800 text-right justify-end">
              <SelectValue placeholder="Select preset" />
            </SelectTrigger>
            <SelectContent align="end">
              {presets.map((p) => (
                <SelectItem key={p.name} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="xs"
              className="text-xs font-light p-1.5 px-3 h-min border border-neutral-800 bg-linear-to-b from-neutral-800 hover:from-neutral-700 rounded-sm text-neutral-300"
            >
              Save preset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-neutral-200 text-sm">
                Save preset as
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Preset name"
                className="text-xs bg-black border-neutral-800"
              />
              <div className="flex justify-end">
                <Button
                  size="xs"
                  onClick={() => {
                    if (!name.trim()) return;
                    savePreset(name.trim());
                    setDialogOpen(false);
                    setName("");
                  }}
                  className="text-xs font-light p-1.5 px-3 h-min border border-neutral-800 bg-linear-to-b from-neutral-800 hover:from-neutral-700 rounded-sm text-neutral-300"
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-3">
        {activePreset.slots.map((slot, i) => (
          <div
            key={i}
            className="flex items-center justify-between border border-neutral-800 rounded-sm p-2"
          >
            <div className="text-xs text-neutral-400">
              Slot {i + 1}: R{slot.r} G{slot.g} B{slot.b} W{slot.w} IR{slot.ir}
            </div>

            <div className="flex gap-2">
              <Button
                size="xs"
                onClick={() => applySlot(i)}
                className="text-xs font-light px-3 h-min border border-neutral-800 bg-linear-to-b from-neutral-800 hover:from-neutral-700 rounded-sm text-neutral-300"
              >
                Load
              </Button>
              <Button
                size="xs"
                onClick={() => saveSlot(i)}
                className="text-xs font-light px-3 h-min border border-neutral-800 bg-linear-to-b from-neutral-800 hover:from-neutral-700 rounded-sm text-neutral-300"
              >
                Save current
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
