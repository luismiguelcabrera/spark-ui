"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useLocale } from "../../lib/locale";
import { useControllable } from "../../hooks/use-controllable";

type YearPickerProps = {
  value?: number;
  defaultValue?: number;
  onChange?: (year: number) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minYear?: number;
  maxYear?: number;
};

function getDecadeStart(year: number) {
  return Math.floor(year / 10) * 10;
}

function YearPicker({
  value,
  defaultValue,
  onChange,
  label,
  error,
  placeholder,
  disabled,
  className,
  minYear,
  maxYear,
}: YearPickerProps) {
  const { t } = useLocale();

  const today = new Date();
  const currentYear = today.getFullYear();

  const [selected, setSelected] = useControllable<number | undefined>({
    value,
    defaultValue: defaultValue ?? undefined,
    onChange: onChange as ((value: number | undefined) => void) | undefined,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [decadeStart, setDecadeStart] = useState(
    getDecadeStart(selected ?? defaultValue ?? currentYear),
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const resolvedPlaceholder = placeholder ?? t("yearpicker.placeholder", "Select year");

  const years = Array.from({ length: 12 }, (_, i) => decadeStart + i);
  const decadeEnd = decadeStart + 11;

  const isDisabledYear = (year: number) => {
    if (minYear !== undefined && year < minYear) return true;
    if (maxYear !== undefined && year > maxYear) return true;
    return false;
  };

  const selectYear = (year: number) => {
    setSelected(year);
    setIsOpen(false);
  };

  const isSelected = (year: number) => selected !== undefined && selected === year;
  const isCurrent = (year: number) => currentYear === year;

  const displayValue = selected !== undefined ? `${selected}` : resolvedPlaceholder;

  return (
    <div ref={ref} className={cn("flex flex-col gap-1.5 relative", className)}>
      {label && <label className={s.textLabel}>{label}</label>}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          s.inputBase,
          s.inputFocus,
          "flex items-center gap-2 text-left",
          !selected && "text-muted-foreground",
          error && "border-destructive/50",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <Icon name="calendar_today" size="sm" className="text-muted-foreground" />
        <span>{displayValue}</span>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 bg-surface border border-muted rounded-2xl shadow-float p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              aria-label="Previous decade"
              onClick={() => setDecadeStart(decadeStart - 10)}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <Icon name="chevron_left" size="sm" />
            </button>
            <span className="text-sm font-semibold text-secondary">
              {decadeStart} &ndash; {decadeEnd}
            </span>
            <button
              type="button"
              aria-label="Next decade"
              onClick={() => setDecadeStart(decadeStart + 10)}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <Icon name="chevron_right" size="sm" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {years.map((year) => {
              const yearDisabled = isDisabledYear(year);
              return (
                <button
                  key={year}
                  type="button"
                  disabled={yearDisabled}
                  onClick={() => !yearDisabled && selectYear(year)}
                  className={cn(
                    "flex items-center justify-center h-10 rounded-lg text-sm font-medium transition-colors cursor-pointer hover:bg-muted/50",
                    isSelected(year) && "bg-primary text-white hover:bg-primary/90",
                    isCurrent(year) && !isSelected(year) && "bg-primary/10 text-primary font-bold",
                    yearDisabled && "opacity-50 pointer-events-none",
                  )}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
}

YearPicker.displayName = "YearPicker";

export { YearPicker };
export type { YearPickerProps };
