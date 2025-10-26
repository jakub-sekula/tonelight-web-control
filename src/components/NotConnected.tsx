import clsx from "clsx";
import Card from "./Card";
import { Button } from "./ui/button";
import { useSerial } from "@/SerialDeviceProvider";

export default function NotConnected({ className }: { className: string }) {
  const { connect } = useSerial();
  return (
    <Card
      className={clsx(
        "w-full h-full flex items-center justify-center",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 text-center">

        <img src="/tonelight-45-red.png" className="w-48 animate-pulse"></img>
        <h1 className="text-2xl">toneLight not connected</h1>
        <p className="text-sm text-neutral-400 mb-4">
          Plug in a serial USB cable<br/>and press button to connect
        </p>
        <Button
        color='blue'
          onClick={connect}
          className="min-w-32"
        >
          Connect
        </Button>
      </div>
    </Card>
  );
}
