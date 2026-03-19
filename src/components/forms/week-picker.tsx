"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useLocale } from "../../lib/locale";
import { useControllable } from "../../hooks/use-controllable";

type WeekPickerValue = { year: number; week: number };

type WeekPickerProps = {
  value?: WeekPickerValue;
  defaultValue?: WeekPickerValue;
  onChange?: (value: WeekPickerValue) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  /** 0 = Sunday, 1 = Monday (ISO default) */
  weekStartsOn?: 0 | 1;
};

/**
 * Returns the ISO 8601 week number for a date (weekStartsOn=1),
 * or a Sunday-start week number (weekStartsOn=0).
 */
function getWeekNumber(
  date: Date,
  weekStartsOn: 0 | 1 = 1,
): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

  if (weekStartsOn === 1) {
    // ISO 8601: week starts Monday, week 1 contains Jan 4
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return { year: d.getUTCFullYear(), week };
  }

  // Sunday-start: week 1 contains Jan 1
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const yearStartDay = yearStart.getUTCDay(); // 0=Sun
  const dayOfYear = Math.floor((d.getTime() - yearStart.getTime()) / 86400000);
  const week = Math.floor((dayOfYear + yearStartDay) / 7) + 1;
  return { year: d.getUTCFullYear(), week };
}

/**
 * Returns the start date (first day) of a given week.
 */
function getWeekStart(
  year: number,
  week: number,
  weekStartsOn: 0 | 1 = 1,
): Date {
  if (weekStartsOn === 1) {
    // ISO: find Jan 4 of that year, back up to Monday, then add (week-1)*7
    const jan4 = new Date(year, 0, 4);
    const dayOfWeek = jan4.getDay() || 7; // Mon=1..Sun=7
    const monday = new Date(jan4);
    monday.setDate(jan4.getDate() - (dayOfWeek - 1)); // Monday of week 1
    monday.setDate(monday.getDate() + (week - 1) * 7);
    return monday;
  }

  // Sunday-start: Jan 1 minus its day-of-week gives the Sunday of week 1
  const jan1 = new Date(year, 0, 1);
  const jan1Day = jan1.getDay(); // 0=Sun
  const sunday = new Date(jan1);
  sunday.setDate(jan1.getDate() - jan1Day + (week - 1) * 7);
  return sunday;
}

/**
 * Returns the end date (last day) of a given week.
 */
function getWeekEnd(
  year: number,
  week: number,
  weekStartsOn: 0 | 1 = 1,
): Date {
  const start = getWeekStart(year, week, weekStartsOn);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function WeekPicker({
  value,
  defaultValue,
  onChange,
  placeholder,
  label,
  error,
  disabled,
  className,
  weekStartsOn = 1,
}: WeekPickerProps) {
  const { t } = useLocale();

  const [selected, setSelected] = useControllable<WeekPickerValue | undefined>({
    value,
    defaultValue: defaultValue ?? undefined,
    onChange: onChange as ((value: WeekPickerValue | undefined) => void) | undefined,
  });

  const today = new Date();
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    selected?.year ?? defaultValue?.year ?? today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [hoverWeek, setHoverWeek] = useState<{ year: number; week: number } | null>(null);
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

  const allDayLabels = useMemo(
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

  // Reorder day labels based on weekStartsOn
  const dayLabels = useMemo(() => {
    if (weekStartsOn === 0) return allDayLabels;
    return [...allDayLabels.slice(weekStartsOn), ...allDayLabels.slice(0, weekStartsOn)];
  }, [allDayLabels, weekStartsOn]);

  const resolvedPlaceholder =
    placeholder ?? t("weekpicker.placeholder", "Select week");

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayRaw = getFirstDayOfMonth(viewYear, viewMonth);
  // Adjust first day offset for weekStartsOn
  const firstDay = (firstDayRaw - weekStartsOn + 7) % 7;

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

  const selectDay = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    const wk = getWeekNumber(date, weekStartsOn);
    setSelected(wk);
    setIsOpen(false);
  };

  const getWeekForDay = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    return getWeekNumber(date, weekStartsOn);
  };

  const isInWeek = (
    day: number,
    target: { year: number; week: number } | null | undefined,
  ) => {
    if (!target) return false;
    const wk = getWeekForDay(day);
    return wk.year === target.year && wk.week === target.week;
  };

  const isWeekStart = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === weekStartsOn;
  };

  const isWeekEnd = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    const dayOfWeek = date.getDay();
    const endDay = (weekStartsOn + 6) % 7;
    return dayOfWeek === endDay;
  };

  const formatDisplayValue = () => {
    if (!selected) return resolvedPlaceholder;
    const start = getWeekStart(selected.year, selected.week, weekStartsOn);
    const end = getWeekEnd(selected.year, selected.week, weekStartsOn);
    const startMonth = shortMonths[start.getMonth()];
    const endMonth = shortMonths[end.getMonth()];
    const startDay = start.getDate();
    const endDay = end.getDate();
    const endYear = end.getFullYear();

    if (start.getMonth() === end.getMonth()) {
      return `${startMonth} ${startDay} – ${endDay}, ${endYear}`;
    }
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${endYear}`;
  };

  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === viewMonth &&
    today.getFullYear() === viewYear;

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
          !selected && "text-slate-600",
          error && "border-red-300",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <Icon name="calendar_today" size="sm" className="text-slate-500" />
        <span>{formatDisplayValue()}</span>
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
              <span
                key={d}
                className="py-1 text-[11px] font-semibold text-slate-600 uppercase"
              >
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
              const inSelected = isInWeek(day, selected);
              const inHovered = isInWeek(day, hoverWeek);
              const weekStart = isWeekStart(day);
              const weekEnd = isWeekEnd(day);
              const firstOfMonth = day === 1;
              const lastOfMonth = day === daysInMonth;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  onMouseEnter={() => setHoverWeek(getWeekForDay(day))}
                  onMouseLeave={() => setHoverWeek(null)}
                  className={cn(
                    "h-9 w-full text-sm font-medium transition-colors",
                    // Row highlight on hover
                    !inSelected && inHovered && "bg-primary/10",
                    // Selected week row
                    inSelected && "bg-primary/10",
                    // Stronger highlight on first/last of selected week
                    inSelected &&
                      (weekStart || firstOfMonth) &&
                      "bg-primary text-white rounded-l-lg",
                    inSelected &&
                      (weekEnd || lastOfMonth) &&
                      "bg-primary text-white rounded-r-lg",
                    // Hover row rounding at edges
                    !inSelected &&
                      inHovered &&
                      (weekStart || firstOfMonth) &&
                      "rounded-l-lg",
                    !inSelected &&
                      inHovered &&
                      (weekEnd || lastOfMonth) &&
                      "rounded-r-lg",
                    // Today styling (when not selected)
                    isToday(day) && !inSelected && "text-primary font-bold",
                    // Default hover
                    !inSelected && !inHovered && "hover:bg-slate-50 rounded-lg",
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

WeekPicker.displayName = "WeekPicker";

export { WeekPicker, getWeekNumber, getWeekStart, getWeekEnd };
export type { WeekPickerProps, WeekPickerValue };
