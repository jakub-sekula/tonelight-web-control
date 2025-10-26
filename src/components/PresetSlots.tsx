import { useSerial } from "@/SerialDeviceProvider";
import Card from "./Card";

export default function PresetSlots() {
  const { status } = useSerial();

  return (
    <Card title="Preset slots">
      {status == "connected" ? (
        <div>hi</div>
      ) : (
        "Device not connected"
      )}
    </Card>
  );
}
