"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useLocale } from "../../lib/locale";

type DateTimePickerProps = {
  /** Current date-time value */
  value?: Date;
  /** Callback when date-time changes */
  onChange?: (date: Date) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Label above the trigger */
  label?: string;
  /** Error message below the trigger */
  error?: string;
  /** Additional class name */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** 12 or 24 hour format */
  format?: "12" | "24";
  /** Minute step interval */
  minuteStep?: number;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const pad = (n: number) => String(n).padStart(2, "0");

function formatDateTime(
  date: Date,
  monthShortNames: string[],
  format: "12" | "24",
) {
  const month = monthShortNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();

  if (format === "12") {
    const h12 = hour % 12 || 12;
    const ampm = hour < 12 ? "AM" : "PM";
    return `${month} ${day}, ${year} ${h12}:${pad(minute)} ${ampm}`;
  }
  return `${month} ${day}, ${year} ${pad(hour)}:${pad(minute)}`;
}

function DateTimePicker({
  value,
  onChange,
  placeholder,
  label,
  error,
  className,
  disabled = false,
  format = "24",
  minuteStep = 1,
  minDate,
  maxDate,
}: DateTimePickerProps) {
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

  const monthShortNames = useMemo(
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

  const resolvedPlaceholder =
    placeholder ?? t("datetimepicker.placeholder", "Select date and time");
  const nowLabel = t("datetimepicker.now", "Now");

  const today = new Date();
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    value?.getFullYear() ?? today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    value?.getMonth() ?? today.getMonth(),
  );
  const ref = useRef<HTMLDivElement>(null);

  // Track selected hour and minute internally so partial selections persist
  const [selectedHour, setSelectedHour] = useState<number>(
    value?.getHours() ?? today.getHours(),
  );
  const [selectedMinute, setSelectedMinute] = useState<number>(
    value?.getMinutes() ?? 0,
  );

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

  const hours =
    format === "12"
      ? Array.from({ length: 12 }, (_, i) => i + 1)
      : Array.from({ length: 24 }, (_, i) => i);

  const minutes = Array.from(
    { length: Math.ceil(60 / minuteStep) },
    (_, i) => i * minuteStep,
  );

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

  const buildDate = (
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
  ) => {
    return new Date(year, month, day, hour, minute);
  };

  const selectDate = (day: number) => {
    const hour = value?.getHours() ?? selectedHour;
    const minute = value?.getMinutes() ?? selectedMinute;
    const selected = buildDate(viewYear, viewMonth, day, hour, minute);
    onChange?.(selected);
  };

  const selectHour = (h: number) => {
    setSelectedHour(h);
    // For 12h format, convert display hour to 24h
    let hour24 = h;
    if (format === "12") {
      const currentAmPm = getAmPm();
      if (currentAmPm === "PM" && h !== 12) hour24 = h + 12;
      if (currentAmPm === "AM" && h === 12) hour24 = 0;
    }
    const year = value?.getFullYear() ?? viewYear;
    const month = value?.getMonth() ?? viewMonth;
    const day = value?.getDate() ?? today.getDate();
    const minute = value?.getMinutes() ?? selectedMinute;
    onChange?.(buildDate(year, month, day, hour24, minute));
  };

  const selectMinute = (m: number) => {
    setSelectedMinute(m);
    const year = value?.getFullYear() ?? viewYear;
    const month = value?.getMonth() ?? viewMonth;
    const day = value?.getDate() ?? today.getDate();
    const hour = value?.getHours() ?? selectedHour;
    onChange?.(buildDate(year, month, day, hour, m));
  };

  const getAmPm = (): "AM" | "PM" => {
    const hour = value?.getHours() ?? selectedHour;
    return hour < 12 ? "AM" : "PM";
  };

  const toggleAmPm = () => {
    const hour = value?.getHours() ?? selectedHour;
    const newHour = hour < 12 ? hour + 12 : hour - 12;
    setSelectedHour(newHour);
    const year = value?.getFullYear() ?? viewYear;
    const month = value?.getMonth() ?? viewMonth;
    const day = value?.getDate() ?? today.getDate();
    const minute = value?.getMinutes() ?? selectedMinute;
    onChange?.(buildDate(year, month, day, newHour, minute));
  };

  const getDisplay12Hour = (): number => {
    const hour = value?.getHours() ?? selectedHour;
    const h12 = hour % 12;
    return h12 === 0 ? 12 : h12;
  };

  const handleNow = () => {
    const now = new Date();
    onChange?.(now);
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedHour(now.getHours());
    setSelectedMinute(now.getMinutes());
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

  const isDateDisabled = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    if (minDate) {
      const min = new Date(
        minDate.getFullYear(),
        minDate.getMonth(),
        minDate.getDate(),
      );
      if (date < min) return true;
    }
    if (maxDate) {
      const max = new Date(
        maxDate.getFullYear(),
        maxDate.getMonth(),
        maxDate.getDate(),
      );
      if (date > max) return true;
    }
    return false;
  };

  return (
    <div ref={ref} className={cn("flex flex-col gap-1.5 relative", className)}>
      {label && <label className={s.textLabel}>{label}</label>}
      <button
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          s.inputBase,
          s.inputFocus,
          "flex items-center gap-2 text-left",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          !value && "text-slate-600",
          error && "border-red-300",
        )}
      >
        <Icon name="calendar_today" size="sm" className="text-slate-500" />
        <span className="flex-1">
          {value
            ? formatDateTime(value, monthShortNames, format)
            : resolvedPlaceholder}
        </span>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-float p-4">
          {/* Calendar header */}
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

          {/* Day labels */}
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

          {/* Calendar grid */}
          <div className="grid grid-cols-7 text-center">
            {Array.from({ length: firstDay }).map((_, i) => (
              <span key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateDisabled = isDateDisabled(day);
              return (
                <button
                  key={day}
                  type="button"
                  disabled={dateDisabled}
                  onClick={() => selectDate(day)}
                  className={cn(
                    "h-9 w-9 mx-auto rounded-lg text-sm font-medium transition-colors hover:bg-slate-50",
                    isSelected(day) &&
                      "bg-primary text-white hover:bg-primary/90",
                    isToday(day) &&
                      !isSelected(day) &&
                      "bg-primary/10 text-primary font-bold",
                    dateDisabled && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-3 h-px bg-slate-200" />

          {/* Time selector */}
          <div className="flex gap-2" data-testid="time-columns">
            {/* Hours */}
            <div className="flex-1">
              <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider text-center mb-1">
                Hour
              </div>
              <div className="max-h-36 overflow-y-auto space-y-0.5 pr-1 custom-scrollbar">
                {hours.map((h) => {
                  const isActiveHour =
                    format === "12"
                      ? getDisplay12Hour() === h
                      : (value?.getHours() ?? selectedHour) === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => selectHour(h)}
                      className={cn(
                        "px-3 py-1.5 text-sm cursor-pointer hover:bg-slate-50 rounded-lg text-center w-full",
                        isActiveHour
                          ? "bg-primary text-white"
                          : "text-slate-600",
                      )}
                    >
                      {pad(h)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-px bg-slate-200" />

            {/* Minutes */}
            <div className="flex-1">
              <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider text-center mb-1">
                Min
              </div>
              <div className="max-h-36 overflow-y-auto space-y-0.5 pr-1 custom-scrollbar">
                {minutes.map((m) => {
                  const isActiveMinute =
                    (value?.getMinutes() ?? selectedMinute) === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => selectMinute(m)}
                      className={cn(
                        "px-3 py-1.5 text-sm cursor-pointer hover:bg-slate-50 rounded-lg text-center w-full",
                        isActiveMinute
                          ? "bg-primary text-white"
                          : "text-slate-600",
                      )}
                    >
                      {pad(m)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AM/PM toggle for 12h format */}
            {format === "12" && (
              <>
                <div className="w-px bg-slate-200" />
                <div className="flex flex-col gap-1 justify-center">
                  <button
                    type="button"
                    onClick={() => getAmPm() !== "AM" && toggleAmPm()}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg font-medium transition-colors",
                      getAmPm() === "AM"
                        ? "bg-primary text-white"
                        : "text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => getAmPm() !== "PM" && toggleAmPm()}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg font-medium transition-colors",
                      getAmPm() === "PM"
                        ? "bg-primary text-white"
                        : "text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    PM
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Now button */}
          <button
            type="button"
            onClick={handleNow}
            className="mt-3 w-full py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            {nowLabel}
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}

DateTimePicker.displayName = "DateTimePicker";

export { DateTimePicker };
export type { DateTimePickerProps };
