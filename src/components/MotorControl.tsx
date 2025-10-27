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

          <div className="flex w-full h-24 gap-4">
            <Button
              onClick={() => {
                moveMotor("backward", true);
              }}
              size="xs"
              className="w-full grow-0 shrink max-h-none h-full"
            >
              Adjust -
            </Button>
            <Button
              onClick={() => {
                moveMotor("backward");
              }}
              className="w-full grow-0 shrink max-h-none h-full"
              size="xs"
            >
              Previous frame
            </Button>
            <Button
              onClick={() => {
                moveMotor("forward");
              }}
              className="w-full grow-0 shrink max-h-none h-full"
              size="xs"
            >
              Next frame
            </Button>
            <Button
              onClick={() => {
                moveMotor("forward", true);
              }}
              className="w-full grow-0 shrink max-h-none h-full"
              size="xs"
            >
              Adjust +
            </Button>
          </div>

          <div className="flex pt-3 mt-4 items-center border-t border-neutral-800">
            {deviceData.motor?.mode === "AUTO" ? (
              <div className="flex flex-col min-w-24 ">
                <h4 className="text-xs text-neutral-500">
                  Current frame
                </h4>
                <span className="text-sm text-white">{`${deviceData.motor?.current_frame} of ${deviceData.motor?.frames_auto}`}</span>
              </div>
            ) : null}

            <Button
              color="red"
              onClick={() => {
                stopMotor();
              }}
              // size="xs"
              className=" ml-auto"
            >
              E-Stop
            </Button>
          </div>
        </>
      ) : (
        "Device not connected"
      )}
    </Card>
  );
}
