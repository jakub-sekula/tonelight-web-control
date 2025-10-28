import { LedSlider } from "@/components/LedSlider";
import { useSerial } from "@/SerialDeviceProvider";
import Card from "./Card";
import StatefulButton from "./StatefulButton";

function mapChannelNameToIndex(channel: string): number {
  switch (channel) {
    case "r":
      return 0;
    case "g":
      return 1;
    case "b":
      return 2;
    case "ir":
      return 3;
    case "w":
      return 4;
    default:
      return -1;
  }
}

export default function LedControl(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  const { deviceData, toggleDark, sendToQueue, status, setActiveChannel } =
    useSerial();
  const leds: Partial<LedState> = deviceData.led ?? {};
  const currentChannel = leds.channel;
  const sliders: {
    channel: LedChannel;
    color: LedColor;
    label: string;
    index: number;
  }[] = [
    { channel: "r", color: "red", label: "Red", index: 0 },
    { channel: "g", color: "green", label: "Green", index: 1 },
    { channel: "b", color: "blue", label: "Blue", index: 2 },
    { channel: "w", color: "white", label: "White", index: 4 },
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
            {sliders.map(({ channel, color, label, index }) => (
              <LedSlider
                key={channel}
                label={label}
                color={color}
                value={leds[channel] ?? 0}
                onChange={(v) => {
                  if (
                    mapChannelNameToIndex(currentChannel as LedChannel) != index
                  ) {
                    setActiveChannel(index);
                  }
                  sendToQueue(`led set ${channel} ${Math.round(v)}`);
                }}
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
