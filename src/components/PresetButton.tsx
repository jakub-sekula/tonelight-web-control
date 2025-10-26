import { Button } from "./ui/button";
import { getApproxRGBColor } from "@/utils/utils";
import { useSerial } from "@/SerialDeviceProvider";

export default function PresetButton({
  preset,
  index,
}: {
  preset: LedPresetState;
  index: number;
}) {
  const { loadPreset, savePreset } = useSerial();

  const rgb = getApproxRGBColor(preset);

  return (
    <Button
      key={index}
      type="button"
      glow="strong"
      onClick={() => loadPreset(index)} // left click → load
      onContextMenu={(e) => {
        e.preventDefault();
        savePreset(index);
      }}
      className={`
        rounded-full shrink max-w-36 w-full h-full relative aspect-square border-none
        bg-[linear-gradient(to_bottom,var(--btn-color-light),var(--btn-color-dark))]
        border border-[color-mix(in_srgb,var(--btn-color)_60%,black)]
        text-white
        hover:bg-[linear-gradient(to_bottom,var(--btn-color-dark),color-mix(in_srgb,var(--btn-color)_80%,black))]
        shadow-[0_0_16px_color-mix(in_srgb,var(--glow-color)_100%,transparent)]
        shadow-[0_0_25px_color-mix(in_srgb,var(--glow-color)_85%,transparent)]
        shadow-[0_0_40px_color-mix(in_srgb,var(--glow-color)_70%,transparent)]
        shadow-[0_0_60px_color-mix(in_srgb,var(--glow-color)_50%,transparent)]
      `}
      style={{
        ["--btn-color" as string]: rgb,
        ["--btn-color-light" as string]: `color-mix(in srgb, ${rgb} 85%, white)`,
        ["--btn-color-dark" as string]: `color-mix(in srgb, ${rgb} 90%, black)`,
        ["--glow-color" as string]: rgb,
      }}
      title={`Left-click: Load | Right-click: Save`}
    >
      <div className="absolute flex flex-col items-center justify-center text-lg font-semibold inset-2 rounded-full bg-black/50">
        <span>P{index + 1}</span>
        <ul className="text-xs font-light opacity-80">
          <li>kek</li>
        </ul>
      </div>
    </Button>
  );
}
