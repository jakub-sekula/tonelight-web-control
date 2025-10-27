import { LedSlider } from "@/components/LedSlider";
import { useSerial } from "@/SerialDeviceProvider";
import Card from "./Card";
import StatefulButton from "./StatefulButton";

export default function LedControl(props: React.HTMLAttributes<HTMLDivElement>) {
  const { deviceData, toggleDark, send, status } = useSerial();
  const leds: Partial<LedState> = deviceData.led ?? {};
  const sliders: { channel: LedChannel; color: LedColor; label: string }[] = [
    { channel: "r", color: "red", label: "Red" },
    { channel: "g", color: "green", label: "Green" },
    { channel: "b", color: "blue", label: "Blue" },
    { channel: "w", color: "white", label: "White" },
  ];
  return (
    <Card {...props}>
      {status == "connected" ? (
        <>
          <div className="flex justify-between pb-4 mb-4 items-center border-b border-neutral-800">
            <h2 className="text-lg font-semibold text-neutral-200">
              LED Control
            </h2>
            <StatefulButton
              activated={leds?.mode === "DARK"}
              size="xs"
              onClick={() => {
                toggleDark();
              }}
            >
              Dark
            </StatefulButton>
          </div>
          <div className="flex flex-col gap-8">
            {sliders.map(({ channel, color, label }) => (
              <LedSlider
                key={channel}
                label={label}
                color={color}
                value={leds[channel] ?? 0}
                onChange={(v) =>
                  send(
                    `led set ${channel} ${Math.round(
                      v
                    )}`
                  )
                }
              />
            ))}
          </div>
        </>
      ) : (
        "Device not connected"
      )}
    </Card>
  );
}
