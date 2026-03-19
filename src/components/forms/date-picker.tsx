"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useLocale } from "../../lib/locale";

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(date: Date, monthNames: string[]) {
  return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function DatePicker({
  value,
  onChange,
  placeholder,
  label,
  error,
  className,
}: DatePickerProps) {
  const { t } = useLocale();

  const monthNames = useMemo(
    () => [
      t("calendar.monthJanuary", "January"),
      t("calendar.monthFebruary", "February"),
      t("calendar.monthMarch", "March"),
      t("calendar.monthApril", "April"),
      t("calendar.monthMay", "May"),
      t("calendar.monthJune", "June"),
      t("calendar.monthJuly", "July"),
      t("calendar.monthAugust", "August"),
      t("calendar.monthSeptember", "September"),
      t("calendar.monthOctober", "October"),
      t("calendar.monthNovember", "November"),
      t("calendar.monthDecember", "December"),
    ],
    [t],
  );

  const dayLabels = useMemo(
    () => [
      t("datepicker.dayShortSu", "Su"),
      t("datepicker.dayShortMo", "Mo"),
      t("datepicker.dayShortTu", "Tu"),
      t("datepicker.dayShortWe", "We"),
      t("datepicker.dayShortTh", "Th"),
      t("datepicker.dayShortFr", "Fr"),
      t("datepicker.dayShortSa", "Sa"),
    ],
    [t],
  );

  const resolvedPlaceholder = placeholder ?? t("datepicker.pickDate", "Pick a date");

  const today = new Date();
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? today.getMonth());
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

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const selectDate = (day: number) => {
    const selected = new Date(viewYear, viewMonth, day);
    onChange?.(selected);
    setIsOpen(false);
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    return (
      value.getDate() === day &&
      value.getMonth() === viewMonth &&
      value.getFullYear() === viewYear
    );
  };

  const isToday = (day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === viewMonth &&
      today.getFullYear() === viewYear
    );
  };

  return (
    <div ref={ref} className={cn("flex flex-col gap-1.5 relative", className)}>
      {label && <label className={s.textLabel}>{label}</label>}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          s.inputBase,
          s.inputFocus,
          "flex items-center gap-2 text-left",
          !value && "text-slate-600",
          error && "border-red-300",
        )}
      >
        <Icon name="calendar_today" size="sm" className="text-slate-500" />
        <span>{value ? formatDate(value, monthNames) : resolvedPlaceholder}</span>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-float p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              aria-label={t("calendar.previousMonth", "Previous month")}
              onClick={prevMonth}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <Icon name="chevron_left" size="sm" />
            </button>
            <span className="text-sm font-semibold text-secondary">
              {monthNames[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              aria-label={t("calendar.nextMonth", "Next month")}
              onClick={nextMonth}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <Icon name="chevron_right" size="sm" />
            </button>
          </div>
          <div className="grid grid-cols-7 text-center mb-1">
            {dayLabels.map((d) => (
              <span key={d} className="py-1 text-[11px] font-semibold text-slate-600 uppercase">
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 text-center">
            {Array.from({ length: firstDay }).map((_, i) => (
              <span key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDate(day)}
                  className={cn(
                    "h-9 w-9 mx-auto rounded-lg text-sm font-medium transition-colors hover:bg-slate-50",
                    isSelected(day) && "bg-primary text-white hover:bg-primary/90",
                    isToday(day) && !isSelected(day) && "bg-primary/10 text-primary font-bold",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}

export { DatePicker };
export type { DatePickerProps };
