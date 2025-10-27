import Header from "@/components/Header";
import LedControl from "@/components/LedControl";
import MotorControl from "@/components/MotorControl";
import ShutterControl from "@/components/ShutterControl";
import PresetSlots from "@/components/PresetSlots";
// import SerialMonitor from "@/components/SerialMonitor";
import { useSerial } from "@/SerialDeviceProvider";
import NotConnected from "@/components/NotConnected";
import { useGlobalKeys } from "@/hooks/useGlobalKeys";

export default function App() {
  const {
    status,
    toggleDark,
    toggleTriplet,
    moveMotor,
    stopMotor,
    feedForward,
    feedBackward,
    stopFeeding,
    shoot,
    loadPreset,
    setMotorMode,
    sendToQueue
  } = useSerial();

useGlobalKeys(
  (e) => {
    if (e.shiftKey && ["1", "2", "3"].includes(e.key)) {
      e.preventDefault();
      switch (e.key) {
        case "1":
          setMotorMode("MANUAL");
          break;
        case "2":
          setMotorMode("SEMI_AUTO");
          break;
        case "3":
          setMotorMode("AUTO");
          break;
      }
      return;
    }

    const n = Number(e.key);
    if (n >= 1 && n <= 9) {
      loadPreset(n - 1);
      return;
    }

    switch (e.key.toLowerCase()) {
      case "d":
        toggleDark();
        break;
      case "t":
        toggleTriplet();
        break;
      case "j":
        moveMotor("backward");
        break;
      case "k":
        stopMotor();
        break;
      case "l":
        moveMotor("forward");
        break;
      case "s":
        shoot();
        break;
      case "z":
        setMotorMode("MANUAL");
        break;
      case "x":
        setMotorMode("SEMI_AUTO");
        break;
      case "c":
        setMotorMode("AUTO");
        break;
      case "arrowright":
        e.preventDefault();
        moveMotor("forward", true);
        break;
      case "arrowleft":
        e.preventDefault();
        moveMotor("backward", true);
        break;
      default:
        break;
    }
  },
  (key, isDown) => {
    if (isDown) {
      if (key === "l") feedBackward();
      else if (key === "j") feedForward();
    } else {
      if (key === "j" || key === "l") stopFeeding();
    }
  },
  400
);


  return (
    <>
      <Header />
      <main className="grid grid-cols-12 w-full max-w-7xl mx-auto gap-4 px-4 xl:px-0 pb-20">
        {status == "connected" ? (
          <>
            <div className="flex flex-col col-span-full md:col-span-6 gap-4">
              <LedControl className="grow" />
              <ShutterControl className="w-1/2 shrink" />
            </div>
            <div className="flex flex-col col-span-full md:col-span-6 gap-4">
              <PresetSlots/>
              <MotorControl className="grow-0" />
            </div>
            {/* <div className="col-span-full">
              <SerialMonitor />
            </div> */}
          </>
        ) : (
          <NotConnected className="col-span-full h-full min-h-[75vh]" />
        )}
      </main>
    </>
  );
}
