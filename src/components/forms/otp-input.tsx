"use client";

import { useRef, useCallback, KeyboardEvent, ClipboardEvent } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  className,
}: OtpInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, length - 1));
      inputs.current[clamped]?.focus();
    },
    [length],
  );

  const handleChange = useCallback(
    (index: number, char: string) => {
      if (!/^\d?$/.test(char)) return;
      const arr = value.split("");
      arr[index] = char;
      const newValue = arr.join("").slice(0, length);
      onChange(newValue);
      if (char && index < length - 1) {
        focusInput(index + 1);
      }
    },
    [value, length, onChange, focusInput],
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !value[index] && index > 0) {
        focusInput(index - 1);
      }
      if (e.key === "ArrowLeft") focusInput(index - 1);
      if (e.key === "ArrowRight") focusInput(index + 1);
    },
    [value, focusInput],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      onChange(pasted);
      focusInput(Math.min(pasted.length, length - 1));
    },
    [length, onChange, focusInput],
  );

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={value[i] || ""}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            s.inputBase,
            "w-12 h-14 text-center text-xl font-bold rounded-xl",
            "focus:ring-2 focus:ring-primary/20 focus:border-primary",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        />
      ))}
    </div>
  );
}
