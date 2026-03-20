"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useLocale } from "../../lib/locale";
import { useControllable } from "../../hooks/use-controllable";

type MonthPickerValue = { month: number; year: number };

type MonthPickerProps = {
  value?: MonthPickerValue;
  defaultValue?: MonthPickerValue;
  onChange?: (value: MonthPickerValue) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: MonthPickerValue;
  maxDate?: MonthPickerValue;
};

function MonthPicker({
  value,
  defaultValue,
  onChange,
  label,
  error,
  placeholder,
  disabled,
  className,
  minDate,
  maxDate,
}: MonthPickerProps) {
  const { t } = useLocale();

  const today = new Date();
  const fallback: MonthPickerValue = { month: today.getMonth(), year: today.getFullYear() };

  const [selected, setSelected] = useControllable<MonthPickerValue | undefined>({
    value,
    defaultValue: defaultValue ?? undefined,
    onChange: onChange as ((value: MonthPickerValue | undefined) => void) | undefined,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    selected?.year ?? defaultValue?.year ?? fallback.year,
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

  const shortMonths = useMemo(
    () => [
      t("calendar.monthShortJan", "Jan"),
      t("calendar.monthShortFeb", "Feb"),
      t("calendar.monthShortMar", "Mar"),
      t("calendar.monthShortApr", "Apr"),
      t("calendar.monthShortMay", "May"),
      t("calendar.monthShortJun", "Jun"),
      t("calendar.monthShortJul", "Jul"),
      t("calendar.monthShortAug", "Aug"),
      t("calendar.monthShortSep", "Sep"),
      t("calendar.monthShortOct", "Oct"),
      t("calendar.monthShortNov", "Nov"),
      t("calendar.monthShortDec", "Dec"),
    ],
    [t],
  );

  const resolvedPlaceholder = placeholder ?? t("monthpicker.placeholder", "Select month");

  const isDisabledMonth = (month: number) => {
    if (minDate) {
      if (viewYear < minDate.year) return true;
      if (viewYear === minDate.year && month < minDate.month) return true;
    }
    if (maxDate) {
      if (viewYear > maxDate.year) return true;
      if (viewYear === maxDate.year && month > maxDate.month) return true;
    }
    return false;
  };

  const selectMonth = (month: number) => {
    setSelected({ month, year: viewYear });
    setIsOpen(false);
  };

  const isSelected = (month: number) =>
    selected !== undefined && selected.month === month && selected.year === viewYear;

  const isCurrent = (month: number) =>
    today.getMonth() === month && today.getFullYear() === viewYear;

  const displayValue = selected
    ? `${shortMonths[selected.month]} ${selected.year}`
    : resolvedPlaceholder;

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
              aria-label={t("calendar.previousYear", "Previous year")}
              onClick={() => setViewYear(viewYear - 1)}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <Icon name="chevron_left" size="sm" />
            </button>
            <span className="text-sm font-semibold text-secondary">{viewYear}</span>
            <button
              type="button"
              aria-label={t("calendar.nextYear", "Next year")}
              onClick={() => setViewYear(viewYear + 1)}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <Icon name="chevron_right" size="sm" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {shortMonths.map((name, i) => {
              const monthDisabled = isDisabledMonth(i);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={monthDisabled}
                  onClick={() => !monthDisabled && selectMonth(i)}
                  className={cn(
                    "flex items-center justify-center h-10 rounded-lg text-sm font-medium transition-colors cursor-pointer hover:bg-muted/50",
                    isSelected(i) && "bg-primary text-white hover:bg-primary/90",
                    isCurrent(i) && !isSelected(i) && "bg-primary/10 text-primary font-bold",
                    monthDisabled && "opacity-50 pointer-events-none",
                  )}
                >
                  {name}
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

MonthPicker.displayName = "MonthPicker";

export { MonthPicker };
export type { MonthPickerProps, MonthPickerValue };
