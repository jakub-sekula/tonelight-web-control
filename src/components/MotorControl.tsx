import { useSerial } from "@/SerialDeviceProvider";
import Card from "./Card";
import { Button } from "@/components/ui/button";
import MotorModeSelector from "./MotorModeSelector";
import MotorSettingsDialog from "./MotorSettingsDialog";

export default function MotorControl(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  const { deviceData, moveMotor, stopMotor, status } = useSerial();

  return (
    <Card {...props}>
      {status == "connected" ? (
        <>
          <div className="flex pb-4 mb-4 items-center border-b border-neutral-800">
            <h2 className="text-lg font-semibold text-neutral-200 mr-2">
              Motor controls
            </h2>
            <MotorSettingsDialog />
            <MotorModeSelector />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                moveMotor("backward", true);
              }}
              size="xs"
            >
              Jog -
            </Button>
            <Button
              onClick={() => {
                moveMotor("backward");
              }}
              size="xs"
            >
              Move backward
            </Button>
            <Button
              onClick={() => {
                moveMotor("forward");
              }}
              size="xs"
            >
              Move forward
            </Button>
            <Button
              onClick={() => {
                moveMotor("forward", true);
              }}
              size="xs"
            >
              Jog +
            </Button>
          </div>
          <Button
            color="red"
            onClick={() => {
              stopMotor();
            }}
            size="xs"
          >
            Stop
          </Button>
          <div className="flex pt-3 mt-4 items-center border-t border-neutral-800">
            <div className="flex flex-col min-w-24 ">
              <h4 className="text-xs text-neutral-500">Current frame</h4>
              <span className="text-sm text-white">{`${deviceData.motor?.current_frame} of ${deviceData.motor?.frames_auto}`}</span>
            </div>
            <div className="flex flex-col min-w-24 ">
              <h4 className="text-xs text-neutral-500">Travel distance</h4>
              <span className="text-sm text-white">{`${deviceData.motor?.travel_mm.toFixed(
                1
              )} mm`}</span>
            </div>
          </div>
        </>
      ) : (
        "Device not connected"
      )}
    </Card>
  );
}
