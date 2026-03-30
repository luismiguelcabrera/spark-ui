"use client";

import {
  useState,
  useMemo,
  useCallback,
  useRef,
  useId,
  forwardRef,
  type KeyboardEvent,
} from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "./icon";
import { useControllable } from "../../hooks/use-controllable";

// ── Types ────────────────────────────────────────────────────────────────

type CalendarDay = {
  day: number;
  date: Date;
  muted?: boolean;
  today?: boolean;
  selected?: boolean;
  disabled?: boolean;
  hasEvent?: boolean;
  rangeStart?: boolean;
  rangeEnd?: boolean;
  inRange?: boolean;
  mark?: MarkedDate;
};

type CalendarMode = "single" | "multiple" | "range";

type MarkedDate = {
  /** Day of the month */
  day: number;
  /** Background color (Tailwind class or CSS color) */
  color?: string;
  /** Dot color below the date (Tailwind class or CSS color) */
  dotColor?: string;
  /** Tooltip label shown on hover */
  label?: string;
};

type CalendarProps = {
  /** Selection mode */
  mode?: CalendarMode;
  /** Month name (auto-mode uses navigation) */
  month?: string;
  /** Year (auto-mode uses navigation) */
  year?: number;
  /** Manual day entries (disables auto-mode) */
  days?: CalendarDay[];

  // ── Single mode ──
  /** Selected day number */
  selected?: number;
  /** Default selected day (uncontrolled) */
  defaultSelected?: number;
  /** Callback with day number */
  onSelect?: (day: number) => void;
  /** Callback with full Date object */
  onSelectDate?: (date: Date) => void;

  // ── Multiple mode ──
  selectedDates?: number[];
  defaultSelectedDates?: number[];
  onSelectDates?: (days: number[]) => void;
  /** Max selectable dates */
  max?: number;

  // ── Range mode ──
  selectedRange?: [number, number] | null;
  defaultSelectedRange?: [number, number] | null;
  onSelectRange?: (range: [number, number] | null) => void;

  // ── Navigation ──
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  /** Called when displayed month/year changes */
  onMonthChange?: (month: number, year: number) => void;

  // ── Constraints ──
  /** Earliest selectable date */
  minDate?: Date;
  /** Latest selectable date */
  maxDate?: Date;
  /** Specific dates that cannot be selected */
  disabledDates?: Date[];

  // ── Display ──
  /** Day the week starts on: 0=Sun (default), 1=Mon, etc. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Always show 6 rows (prevents layout shift between months) */
  fixedWeeks?: boolean;
  /** Highlight today's date with a ring indicator */
  showToday?: boolean;
  /** Days that have events (shown with dot) */
  eventDays?: number[];
  /** Custom-marked dates with colors/dots/tooltips */
  markedDates?: MarkedDate[];

  className?: string;
};

// ── Constants ────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

const ALL_DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

// ── Helpers ──────────────────────────────────────────────────────────────

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isDateDisabled(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledSet?: Set<string>,
): boolean {
  if (minDate && date < minDate && !isSameDay(date, minDate)) return true;
  if (maxDate && date > maxDate && !isSameDay(date, maxDate)) return true;
  if (disabledSet?.has(date.toDateString())) return true;
  return false;
}

function generateCalendarDays(
  monthIndex: number,
  year: number,
  weekStartsOn: number,
  fixedWeeks: boolean,
  selectedDay: number | undefined,
  selectedDates: Set<number>,
  range: [number, number] | null,
  eventDays: number[],
  markedDates: Map<number, MarkedDate>,
  minDate?: Date,
  maxDate?: Date,
  disabledSet?: Set<string>,
): CalendarDay[] {
  const firstDayOfMonth = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const daysInPrevMonth = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();

  const now = new Date();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === monthIndex;
  const todayDate = isCurrentMonth ? now.getDate() : -1;

  const eventSet = new Set(eventDays);
  const rangeMin = range ? Math.min(range[0], range[1]) : -1;
  const rangeMax = range ? Math.max(range[0], range[1]) : -1;

  // How many filler days from previous month
  const offset = (firstDayOfMonth - weekStartsOn + 7) % 7;

  const result: CalendarDay[] = [];

  // Previous month filler
  for (let i = offset - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const prevMonthDate = new Date(Date.UTC(year, monthIndex - 1, d));
    result.push({ day: d, date: prevMonthDate, muted: true, disabled: true });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(Date.UTC(year, monthIndex, d));
    const isSelected = d === selectedDay || selectedDates.has(d);
    const isRangeStart = range ? d === range[0] : false;
    const isRangeEnd = range ? d === range[1] : false;
    const isInRange = range ? d > rangeMin && d < rangeMax : false;
    const disabled = isDateDisabled(date, minDate, maxDate, disabledSet);

    result.push({
      day: d,
      date,
      today: d === todayDate,
      selected: isSelected || isRangeStart || isRangeEnd,
      disabled,
      hasEvent: eventSet.has(d),
      rangeStart: isRangeStart,
      rangeEnd: isRangeEnd,
      inRange: isInRange,
      mark: markedDates.get(d),
    });
  }

  // Next month filler
  const targetRows = fixedWeeks ? 6 : Math.ceil(result.length / 7);
  const totalCells = targetRows * 7;
  const remaining = totalCells - result.length;
  for (let i = 1; i <= remaining; i++) {
    const nextMonthDate = new Date(Date.UTC(year, monthIndex + 1, i));
    result.push({ day: i, date: nextMonthDate, muted: true, disabled: true });
  }

  return result;
}

// ── Component ────────────────────────────────────────────────────────────

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
      onSelectDate,
      selectedDates: selectedDatesProp,
      defaultSelectedDates,
      onSelectDates,
      selectedRange: selectedRangeProp,
      defaultSelectedRange,
      onSelectRange,
      onPrevMonth,
      onNextMonth,
      onMonthChange,
      minDate,
      maxDate,
      disabledDates,
      weekStartsOn = 0,
      fixedWeeks = false,
      eventDays = [],
      markedDates: markedDatesProp,
      showToday = true,
      max,
      className,
    },
    ref
  ) => {
    const gridId = useId();
    const isAutoMode = !days;
    const gridRef = useRef<HTMLDivElement>(null);

    const markedMap = useMemo(
      () => new Map((markedDatesProp ?? []).map((m) => [m.day, m])),
      [markedDatesProp]
    );

    const disabledSet = useMemo(
      () => new Set((disabledDates ?? []).map((d) => d.toDateString())),
      [disabledDates]
    );

    // Rotated day labels based on weekStartsOn
    const dayLabels = useMemo(() => {
      const labels = [...ALL_DAY_LABELS];
      return [...labels.slice(weekStartsOn), ...labels.slice(0, weekStartsOn)];
    }, [weekStartsOn]);

    // Month navigation state
    const now = new Date();
    const initialMonthIndex = month
      ? MONTH_NAMES.indexOf(month as (typeof MONTH_NAMES)[number])
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

    // ── Navigation ──

    const changeMonth = useCallback(
      (newMonth: number, newYear: number) => {
        setNavMonth(newMonth);
        setNavYear(newYear);
        onMonthChange?.(newMonth, newYear);
        // Clear selection on month change
        if (mode === "single") setSelectedDay(-1);
        else if (mode === "multiple") setMultiDates([]);
        else if (mode === "range") {
          setRange(null);
          setRangeStep("start");
        }
      },
      [mode, onMonthChange, setSelectedDay, setMultiDates, setRange]
    );

    const goToPrevMonth = useCallback(() => {
      if (navMonth === 0) changeMonth(11, navYear - 1);
      else changeMonth(navMonth - 1, navYear);
    }, [navMonth, navYear, changeMonth]);

    const goToNextMonth = useCallback(() => {
      if (navMonth === 11) changeMonth(0, navYear + 1);
      else changeMonth(navMonth + 1, navYear);
    }, [navMonth, navYear, changeMonth]);

    // ── Day click ──

    const handleDayClick = useCallback(
      (calDay: CalendarDay) => {
        if (calDay.disabled || calDay.muted) return;
        const day = calDay.day;

        if (mode === "single") {
          setSelectedDay(day);
          onSelectDate?.(calDay.date);
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
      [mode, setSelectedDay, onSelectDate, multiDateSet, multiDates, setMultiDates, max, range, setRange, rangeStep]
    );

    // ── Keyboard navigation ──

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const handleGridKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>, displayDays: CalendarDay[]) => {
        const current = focusedIndex ?? displayDays.findIndex((d) => !d.muted);
        if (current < 0) return;

        let next = current;
        switch (e.key) {
          case "ArrowRight":
            next = Math.min(current + 1, displayDays.length - 1);
            break;
          case "ArrowLeft":
            next = Math.max(current - 1, 0);
            break;
          case "ArrowDown":
            next = Math.min(current + 7, displayDays.length - 1);
            break;
          case "ArrowUp":
            next = Math.max(current - 7, 0);
            break;
          case "Home":
            next = displayDays.findIndex((d) => !d.muted);
            break;
          case "End": {
            for (let i = displayDays.length - 1; i >= 0; i--) {
              if (!displayDays[i].muted) { next = i; break; }
            }
            break;
          }
          case "Enter":
          case " ":
            e.preventDefault();
            if (displayDays[current] && !displayDays[current].muted) {
              handleDayClick(displayDays[current]);
            }
            return;
          case "Escape":
            if (mode === "single") setSelectedDay(-1);
            return;
          default:
            return;
        }

        e.preventDefault();
        setFocusedIndex(next);
        // Focus the button
        const grid = gridRef.current;
        if (grid) {
          const buttons = grid.querySelectorAll<HTMLButtonElement>("button[data-day]");
          buttons[next]?.focus();
        }
      },
      [focusedIndex, handleDayClick, mode, setSelectedDay]
    );

    // ── Generate days ──

    const activeSelectedDay = mode === "single" && selectedDay > 0 ? selectedDay : undefined;

    const hasExternalNav = !!(onPrevMonth || onNextMonth);
    const activeMonth = hasExternalNav
      ? (MONTH_NAMES.indexOf(month as (typeof MONTH_NAMES)[number]) >= 0
        ? MONTH_NAMES.indexOf(month as (typeof MONTH_NAMES)[number])
        : navMonth)
      : navMonth;
    const activeYear = hasExternalNav ? (year ?? navYear) : navYear;

    const computedDays = useMemo(
      () =>
        isAutoMode
          ? generateCalendarDays(
              activeMonth,
              activeYear,
              weekStartsOn,
              fixedWeeks,
              activeSelectedDay,
              mode === "multiple" ? multiDateSet : new Set<number>(),
              mode === "range" ? range : null,
              eventDays,
              markedMap,
              minDate,
              maxDate,
              disabledSet,
            )
          : [],
      [isAutoMode, activeMonth, activeYear, weekStartsOn, fixedWeeks, activeSelectedDay, mode, multiDateSet, range, eventDays, markedMap, minDate, maxDate, disabledSet]
    );

    const displayDays = !isAutoMode ? days! : computedDays;
    const displayMonth = hasExternalNav ? MONTH_NAMES[activeMonth] : (isAutoMode ? MONTH_NAMES[navMonth] : month);
    const displayYear = hasExternalNav ? activeYear : (isAutoMode ? navYear : year);

    // Can navigate prev/next? (respect minDate/maxDate)
    const canGoPrev = !minDate || new Date(Date.UTC(activeYear, activeMonth, 0)) >= minDate;
    const canGoNext = !maxDate || new Date(Date.UTC(activeYear, activeMonth + 1, 1)) <= maxDate;

    // ── Render ───────────────────────────────────────────────────────────

    return (
      <div ref={ref} className={cn(s.calendarContainer, className)} role="group" aria-label="Calendar">
        {/* Header */}
        <div className={s.calendarHeader}>
          <button
            type="button"
            onClick={onPrevMonth ?? (isAutoMode ? goToPrevMonth : undefined)}
            disabled={!canGoPrev}
            aria-label="Previous month"
            className={cn(
              "p-1 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              canGoPrev ? "hover:bg-slate-100" : "opacity-30 cursor-not-allowed"
            )}
          >
            <Icon name="chevron_left" size="sm" className="text-slate-500" />
          </button>
          <h3 className="text-sm font-bold text-secondary" aria-live="polite">
            {displayMonth} {displayYear}
          </h3>
          <button
            type="button"
            onClick={onNextMonth ?? (isAutoMode ? goToNextMonth : undefined)}
            disabled={!canGoNext}
            aria-label="Next month"
            className={cn(
              "p-1 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              canGoNext ? "hover:bg-slate-100" : "opacity-30 cursor-not-allowed"
            )}
          >
            <Icon name="chevron_right" size="sm" className="text-slate-500" />
          </button>
        </div>

        {/* Day labels */}
        <div className={s.calendarGrid} role="row">
          {dayLabels.map((label) => (
            <div key={label} className={s.calendarDayLabel} role="columnheader" aria-label={label}>
              {label}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div
          ref={gridRef}
          id={gridId}
          className={cn(s.calendarGrid, "px-1 pb-2")}
          role="grid"
          aria-label={`${displayMonth} ${displayYear}`}
          onKeyDown={(e) => handleGridKeyDown(e, displayDays)}
        >
          {displayDays.map((day, i) => {
            const isColorMark = !!day.mark?.color;
            const isInlineColor = isColorMark && (day.mark!.color!.startsWith("#") || day.mark!.color!.startsWith("rgb"));

            return (
              <button
                key={i}
                type="button"
                data-day={day.day}
                tabIndex={focusedIndex === i ? 0 : (focusedIndex === null && day.today ? 0 : -1)}
                disabled={day.disabled || day.muted}
                onClick={() => handleDayClick(day)}
                aria-selected={day.selected || undefined}
                aria-current={day.today ? "date" : undefined}
                aria-disabled={day.disabled || day.muted || undefined}
                className={cn(
                  s.calendarDay,
                  day.muted && s.calendarDayMuted,
                  day.disabled && !day.muted && "opacity-40 cursor-not-allowed",
                  showToday && day.today && !day.selected && !day.inRange && !isColorMark && s.calendarDayToday,
                  day.selected && !isColorMark && s.calendarDaySelected,
                  // Event dot
                  day.hasEvent && !day.mark?.dotColor && (
                    day.selected
                      ? "after:absolute after:bottom-1 after:w-1 after:h-1 after:rounded-full after:bg-white"
                      : s.calendarDayEvent
                  ),
                  // Custom mark background (Tailwind class)
                  isColorMark && !isInlineColor && day.mark!.color,
                  // Range
                  day.inRange && "bg-primary/15 text-primary font-medium rounded-none",
                  day.rangeStart && "rounded-l-lg rounded-r-none",
                  day.rangeEnd && "rounded-r-lg rounded-l-none",
                  day.rangeStart && day.rangeEnd && "rounded-lg",
                  // Interactive
                  !day.muted && !day.disabled && "cursor-pointer hover:bg-primary/10 transition-colors",
                  // Focus
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:outline-none"
                )}
                style={
                  isInlineColor ? { backgroundColor: day.mark!.color!, color: "#fff" } : undefined
                }
                title={day.mark?.label}
              >
                {day.day}
                {/* Today dot when selected */}
                {showToday && day.today && day.selected && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white" />
                )}
                {/* Custom mark dot */}
                {day.mark?.dotColor && !day.selected && (
                  <span
                    className={cn(
                      "absolute bottom-1 w-1.5 h-1.5 rounded-full",
                      !(day.mark.dotColor.startsWith("#") || day.mark.dotColor.startsWith("rgb")) && day.mark.dotColor
                    )}
                    style={
                      day.mark.dotColor.startsWith("#") || day.mark.dotColor.startsWith("rgb")
                        ? { backgroundColor: day.mark.dotColor }
                        : undefined
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);
Calendar.displayName = "Calendar";

export { Calendar };
export type { CalendarProps, CalendarDay, CalendarMode, MarkedDate };
