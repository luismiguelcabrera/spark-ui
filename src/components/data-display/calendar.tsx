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
  /** Hovered in range preview */
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

  // Range
  selectedRange?: [number, number] | null;
  defaultSelectedRange?: [number, number] | null;
  onSelectRange?: (range: [number, number] | null) => void;

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
  /** Show "Today" quick-jump button */
  showTodayButton?: boolean;
  /** Show selected date label below the grid */
  showSelectedLabel?: boolean;
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

function isDateDisabled(date: Date, minDate?: Date, maxDate?: Date, disabledSet?: Set<string>): boolean {
  if (minDate && date < minDate && !isSameDay(date, minDate)) return true;
  if (maxDate && date > maxDate && !isSameDay(date, maxDate)) return true;
  if (disabledSet?.has(date.toDateString())) return true;
  return false;
}

function formatSelectedLabel(mode: CalendarMode, selectedDay: number, multiDates: number[], range: [number, number] | null, monthName: string, displayYear: number): string | null {
  if (mode === "single" && selectedDay > 0) {
    return `${monthName} ${selectedDay}, ${displayYear}`;
  }
  if (mode === "multiple" && multiDates.length > 0) {
    if (multiDates.length <= 3) return multiDates.map((d) => `${monthName} ${d}`).join(", ");
    return `${multiDates.length} dates selected`;
  }
  if (mode === "range" && range && range[0] !== range[1]) {
    const min = Math.min(range[0], range[1]);
    const max = Math.max(range[0], range[1]);
    return `${monthName} ${min} – ${max}, ${displayYear}`;
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
  range: [number, number] | null,
  hoverDay: number | null,
  rangeStep: "start" | "end",
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

  // Range hover preview: when picking end date, show preview
  const hoverRangeStart = range && rangeStep === "end" && hoverDay ? range[0] : null;
  const hoverRangeEnd = hoverDay;
  const hoverMin = hoverRangeStart && hoverRangeEnd ? Math.min(hoverRangeStart, hoverRangeEnd) : -1;
  const hoverMax = hoverRangeStart && hoverRangeEnd ? Math.max(hoverRangeStart, hoverRangeEnd) : -1;

  const offset = (firstDayOfMonth - weekStartsOn + 7) % 7;
  const result: CalendarDay[] = [];

  for (let i = offset - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    result.push({ day: d, date: new Date(Date.UTC(year, monthIndex - 1, d)), muted: true, disabled: true });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(Date.UTC(year, monthIndex, d));
    const isSelected = d === selectedDay || selectedDates.has(d);
    const isRangeStart = range ? d === range[0] : false;
    const isRangeEnd = range ? d === range[1] : false;
    const isInRange = range ? d > rangeMin && d < rangeMax : false;
    const isInHoverRange = hoverMin > 0 ? d > hoverMin && d < hoverMax : false;
    const disabled = isDateDisabled(date, minDate, maxDate, disabledSet);

    result.push({
      day: d, date, today: d === todayDate,
      selected: isSelected || isRangeStart || isRangeEnd,
      disabled, hasEvent: eventSet.has(d),
      rangeStart: isRangeStart || (hoverRangeStart !== null && d === hoverRangeStart),
      rangeEnd: isRangeEnd || (hoverRangeEnd !== null && rangeStep === "end" && d === hoverRangeEnd),
      inRange: isInRange,
      inHoverRange: isInHoverRange && !isInRange,
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

// ── Component ────────────────────────────────────────────────────────────

const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      mode = "single", month, year, days,
      selected, defaultSelected, onSelect, onSelectDate,
      selectedDates: selectedDatesProp, defaultSelectedDates, onSelectDates, max,
      selectedRange: selectedRangeProp, defaultSelectedRange, onSelectRange,
      onPrevMonth, onNextMonth, onMonthChange,
      minDate, maxDate, disabledDates,
      weekStartsOn = 0, fixedWeeks = false,
      eventDays = [], markedDates: markedDatesProp,
      showToday = true, showTodayButton = false, showSelectedLabel = false,
      className,
    },
    ref
  ) => {
    const gridId = useId();
    const isAutoMode = !days;
    const gridRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const markedMap = useMemo(() => new Map((markedDatesProp ?? []).map((m) => [m.day, m])), [markedDatesProp]);
    const disabledSet = useMemo(() => new Set((disabledDates ?? []).map((d) => d.toDateString())), [disabledDates]);
    const dayLabels = useMemo(() => {
      const labels = [...ALL_DAY_LABELS];
      return [...labels.slice(weekStartsOn), ...labels.slice(0, weekStartsOn)];
    }, [weekStartsOn]);

    // Navigation state
    const now = new Date();
    const initialMonthIndex = month ? MONTH_NAMES.indexOf(month as (typeof MONTH_NAMES)[number]) : now.getMonth();
    const initialYear = year ?? now.getFullYear();
    const [navMonth, setNavMonth] = useState(initialMonthIndex >= 0 ? initialMonthIndex : now.getMonth());
    const [navYear, setNavYear] = useState(initialYear);

    // Slide animation direction
    const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null);

    // Year/month picker
    const [pickerOpen, setPickerOpen] = useState(false);

    // Range hover preview
    const [hoverDay, setHoverDay] = useState<number | null>(null);

    // Selection state
    const [selectedDay, setSelectedDay] = useControllable<number>({ value: selected, defaultValue: defaultSelected ?? -1, onChange: onSelect });
    const [multiDates, setMultiDates] = useControllable<number[]>({ value: selectedDatesProp, defaultValue: defaultSelectedDates ?? [], onChange: onSelectDates });
    const [range, setRange] = useControllable<[number, number] | null>({ value: selectedRangeProp, defaultValue: defaultSelectedRange ?? null, onChange: onSelectRange });
    const [rangeStep, setRangeStep] = useState<"start" | "end">("start");
    const multiDateSet = useMemo(() => new Set(multiDates), [multiDates]);

    // ── Swipe gestures ──
    const touchStartX = useRef(0);
    const handleTouchStart = useCallback((e: ReactTouchEvent) => { touchStartX.current = e.touches[0].clientX; }, []);
    const handleTouchEnd = useCallback((e: ReactTouchEvent) => {
      const diff = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToPrevMonth();
        else goToNextMonth();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navMonth, navYear]);

    // ── Navigation ──
    const changeMonth = useCallback(
      (newMonth: number, newYear: number, dir: "left" | "right") => {
        setSlideDir(dir);
        setNavMonth(newMonth);
        setNavYear(newYear);
        onMonthChange?.(newMonth, newYear);
        if (mode === "single") setSelectedDay(-1);
        else if (mode === "multiple") setMultiDates([]);
        else if (mode === "range") { setRange(null); setRangeStep("start"); }
        setHoverDay(null);
      },
      [mode, onMonthChange, setSelectedDay, setMultiDates, setRange]
    );

    // Clear slide animation after it plays
    useEffect(() => {
      if (!slideDir) return;
      const timer = setTimeout(() => setSlideDir(null), 250);
      return () => clearTimeout(timer);
    }, [slideDir, navMonth]);  

    const goToPrevMonth = useCallback(() => {
      if (navMonth === 0) changeMonth(11, navYear - 1, "right");
      else changeMonth(navMonth - 1, navYear, "right");
    }, [navMonth, navYear, changeMonth]);

    const goToNextMonth = useCallback(() => {
      if (navMonth === 11) changeMonth(0, navYear + 1, "left");
      else changeMonth(navMonth + 1, navYear, "left");
    }, [navMonth, navYear, changeMonth]);

    const goToToday = useCallback(() => {
      const today = new Date();
      const dir = navYear * 12 + navMonth > today.getFullYear() * 12 + today.getMonth() ? "right" : "left";
      changeMonth(today.getMonth(), today.getFullYear(), dir);
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
          if (rangeStep === "start" || (range && range[0] !== range[1])) {
            // Start new range (also restart if a complete range exists)
            setRange([day, day]);
            setRangeStep("end");
          } else {
            setRange([range![0], day]);
            setRangeStep("start");
            setHoverDay(null);
          }
        }
      },
      [mode, setSelectedDay, onSelectDate, multiDateSet, multiDates, setMultiDates, max, range, setRange, rangeStep]
    );

    // ── Keyboard ──
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
          case "Escape": if (mode === "single") setSelectedDay(-1); return;
          default: return;
        }
        e.preventDefault();
        setFocusedIndex(next);
        gridRef.current?.querySelectorAll<HTMLButtonElement>("button[data-day]")[next]?.focus();
      },
      [focusedIndex, handleDayClick, mode, setSelectedDay]
    );

    // ── Generate days ──
    const hasExternalNav = !!(onPrevMonth || onNextMonth);
    const activeMonth = hasExternalNav
      ? (MONTH_NAMES.indexOf(month as (typeof MONTH_NAMES)[number]) >= 0 ? MONTH_NAMES.indexOf(month as (typeof MONTH_NAMES)[number]) : navMonth)
      : navMonth;
    const activeYear = hasExternalNav ? (year ?? navYear) : navYear;
    const activeSelectedDay = mode === "single" && selectedDay > 0 ? selectedDay : undefined;

    const computedDays = useMemo(
      () => isAutoMode
        ? generateCalendarDays(activeMonth, activeYear, weekStartsOn, fixedWeeks, activeSelectedDay, mode === "multiple" ? multiDateSet : new Set<number>(), mode === "range" ? range : null, hoverDay, rangeStep, eventDays, markedMap, minDate, maxDate, disabledSet)
        : [],
      [isAutoMode, activeMonth, activeYear, weekStartsOn, fixedWeeks, activeSelectedDay, mode, multiDateSet, range, hoverDay, rangeStep, eventDays, markedMap, minDate, maxDate, disabledSet]
    );

    const displayDays = !isAutoMode ? days! : computedDays;
    const displayMonth = hasExternalNav ? MONTH_NAMES[activeMonth] : (isAutoMode ? MONTH_NAMES[navMonth] : month);
    const displayYear = hasExternalNav ? activeYear : (isAutoMode ? navYear : year);

    const canGoPrev = !minDate || new Date(Date.UTC(activeYear, activeMonth, 0)) >= minDate;
    const canGoNext = !maxDate || new Date(Date.UTC(activeYear, activeMonth + 1, 1)) <= maxDate;

    const isCurrentMonth = navMonth === now.getMonth() && navYear === now.getFullYear();
    const selectedLabel = showSelectedLabel ? formatSelectedLabel(mode, selectedDay, multiDates, range, displayMonth as string, displayYear as number) : null;

    // (yearRange reserved for future year grid picker)

    // ── Render ───────────────────────────────────────────────────────────

    return (
      <div
        ref={(node) => {
          // Merge refs
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn(s.calendarContainer, "select-none", className)}
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

          {/* Clickable header → year/month picker */}
          <button
            type="button"
            onClick={() => setPickerOpen(!pickerOpen)}
            className="text-sm font-bold text-secondary hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-slate-50 active:scale-95"
            aria-expanded={pickerOpen}
            aria-label={`${displayMonth} ${displayYear}, click to pick month`}
          >
            <span aria-live="polite">{displayMonth} {displayYear}</span>
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

        {/* Year/Month picker dropdown */}
        {pickerOpen && (
          <div className="px-3 pb-3 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Year row */}
            <div className="flex items-center justify-between mb-2">
              <button type="button" onClick={() => setNavYear(navYear - 1)} className="p-1 rounded hover:bg-slate-100 active:scale-95" aria-label="Previous year">
                <Icon name="chevron_left" size="sm" className="text-slate-400" />
              </button>
              <span className="text-xs font-bold text-slate-600">{navYear}</span>
              <button type="button" onClick={() => setNavYear(navYear + 1)} className="p-1 rounded hover:bg-slate-100 active:scale-95" aria-label="Next year">
                <Icon name="chevron_right" size="sm" className="text-slate-400" />
              </button>
            </div>
            {/* Month grid */}
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

        {/* Day labels */}
        {!pickerOpen && (
          <>
            <div className={s.calendarGrid} role="row">
              {dayLabels.map((label) => (
                <div key={label} className={s.calendarDayLabel} role="columnheader" aria-label={label}>
                  {label}
                </div>
              ))}
            </div>

            {/* Day grid with slide animation */}
            <div
              ref={gridRef}
              id={gridId}
              className={cn(
                s.calendarGrid, "px-1 pb-2",
                slideDir === "left" && "animate-in slide-in-from-right-4 fade-in duration-200",
                slideDir === "right" && "animate-in slide-in-from-left-4 fade-in duration-200",
              )}
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
                    onMouseEnter={mode === "range" && rangeStep === "end" && !day.muted && !day.disabled ? () => setHoverDay(day.day) : undefined}
                    onMouseLeave={mode === "range" && rangeStep === "end" ? () => setHoverDay(null) : undefined}
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
                      // Custom mark
                      isColorMark && !isInlineColor && day.mark!.color,
                      // Range committed
                      day.inRange && "bg-primary/15 text-primary font-medium rounded-none",
                      // Range hover preview
                      day.inHoverRange && "bg-primary/8 text-primary/70 rounded-none",
                      day.rangeStart && "rounded-l-lg rounded-r-none",
                      day.rangeEnd && "rounded-r-lg rounded-l-none",
                      day.rangeStart && day.rangeEnd && "rounded-lg",
                      // Micro-animation on click
                      !day.muted && !day.disabled && "cursor-pointer hover:bg-primary/10 active:scale-90 transition-all duration-150",
                      "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:outline-none"
                    )}
                    style={isInlineColor ? { backgroundColor: day.mark!.color!, color: "#fff" } : undefined}
                    title={day.mark?.label}
                  >
                    {day.day}
                    {showToday && day.today && day.selected && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white" />
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

            {/* Footer: Today button + selected label */}
            {(showTodayButton || selectedLabel) && (
              <div className="flex items-center justify-between px-4 pb-3 pt-1">
                {showTodayButton && !isCurrentMonth ? (
                  <button
                    type="button"
                    onClick={goToToday}
                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors active:scale-95"
                  >
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
export type { CalendarProps, CalendarDay, CalendarMode, MarkedDate };
