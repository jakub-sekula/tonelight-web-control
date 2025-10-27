import { Button } from "@/components/ui/button";
import { useSerial } from "@/SerialDeviceProvider";
import clsx from "clsx";

export default function ShutterButton(
  props: React.ComponentProps<typeof Button>
) {
  const { send } = useSerial();

  return (
    <Button
      {...props}
      onClick={(e) => {
        send("shutter shoot");
        props.onClick?.(e);
      }}
      className={clsx(props.className, "")}
    >
      Shoot
    </Button>
  );
}
