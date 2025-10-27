import { useEffect, useState } from "react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";
import { useLedPresets } from "@/hooks/useLedPresets";
import PresetButton from "./PresetButton";
import { Trash2, ChevronDown } from "lucide-react";

export default function PresetSlots(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  const { status, deviceData, pushPreset } = useSerial();
  const { presets, savePresetsToLocalStorage, deletePresetFromLocalStorage } =
    useLedPresets();

  const [slots, setSlots] = useState<LedPresetState[]>([
    { r: 0, g: 0, b: 0, ir: 0, w: 0, channel: 0 },
    { r: 0, g: 0, b: 0, ir: 0, w: 0, channel: 0 },
    { r: 0, g: 0, b: 0, ir: 0, w: 0, channel: 0 },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    const devPresets = deviceData?.led?.presets;
    if (!devPresets) return;

    const firstThree: LedPresetState[] = [];
    for (let i = 0; i < 3; i++) {
      const p = devPresets[i];
      if (p)
        firstThree.push({
          r: p.r ?? 0,
          g: p.g ?? 0,
          b: p.b ?? 0,
          ir: p.ir ?? 0,
          w: p.w ?? 0,
          channel: p.channel ?? 0,
        });
      else firstThree.push({ r: 0, g: 0, b: 0, ir: 0, w: 0, channel: 0 });
    }
    setSlots(firstThree);
  }, [deviceData?.led?.presets]);

  if (status !== "connected")
    return <Card {...props}>Device not connected</Card>;

  const handleSavePreset = () => {
    if (!name.trim()) return;

    const preset = { name: name.trim(), slots };
    savePresetsToLocalStorage(name.trim(), preset);

    // Update UI selection to the newly saved preset
    setSelectedPreset(name.trim());

    setDialogOpen(false);
    setName("");
  };
  const handleDeletePreset = (presetName: string) => {
    if (
      confirm(
        `Delete preset "${presetName}" from local storage? This cannot be undone.`
      )
    ) {
      deletePresetFromLocalStorage(presetName);
      if (selectedPreset === presetName) setSelectedPreset("");
    }
  };

  const handleSelectPreset = (presetName: string) => {
    setSelectedPreset(presetName);
    setPopoverOpen(false);
    const preset = presets.find((p) => p.name === presetName);
    if (!preset) return;
    preset.slots.forEach((slot, i) => {
      pushPreset(i, {
        r: slot.r,
        g: slot.g,
        b: slot.b,
        ir: slot.ir,
        w: slot.w,
        channel: slot.channel ?? 0,
      });
    });
  };

  return (
    <Card {...props}>
      <div className="flex pb-4 items-center border-b border-neutral-800 justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-neutral-200">
            Preset slots
          </h2>

          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                size="xs"
                variant="outline"
                className="h-7 text-xs bg-black border-neutral-800 text-neutral-300 flex items-center gap-1"
              >
                {selectedPreset || "Select preset"}
                <ChevronDown size={14} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="p-1 w-44 bg-black border border-neutral-800"
            >
              {presets.length === 0 ? (
                <div className="text-neutral-500 text-xs px-3 py-2">
                  No presets saved
                </div>
              ) : (
                presets.map((p) => (
                  <div
                    key={p.name}
                    className="flex justify-between items-center text-xs px-2 py-1.5 rounded-sm hover:bg-neutral-800 cursor-pointer"
                    onClick={() => handleSelectPreset(p.name)}
                  >
                    <span className="truncate">{p.name}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-neutral-500 hover:text-red-500 hover:bg-transparent h-4 w-4 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePreset(p.name);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))
              )}
            </PopoverContent>
          </Popover>
        </div>

        {/* Save dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="xs"
              className="text-xs font-light p-1.5 px-3 h-min border border-neutral-800 bg-linear-to-b from-neutral-800 hover:from-neutral-700 rounded-sm text-neutral-300"
            >
              Save to local storage
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-neutral-200 text-sm">
                Save preset triplet
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
                  onClick={handleSavePreset}
                  className="text-xs font-light p-1.5 px-3 h-min border border-neutral-800 bg-linear-to-b from-neutral-800 hover:from-neutral-700 rounded-sm text-neutral-300"
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex w-full gap-4 pt-4 justify-around items-center">
        {slots.map((slot, i) => (
          <PresetButton key={i} preset={slot} index={i} />
        ))}
      </div>
      <div className="flex pt-3 mt-4 items-center border-t border-neutral-800">
        <span className="text-xs text-neutral-500">Left click to enable. Right click to save current settings to slot.</span>
      </div>
    </Card>
  );
}
