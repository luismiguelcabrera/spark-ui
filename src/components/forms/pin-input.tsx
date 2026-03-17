"use client";

import { forwardRef, useRef, useState, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type PinInputProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  /** Number of input fields */
  length?: number;
  /** Current value */
  value?: string;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Callback when all fields are filled */
  onComplete?: (value: string) => void;
  /** Input type */
  type?: "number" | "text" | "password";
  /** Placeholder character */
  placeholder?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Disabled state */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Auto-focus first input */
  autoFocus?: boolean;
  /** Mask input (for passwords) */
  mask?: boolean;
  /** Label */
  label?: string;
  /** Error message */
  errorMessage?: string;
};

const sizeMap = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
};

const PinInput = forwardRef<HTMLDivElement, PinInputProps>(
  (
    {
      className,
      length = 6,
      value: controlledValue,
      onChange,
      onComplete,
      type = "number",
      placeholder = "○",
      size = "md",
      disabled = false,
      error = false,
      autoFocus = false,
      mask = false,
      label,
      errorMessage,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(
      controlledValue ?? ""
    );
    const value = controlledValue ?? internalValue;
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const chars = value.split("").concat(Array(length).fill("")).slice(0, length);

    const updateValue = (newValue: string) => {
      if (controlledValue === undefined) setInternalValue(newValue);
      onChange?.(newValue);
      if (newValue.length === length) onComplete?.(newValue);
    };

    const focusInput = (index: number) => {
      const input = inputRefs.current[index];
      if (input) {
        input.focus();
        input.select();
      }
    };

    const handleInput = (index: number, char: string) => {
      if (disabled) return;
      if (type === "number" && !/^\d$/.test(char)) return;

      const newChars = [...chars];
      newChars[index] = char;
      const newValue = newChars.join("").replace(/\s/g, "");
      updateValue(newValue);

      if (index < length - 1) {
        focusInput(index + 1);
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const newChars = [...chars];
        if (chars[index]) {
          newChars[index] = "";
          updateValue(newChars.join("").trimEnd());
        } else if (index > 0) {
          newChars[index - 1] = "";
          updateValue(newChars.join("").trimEnd());
          focusInput(index - 1);
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        focusInput(index - 1);
      } else if (e.key === "ArrowRight" && index < length - 1) {
        focusInput(index + 1);
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").slice(0, length);
      if (type === "number" && !/^\d+$/.test(pasted)) return;
      updateValue(pasted);
      focusInput(Math.min(pasted.length, length - 1));
    };

    return (
      <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
        {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
        <div className="flex items-center gap-2">
          {Array.from({ length }, (_, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type={mask || type === "password" ? "password" : "text"}
              inputMode={type === "number" ? "numeric" : "text"}
              maxLength={1}
              value={chars[i] || ""}
              placeholder={placeholder}
              disabled={disabled}
              autoFocus={autoFocus && i === 0}
              onChange={(e) => {
                const char = e.target.value.slice(-1);
                if (char) handleInput(i, char);
              }}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              onFocus={(e) => e.target.select()}
              className={cn(
                "text-center font-semibold rounded-xl border bg-slate-50 transition-all",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "placeholder:text-slate-300",
                error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-slate-200",
                sizeMap[size]
              )}
              aria-label={`Pin digit ${i + 1}`}
            />
          ))}
        </div>
        {errorMessage && <p className="text-xs text-red-500 font-medium">{errorMessage}</p>}
      </div>
    );
  }
);
PinInput.displayName = "PinInput";

export { PinInput };
export type { PinInputProps };
