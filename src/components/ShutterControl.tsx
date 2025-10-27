import { useSerial } from "@/SerialDeviceProvider";
import Card from "@/components/Card";
import StatefulButton from "./StatefulButton";
import ShutterButton from "./ShutterButton";
import ShutterSettingsDialog from "./ShutterSettingsDialog";

export default function ShutterControl(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  const { status, send, deviceData } = useSerial();

  const { shutter } = deviceData;

  return (
    <Card {...props}>
      {status == "connected" ? (
        <>
          <div className="flex pb-4 mb-4 items-center border-b border-neutral-800">
            <h2 className="text-lg font-semibold text-neutral-200 mr-2">
              Shutter controls
            </h2>
            <ShutterSettingsDialog />
            <div className="flex gap-4">
              <StatefulButton
                activated={shutter?.triplet}
                size="xs"
                onClick={() => {
                  send("shutter triplet");
                }}
              >
                RGB triplet
              </StatefulButton>
              <StatefulButton
                size="xs"
                disabled
              >
                Capture IR
              </StatefulButton>
            </div>
          </div>
          <div className="flex grow gap-4">
            <ShutterButton className="w-full h-full max-h-none grow shrink-0"/>
          </div>
        </>
      ) : (
        "Device not connected"
      )}
    </Card>
  );
}
