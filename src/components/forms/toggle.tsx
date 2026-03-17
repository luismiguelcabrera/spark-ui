"use client";

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

function Toggle({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  label,
  className,
}: ToggleProps) {
  const [isChecked, setIsChecked] = useControllable({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && (
        <span className={cn(s.textSecondary, disabled && "opacity-50")}>
          {label}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-label={label ?? "Toggle"}
        disabled={disabled}
        onClick={() => !disabled && setIsChecked(!isChecked)}
        className={cn(
          "w-9 h-5 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
          isChecked ? "bg-primary" : "bg-slate-300",
          disabled && "opacity-50 cursor-not-allowed"
        )}
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

export { Toggle };
export type { ToggleProps };
