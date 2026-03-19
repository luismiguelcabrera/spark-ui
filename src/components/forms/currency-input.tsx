"use client";

import {
  forwardRef,
  useState,
  useCallback,
  type InputHTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";

type CurrencyInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange" | "value" | "defaultValue" | "size"
> & {
  /** Current numeric value (controlled) */
  value?: number;
  /** Default numeric value */
  defaultValue?: number;
  /** Callback when value changes */
  onChange?: (value: number) => void;
  /** ISO 4217 currency code */
  currency?: string;
  /** BCP 47 locale string */
  locale?: string;
  /** How to display the currency */
  currencyDisplay?: "symbol" | "code" | "name";
  /** Allow negative values */
  allowNegative?: boolean;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Decimal precision */
  precision?: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
};

const sizeMap = {
  sm: "h-8 text-sm",
  md: "h-10 text-sm",
  lg: "h-12 text-base",
};

/**
 * Get the currency symbol or code for display in the addon.
 */
function getCurrencySymbol(
  locale: string,
  currency: string,
  currencyDisplay: "symbol" | "code" | "name"
): string {
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay,
    }).formatToParts(0);

    const currencyPart = parts.find((p) => p.type === "currency");
    return currencyPart?.value ?? currency;
  } catch {
    return currency;
  }
}

/**
 * Format a number as currency string for display.
 */
function formatCurrency(
  value: number,
  locale: string,
  currency: string,
  currencyDisplay: "symbol" | "code" | "name",
  precision: number
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay,
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    }).format(value);
  } catch {
    return value.toFixed(precision);
  }
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      className,
      value: valueProp,
      defaultValue = 0,
      onChange,
      currency = "USD",
      locale = "en-US",
      currencyDisplay = "symbol",
      allowNegative = false,
      min,
      max,
      precision = 2,
      size = "md",
      label,
      error,
      disabled,
      onFocus,
      onBlur,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useControllable({
      value: valueProp,
      defaultValue,
      onChange,
    });

    const [isFocused, setIsFocused] = useState(false);

    const clamp = useCallback(
      (v: number): number => {
        let clamped = v;
        if (min !== undefined) clamped = Math.max(min, clamped);
        if (max !== undefined) clamped = Math.min(max, clamped);
        return Number(clamped.toFixed(precision));
      },
      [min, max, precision]
    );

    const symbol = getCurrencySymbol(locale, currency, currencyDisplay);

    const formattedValue = formatCurrency(
      value,
      locale,
      currency,
      currencyDisplay,
      precision
    );

    const rawValue =
      value === 0 && !isFocused ? "" : precision > 0 ? value.toFixed(precision) : String(value);

    const displayValue = isFocused
      ? rawValue
      : formattedValue;

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        // Select all text on focus for easy replacement
        requestAnimationFrame(() => {
          e.target.select();
        });
        onFocus?.(e);
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        // Re-clamp on blur
        const raw = e.target.value;
        if (raw === "" || raw === "-") {
          setValue(clamp(0));
        } else {
          const parsed = parseFloat(raw);
          if (!isNaN(parsed)) {
            setValue(clamp(parsed));
          }
        }
        onBlur?.(e);
      },
      [onBlur, clamp, setValue]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;

        // Allow empty or just minus sign while typing
        if (raw === "" || (raw === "-" && allowNegative)) return;

        // Validate the raw input format
        const regex = allowNegative
          ? /^-?\d*\.?\d*$/
          : /^\d*\.?\d*$/;

        if (!regex.test(raw)) return;

        const parsed = parseFloat(raw);
        if (!isNaN(parsed)) {
          setValue(clamp(parsed));
        }
      },
      [allowNegative, clamp, setValue]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow: digits, decimal, backspace, delete, tab, escape, enter, arrows, home, end, select-all
        const allowedKeys = [
          "Backspace",
          "Delete",
          "Tab",
          "Escape",
          "Enter",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Home",
          "End",
        ];

        if (allowedKeys.includes(e.key)) {
          onKeyDown?.(e);
          return;
        }

        // Allow Ctrl/Cmd + A, C, V, X
        if (
          (e.ctrlKey || e.metaKey) &&
          ["a", "c", "v", "x"].includes(e.key.toLowerCase())
        ) {
          onKeyDown?.(e);
          return;
        }

        // Allow digits
        if (/^\d$/.test(e.key)) {
          onKeyDown?.(e);
          return;
        }

        // Allow decimal point (only one)
        if (e.key === "." && precision > 0) {
          const target = e.target as HTMLInputElement;
          if (!target.value.includes(".")) {
            onKeyDown?.(e);
            return;
          }
        }

        // Allow minus sign at start
        if (e.key === "-" && allowNegative) {
          const target = e.target as HTMLInputElement;
          if (target.selectionStart === 0 && !target.value.includes("-")) {
            onKeyDown?.(e);
            return;
          }
        }

        // Block everything else
        e.preventDefault();
        onKeyDown?.(e);
      },
      [allowNegative, precision, onKeyDown]
    );

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
          <span
            className={cn(
              "flex items-center border-r border-slate-200 px-3 text-slate-600 bg-transparent select-none",
              sizeMap[size]
            )}
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            aria-label={label ?? "Currency input"}
            aria-invalid={error ? true : undefined}
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={cn(
              "flex-1 min-w-0 bg-transparent text-right outline-none px-3",
              "disabled:cursor-not-allowed",
              sizeMap[size]
            )}
            {...props}
          />
        </div>
        {error && (
          <p role="alert" className="text-xs text-red-600 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);
CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
export type { CurrencyInputProps };
