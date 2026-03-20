"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

type FabColor = "primary" | "secondary" | "destructive" | "success";
type FabSize = "sm" | "md" | "lg";
type FabPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

const fabVariants = cva(
  "inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0",
  {
    variants: {
      size: {
        sm: "h-10 w-10",
        md: "h-14 w-14",
        lg: "h-16 w-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const colorMap: Record<FabColor, string> = {
  primary:
    "bg-primary hover:bg-primary-dark text-white shadow-primary/30 focus-visible:ring-primary",
  secondary:
    "bg-secondary hover:bg-secondary-light text-white shadow-secondary/30 focus-visible:ring-secondary",
  destructive:
    "bg-destructive hover:bg-destructive/90 text-white shadow-destructive/30 focus-visible:ring-destructive",
  success:
    "bg-success hover:bg-success/90 text-white shadow-success/30 focus-visible:ring-success",
};

const positionMap: Record<FabPosition, string> = {
  "bottom-right": "fixed bottom-6 right-6",
  "bottom-left": "fixed bottom-6 left-6",
  "top-right": "fixed top-6 right-6",
  "top-left": "fixed top-6 left-6",
};

const iconSizeMap: Record<FabSize, "sm" | "md" | "lg"> = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

const extendedSizeMap: Record<FabSize, string> = {
  sm: "h-10 px-4 gap-1.5",
  md: "h-14 px-6 gap-2",
  lg: "h-16 px-8 gap-2.5",
};

type FabProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof fabVariants> & {
    /** Icon name */
    icon: string;
    /** Color palette */
    color?: FabColor;
    /** Position on screen — set to undefined to disable fixed positioning */
    position?: FabPosition;
    /** Show label alongside icon */
    extended?: boolean;
    /** Label text (displayed when extended) */
    label?: string;
  };

const Fab = forwardRef<HTMLButtonElement, FabProps>(
  (
    {
      className,
      icon,
      color = "primary",
      size = "md",
      position,
      extended = false,
      label,
      type = "button",
      disabled,
      ...props
    },
    ref
  ) => {
    // Dev warning for missing aria-label when there's no visible text
    if (
      typeof globalThis !== "undefined" &&
      !extended &&
      !label &&
      !props["aria-label"] &&
      !props["aria-labelledby"]
    ) {
      console.warn(
        "[spark-ui] Fab: Icon-only FABs require an `aria-label` or `aria-labelledby` for accessibility."
      );
    }

    const resolvedSize = size ?? "md";
    const isExtended = extended && label;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          isExtended
            ? cn(
                "inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
                "rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0",
                extendedSizeMap[resolvedSize]
              )
            : fabVariants({ size }),
          colorMap[color],
          position && positionMap[position],
          position && "z-50",
          className
        )}
        {...props}
      >
        <Icon name={icon} size={iconSizeMap[resolvedSize]} />
        {isExtended && (
          <span className="text-sm font-semibold">{label}</span>
        )}
      </button>
    );
  }
);
Fab.displayName = "Fab";

export { Fab, fabVariants };
export type { FabProps, FabColor, FabSize, FabPosition };
