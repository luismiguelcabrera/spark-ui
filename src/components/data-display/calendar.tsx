"use client";

import { useState, useMemo } from "react";
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
};

type CalendarProps = {
  month?: string;
  year?: number;
  days?: CalendarDay[];
  selected?: number;
  defaultSelected?: number;
  onSelect?: (day: number) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  eventDays?: number[];
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
  eventDays: number[]
): CalendarDay[] {
  const firstDay = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const daysInPrevMonth = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();

  const now = new Date();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === monthIndex;
  const todayDate = isCurrentMonth ? now.getDate() : -1;

  const eventSet = new Set(eventDays);
  const result: CalendarDay[] = [];

  // Previous month filler
  for (let i = firstDay - 1; i >= 0; i--) {
    result.push({ day: daysInPrevMonth - i, muted: true });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    result.push({
      day: d,
      today: d === todayDate,
      selected: d === selectedDay,
      hasEvent: eventSet.has(d),
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

function Calendar({
  month,
  year,
  days,
  selected,
  defaultSelected,
  onSelect,
  onPrevMonth,
  onNextMonth,
  eventDays = [],
  className,
}: CalendarProps) {
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

  const [selectedDay, setSelectedDay] = useControllable<number>({
    value: selected,
    defaultValue: defaultSelected ?? -1,
    onChange: onSelect,
  });

  const autoDays = useMemo(
    () =>
      isAutoMode
        ? generateCalendarDays(navMonth, navYear, selectedDay > 0 ? selectedDay : undefined, eventDays)
        : [],
    [isAutoMode, navMonth, navYear, selectedDay, eventDays]
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
        ? generateCalendarDays(activeMonth, activeYear, selectedDay > 0 ? selectedDay : undefined, eventDays)
        : [],
    [hasExternalNav, activeMonth, activeYear, selectedDay, eventDays]
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
    <div className={cn(s.calendarContainer, className)}>
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
                ? () => setSelectedDay(day.day)
                : undefined
            }
            className={cn(
              s.calendarDay,
              day.muted && s.calendarDayMuted,
              day.today && s.calendarDayToday,
              day.selected && !day.today && s.calendarDaySelected,
              day.hasEvent && !day.today && !day.selected && s.calendarDayEvent,
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

export { Calendar };
export type { CalendarProps, CalendarDay };
