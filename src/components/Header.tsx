import { Button } from "@/components/ui/button";
import { useSerial } from "@/SerialDeviceProvider";
import {
  getIOModeString,
  getMotorStateString,
  getShutterStateString,
} from "@/utils/utils";

export default function Header() {
  const { disconnect, status, deviceData } = useSerial();

  const { motor, shutter, device } = deviceData;

  return (
    <header className="flex h-32 w-full justify-center px-4 lg:px-0 ">
      <div className="grid grid-cols-3 max-w-7xl w-full">
        <div className="flex items-center">
          <img src="/tone-logo-white.svg" className="h-6"></img>
        </div>
        <div className="flex gap-8 items-center justify-center">
          {status === "connected" ? (
            <>
              <div className="flex flex-col min-w-24 items-center justify-center text-center">
                <h4 className="text-xs text-neutral-500">Shutter</h4>
                <span className="text-sm text-white">
                  {getShutterStateString(shutter?.state)}
                </span>
              </div>
              <div className="flex flex-col min-w-24 items-center justify-center text-center">
                <h4 className="text-xs text-neutral-500">Motor</h4>
                <span className="text-sm text-white">
                  {getMotorStateString(motor?.state)}
                </span>
              </div>
              <div className="flex flex-col min-w-24 items-center justify-center text-center">
                <h4 className="text-xs text-neutral-500">IO mode</h4>
                <span className="text-sm text-white">
                  {getIOModeString(device?.mode)}
                </span>
              </div>
              <div className="flex flex-col min-w-24 items-center justify-center text-center">
                <h4 className="text-xs text-neutral-500">Status</h4>
                <span className="text-sm text-white capitalize">{status}</span>
              </div>
            </>
          ) : null}
        </div>
        <div className="flex gap-4 items-center justify-end">
          {status == "connected" ? (
            <Button
              onClick={disconnect}
              size="sm"
              className="bg-none border-red-600 hover:border-red-700 min-w-32 hover:bg-red-700/10 hover:text-red-500 text-red-500"
            >
              Disconnect
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
