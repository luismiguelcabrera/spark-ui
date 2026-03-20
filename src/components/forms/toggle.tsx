"use client";

import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { useControllable } from "../../hooks/use-controllable";

type ToggleProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
};

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      label,
      className,
    },
    ref
  ) => {
    const [isChecked, setIsChecked] = useControllable({
      value: checked,
      defaultValue: defaultChecked,
      onChange: onCheckedChange,
    });

    return (
      <div className={cn("flex items-center gap-2", className)}>
        {label && (
          <span className={s.textSecondary}>
            {label}
          </span>
        )}
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={isChecked}
          aria-label={label || "Toggle"}
          disabled={disabled}
          onClick={() => setIsChecked(!isChecked)}
          className={cn(
            "w-9 h-5 rounded-full relative transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
            isChecked ? "bg-primary" : "bg-muted",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 bg-surface w-4 h-4 rounded-full shadow-sm transition-transform duration-200",
              isChecked ? "left-4" : "left-0.5"
            )}
          />
        </button>
      </div>
    );
  }
);
Toggle.displayName = "Toggle";

export { Toggle };
export type { ToggleProps };
