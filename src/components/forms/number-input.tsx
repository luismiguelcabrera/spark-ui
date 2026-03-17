"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";
import { Icon } from "../data-display/icon";

type NumberInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value" | "defaultValue" | "size"> & {
  /** Current value */
  value?: number;
  /** Default value */
  defaultValue?: number;
  /** Callback when value changes */
  onChange?: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Precision (decimal places) */
  precision?: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Label */
  label?: string;
  /** Error message */
  error?: string;
  /** Whether to show stepper buttons */
  showStepper?: boolean;
  /** Format value for display */
  formatValue?: (value: number) => string;
  /** Parse display string back to number */
  parseValue?: (value: string) => number;
};

const sizeMap = {
  sm: "h-8 text-sm",
  md: "h-10 text-sm",
  lg: "h-12 text-base",
};

const buttonSizeMap = {
  sm: "w-7",
  md: "w-9",
  lg: "w-11",
};

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      value: valueProp,
      defaultValue = 0,
      onChange,
      min = -Infinity,
      max = Infinity,
      step = 1,
      precision,
      size = "md",
      label,
      error,
      disabled,
      showStepper = true,
      formatValue,
      parseValue,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useControllable({
      value: valueProp,
      defaultValue,
      onChange,
    });

    const clamp = (v: number) => {
      let clamped = Math.min(max, Math.max(min, v));
      if (precision !== undefined) {
        clamped = Number(clamped.toFixed(precision));
      }
      return clamped;
    };

    const increment = () => !disabled && setValue(clamp(value + step));
    const decrement = () => !disabled && setValue(clamp(value - step));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (raw === "" || raw === "-") return;
      const parsed = parseValue ? parseValue(raw) : Number(raw);
      if (!isNaN(parsed)) {
        setValue(clamp(parsed));
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        increment();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        decrement();
      }
    };

    const displayValue = formatValue ? formatValue(value) : precision !== undefined ? value.toFixed(precision) : String(value);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-slate-700">{label}</label>
        )}
        <div
          className={cn(
            "inline-flex items-center rounded-xl border bg-slate-50 transition-colors",
            "focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
            error ? "border-red-300" : "border-slate-200",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          {showStepper && (
            <button
              type="button"
              tabIndex={-1}
              onClick={decrement}
              disabled={disabled || value <= min}
              className={cn(
                "flex items-center justify-center border-r border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                buttonSizeMap[size],
                sizeMap[size]
              )}
              aria-label="Decrease value"
            >
              <Icon name="minus" size="sm" />
            </button>
          )}
          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            role="spinbutton"
            aria-valuemin={min === -Infinity ? undefined : min}
            aria-valuemax={max === Infinity ? undefined : max}
            aria-valuenow={value}
            value={displayValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={cn(
              "flex-1 min-w-0 bg-transparent text-center outline-none px-2",
              "disabled:cursor-not-allowed",
              sizeMap[size]
            )}
            {...props}
          />
          {showStepper && (
            <button
              type="button"
              tabIndex={-1}
              onClick={increment}
              disabled={disabled || value >= max}
              className={cn(
                "flex items-center justify-center border-l border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                buttonSizeMap[size],
                sizeMap[size]
              )}
              aria-label="Increase value"
            >
              <Icon name="plus" size="sm" />
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);
NumberInput.displayName = "NumberInput";

export { NumberInput };
export type { NumberInputProps };
