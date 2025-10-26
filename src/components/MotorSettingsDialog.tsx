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

export default function MotorSettingsDialog() {
  const { sendToQueue, deviceData } = useSerial();
  const [open, setOpen] = useState(false);

  const motor = deviceData?.motor;

  const round = (v: number | undefined, decimals = 2) =>
    Number.isFinite(v) ? Number(v!.toFixed(decimals)) : 0;

  const form = useForm<MotorState>({
    defaultValues: {
      travel_mm: round(motor?.travel_mm, 2),
      jog_mm: round(motor?.jog_mm, 2),
      backlash_mm: round(motor?.backlash_mm, 3),
      feed_speed: round(motor?.feed_speed, 0),
      microsteps: motor?.microsteps ?? 0,
      roller_diameter: round(motor?.roller_diameter, 3),
      frames_auto: round(motor?.frames_auto, 0),
      max_speed: round(motor?.max_speed, 0),
      max_accel: round(motor?.max_accel, 0),
    },
  });

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (open && motor) {
      form.reset({
        travel_mm: round(motor.travel_mm, 2),
        jog_mm: round(motor.jog_mm, 2),
        backlash_mm: round(motor.backlash_mm, 3),
        feed_speed: round(motor.feed_speed, 0),
        microsteps: motor.microsteps ?? 0,
        roller_diameter: round(motor.roller_diameter, 3),
        frames_auto: round(motor.frames_auto, 0),
        max_speed: round(motor.max_speed, 0),
        max_accel: round(motor.max_accel, 0),
      });
    }
  };

  useEffect(() => {
    if (!motor) return;
    form.reset({
      travel_mm: round(motor.travel_mm, 2),
      jog_mm: round(motor.jog_mm, 2),
      backlash_mm: round(motor.backlash_mm, 3),
      feed_speed: round(motor.feed_speed, 0),
      microsteps: motor.microsteps ?? 0,
      roller_diameter: round(motor.roller_diameter, 3),
      frames_auto: round(motor.frames_auto, 0),
      max_speed: round(motor.max_speed, 0),
      max_accel: round(motor.max_accel, 0),
    });
  }, [motor, form]);

  const onSubmit = (data: MotorState) => {
    const { dirtyFields } = form.formState;
    const cmds: string[] = [];

    if (dirtyFields.travel_mm) cmds.push(`motor travel ${data.travel_mm}`);
    if (dirtyFields.jog_mm) cmds.push(`motor jog ${data.jog_mm}`);
    if (dirtyFields.backlash_mm)
      cmds.push(`motor backlash ${data.backlash_mm}`);
    if (dirtyFields.feed_speed) cmds.push(`motor feedspeed ${data.feed_speed}`);
    if (dirtyFields.microsteps)
      cmds.push(`motor microsteps ${data.microsteps}`);
    if (dirtyFields.roller_diameter)
      cmds.push(`motor diameter ${data.roller_diameter}`);
    if (dirtyFields.frames_auto) cmds.push(`motor frames ${data.frames_auto}`);
    if (dirtyFields.max_speed) cmds.push(`motor speed ${data.max_speed}`);
    if (dirtyFields.max_accel) cmds.push(`motor accel ${data.max_accel}`);

    cmds.forEach((cmd) => sendToQueue(cmd));
    setOpen(false);
  };

  const numericFields = [
    { name: "travel_mm", label: "Travel", step: null, unit: "mm", decimals: 2 },
    { name: "jog_mm", label: "Jog", step: null, unit: "mm", decimals: 2 },
    {
      name: "backlash_mm",
      label: "Backlash",
      step: null,
      unit: "mm",
      decimals: 2,
    },
    { name: "frames_auto", label: "Frames", step: 1, unit: "", decimals: 0 },
    {
      name: "max_speed",
      label: "Speed",
      step: 1,
      max: 4000,
      unit: "st/s",
      decimals: 0,
    },
    {
      name: "feed_speed",
      label: "Feed speed",
      step: 1,
      unit: "st/s",
      decimals: 0,
    },
    { name: "max_accel", label: "Accel", step: 1, unit: "st/s²", decimals: 0 },
    {
      name: "roller_diameter",
      label: "Roller diameter",
      step: null,
      unit: "mm",
      decimals: 3,
    },
  ] as const;

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
            {numericFields.map(({ name, label, step, unit, decimals }) => (
              <FormField
                key={name}
                control={form.control}
                name={
                  name as keyof Pick<
                    MotorState,
                    | "travel_mm"
                    | "jog_mm"
                    | "backlash_mm"
                    | "feed_speed"
                    | "roller_diameter"
                    | "frames_auto"
                    | "max_speed"
                    | "max_accel"
                  >
                }
                render={({ field }) => (
                  <FormItem className="flex justify-between items-center gap-3">
                    <FormLabel className="text-xs text-neutral-300 w-32">
                      {label}
                    </FormLabel>
                    <FormControl>
                      <div className="relative max-w-24">
                        <Input
                          type="number"
                          step={step ?? "any"}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            field.onChange(v === "" ? "" : Number(v));
                          }}
                          onBlur={(e) => {
                            const v = parseFloat(e.target.value);
                            if (!Number.isNaN(v)) {
                              const rounded = Number(v.toFixed(decimals));
                              field.onChange(rounded);
                              e.target.value = rounded.toFixed(decimals);
                            }
                          }}
                          className="w-full pr-5 text-left text-xs bg-black border-neutral-800"
                        />
                        {unit && (
                          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white/30 text-[10px] pointer-events-none">
                            {unit}
                          </span>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}

            {/* Microsteps select */}
            <FormField
              control={form.control}
              name="microsteps"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center gap-3">
                  <FormLabel className="text-xs text-neutral-300 w-32">
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
