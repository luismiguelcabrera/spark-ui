"use client";

import { useState, useMemo, useCallback, forwardRef } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "./icon";
import { useControllable } from "../../hooks/use-controllable";

type CalendarDay = {
  day: number;
  muted?: boolean;
  today?: boolean;
  selected?: boolean;
  hasEvent?: boolean;
  /** Range: first selected date */
  rangeStart?: boolean;
  /** Range: last selected date */
  rangeEnd?: boolean;
  /** Range: between start and end */
  inRange?: boolean;
};

type CalendarMode = "single" | "multiple" | "range";

type CalendarProps = {
  /** Selection mode: single date, multiple dates, or date range */
  mode?: CalendarMode;
  /** Month name (auto-mode uses navigation) */
  month?: string;
  /** Year (auto-mode uses navigation) */
  year?: number;
  /** Manual day entries (disables auto-mode) */
  days?: CalendarDay[];
  /** Selected day (single mode) */
  selected?: number;
  /** Default selected day (single mode, uncontrolled) */
  defaultSelected?: number;
  /** Callback when a day is selected (single mode) */
  onSelect?: (day: number) => void;
  /** Selected days (multiple mode) */
  selectedDates?: number[];
  /** Default selected days (multiple mode, uncontrolled) */
  defaultSelectedDates?: number[];
  /** Callback when days change (multiple mode) */
  onSelectDates?: (days: number[]) => void;
  /** Selected range [start, end] (range mode) */
  selectedRange?: [number, number] | null;
  /** Default range (range mode, uncontrolled) */
  defaultSelectedRange?: [number, number] | null;
  /** Callback when range changes (range mode) */
  onSelectRange?: (range: [number, number] | null) => void;
  /** Navigate to previous month */
  onPrevMonth?: () => void;
  /** Navigate to next month */
  onNextMonth?: () => void;
  /** Days that have events (shown with dot indicator) */
  eventDays?: number[];
  /** Max number of selectable dates (multiple mode) */
  max?: number;
  className?: string;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function generateCalendarDays(
  monthIndex: number,
  year: number,
  selectedDay: number | undefined,
  selectedDates: Set<number>,
  range: [number, number] | null,
  eventDays: number[]
): CalendarDay[] {
  const firstDay = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const daysInPrevMonth = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();

  const now = new Date();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === monthIndex;
  const todayDate = isCurrentMonth ? now.getDate() : -1;

  const eventSet = new Set(eventDays);
  const rangeMin = range ? Math.min(range[0], range[1]) : -1;
  const rangeMax = range ? Math.max(range[0], range[1]) : -1;

  const result: CalendarDay[] = [];

  // Previous month filler
  for (let i = firstDay - 1; i >= 0; i--) {
    result.push({ day: daysInPrevMonth - i, muted: true });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected = d === selectedDay || selectedDates.has(d);
    const isRangeStart = range ? d === range[0] : false;
    const isRangeEnd = range ? d === range[1] : false;
    const isInRange = range ? d > rangeMin && d < rangeMax : false;

    result.push({
      day: d,
      today: d === todayDate,
      selected: isSelected || isRangeStart || isRangeEnd,
      hasEvent: eventSet.has(d),
      rangeStart: isRangeStart,
      rangeEnd: isRangeEnd,
      inRange: isInRange,
    });
  }

  // Next month filler
  const remaining = 7 - (result.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      result.push({ day: i, muted: true });
    }
  }

  return result;
}

const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      mode = "single",
      month,
      year,
      days,
      selected,
      defaultSelected,
      onSelect,
      selectedDates: selectedDatesProp,
      defaultSelectedDates,
      onSelectDates,
      selectedRange: selectedRangeProp,
      defaultSelectedRange,
      onSelectRange,
      onPrevMonth,
      onNextMonth,
      eventDays = [],
      max,
      className,
    },
    ref
  ) => {
    const isAutoMode = !days;

    // Month navigation state (only used in auto mode)
    const now = new Date();
    const initialMonthIndex = month
      ? MONTH_NAMES.indexOf(month as typeof MONTH_NAMES[number])
      : now.getMonth();
    const initialYear = year ?? now.getFullYear();

    const [navMonth, setNavMonth] = useState(
      initialMonthIndex >= 0 ? initialMonthIndex : now.getMonth()
    );
    const [navYear, setNavYear] = useState(initialYear);

    // Single mode
    const [selectedDay, setSelectedDay] = useControllable<number>({
      value: selected,
      defaultValue: defaultSelected ?? -1,
      onChange: onSelect,
    });

    // Multiple mode
    const [multiDates, setMultiDates] = useControllable<number[]>({
      value: selectedDatesProp,
      defaultValue: defaultSelectedDates ?? [],
      onChange: onSelectDates,
    });

    // Range mode
    const [range, setRange] = useControllable<[number, number] | null>({
      value: selectedRangeProp,
      defaultValue: defaultSelectedRange ?? null,
      onChange: onSelectRange,
    });
    const [rangeStep, setRangeStep] = useState<"start" | "end">("start");

    const multiDateSet = useMemo(() => new Set(multiDates), [multiDates]);

    const handleDayClick = useCallback(
      (day: number) => {
        if (mode === "single") {
          setSelectedDay(day);
        } else if (mode === "multiple") {
          if (multiDateSet.has(day)) {
            setMultiDates(multiDates.filter((d) => d !== day));
          } else {
            if (max && multiDates.length >= max) return;
            setMultiDates([...multiDates, day].sort((a, b) => a - b));
          }
        } else if (mode === "range") {
          if (rangeStep === "start") {
            setRange([day, day]);
            setRangeStep("end");
          } else {
            setRange([range![0], day]);
            setRangeStep("start");
          }
        }
      },
      [mode, setSelectedDay, multiDateSet, multiDates, setMultiDates, max, range, setRange, rangeStep]
    );

    const activeSelectedDay = mode === "single" && selectedDay > 0 ? selectedDay : undefined;

    const autoDays = useMemo(
      () =>
        isAutoMode
          ? generateCalendarDays(
              navMonth,
              navYear,
              activeSelectedDay,
              mode === "multiple" ? multiDateSet : new Set<number>(),
              mode === "range" ? range : null,
              eventDays
            )
          : [],
      [isAutoMode, navMonth, navYear, activeSelectedDay, mode, multiDateSet, range, eventDays]
    );

    const hasExternalNav = !!(onPrevMonth || onNextMonth);
    const activeMonth = hasExternalNav
      ? (MONTH_NAMES.indexOf(month as typeof MONTH_NAMES[number]) >= 0
          ? MONTH_NAMES.indexOf(month as typeof MONTH_NAMES[number])
          : navMonth)
      : navMonth;
    const activeYear = hasExternalNav ? (year ?? navYear) : navYear;

    const externalDays = useMemo(
      () =>
        hasExternalNav
          ? generateCalendarDays(
              activeMonth,
              activeYear,
              activeSelectedDay,
              mode === "multiple" ? multiDateSet : new Set<number>(),
              mode === "range" ? range : null,
              eventDays
            )
          : [],
      [hasExternalNav, activeMonth, activeYear, activeSelectedDay, mode, multiDateSet, range, eventDays]
    );

    const displayDays = !isAutoMode ? days : hasExternalNav ? externalDays : autoDays;
    const displayMonth = hasExternalNav ? MONTH_NAMES[activeMonth] : (isAutoMode ? MONTH_NAMES[navMonth] : month);
    const displayYear = hasExternalNav ? activeYear : (isAutoMode ? navYear : year);

    const goToPrevMonth = () => {
      if (navMonth === 0) {
        setNavMonth(11);
        setNavYear(navYear - 1);
      } else {
        setNavMonth(navMonth - 1);
      }
    };

    const goToNextMonth = () => {
      if (navMonth === 11) {
        setNavMonth(0);
        setNavYear(navYear + 1);
      } else {
        setNavMonth(navMonth + 1);
      }
    };

    return (
      <div ref={ref} className={cn(s.calendarContainer, className)}>
        {/* Header */}
        <div className={s.calendarHeader}>
          <button
            type="button"
            onClick={onPrevMonth ?? (isAutoMode ? goToPrevMonth : undefined)}
            aria-label="Previous month"
            className="p-1 rounded-lg hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Icon name="chevron_left" size="sm" className="text-slate-500" />
          </button>
          <h3 className="text-sm font-bold text-secondary" aria-live="polite">
            {displayMonth} {displayYear}
          </h3>
          <button
            type="button"
            onClick={onNextMonth ?? (isAutoMode ? goToNextMonth : undefined)}
            aria-label="Next month"
            className="p-1 rounded-lg hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Icon name="chevron_right" size="sm" className="text-slate-500" />
          </button>
        </div>

        {/* Day labels */}
        <div className={s.calendarGrid}>
          {dayLabels.map((label) => (
            <div key={label} className={s.calendarDayLabel}>
              {label}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className={cn(s.calendarGrid, "px-1 pb-2")}>
          {displayDays!.map((day, i) => (
            <div
              key={i}
              onClick={
                !day.muted && isAutoMode
                  ? () => handleDayClick(day.day)
                  : undefined
              }
              className={cn(
                s.calendarDay,
                day.muted && s.calendarDayMuted,
                day.today && s.calendarDayToday,
                day.selected && !day.today && s.calendarDaySelected,
                day.hasEvent && !day.today && !day.selected && s.calendarDayEvent,
                day.inRange && "bg-primary/10 text-primary",
                day.rangeStart && "rounded-l-lg",
                day.rangeEnd && "rounded-r-lg",
                !day.muted && isAutoMode && "cursor-pointer"
              )}
            >
              {day.day}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
Calendar.displayName = "Calendar";

export { Calendar };
export type { CalendarProps, CalendarDay, CalendarMode };
