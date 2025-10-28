import { Button } from "@/components/ui/button";
import { useSerial } from "@/SerialDeviceProvider";
import {
  getIOModeString,
  getMotorStateString,
  getShutterStateString,
} from "@/utils/utils";
import KeyboardShortcutsDialog from "./KeyboardShortcutsDialog";
import { HeaderStateIndicator } from "./HeaderStateIndicator";
import SerialConsoleDialog from "./SerialConsoleDialog";

export default function Header({
  setDebug,
}: {
  setDebug: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { disconnect, status, deviceData } = useSerial();

  const { motor, shutter, device } = deviceData;

  return (
    <header className="flex h-32 w-full justify-center px-4 lg:px-0 ">
      <div className="grid grid-cols-3 max-w-7xl w-full">
        <div className="flex items-center">
          <img
            src="/tone-logo-white.svg"
            className="h-6"
            onDoubleClick={() => setDebug((prev) => !prev)}
          ></img>
        </div>
        <div className="flex gap-8 items-center justify-center">
          {status === "connected" ? (
            <>
              <HeaderStateIndicator
                label="Shutter"
                value={getShutterStateString(shutter?.state)}
                type="shutter"
              />
              <HeaderStateIndicator
                label="Motor"
                value={getMotorStateString(motor?.state)}
                type="motor"
              />
              <HeaderStateIndicator
                label="Front IO"
                value={getIOModeString(device?.mode)}
                type="io"
              />
            </>
          ) : null}
          <HeaderStateIndicator label="Status" value={status} type="status" />
        </div>
        <div className="flex gap-4 items-center justify-end">
          <KeyboardShortcutsDialog />
          <SerialConsoleDialog />
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
