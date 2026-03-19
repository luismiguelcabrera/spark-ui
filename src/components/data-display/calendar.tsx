"use client";

import {
  useState,
  useMemo,
  useCallback,
  useRef,
  useId,
  useEffect,
  forwardRef,
  type KeyboardEvent,
  type TouchEvent as ReactTouchEvent,
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
  inHoverRange?: boolean;
  mark?: MarkedDate;
};

type CalendarMode = "single" | "multiple" | "range";

type MarkedDate = {
  day: number;
  color?: string;
  dotColor?: string;
  label?: string;
};

/** Range stored as full Date objects so it works across months */
type CalendarDateRange = { start: Date; end: Date | null };

type CalendarProps = {
  mode?: CalendarMode;
  month?: string;
  year?: number;
  days?: CalendarDay[];

  // Single
  selected?: number;
  defaultSelected?: number;
  onSelect?: (day: number) => void;
  onSelectDate?: (date: Date) => void;

  // Multiple
  selectedDates?: number[];
  defaultSelectedDates?: number[];
  onSelectDates?: (days: number[]) => void;
  max?: number;

  // Range (Date-based for cross-month)
  /** Controlled range as Date objects */
  selectedRange?: CalendarDateRange | null;
  /** Default range (uncontrolled) */
  defaultSelectedRange?: CalendarDateRange | null;
  /** Callback with Date-based range */
  onRangeChange?: (range: CalendarDateRange | null) => void;

  // Navigation
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onMonthChange?: (month: number, year: number) => void;

  // Constraints
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];

  // Display
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  fixedWeeks?: boolean;
  showToday?: boolean;
  showTodayButton?: boolean;
  showSelectedLabel?: boolean;
  /** Number of months to display side by side (1 or 2) */
  numberOfMonths?: 1 | 2;
  eventDays?: number[];
  markedDates?: MarkedDate[];

  className?: string;
};

// ── Constants ────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

const ALL_DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

// ── Helpers ──────────────────────────────────────────────────────────────

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function toDateKey(d: Date): number {
  return d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate();
}

function isDateDisabled(date: Date, minDate?: Date, maxDate?: Date, disabledSet?: Set<string>): boolean {
  if (minDate && date < minDate && !isSameDay(date, minDate)) return true;
  if (maxDate && date > maxDate && !isSameDay(date, maxDate)) return true;
  if (disabledSet?.has(date.toDateString())) return true;
  return false;
}

function nextMonth(m: number, y: number): [number, number] {
  return m === 11 ? [0, y + 1] : [m + 1, y];
}

function prevMonth(m: number, y: number): [number, number] {
  return m === 0 ? [11, y - 1] : [m - 1, y];
}

function formatLabel(
  mode: CalendarMode,
  selectedDay: number,
  multiDates: number[],
  range: CalendarDateRange | null,
  monthName: string,
  displayYear: number,
): string | null {
  if (mode === "single" && selectedDay > 0) return `${monthName} ${selectedDay}, ${displayYear}`;
  if (mode === "multiple" && multiDates.length > 0) {
    if (multiDates.length <= 3) return multiDates.map((d) => `${monthName} ${d}`).join(", ");
    return `${multiDates.length} dates selected`;
  }
  if (mode === "range" && range?.start && range.end && !isSameDay(range.start, range.end)) {
    const s = range.start;
    const e = range.end;
    const sStr = `${MONTH_SHORT[s.getMonth()]} ${s.getDate()}`;
    const eStr = `${MONTH_SHORT[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`;
    return `${sStr} – ${eStr}`;
  }
  return null;
}

function generateCalendarDays(
  monthIndex: number,
  year: number,
  weekStartsOn: number,
  fixedWeeks: boolean,
  selectedDay: number | undefined,
  selectedDates: Set<number>,
  range: CalendarDateRange | null,
  hoverDate: Date | null,
  rangePickingEnd: boolean,
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

  // Range as date keys for cross-month comparison
  const rangeStartKey = range?.start ? toDateKey(range.start) : -1;
  const rangeEndKey = range?.end ? toDateKey(range.end) : -1;
  const rangeMin = rangeStartKey > 0 && rangeEndKey > 0 ? Math.min(rangeStartKey, rangeEndKey) : -1;
  const rangeMax = rangeStartKey > 0 && rangeEndKey > 0 ? Math.max(rangeStartKey, rangeEndKey) : -1;

  // Hover preview for range
  const hoverKey = hoverDate ? toDateKey(hoverDate) : -1;
  const hoverMin = rangePickingEnd && rangeStartKey > 0 && hoverKey > 0 ? Math.min(rangeStartKey, hoverKey) : -1;
  const hoverMax = rangePickingEnd && rangeStartKey > 0 && hoverKey > 0 ? Math.max(rangeStartKey, hoverKey) : -1;

  const offset = (firstDayOfMonth - weekStartsOn + 7) % 7;
  const result: CalendarDay[] = [];

  for (let i = offset - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    result.push({ day: d, date: new Date(Date.UTC(year, monthIndex - 1, d)), muted: true, disabled: true });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(Date.UTC(year, monthIndex, d));
    const dk = toDateKey(date);
    const isSelected = d === selectedDay || selectedDates.has(d);
    const isRangeStart = dk === rangeStartKey;
    const isRangeEnd = dk === rangeEndKey;
    const isInRange = rangeMin > 0 && dk > rangeMin && dk < rangeMax;
    const isInHoverRange = hoverMin > 0 && dk > hoverMin && dk < hoverMax && !isInRange;
    const isHoverEndpoint = rangePickingEnd && dk === hoverKey && !isRangeStart;
    const disabled = isDateDisabled(date, minDate, maxDate, disabledSet);

    result.push({
      day: d, date, today: d === todayDate,
      selected: isSelected || isRangeStart || isRangeEnd || isHoverEndpoint,
      disabled, hasEvent: eventSet.has(d),
      rangeStart: isRangeStart || (rangePickingEnd && rangeStartKey > 0 && dk === Math.min(rangeStartKey, hoverKey > 0 ? hoverKey : rangeStartKey)),
      rangeEnd: isRangeEnd || isHoverEndpoint,
      inRange: isInRange,
      inHoverRange: isInHoverRange,
      mark: markedDates.get(d),
    });
  }

  const targetRows = fixedWeeks ? 6 : Math.ceil(result.length / 7);
  const totalCells = targetRows * 7;
  const remaining = totalCells - result.length;
  for (let i = 1; i <= remaining; i++) {
    result.push({ day: i, date: new Date(Date.UTC(year, monthIndex + 1, i)), muted: true, disabled: true });
  }

  return result;
}

// ── Single Month Grid (internal) ─────────────────────────────────────────

type MonthGridProps = {
  monthIndex: number;
  year: number;
  days: CalendarDay[];
  dayLabels: string[];
  showToday: boolean;
  mode: CalendarMode;
  rangePickingEnd: boolean;
  slideDir: "left" | "right" | null;
  gridRef?: React.RefObject<HTMLDivElement | null>;
  gridId: string;
  focusedIndex: number | null;
  onDayClick: (day: CalendarDay) => void;
  onDayHover: (date: Date | null) => void;
  onGridKeyDown: (e: KeyboardEvent<HTMLDivElement>, days: CalendarDay[]) => void;
};

function MonthGrid({
  monthIndex, year, days, dayLabels, showToday, mode, rangePickingEnd, slideDir,
  gridRef, gridId, focusedIndex, onDayClick, onDayHover, onGridKeyDown,
}: MonthGridProps) {
  return (
    <div>
      {/* Day labels */}
      <div className={s.calendarGrid} role="row">
        {dayLabels.map((label) => (
          <div key={label} className={s.calendarDayLabel} role="columnheader" aria-label={label}>{label}</div>
        ))}
      </div>

      {/* Day grid */}
      <div
        ref={gridRef}
        id={gridId}
        className={cn(
          s.calendarGrid, "px-1 pb-2",
          slideDir === "left" && "animate-in slide-in-from-right-4 fade-in duration-200",
          slideDir === "right" && "animate-in slide-in-from-left-4 fade-in duration-200",
        )}
        role="grid"
        aria-label={`${MONTH_NAMES[monthIndex]} ${year}`}
        onKeyDown={(e) => onGridKeyDown(e, days)}
      >
        {days.map((day, i) => {
          const isColorMark = !!day.mark?.color;
          const isInlineColor = isColorMark && (day.mark!.color!.startsWith("#") || day.mark!.color!.startsWith("rgb"));

          return (
            <button
              key={i}
              type="button"
              data-day={day.day}
              tabIndex={focusedIndex === i ? 0 : (focusedIndex === null && day.today ? 0 : -1)}
              disabled={day.disabled || day.muted}
              onClick={() => onDayClick(day)}
              onMouseEnter={mode === "range" && rangePickingEnd && !day.muted && !day.disabled ? () => onDayHover(day.date) : undefined}
              onMouseLeave={mode === "range" && rangePickingEnd ? () => onDayHover(null) : undefined}
              aria-selected={day.selected || undefined}
              aria-current={day.today ? "date" : undefined}
              aria-disabled={day.disabled || day.muted || undefined}
              className={cn(
                s.calendarDay,
                day.muted && s.calendarDayMuted,
                day.disabled && !day.muted && "opacity-40 cursor-not-allowed",
                showToday && day.today && !day.selected && !day.inRange && !day.inHoverRange && !isColorMark && s.calendarDayToday,
                day.selected && !isColorMark && s.calendarDaySelected,
                day.hasEvent && !day.mark?.dotColor && (
                  day.selected
                    ? "after:absolute after:bottom-1 after:w-1 after:h-1 after:rounded-full after:bg-white"
                    : s.calendarDayEvent
                ),
                isColorMark && !isInlineColor && day.mark!.color,
                day.inRange && "bg-primary/15 text-primary font-medium rounded-none",
                day.inHoverRange && "bg-primary/8 text-primary/70 rounded-none",
                day.rangeStart && "rounded-l-lg rounded-r-none",
                day.rangeEnd && "rounded-r-lg rounded-l-none",
                day.rangeStart && day.rangeEnd && "rounded-lg",
                !day.muted && !day.disabled && "cursor-pointer hover:bg-primary/10 active:scale-90 transition-all duration-150",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:outline-none"
              )}
              style={isInlineColor ? { backgroundColor: day.mark!.color!, color: "#fff" } : undefined}
              title={day.mark?.label}
            >
              {day.day}
              {/* Today dot — adapts color to context */}
              {showToday && day.today && (day.selected || day.inRange || day.inHoverRange) && (
                <span className={cn(
                  "absolute bottom-1 w-1.5 h-1.5 rounded-full",
                  day.selected ? "bg-white" : "bg-primary"
                )} />
              )}
              {day.mark?.dotColor && !day.selected && (
                <span
                  className={cn(
                    "absolute bottom-1 w-1.5 h-1.5 rounded-full",
                    !(day.mark.dotColor.startsWith("#") || day.mark.dotColor.startsWith("rgb")) && day.mark.dotColor
                  )}
                  style={
                    day.mark.dotColor.startsWith("#") || day.mark.dotColor.startsWith("rgb")
                      ? { backgroundColor: day.mark.dotColor } : undefined
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

// ── Main Component ───────────────────────────────────────────────────────

const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      mode = "single", month, year, days,
      selected, defaultSelected, onSelect, onSelectDate,
      selectedDates: selectedDatesProp, defaultSelectedDates, onSelectDates, max,
      selectedRange: selectedRangeProp, defaultSelectedRange, onRangeChange,
      onPrevMonth, onNextMonth, onMonthChange,
      minDate, maxDate, disabledDates,
      weekStartsOn = 0, fixedWeeks = false,
      numberOfMonths = 1,
      eventDays = [], markedDates: markedDatesProp,
      showToday = true, showTodayButton = false, showSelectedLabel = false,
      className,
    },
    ref
  ) => {
    const gridId = useId();
    const isAutoMode = !days;
    const gridRef = useRef<HTMLDivElement>(null);
    const isDual = numberOfMonths === 2;

    const markedMap = useMemo(() => new Map((markedDatesProp ?? []).map((m) => [m.day, m])), [markedDatesProp]);
    const disabledSet = useMemo(() => new Set((disabledDates ?? []).map((d) => d.toDateString())), [disabledDates]);
    const dayLabels = useMemo(() => {
      const labels = [...ALL_DAY_LABELS];
      return [...labels.slice(weekStartsOn), ...labels.slice(0, weekStartsOn)];
    }, [weekStartsOn]);

    // Navigation
    const now = new Date();
    const initialMonthIndex = month ? MONTH_NAMES.indexOf(month as (typeof MONTH_NAMES)[number]) : now.getMonth();
    const [navMonth, setNavMonth] = useState(initialMonthIndex >= 0 ? initialMonthIndex : now.getMonth());
    const [navYear, setNavYear] = useState(year ?? now.getFullYear());
    const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [hoverDate, setHoverDate] = useState<Date | null>(null);

    // Selection
    const [selectedDay, setSelectedDay] = useControllable<number>({ value: selected, defaultValue: defaultSelected ?? -1, onChange: onSelect });
    const [multiDates, setMultiDates] = useControllable<number[]>({ value: selectedDatesProp, defaultValue: defaultSelectedDates ?? [], onChange: onSelectDates });
    const [dateRange, setCalendarDateRange] = useControllable<CalendarDateRange | null>({ value: selectedRangeProp, defaultValue: defaultSelectedRange ?? null, onChange: onRangeChange });
    const [rangeStep, setRangeStep] = useState<"start" | "end">("start");
    const multiDateSet = useMemo(() => new Set(multiDates), [multiDates]);

    // Swipe
    const touchStartX = useRef(0);
    const handleTouchStart = useCallback((e: ReactTouchEvent) => { touchStartX.current = e.touches[0].clientX; }, []);
    const handleTouchEnd = useCallback((e: ReactTouchEvent) => {
      const diff = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(diff) > 50) { if (diff > 0) goToPrevMonth(); else goToNextMonth(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navMonth, navYear]);

    // Navigation helpers
    const changeMonth = useCallback(
      (newMonth: number, newYear: number, dir: "left" | "right") => {
        setSlideDir(dir);
        setNavMonth(newMonth);
        setNavYear(newYear);
        onMonthChange?.(newMonth, newYear);
        // Clear single/multiple on month change (range persists for cross-month)
        if (mode === "single") setSelectedDay(-1);
        else if (mode === "multiple") setMultiDates([]);
        setHoverDate(null);
      },
      [mode, onMonthChange, setSelectedDay, setMultiDates]
    );

    useEffect(() => {
      if (!slideDir) return;
      const timer = setTimeout(() => setSlideDir(null), 250);
      return () => clearTimeout(timer);
    }, [slideDir, navMonth]);  

    const goToPrevMonth = useCallback(() => {
      const [m, y] = prevMonth(navMonth, navYear);
      changeMonth(m, y, "right");
    }, [navMonth, navYear, changeMonth]);

    const goToNextMonth = useCallback(() => {
      const [m, y] = nextMonth(navMonth, navYear);
      changeMonth(m, y, "left");
    }, [navMonth, navYear, changeMonth]);

    const goToToday = useCallback(() => {
      const dir = navYear * 12 + navMonth > now.getFullYear() * 12 + now.getMonth() ? "right" : "left";
      changeMonth(now.getMonth(), now.getFullYear(), dir);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navMonth, navYear, changeMonth]);

    // Day click
    const handleDayClick = useCallback(
      (calDay: CalendarDay) => {
        if (calDay.disabled || calDay.muted) return;

        if (mode === "single") {
          setSelectedDay(calDay.day);
          onSelectDate?.(calDay.date);
        } else if (mode === "multiple") {
          const day = calDay.day;
          if (multiDateSet.has(day)) {
            setMultiDates(multiDates.filter((d) => d !== day));
          } else {
            if (max && multiDates.length >= max) return;
            setMultiDates([...multiDates, day].sort((a, b) => a - b));
          }
        } else if (mode === "range") {
          if (rangeStep === "start" || (dateRange?.end && !isSameDay(dateRange.start, dateRange.end))) {
            // Start new range
            setCalendarDateRange({ start: calDay.date, end: null });
            setRangeStep("end");
          } else {
            // Complete range
            const start = dateRange!.start;
            const end = calDay.date;
            // Normalize order
            const [s, e] = toDateKey(start) <= toDateKey(end) ? [start, end] : [end, start];
            setCalendarDateRange({ start: s, end: e });
            setRangeStep("start");
            setHoverDate(null);
          }
        }
      },
      [mode, setSelectedDay, onSelectDate, multiDateSet, multiDates, setMultiDates, max, dateRange, setCalendarDateRange, rangeStep]
    );

    // Keyboard
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const handleGridKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>, allDays: CalendarDay[]) => {
        const current = focusedIndex ?? allDays.findIndex((d) => !d.muted);
        if (current < 0) return;
        let next = current;
        switch (e.key) {
          case "ArrowRight": next = Math.min(current + 1, allDays.length - 1); break;
          case "ArrowLeft": next = Math.max(current - 1, 0); break;
          case "ArrowDown": next = Math.min(current + 7, allDays.length - 1); break;
          case "ArrowUp": next = Math.max(current - 7, 0); break;
          case "Home": next = allDays.findIndex((d) => !d.muted); break;
          case "End": for (let i = allDays.length - 1; i >= 0; i--) { if (!allDays[i].muted) { next = i; break; } } break;
          case "Enter": case " ": e.preventDefault(); if (allDays[current] && !allDays[current].muted) handleDayClick(allDays[current]); return;
          case "Escape": if (mode === "single") setSelectedDay(-1); else if (mode === "range") { setCalendarDateRange(null); setRangeStep("start"); } return;
          default: return;
        }
        e.preventDefault();
        setFocusedIndex(next);
        gridRef.current?.querySelectorAll<HTMLButtonElement>("button[data-day]")[next]?.focus();
      },
      [focusedIndex, handleDayClick, mode, setSelectedDay, setCalendarDateRange]
    );

    // Generate days
    const hasExternalNav = !!(onPrevMonth || onNextMonth);
    const activeMonth = hasExternalNav
      ? (MONTH_NAMES.indexOf(month as (typeof MONTH_NAMES)[number]) >= 0 ? MONTH_NAMES.indexOf(month as (typeof MONTH_NAMES)[number]) : navMonth)
      : navMonth;
    const activeYear = hasExternalNav ? (year ?? navYear) : navYear;
    const activeSelectedDay = mode === "single" && selectedDay > 0 ? selectedDay : undefined;

    const genArgs = [weekStartsOn, fixedWeeks, activeSelectedDay, mode === "multiple" ? multiDateSet : new Set<number>(), mode === "range" ? dateRange : null, hoverDate, rangeStep === "end", eventDays, markedMap, minDate, maxDate, disabledSet] as const;

    const month1Days = useMemo(
      () => isAutoMode ? generateCalendarDays(activeMonth, activeYear, ...genArgs) : [],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [isAutoMode, activeMonth, activeYear, ...genArgs]
    );

    const [m2, y2] = nextMonth(activeMonth, activeYear);
    const month2Days = useMemo(
      () => isDual && isAutoMode ? generateCalendarDays(m2, y2, ...genArgs) : [],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [isDual, isAutoMode, m2, y2, ...genArgs]
    );

    const displayDays = !isAutoMode ? days! : month1Days;
    const displayMonth = hasExternalNav ? MONTH_NAMES[activeMonth] : (isAutoMode ? MONTH_NAMES[navMonth] : month);
    const displayYear = hasExternalNav ? activeYear : (isAutoMode ? navYear : year);

    const canGoPrev = !minDate || new Date(Date.UTC(activeYear, activeMonth, 0)) >= minDate;
    const canGoNext = !maxDate || new Date(Date.UTC(activeYear, activeMonth + (isDual ? 2 : 1), 1)) <= maxDate;
    const isCurrentMonth = navMonth === now.getMonth() && navYear === now.getFullYear();

    const selectedLabel = showSelectedLabel
      ? formatLabel(mode, selectedDay, multiDates, dateRange, displayMonth as string, displayYear as number)
      : null;

    // ── Render ───────────────────────────────────────────────────────────

    return (
      <div
        ref={ref}
        className={cn(s.calendarContainer, "select-none", isDual && "w-auto", className)}
        role="group"
        aria-label="Calendar"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className={s.calendarHeader}>
          <button
            type="button"
            onClick={onPrevMonth ?? (isAutoMode ? goToPrevMonth : undefined)}
            disabled={!canGoPrev}
            aria-label="Previous month"
            className={cn(
              "p-1.5 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              canGoPrev ? "hover:bg-slate-100 active:scale-95" : "opacity-30 cursor-not-allowed"
            )}
          >
            <Icon name="chevron_left" size="sm" className="text-slate-500" />
          </button>

          <button
            type="button"
            onClick={() => setPickerOpen(!pickerOpen)}
            className="text-sm font-bold text-secondary hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-slate-50 active:scale-95"
            aria-expanded={pickerOpen}
            aria-label={`${displayMonth} ${displayYear}, click to pick month`}
          >
            <span aria-live="polite">
              {isDual
                ? `${MONTH_NAMES[activeMonth]} – ${MONTH_NAMES[m2]} ${y2}`
                : `${displayMonth} ${displayYear}`
              }
            </span>
            <Icon name="expand_more" size="sm" className={cn("inline-block ml-1 transition-transform", pickerOpen && "rotate-180")} />
          </button>

          <button
            type="button"
            onClick={onNextMonth ?? (isAutoMode ? goToNextMonth : undefined)}
            disabled={!canGoNext}
            aria-label="Next month"
            className={cn(
              "p-1.5 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              canGoNext ? "hover:bg-slate-100 active:scale-95" : "opacity-30 cursor-not-allowed"
            )}
          >
            <Icon name="chevron_right" size="sm" className="text-slate-500" />
          </button>
        </div>

        {/* Year/Month picker */}
        {pickerOpen && (
          <div className="px-3 pb-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-2">
              <button type="button" onClick={() => setNavYear(navYear - 1)} className="p-1 rounded hover:bg-slate-100 active:scale-95" aria-label="Previous year">
                <Icon name="chevron_left" size="sm" className="text-slate-400" />
              </button>
              <span className="text-xs font-bold text-slate-600">{navYear}</span>
              <button type="button" onClick={() => setNavYear(navYear + 1)} className="p-1 rounded hover:bg-slate-100 active:scale-95" aria-label="Next year">
                <Icon name="chevron_right" size="sm" className="text-slate-400" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {MONTH_SHORT.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { changeMonth(i, navYear, i < navMonth ? "right" : "left"); setPickerOpen(false); }}
                  className={cn(
                    "text-xs py-1.5 rounded-lg transition-all active:scale-95",
                    i === navMonth ? "bg-primary text-white font-bold" : "hover:bg-slate-100 text-slate-600",
                    i === now.getMonth() && navYear === now.getFullYear() && i !== navMonth && "ring-1 ring-primary/30 text-primary font-medium"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Calendar grid(s) */}
        {!pickerOpen && (
          <>
            <div className={cn(isDual && "flex gap-6 px-2")}>
              {/* Month 1 */}
              <div className={cn(isDual && "flex-1 min-w-0")}>
                {isDual && (
                  <div className="text-center text-xs font-semibold text-slate-500 pb-1">
                    {MONTH_NAMES[activeMonth]} {activeYear}
                  </div>
                )}
                <MonthGrid
                  monthIndex={activeMonth}
                  year={activeYear}
                  days={displayDays}
                  dayLabels={dayLabels as unknown as string[]}
                  showToday={showToday}
                  mode={mode}
                  rangePickingEnd={rangeStep === "end"}
                  slideDir={slideDir}
                  gridRef={gridRef}
                  gridId={gridId}
                  focusedIndex={focusedIndex}
                  onDayClick={handleDayClick}
                  onDayHover={setHoverDate}
                  onGridKeyDown={handleGridKeyDown}
                />
              </div>

              {/* Month 2 (dual mode) */}
              {isDual && isAutoMode && (
                <>
                  <div className="w-px bg-slate-200 self-stretch my-2" />
                  <div className="flex-1 min-w-0">
                    <div className="text-center text-xs font-semibold text-slate-500 pb-1">
                      {MONTH_NAMES[m2]} {y2}
                    </div>
                    <MonthGrid
                      monthIndex={m2}
                      year={y2}
                      days={month2Days}
                      dayLabels={dayLabels as unknown as string[]}
                      showToday={showToday}
                      mode={mode}
                      rangePickingEnd={rangeStep === "end"}
                      slideDir={slideDir}
                      gridRef={undefined}
                      gridId={`${gridId}-m2`}
                      focusedIndex={null}
                      onDayClick={handleDayClick}
                      onDayHover={setHoverDate}
                      onGridKeyDown={handleGridKeyDown}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {(showTodayButton || selectedLabel) && (
              <div className="flex items-center justify-between px-4 pb-3 pt-1">
                {showTodayButton && !isCurrentMonth ? (
                  <button type="button" onClick={goToToday} className="text-xs font-medium text-primary hover:text-primary/80 transition-colors active:scale-95">
                    Today
                  </button>
                ) : <span />}
                {selectedLabel && (
                  <span className="text-xs text-slate-500 font-medium">{selectedLabel}</span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);
Calendar.displayName = "Calendar";

export { Calendar };
export type { CalendarProps, CalendarDay, CalendarMode, MarkedDate, CalendarDateRange };
