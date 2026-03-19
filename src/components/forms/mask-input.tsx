"use client";

import { forwardRef, useState, useRef, useCallback, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

type MaskInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "defaultValue"> & {
  /** Mask pattern: 9=digit, a=letter, *=any character */
  mask: string;
  /** Character shown for unfilled positions */
  maskChar?: string;
  /** Current value (unmasked raw characters) */
  value?: string;
  /** Default value (unmasked raw characters) */
  defaultValue?: string;
  /** Callback with the raw (unmasked) value */
  onChange?: (value: string) => void;
  /** Label */
  label?: string;
  /** Error message */
  error?: string;
  /** Hint text */
  hint?: string;
};

function isMaskChar(c: string): boolean {
  return c === "9" || c === "a" || c === "*";
}

function matchesMaskChar(maskChar: string, inputChar: string): boolean {
  switch (maskChar) {
    case "9":
      return /\d/.test(inputChar);
    case "a":
      return /[a-zA-Z]/.test(inputChar);
    case "*":
      return /[a-zA-Z0-9]/.test(inputChar);
    default:
      return false;
  }
}

/** Get the editable slot positions from the mask */
function getSlots(mask: string): number[] {
  const slots: number[] = [];
  for (let i = 0; i < mask.length; i++) {
    if (isMaskChar(mask[i])) {
      slots.push(i);
    }
  }
  return slots;
}

/** Build display string from raw value and mask */
function formatValue(mask: string, raw: string, placeholder: string): string {
  let result = "";
  let rawIndex = 0;
  for (let i = 0; i < mask.length; i++) {
    if (isMaskChar(mask[i])) {
      if (rawIndex < raw.length) {
        result += raw[rawIndex];
        rawIndex++;
      } else {
        result += placeholder;
      }
    } else {
      result += mask[i];
    }
  }
  return result;
}

const MaskInput = forwardRef<HTMLInputElement, MaskInputProps>(
  (
    {
      className,
      mask,
      maskChar = "_",
      value: valueProp,
      defaultValue = "",
      onChange,
      label,
      error,
      hint,
      disabled,
      id: idProp,
      ...props
    },
    ref
  ) => {
    const [internalRaw, setInternalRaw] = useState(defaultValue);
    const controlled = valueProp !== undefined;
    const raw = controlled ? valueProp : internalRaw;
    const inputRef = useRef<HTMLInputElement>(null);

    const slots = getSlots(mask);
    const displayValue = formatValue(mask, raw, maskChar);

    const setRaw = useCallback(
      (next: string) => {
        if (!controlled) setInternalRaw(next);
        onChange?.(next);
      },
      [controlled, onChange]
    );

    /** Find the cursor position for the next editable slot after rawIndex chars are filled */
    const getCursorForRawLength = useCallback(
      (rawLen: number) => {
        if (rawLen >= slots.length) return mask.length;
        return slots[rawLen];
      },
      [slots, mask.length]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = inputRef.current;
        if (!input) return;

        // Allow navigation keys
        if (
          e.key === "Tab" ||
          e.key === "Shift" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "Home" ||
          e.key === "End" ||
          e.ctrlKey ||
          e.metaKey
        ) {
          return;
        }

        e.preventDefault();

        if (e.key === "Backspace") {
          if (raw.length > 0) {
            const newRaw = raw.slice(0, -1);
            setRaw(newRaw);
            // Set cursor after microtask
            requestAnimationFrame(() => {
              const pos = getCursorForRawLength(newRaw.length);
              input.setSelectionRange(pos, pos);
            });
          }
          return;
        }

        if (e.key === "Delete") {
          // Delete works like backspace in mask mode
          if (raw.length > 0) {
            const newRaw = raw.slice(0, -1);
            setRaw(newRaw);
            requestAnimationFrame(() => {
              const pos = getCursorForRawLength(newRaw.length);
              input.setSelectionRange(pos, pos);
            });
          }
          return;
        }

        // Single character input
        if (e.key.length === 1) {
          const nextSlotIndex = raw.length;
          if (nextSlotIndex >= slots.length) return; // mask is full

          const maskCharAtSlot = mask[slots[nextSlotIndex]];
          if (matchesMaskChar(maskCharAtSlot, e.key)) {
            const newRaw = raw + e.key;
            setRaw(newRaw);
            requestAnimationFrame(() => {
              const pos = getCursorForRawLength(newRaw.length);
              input.setSelectionRange(pos, pos);
            });
          }
        }
      },
      [raw, setRaw, mask, slots, getCursorForRawLength]
    );

    const handleFocus = useCallback(() => {
      const input = inputRef.current;
      if (!input) return;
      requestAnimationFrame(() => {
        const pos = getCursorForRawLength(raw.length);
        input.setSelectionRange(pos, pos);
      });
    }, [raw.length, getCursorForRawLength]);

    const handleClick = useCallback(() => {
      const input = inputRef.current;
      if (!input) return;
      requestAnimationFrame(() => {
        const pos = getCursorForRawLength(raw.length);
        input.setSelectionRange(pos, pos);
      });
    }, [raw.length, getCursorForRawLength]);

    // Merge refs
    const mergedRef = useCallback(
      (el: HTMLInputElement | null) => {
        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
      },
      [ref]
    );

    const inputId = idProp ?? (label ? `mask-input-${mask.replace(/[^a-zA-Z0-9]/g, "")}` : undefined);

    if (!label && !error && !hint) {
      return (
        <input
          ref={mergedRef}
          id={inputId}
          type="text"
          value={displayValue}
          onChange={() => {}} // controlled via onKeyDown
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onClick={handleClick}
          disabled={disabled}
          className={cn(s.inputBase, s.inputFocus, s.inputDisabled, className)}
          aria-label={props["aria-label"] || `Masked input: ${mask}`}
          {...props}
        />
      );
    }

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <input
          ref={mergedRef}
          id={inputId}
          type="text"
          value={displayValue}
          onChange={() => {}} // controlled via onKeyDown
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            s.inputBase,
            s.inputFocus,
            s.inputDisabled,
            error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-600">{hint}</p>}
      </div>
    );
  }
);
MaskInput.displayName = "MaskInput";

export { MaskInput };
export type { MaskInputProps };
