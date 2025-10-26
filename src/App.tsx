import Header from "@/components/Header";
import SerialConsole from "./components/SerialConsole";
import LedControl from "./components/LedControl";
import MotorControl from "./components/MotorControl";
import ShutterControl from "./components/ShutterControl";
import PresetSlots from "./components/PresetSlots";
import SerialMonitor from "./components/SerialMonitor";
import { useSerial } from "./SerialDeviceProvider";
import NotConnected from "./components/NotConnected";
import { useGlobalKeys } from "./hooks/useGlobalKeys";

export default function App() {
  const {
    status,
    toggleDark,
    toggleTriplet,
    moveMotor,
    stopMotor,
    shoot,
    loadPreset,
  } = useSerial();

  useGlobalKeys((e) => {
    const n = Number(e.key);
    if (n >= 1 && n <= 9) {
      loadPreset(n - 1);
      return;
    }
    switch (e.key) {
      case "1":
        loadPreset(0);
        break;
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
      case "ArrowRight":
        e.preventDefault();
        moveMotor("forward", true);
        break;
      case "ArrowLeft":
        e.preventDefault();
        moveMotor("backward", true);
        break;
      default:
        break;
    }
  });

  return (
    <>
      <Header />
      <main className="grid grid-cols-12 w-full max-w-7xl mx-auto gap-4 px-4 xl:px-0">
        {status == "connected" ? (
          <>
            <div className="flex flex-col col-span-full md:col-span-6 gap-4">
              <LedControl />
              <MotorControl />
            </div>
            <div className="flex flex-col col-span-full md:col-span-6 gap-4">
              <PresetSlots />
              <ShutterControl />
            </div>
              <SerialConsole className="col-span-6" />
            <div className="col-span-full">
              <SerialMonitor />
            </div>
          </>
        ) : (
          <NotConnected className="col-span-full h-full min-h-[75vh]" />
        )}
      </main>
    </>
  );
}
