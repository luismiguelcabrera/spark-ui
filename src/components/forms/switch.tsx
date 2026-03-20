"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";

type SwitchProps = Omit<HTMLAttributes<HTMLButtonElement>, "onChange"> & {
  /** Whether the switch is on */
  checked?: boolean;
  /** Default checked state */
  defaultChecked?: boolean;
  /** Callback when state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Color when checked */
  color?: "primary" | "secondary" | "success" | "warning" | "destructive" | "accent";
  /** Label text */
  label?: string;
  /** Description text */
  description?: string;
  /** Label placement */
  labelPlacement?: "left" | "right";
  /** Required indicator */
  required?: boolean;
};

const trackSizeMap = {
  sm: "w-7 h-4",
  md: "w-10 h-6",
  lg: "w-14 h-8",
};

const thumbSizeMap = {
  sm: "w-3 h-3",
  md: "w-4.5 h-4.5",
  lg: "w-6.5 h-6.5",
};

const thumbTranslateMap = {
  sm: "translate-x-3",
  md: "translate-x-4",
  lg: "translate-x-6",
};

const colorMap: Record<string, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  accent: "bg-accent",
};

const focusColorMap: Record<string, string> = {
  primary: "focus-visible:ring-primary",
  secondary: "focus-visible:ring-secondary",
  success: "focus-visible:ring-success",
  warning: "focus-visible:ring-warning",
  destructive: "focus-visible:ring-destructive",
  accent: "focus-visible:ring-accent",
};

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      size = "md",
      color = "primary",
      label,
      description,
      labelPlacement = "right",
      required,
      ...props
    },
    ref
  ) => {
    const [isChecked, setIsChecked] = useControllable({
      value: checked,
      defaultValue: defaultChecked,
      onChange: onCheckedChange,
    });

    const track = (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-label={label ?? "Switch"}
        aria-required={required}
        disabled={disabled}
        onClick={() => !disabled && setIsChecked(!isChecked)}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          trackSizeMap[size],
          isChecked ? colorMap[color] : "bg-muted",
          focusColorMap[color],
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none inline-block rounded-full bg-surface shadow-sm transition-transform",
            "absolute top-1/2 -translate-y-1/2 left-0.5",
            thumbSizeMap[size],
            isChecked && thumbTranslateMap[size]
          )}
        />
      </button>
    );

    if (!label && !description) return track;

    return (
      <div className={cn("flex items-start gap-3", labelPlacement === "left" && "flex-row-reverse")}>
        {track}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-navy-text">
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </span>
          {description && (
            <span className="text-xs text-muted-foreground">
              {description}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
export type { SwitchProps };
