import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import clsx from "clsx";
import { Input } from "@/components/ui/input";

const colorClasses = {
  red: {
    track: "",
    range: "bg-red-500",
    thumb: "bg-red-500 border border-red-700 shadow-md",
  },
  green: {
    track: "",
    range: "bg-green-500",
    thumb: "bg-green-500 border border-green-700 shadow-md",
  },
  blue: {
    track: "",
    range: "bg-blue-500",
    thumb: "bg-blue-500 border border-blue-700 shadow-md",
  },
  white: {
    track: "",
    range: "bg-white",
    thumb: "bg-white border border-neutral-400 shadow-md",
  },
  infrared: {
    track: "",
    range: "bg-white",
    thumb: "bg-white border border-neutral-400 shadow-md",
  },
} as const;

type LedColor = keyof typeof colorClasses;

export function LedSlider({
  label,
  color,
  value,
  onChange,
  className,
}: {
  label: string;
  color: LedColor;
  value: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  const [localValue, setLocalValue] = useState(value);
  const [percent, setPercent] = useState(
    () => +((value / 1023) * 100).toFixed(1)
  );
  const [inputText, setInputText] = useState(percent.toFixed(1));

  useEffect(() => {
    const p = +((value / 1023) * 100).toFixed(1);
    setLocalValue(value);
    setPercent(p);
    setInputText(p.toFixed(1));
  }, [value]);

  const c = colorClasses[color];

  const applyPercent = (p: number) => {
    const clamped = Math.min(Math.max(p, 0), 100);
    const raw = Math.round((clamped / 100) * 1023);

    setPercent(clamped);
    setInputText(clamped.toFixed(1));
    setLocalValue(raw);
    onChange(raw); // immediate (no debounce)
  };

  return (
    <div className="flex flex-col">
      <span className="text-xs text-neutral-400 font-light">{label}</span>
      <div className="flex gap-4 items-center">
        <Slider
          min={0}
          max={1023}
          step={1}
          trackClassName={clsx(
            "h-5 rounded-full border border-neutral-800 bg-black",
            c.track
          )}
          rangeClassName={clsx(c.range)}
          thumbClassName={clsx(
            "size-6 rounded-full transition-all duration-150 hover:scale-110 focus-visible:ring-4 focus-visible:ring-white/30",
            c.thumb
          )}
          className={className}
          value={[localValue]}
          onValueChange={([v]) => {
            setLocalValue(v);
            const p = +((v / 1023) * 100).toFixed(1);
            setPercent(p);
            setInputText(p.toFixed(1));
            onChange(v); // slider updates immediately
          }}
        />
        <div className="relative max-w-20">
          <Input
            type="text"
            inputMode="decimal"
            min={0}
            max={100}
            step={0.1}
            value={inputText}
            onChange={(e) => {
              const v = e.target.value;

              if (/^[0-9]*\.?[0-9]*$/.test(v)) {
                setInputText(v);
              }
            }}
            onFocus={(e) => e.target.select()}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            onBlur={() => {
              const v = Number(inputText);
              if (!Number.isNaN(v)) applyPercent(v);
              else setInputText(percent.toFixed(1));
            }}
            className="w-full pr-4 text-left text-xs h-min rounded-sm border-neutral-800 bg-black selection:bg-neutral-600 max-w-fit"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 text-[10px] pointer-events-none">
            %
          </span>
        </div>
      </div>
    </div>
  );
}
