import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-light transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "text-neutral-300 border transform active:scale-[0.98] scale-100 bg-linear-to-b from-neutral-800 to-neutral-900 hover:from-neutral-800/80 border-neutral-800",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "text-xs font-light p-1.5 px-3 h-min",
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-sm gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-sm px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
      color: {
        default: "",
        amber:
          "bg-linear-to-b from-amber-500 to-amber-600 border border-amber-900 text-amber-50 hover:from-amber-600 hover:to-amber-700",
        green:
          "bg-linear-to-b from-green-500 to-green-600 border border-green-900 text-green-50 hover:from-green-600 hover:to-green-700",
        blue: "bg-linear-to-b from-blue-500 to-blue-800 border border-blue-900 text-blue-50 hover:from-blue-600 hover:to-blue-700",
        red: "bg-linear-to-b from-red-500 to-red-600 border border-red-900 text-red-50 hover:from-red-600 hover:to-red-700",
        purple:
          "bg-linear-to-b from-purple-500 to-purple-600 border border-purple-900 text-purple-50 hover:from-purple-600 hover:to-purple-700",
        grey: "bg-linear-to-b from-neutral-500 to-neutral-600 border border-neutral-900 text-neutral-50 hover:from-neutral-600 hover:to-neutral-700",
      },
      glow: {
        none: "",
        subtle: "shadow-[0_0_8px_var(--glow-color)]",
        strong:
          "shadow-[0_0_16px_color-mix(in_srgb,var(--glow-color)_100%,transparent)] shadow-[0_0_25px_color-mix(in_srgb,var(--glow-color)_85%,transparent)] shadow-[0_0_40px_color-mix(in_srgb,var(--glow-color)_70%,transparent)] shadow-[0_0_60px_color-mix(in_srgb,var(--glow-color)_50%,transparent)]",
      },
    },
    compoundVariants: [
      {
        color: "red",
        glow: "subtle",
        class: "[--glow-color:theme(colors.red.500)]",
      },
      {
        color: "red",
        glow: "strong",
        class: "[--glow-color:theme(colors.red.500)]",
      },

      {
        color: "green",
        glow: "subtle",
        class: "[--glow-color:theme(colors.green.500)]",
      },
      {
        color: "green",
        glow: "strong",
        class: "[--glow-color:theme(colors.green.500)]",
      },

      {
        color: "blue",
        glow: "subtle",
        class: "[--glow-color:theme(colors.blue.500)]",
      },
      {
        color: "blue",
        glow: "strong",
        class: "[--glow-color:theme(colors.blue.500)]",
      },

      {
        color: "purple",
        glow: "subtle",
        class: "[--glow-color:theme(colors.purple.500)]",
      },
      {
        color: "purple",
        glow: "strong",
        class: "[--glow-color:theme(colors.purple.500)]",
      },

      {
        color: "amber",
        glow: "subtle",
        class: "[--glow-color:theme(colors.amber.500)]",
      },
      {
        color: "amber",
        glow: "strong",
        class: "[--glow-color:theme(colors.amber.500)]",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      color: "default",
      glow: "none",
    },
  }
);

function Button({
  className,
  variant,
  size,
  color,
  glow,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, color, className, glow }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
