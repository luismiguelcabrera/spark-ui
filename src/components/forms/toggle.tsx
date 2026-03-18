"use client";

import { forwardRef, useCallback, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { useControllable } from "../../hooks/use-controllable";

type ToggleProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "defaultChecked" | "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
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
      ...props
    },
    ref
  ) => {
    const [isChecked, setIsChecked] = useControllable({
      value: checked,
      defaultValue: defaultChecked,
      onChange: onCheckedChange,
    });

    const handleClick = useCallback(() => {
      if (!disabled) {
        setIsChecked(!isChecked);
      }
    }, [disabled, isChecked, setIsChecked]);

    return (
      <div className={cn("flex items-center gap-2", className)}>
        {label && (
          <span className={cn(s.textSecondary, disabled && "opacity-50")}>
            {label}
          </span>
        )}
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={isChecked}
          disabled={disabled}
          onClick={handleClick}
          className={cn(
            "w-9 h-5 rounded-full relative transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
            isChecked ? "bg-primary" : "bg-slate-300",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none"
          )}
          {...props}
        >
          <span
            className={cn(
              "absolute top-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform",
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
