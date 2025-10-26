import { useSerial } from "@/SerialDeviceProvider";
import StatefulButton from "./StatefulButton";
import type React from "react";
import clsx from "clsx";

export default function MotorModeSelector(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  const { deviceData, setMotorMode } = useSerial();
  const mode = deviceData.motor?.mode ?? "MANUAL";

  const options = [
    { value: "MANUAL", label: "Manual" },
    { value: "SEMI_AUTO", label: "Semi-auto" },
    { value: "AUTO", label: "Auto" },
  ] as const;

  return (
    <div
      {...props}
      className={clsx(props.className, "flex items-center gap-3")}
    >
      {options.map(({ value, label }) => (
        <StatefulButton
          key={value}
          size="xs"
          activated={mode === value}
          onClick={() => setMotorMode(value)}
        >
          {label}
        </StatefulButton>
      ))}
    </div>
  );
}
