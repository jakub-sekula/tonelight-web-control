import clsx from "clsx";
import { getStateColor } from "@/utils/utils";


export function HeaderStateIndicator({
  label,
  value,
  type,
}: {
  label: string;
  value?: string;
  type: "shutter" | "motor" | "io" | "status";
}) {
  const color = getStateColor(type, value);

  const glowClasses = {
    green: "before:bg-gradient-to-r before:from-transparent before:via-green-500 before:to-transparent after:from-green-500/30",
    amber: "before:bg-gradient-to-r before:from-transparent before:via-amber-500 before:to-transparent after:from-amber-500/30",
    red: "before:bg-gradient-to-r before:from-transparent before:via-red-500 before:to-transparent after:from-red-500/30",
    white: "before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent after:from-white/30",
    gray: "before:bg-gradient-to-r before:from-transparent before:via-neutral-500 before:to-transparent after:from-neutral-500/30",
  }[color];

  return (
    <div className="flex flex-col min-w-24 items-center justify-center text-center">
      <h4 className="text-xs text-neutral-500">{label}</h4>
      <span
        className={clsx(
          "relative text-sm capitalize text-white w-full pb-1",
          "before:absolute before:bottom-0 before:left-7 before:right-7 before:h-px before:rounded-full",
          "after:absolute after:-bottom-3 after:h-3 after:left-8 after:right-8  after:blur-md after:bg-linear-to-b",
          "z-10 after:-z-10",
          glowClasses
        )}
      >
        {value ?? "N/A"}
      </span>
    </div>
  );
}
