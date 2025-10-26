import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useState } from "react";

type StatefulButtonProps = React.ComponentProps<typeof Button> & {
  activated?: boolean;
};

export default function StatefulButton({
  activated: controlledActive,
  onClick,
  className,
  children,
  ...rest
}: StatefulButtonProps) {
  const [internalActive, setInternalActive] = useState(false);
  const active = controlledActive ?? internalActive;

  return (
    <Button
      {...rest}
      onClick={(e) => {
        if (controlledActive === undefined) setInternalActive((v) => !v);
        onClick?.(e);
      }}
      className={clsx(
        active
          ? "border-amber-900 bg-linear-to-b from-neutral-800 hover:from-neutral-800/80"
          : "",
        className
      )}
    >
      {children}
      <div
        className={clsx(
          "ml-2 size-3 aspect-square rounded-full transition-all duration-200",
          active
            ? [
                // centred amber glow
                "bg-[radial-gradient(circle_at_center,#fbbf24_0%,#f59e0b_40%,transparent_80%)]",
                "shadow-[0_0_6px_2px_rgba(251,191,36,0.6)]",
              ]
            : [
                // neutral off state
                "bg-[radial-gradient(circle_at_center,#444_0%,#222_80%)]",
                "shadow-[inset_0_0_2px_rgba(0,0,0,0.8)]",
              ]
        )}
      />
    </Button>
  );
}
