import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useSerial } from "@/SerialDeviceProvider";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
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


type SerialConsoleFormValues = {
  level: DebugLevel;
};

export default function SerialConsoleSettingsDialog() {
  const { sendToQueue, deviceData } = useSerial();
  const [open, setOpen] = useState(false);

  const form = useForm<SerialConsoleFormValues>({
    defaultValues: {
      level: "info",
    },
  });

  // If device reports debug level, sync it
  const currentLevel = deviceData?.debug?.level as DebugLevel | undefined;

  useEffect(() => {
    if (currentLevel)
      form.reset({ level: currentLevel });
  }, [currentLevel, form]);

  const onSubmit = (data: SerialConsoleFormValues) => {
    sendToQueue(`debug level ${data.level}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            Serial Console Settings
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
              name="level"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center gap-3">
                  <FormLabel className="text-xs text-neutral-300">
                    Debug level
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(v) => field.onChange(v as DebugLevel)}
                    >
                      <SelectTrigger className="w-32 h-7 text-xs bg-black border-neutral-800 text-right justify-end">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="end">
                        {["API", "error", "warning", "info", "debug", "verbose"].map(
                          (level) => (
                            <SelectItem key={level} value={level} className="capitalize">
                              {level}
                            </SelectItem>
                          )
                        )}
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
