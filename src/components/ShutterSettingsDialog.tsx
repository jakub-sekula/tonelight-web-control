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

type ShutterFormValues = {
  focus_time: number;
  hold_factor: number;
  fps: number;
  gap: number;
};

export default function ShutterSettingsDialog() {
  const { sendToQueue, deviceData } = useSerial();
  const [open, setOpen] = useState(false);

  const shutter = deviceData?.shutter;

  const form = useForm<ShutterFormValues>({
    defaultValues: {
      focus_time: shutter?.focus_time ?? 100,
      hold_factor: shutter?.hold_factor ?? 0.5,
      fps: shutter?.fps ?? 2,
      gap: shutter?.time_between_shots ?? 500,
    },
  });

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (open && shutter) {
      form.reset({
        focus_time: shutter.focus_time ?? 100,
        hold_factor: shutter.hold_factor ?? 0.5,
        fps: shutter.fps ?? 2,
        gap: shutter.time_between_shots ?? 500,
      });
    }
  };

  useEffect(() => {
    if (!shutter) return;
    form.reset({
      focus_time: shutter.focus_time ?? 100,
      hold_factor: shutter.hold_factor ?? 0.5,
      fps: shutter.fps ?? 2,
      gap: shutter.time_between_shots ?? 500,
    });
  }, [shutter, form]);

  const onSubmit = (data: ShutterFormValues) => {
    const { dirtyFields } = form.formState;
    const cmds: string[] = [];

    if (dirtyFields.focus_time) cmds.push(`shutter focus ${data.focus_time}`);
    if (dirtyFields.hold_factor) cmds.push(`shutter factor ${data.hold_factor}`);
    if (dirtyFields.fps) cmds.push(`shutter fps ${data.fps}`);
    if (dirtyFields.gap) cmds.push(`shutter gap ${data.gap}`);

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
            Shutter Settings
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-4"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="focus_time"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center gap-3">
                  <FormLabel className="text-xs text-neutral-300">
                    Focus time (ms)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      step={1}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                      className="w-24 text-right text-xs bg-black border-neutral-800"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hold_factor"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center gap-3">
                  <FormLabel className="text-xs text-neutral-300">
                    Hold factor
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0.1}
                      step={0.01}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                      className="w-24 text-right text-xs bg-black border-neutral-800"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fps"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center gap-3">
                  <FormLabel className="text-xs text-neutral-300">
                    FPS
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0.1}
                      step={0.1}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                      className="w-24 text-right text-xs bg-black border-neutral-800"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gap"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center gap-3">
                  <FormLabel className="text-xs text-neutral-300">
                    Gap between shots (ms)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                      className="w-24 text-right text-xs bg-black border-neutral-800"
                    />
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
