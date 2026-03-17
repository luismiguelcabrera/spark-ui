"use client";

import { forwardRef, useState, useRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";
import { useClickOutside } from "../../hooks/use-click-outside";

type DateRange = {
  start: Date | null;
  end: Date | null;
};

type DateRangePickerProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  /** Current date range */
  value?: DateRange;
  /** Callback when range changes */
  onChange?: (range: DateRange) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Label */
  label?: string;
  /** Error message */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Date format function */
  formatDate?: (date: Date) => string;
};

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  return date >= start && date <= end;
}

const defaultFormat = (d: Date) =>
  `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      className,
      value,
      onChange,
      placeholder = "Select date range",
      label,
      error,
      disabled = false,
      minDate,
      maxDate,
      formatDate = defaultFormat,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [viewMonth, setViewMonth] = useState(new Date());
    const [selecting, setSelecting] = useState<"start" | "end">("start");
    const [tempStart, setTempStart] = useState<Date | null>(value?.start ?? null);
    const [tempEnd, setTempEnd] = useState<Date | null>(value?.end ?? null);
    const containerRef = useRef<HTMLDivElement>(null);

    useClickOutside(containerRef, () => setOpen(false), open);

    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonth = () => setViewMonth(new Date(year, month - 1, 1));
    const nextMonth = () => setViewMonth(new Date(year, month + 1, 1));

    const handleDayClick = (day: number) => {
      const date = new Date(year, month, day);

      if (selecting === "start") {
        setTempStart(date);
        setTempEnd(null);
        setSelecting("end");
      } else {
        if (tempStart && date < tempStart) {
          setTempStart(date);
          setTempEnd(tempStart);
        } else {
          setTempEnd(date);
        }
        setSelecting("start");
        onChange?.({ start: tempStart && date < tempStart ? date : tempStart, end: tempStart && date < tempStart ? tempStart : date });
        setOpen(false);
      }
    };

    const isDisabledDay = (day: number) => {
      const date = new Date(year, month, day);
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    };

    const displayValue =
      value?.start && value?.end
        ? `${formatDate(value.start)} — ${formatDate(value.end)}`
        : value?.start
        ? formatDate(value.start)
        : "";

    return (
      <div ref={containerRef} className={cn("relative", className)}>
        {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={cn(
            "flex items-center gap-2 w-full h-10 px-3 bg-slate-50 border rounded-xl text-sm transition-colors text-left",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error ? "border-red-300" : "border-slate-200"
          )}
        >
          <Icon name="calendar" size="sm" className="text-slate-400 shrink-0" />
          <span className={cn("flex-1 truncate", !displayValue && "text-slate-400")}>
            {displayValue || placeholder}
          </span>
          <Icon name="chevron-down" size="sm" className="text-slate-400 shrink-0" />
        </button>
        {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}

        {open && (
          <div
            ref={ref}
            className="absolute z-50 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-float p-4 w-[300px]"
            {...props}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <Icon name="chevron-left" size="sm" />
              </button>
              <span className="text-sm font-semibold text-secondary">
                {MONTHS[month]} {year}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <Icon name="chevron-right" size="sm" />
              </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[11px] font-semibold text-slate-400 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {/* Empty cells for offset */}
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {/* Day cells */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const date = new Date(year, month, day);
                const isStart = tempStart && isSameDay(date, tempStart);
                const isEnd = tempEnd && isSameDay(date, tempEnd);
                const inRange = isInRange(date, tempStart, tempEnd);
                const isToday = isSameDay(date, new Date());
                const dayDisabled = isDisabledDay(day);

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={dayDisabled}
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "relative h-9 flex items-center justify-center text-sm font-medium rounded-lg transition-colors",
                      "hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed",
                      isStart && "bg-primary text-white hover:bg-primary/90",
                      isEnd && "bg-primary text-white hover:bg-primary/90",
                      inRange && !isStart && !isEnd && "bg-primary/10 text-primary",
                      isToday && !isStart && !isEnd && "ring-1 ring-primary/30",
                      !isStart && !isEnd && !inRange && "text-slate-700"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Quick select hint */}
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400 text-center">
              {selecting === "start" ? "Select start date" : "Select end date"}
            </div>
          </div>
        )}
      </div>
    );
  }
);
DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker };
export type { DateRangePickerProps, DateRange };
