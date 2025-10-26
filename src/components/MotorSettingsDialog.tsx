import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useSerial } from "@/SerialDeviceProvider";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MotorFormValues = {
  travel_mm: number;
  jog_mm: number;
  backlash_mm: number;
  feed_speed: number;
  microsteps: number;
  roller_diameter: number;
  frames_in_auto: number;
  speed: number;
  accel: number;
};

export default function MotorSettingsDialog() {
  const { sendToQueue, deviceData } = useSerial();
  const [open, setOpen] = useState(false);

  const motor = deviceData?.motor;

  const form = useForm<MotorFormValues>({
    defaultValues: {
      travel_mm: motor?.travel_mm ?? 40,
      jog_mm: motor?.jog_mm ?? 2,
      backlash_mm: motor?.backlash_mm ?? 0.1,
      feed_speed: motor?.feed_speed ?? 5000,
      microsteps: motor?.microsteps ?? 16,
      roller_diameter: motor?.roller_diameter ?? 18.0,
      frames_in_auto: motor?.frames_auto ?? 36,
      speed: motor?.speed ?? 4000,
      accel: motor?.accel ?? 3000,
    },
  });

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (open && motor) {
      form.reset({
        travel_mm: motor.travel_mm ?? 40,
        jog_mm: motor.jog_mm ?? 2,
        backlash_mm: motor.backlash_mm ?? 0.1,
        feed_speed: motor.feed_speed ?? 5000,
        microsteps: motor.microsteps ?? 16,
        roller_diameter: motor.roller_diameter ?? 18.0,
        frames_in_auto: motor.frames_auto ?? 36,
        speed: motor.speed ?? 4000,
        accel: motor.accel ?? 3000,
      });
    }
  };

  useEffect(() => {
    if (!motor) return;
    form.reset({
      travel_mm: motor.travel_mm ?? 40,
      jog_mm: motor.jog_mm ?? 2,
      backlash_mm: motor.backlash_mm ?? 0.1,
      feed_speed: motor.feed_speed ?? 5000,
      microsteps: motor.microsteps ?? 16,
      roller_diameter: motor.roller_diameter ?? 18.0,
      frames_in_auto: motor.frames_auto ?? 36,
      speed: motor.speed ?? 4000,
      accel: motor.accel ?? 3000,
    });
  }, [motor, form]);

  const onSubmit = (data: MotorFormValues) => {
    const { dirtyFields } = form.formState;
    const cmds: string[] = [];

    if (dirtyFields.travel_mm) cmds.push(`motor travel ${data.travel_mm}`);
    if (dirtyFields.jog_mm) cmds.push(`motor jog ${data.jog_mm}`);
    if (dirtyFields.backlash_mm) cmds.push(`motor backlash ${data.backlash_mm}`);
    if (dirtyFields.feed_speed) cmds.push(`motor feedspeed ${data.feed_speed}`);
    if (dirtyFields.microsteps) cmds.push(`motor microsteps ${data.microsteps}`);
    if (dirtyFields.roller_diameter) cmds.push(`motor diameter ${data.roller_diameter}`);
    if (dirtyFields.frames_in_auto) cmds.push(`motor frames ${data.frames_in_auto}`);
    if (dirtyFields.speed) cmds.push(`motor speed ${data.speed}`);
    if (dirtyFields.accel) cmds.push(`motor accel ${data.accel}`);

    // Send only changed fields
    cmds.forEach((cmd) => sendToQueue(cmd));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="xs"
          className="bg-none border-none text-neutral-400 px-0 mr-auto mt-0.5"
        >
          <Settings size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-neutral-200 text-sm">
            Motor Settings
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-4"
            autoComplete="off"
          >
            {[
              { name: "travel_mm", label: "Travel (mm)", step: 0.1 },
              { name: "jog_mm", label: "Jog (mm)", step: 0.1 },
              { name: "backlash_mm", label: "Backlash (mm)", step: 0.01 },
              { name: "feed_speed", label: "Feed speed (steps/s)", step: 1 },
              { name: "roller_diameter", label: "Roller diameter (mm)", step: 0.01 },
              { name: "frames_in_auto", label: "Frames (auto mode)", step: 1 },
              { name: "speed", label: "Speed (steps/s)", step: 1 },
              { name: "accel", label: "Accel (steps/s²)", step: 1 },
            ].map(({ name, label, step }) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof MotorFormValues}
                render={({ field }) => (
                  <FormItem className="flex justify-between items-center gap-3">
                    <FormLabel className="text-xs text-neutral-300">
                      {label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step={step}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) || 0)
                        }
                        className="w-24 text-right text-xs bg-black border-neutral-800"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}

            {/* Microsteps (select) */}
            <FormField
              control={form.control}
              name="microsteps"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center gap-3">
                  <FormLabel className="text-xs text-neutral-300">
                    Microsteps
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={String(field.value)}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <SelectTrigger className="w-24 h-7 text-xs bg-black border-neutral-800 text-right justify-end">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="end">
                        {[1, 2, 4, 8, 16, 32].map((v) => (
                          <SelectItem key={v} value={String(v)}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="mt-2 flex justify-end">
              <Button
                type="submit"
                size="xs"
                className="text-xs font-light p-1.5 px-3 h-min border border-neutral-800 bg-linear-to-b from-neutral-800 hover:from-neutral-700 rounded-sm text-neutral-300"
              >
                Apply
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
