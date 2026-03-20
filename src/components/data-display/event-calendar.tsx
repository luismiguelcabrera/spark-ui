"use client";

import {
  forwardRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
} from "react";
import { cn } from "../../lib/utils";
import { Icon } from "./icon";
import { useControllable } from "../../hooks/use-controllable";
import { useLocale } from "../../lib/locale";

// ── Types ──────────────────────────────────────────────────────────────────

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  allDay?: boolean;
};

type CalendarView = "month" | "week" | "day";

type EventCalendarProps = {
  events?: CalendarEvent[];
  view?: CalendarView;
  defaultView?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onSlotClick?: (start: Date, end: Date) => void;
  onEventDrop?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void;
  locale?: string;
  weekStartsOn?: 0 | 1;
  className?: string;
};

// ── Helpers ────────────────────────────────────────────────────────────────

const HOURS_START = 6;
const HOURS_END = 22;
const MAX_VISIBLE_EVENTS = 3;

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function startOfWeek(d: Date, weekStartsOn: 0 | 1): Date {
  const r = new Date(d);
  const day = r.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  r.setDate(r.getDate() - diff);
  r.setHours(0, 0, 0, 0);
  return r;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function addMonths(d: Date, n: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
}

function getWeekDays(d: Date, weekStartsOn: 0 | 1): Date[] {
  const start = startOfWeek(d, weekStartsOn);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

function getMonthDays(d: Date, weekStartsOn: 0 | 1): Date[] {
  const year = d.getFullYear();
  const month = d.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  const start = startOfWeek(firstOfMonth, weekStartsOn);
  const days: Date[] = [];

  let current = new Date(start);
  // Always generate full weeks until we pass the last day of the month
  while (current <= lastOfMonth || current.getDay() !== weekStartsOn) {
    days.push(new Date(current));
    current = addDays(current, 1);
    // Safety: max 42 cells (6 weeks)
    if (days.length >= 42) break;
  }

  return days;
}

function formatTime(d: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

function formatMonthYear(d: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(d);
}

function formatWeekRange(d: Date, weekStartsOn: 0 | 1, locale: string): string {
  const days = getWeekDays(d, weekStartsOn);
  const first = days[0];
  const last = days[6];
  const fmt = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  });
  return `${fmt.format(first)} \u2013 ${fmt.format(last)}`;
}

function formatDayHeader(d: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function formatDayLabel(d: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(d);
}

function getEventColor(color?: string): {
  bg: string;
  text: string;
  border: string;
} {
  if (!color) {
    return {
      bg: "bg-primary/10",
      text: "text-primary",
      border: "border-primary/30",
    };
  }

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    red: {
      bg: "bg-destructive/15",
      text: "text-destructive",
      border: "border-destructive/30",
    },
    blue: {
      bg: "bg-primary/15",
      text: "text-primary",
      border: "border-primary/30",
    },
    green: {
      bg: "bg-success/15",
      text: "text-success",
      border: "border-success/30",
    },
    yellow: {
      bg: "bg-warning/15",
      text: "text-warning",
      border: "border-warning/30",
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-900 dark:text-purple-200",
      border: "border-purple-300 dark:border-purple-700",
    },
    orange: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-900 dark:text-orange-200",
      border: "border-orange-300 dark:border-orange-700",
    },
    pink: {
      bg: "bg-pink-100 dark:bg-pink-900/30",
      text: "text-pink-900 dark:text-pink-200",
      border: "border-pink-300 dark:border-pink-700",
    },
    teal: {
      bg: "bg-teal-100 dark:bg-teal-900/30",
      text: "text-teal-900 dark:text-teal-200",
      border: "border-teal-300 dark:border-teal-700",
    },
  };

  if (colorMap[color]) return colorMap[color];

  // Default for unknown/hex colors
  return {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/30",
  };
}

function eventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter((ev) => {
    const evStart = startOfDay(ev.start);
    const evEnd = startOfDay(ev.end);
    const target = startOfDay(day);
    return target >= evStart && target <= evEnd;
  });
}

function timedEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter((ev) => {
    if (ev.allDay) return false;
    return isSameDay(ev.start, day) || isSameDay(ev.end, day);
  });
}

function allDayEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter((ev) => {
    if (!ev.allDay) return false;
    const evStart = startOfDay(ev.start);
    const evEnd = startOfDay(ev.end);
    const target = startOfDay(day);
    return target >= evStart && target <= evEnd;
  });
}

// Compute overlapping columns for timed events
function computeColumns(events: CalendarEvent[]): Map<string, { col: number; totalCols: number }> {
  const result = new Map<string, { col: number; totalCols: number }>();
  if (events.length === 0) return result;

  const sorted = [...events].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );

  const columns: CalendarEvent[][] = [];

  for (const event of sorted) {
    let placed = false;
    for (let col = 0; col < columns.length; col++) {
      const lastInCol = columns[col][columns[col].length - 1];
      if (lastInCol.end.getTime() <= event.start.getTime()) {
        columns[col].push(event);
        result.set(event.id, { col, totalCols: 0 });
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push([event]);
      result.set(event.id, { col: columns.length - 1, totalCols: 0 });
    }
  }

  // Update totalCols for all events — find overlapping groups
  for (const event of sorted) {
    let maxCols = 1;
    for (const other of sorted) {
      if (other.id === event.id) continue;
      if (other.start.getTime() < event.end.getTime() && other.end.getTime() > event.start.getTime()) {
        const otherEntry = result.get(other.id);
        const eventEntry = result.get(event.id);
        if (otherEntry && eventEntry) {
          maxCols = Math.max(maxCols, Math.abs(otherEntry.col - eventEntry.col) + 1);
        }
      }
    }
    const entry = result.get(event.id);
    if (entry) {
      entry.totalCols = Math.max(entry.totalCols, maxCols, columns.length);
    }
  }

  return result;
}

function getEventTopAndHeight(event: CalendarEvent): { top: number; height: number } {
  const startMinutes = event.start.getHours() * 60 + event.start.getMinutes();
  const endMinutes = event.end.getHours() * 60 + event.end.getMinutes();
  const dayStart = HOURS_START * 60;
  const dayRange = (HOURS_END - HOURS_START) * 60;

  const top = ((Math.max(startMinutes, dayStart) - dayStart) / dayRange) * 100;
  const height = ((Math.min(endMinutes, HOURS_END * 60) - Math.max(startMinutes, dayStart)) / dayRange) * 100;

  return { top: Math.max(0, top), height: Math.max(1, height) };
}

// ── Sub-components ──────────────────────────────────────────────────────────

function ViewSwitcher({
  view,
  onViewChange,
}: {
  view: CalendarView;
  onViewChange: (v: CalendarView) => void;
}) {
  const { t } = useLocale();

  const viewLabels = useMemo(
    () => ({
      month: { full: t("eventcalendar.viewMonth", "month"), short: t("eventcalendar.viewMonthShort", "M") },
      week: { full: t("eventcalendar.viewWeek", "week"), short: t("eventcalendar.viewWeekShort", "W") },
      day: { full: t("eventcalendar.viewDay", "day"), short: t("eventcalendar.viewDayShort", "D") },
    }),
    [t],
  );

  const views: CalendarView[] = ["month", "week", "day"];
  return (
    <div className="inline-flex rounded-lg border border-muted bg-muted/30 p-0.5" role="group" aria-label={t("eventcalendar.calendarView", "Calendar view")}>
      {views.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onViewChange(v)}
          className={cn(
            "py-1.5 text-xs font-medium rounded-md transition-colors capitalize",
            "px-2 sm:px-3",
            v === view
              ? "bg-surface text-navy-text shadow-sm ring-1 ring-black/5 font-semibold"
              : "text-muted-foreground hover:text-navy-text hover:bg-muted/50"
          )}
          aria-pressed={v === view}
          aria-label={v}
        >
          <span className="sm:hidden" aria-hidden="true">{viewLabels[v].short}</span>
          <span className="hidden sm:inline" aria-hidden="true">{viewLabels[v].full}</span>
        </button>
      ))}
    </div>
  );
}

function EventPill({
  event,
  onClick,
  compact,
  locale,
}: {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  compact?: boolean;
  locale: string;
}) {
  const { t } = useLocale();
  const colors = getEventColor(event.color);
  const timeLabel = event.allDay
    ? t("eventcalendar.allDay", "All day")
    : `${formatTime(event.start, locale)} \u2013 ${formatTime(event.end, locale)}`;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(event);
      }}
      className={cn(
        "w-full text-left truncate rounded px-1.5 py-0.5 text-xs font-medium border-l-2 transition-colors",
        "hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:outline-none",
        colors.bg,
        colors.text,
        colors.border,
        compact && "py-0",
        compact && "hidden sm:block"
      )}
      aria-label={`${event.title}, ${timeLabel}`}
    >
      {compact ? (
        <span className="truncate">{event.title}</span>
      ) : (
        <span className="truncate">
          {!event.allDay && (
            <span className="mr-1">{formatTime(event.start, locale)}</span>
          )}
          {event.title}
        </span>
      )}
    </button>
  );
}

/** Colored dot for mobile month view — replaces unreadable truncated pills */
function EventDot({ color }: { color?: string }) {
  const colors = getEventColor(color);
  return (
    <span
      className={cn("inline-block w-1.5 h-1.5 rounded-full", colors.bg, colors.border, "border")}
    />
  );
}

// ── Month View ──────────────────────────────────────────────────────────────

function MonthView({
  date,
  events,
  weekStartsOn,
  locale,
  onEventClick,
  onSlotClick,
  onDayClick,
}: {
  date: Date;
  events: CalendarEvent[];
  weekStartsOn: 0 | 1;
  locale: string;
  onEventClick?: (event: CalendarEvent) => void;
  onSlotClick?: (start: Date, end: Date) => void;
  onDayClick: (day: Date) => void;
}) {
  const { t } = useLocale();

  const days = useMemo(
    () => getMonthDays(date, weekStartsOn),
    [date, weekStartsOn]
  );

  const dayHeaders = useMemo(() => {
    const week = getWeekDays(days[0], weekStartsOn);
    return week.map((d) => ({
      full: formatDayLabel(d, locale),
      narrow: new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(d),
    }));
  }, [days, weekStartsOn, locale]);

  const today = useMemo(() => new Date(), []);

  return (
    <div role="grid" aria-label="Month calendar">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-muted" role="row">
        {dayHeaders.map((label, i) => (
          <div
            key={i}
            className="py-2 text-center text-[11px] font-semibold text-muted-foreground uppercase"
            role="columnheader"
          >
            <span className="sm:hidden" aria-hidden="true">{label.narrow}</span>
            <span className="hidden sm:inline">{label.full}</span>
          </div>
        ))}
      </div>

      {/* Day cells — grouped into rows of 7 for ARIA grid structure */}
      {Array.from({ length: Math.ceil(days.length / 7) }, (_, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-7" role="row">
          {days.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
            const i = rowIdx * 7 + colIdx;
            const isCurrentMonth = day.getMonth() === date.getMonth();
            const isToday = isSameDay(day, today);
            const dayEvents = eventsForDay(events, day);
            const visible = dayEvents.slice(0, MAX_VISIBLE_EVENTS);
            const overflow = dayEvents.length - MAX_VISIBLE_EVENTS;

            return (
              <div
                key={i}
                role="gridcell"
                aria-current={isToday ? "date" : undefined}
                className={cn(
                  "min-h-[60px] sm:min-h-[100px] border-b border-r border-muted/50 p-1 cursor-pointer transition-colors hover:bg-muted/30/50",
                  !isCurrentMonth && "bg-muted/30/30",
                  colIdx === 0 && "border-l-0"
                )}
                onClick={() => {
                  onDayClick(day);
                  if (onSlotClick) {
                    const end = new Date(day);
                    end.setHours(23, 59, 59, 999);
                    onSlotClick(startOfDay(day), end);
                  }
                }}
                tabIndex={0}
                onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onDayClick(day);
                  }
                }}
              >
                {/* Day number */}
                <div className="flex justify-end mb-1">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full",
                      isToday && "bg-primary text-white",
                      !isToday && isCurrentMonth && "text-navy-text",
                      !isCurrentMonth && "text-muted-foreground"
                    )}
                  >
                    {day.getDate()}
                  </span>
                </div>

                {/* Events — dots on mobile, pills on sm+ */}
                {dayEvents.length > 0 && (
                  <div className="flex flex-wrap gap-0.5 sm:hidden mt-0.5 justify-center">
                    {dayEvents.slice(0, 4).map((ev) => (
                      <EventDot key={ev.id} color={ev.color} />
                    ))}
                    {dayEvents.length > 4 && (
                      <span className="text-[8px] text-muted-foreground leading-none">+</span>
                    )}
                  </div>
                )}
                <div className="hidden sm:block space-y-0.5">
                  {visible.map((ev) => (
                    <EventPill
                      key={ev.id}
                      event={ev}
                      onClick={onEventClick}
                      compact
                      locale={locale}
                    />
                  ))}
                  {overflow > 0 && (
                    <button
                      type="button"
                      className="w-full text-left text-[10px] text-muted-foreground font-medium px-1.5 hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDayClick(day);
                      }}
                    >
                      +{overflow} {t("eventcalendar.more", "more")}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Time Grid (shared by Week & Day) ────────────────────────────────────────

function TimeGrid({
  days,
  events,
  locale,
  onEventClick,
  onSlotClick,
}: {
  days: Date[];
  events: CalendarEvent[];
  locale: string;
  onEventClick?: (event: CalendarEvent) => void;
  onSlotClick?: (start: Date, end: Date) => void;
}) {
  const { t } = useLocale();

  const hours = useMemo(
    () => Array.from({ length: HOURS_END - HOURS_START }, (_, i) => HOURS_START + i),
    []
  );

  const today = useMemo(() => new Date(), []);
  const [currentTimeTop, setCurrentTimeTop] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Current time indicator
  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      const dayStart = HOURS_START * 60;
      const dayRange = (HOURS_END - HOURS_START) * 60;
      if (minutes >= dayStart && minutes <= HOURS_END * 60) {
        setCurrentTimeTop(((minutes - dayStart) / dayRange) * 100);
      } else {
        setCurrentTimeTop(null);
      }
    }

    updateTime();
    const interval = setInterval(updateTime, 60_000);
    return () => clearInterval(interval);
  }, []);

  // All-day events
  const allDayByDay = useMemo(() => {
    return days.map((day) => allDayEventsForDay(events, day));
  }, [days, events]);

  const hasAllDay = allDayByDay.some((arr) => arr.length > 0);
  const cols = days.length;

  return (
    <div className="flex flex-col overflow-hidden">
      {/* All-day header */}
      {hasAllDay && (
        <div className="border-b border-muted">
          <div
            className="grid"
            style={{ gridTemplateColumns: `60px repeat(${cols}, 1fr)` }}
          >
            <div className="px-2 py-1 text-[10px] font-medium text-muted-foreground border-r border-muted/50">
              {t("eventcalendar.allDay", "All day")}
            </div>
            {allDayByDay.map((dayEvents, di) => (
              <div
                key={di}
                className="px-1 py-1 space-y-0.5 border-r border-muted/50 last:border-r-0"
              >
                {dayEvents.map((ev) => (
                  <EventPill
                    key={ev.id}
                    event={ev}
                    onClick={onEventClick}
                    compact
                    locale={locale}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable time grid */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: "600px" }}>
        <div
          ref={gridRef}
          className="grid relative"
          style={{ gridTemplateColumns: `60px repeat(${cols}, 1fr)` }}
        >
          {/* Time labels column */}
          <div className="border-r border-muted/50">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-16 flex items-start justify-end pr-2 -mt-2"
              >
                <span className="text-[10px] text-muted-foreground font-medium">
                  {formatTime(
                    new Date(2000, 0, 1, hour, 0),
                    locale
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day, di) => {
            const dayTimedEvents = timedEventsForDay(events, day);
            const columns = computeColumns(dayTimedEvents);
            const isToday = isSameDay(day, today);

            return (
              <div key={di} className="relative border-r border-muted/50 last:border-r-0">
                {/* Hour grid lines */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-16 border-b border-muted/30 cursor-pointer hover:bg-muted/30/50 transition-colors"
                    role="button"
                    tabIndex={0}
                    aria-label={`${formatDayLabel(day, locale)} ${formatTime(
                      new Date(2000, 0, 1, hour, 0),
                      locale
                    )}`}
                    onClick={() => {
                      if (onSlotClick) {
                        const start = new Date(day);
                        start.setHours(hour, 0, 0, 0);
                        const end = new Date(day);
                        end.setHours(hour + 1, 0, 0, 0);
                        onSlotClick(start, end);
                      }
                    }}
                    onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (onSlotClick) {
                          const start = new Date(day);
                          start.setHours(hour, 0, 0, 0);
                          const end = new Date(day);
                          end.setHours(hour + 1, 0, 0, 0);
                          onSlotClick(start, end);
                        }
                      }
                    }}
                  />
                ))}

                {/* Timed events overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {dayTimedEvents.map((ev) => {
                    const { top, height } = getEventTopAndHeight(ev);
                    const colInfo = columns.get(ev.id) ?? {
                      col: 0,
                      totalCols: 1,
                    };
                    const colors = getEventColor(ev.color);
                    const width = 100 / colInfo.totalCols;
                    const left = colInfo.col * width;

                    return (
                      <button
                        key={ev.id}
                        type="button"
                        className={cn(
                          "absolute rounded px-1.5 py-0.5 text-[11px] font-medium border-l-2 overflow-hidden pointer-events-auto cursor-pointer",
                          "hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:outline-none",
                          colors.bg,
                          colors.text,
                          colors.border
                        )}
                        style={{
                          top: `${top}%`,
                          height: `${height}%`,
                          left: `${left}%`,
                          width: `${width - 2}%`,
                          minHeight: "20px",
                        }}
                        aria-label={`${ev.title}, ${formatTime(ev.start, locale)} to ${formatTime(ev.end, locale)}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(ev);
                        }}
                      >
                        <div className="truncate font-semibold">{ev.title}</div>
                        <div className="truncate">
                          {formatTime(ev.start, locale)} &ndash;{" "}
                          {formatTime(ev.end, locale)}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Current time indicator */}
                {isToday && currentTimeTop !== null && (
                  <div
                    className="absolute left-0 right-0 z-10 pointer-events-none"
                    style={{ top: `${currentTimeTop}%` }}
                    data-testid="current-time-indicator"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-destructive -ml-1" />
                      <div className="flex-1 h-px bg-destructive" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Week View ───────────────────────────────────────────────────────────────

function WeekView({
  date,
  events,
  weekStartsOn,
  locale,
  onEventClick,
  onSlotClick,
}: {
  date: Date;
  events: CalendarEvent[];
  weekStartsOn: 0 | 1;
  locale: string;
  onEventClick?: (event: CalendarEvent) => void;
  onSlotClick?: (start: Date, end: Date) => void;
}) {
  const days = useMemo(() => getWeekDays(date, weekStartsOn), [date, weekStartsOn]);
  const today = useMemo(() => new Date(), []);

  return (
    <div>
      {/* Day headers */}
      <div
        className="grid border-b border-muted"
        style={{ gridTemplateColumns: `60px repeat(7, 1fr)` }}
      >
        <div className="border-r border-muted/50" />
        {days.map((day, i) => {
          const isToday = isSameDay(day, today);
          return (
            <div
              key={i}
              className={cn(
                "py-2 text-center border-r border-muted/50 last:border-r-0",
                isToday && "bg-primary/5"
              )}
            >
              <div className="text-[10px] font-semibold text-muted-foreground uppercase">
                {formatDayLabel(day, locale)}
              </div>
              <div
                className={cn(
                  "inline-flex items-center justify-center w-7 h-7 text-sm font-bold rounded-full mt-0.5",
                  isToday && "bg-primary text-white",
                  !isToday && "text-navy-text"
                )}
              >
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      <TimeGrid
        days={days}
        events={events}
        locale={locale}
        onEventClick={onEventClick}
        onSlotClick={onSlotClick}
      />
    </div>
  );
}

// ── Day View ────────────────────────────────────────────────────────────────

function DayView({
  date,
  events,
  locale,
  onEventClick,
  onSlotClick,
}: {
  date: Date;
  events: CalendarEvent[];
  locale: string;
  onEventClick?: (event: CalendarEvent) => void;
  onSlotClick?: (start: Date, end: Date) => void;
}) {
  const days = useMemo(() => [startOfDay(date)], [date]);

  return (
    <div>
      {/* Day header */}
      <div
        className="grid border-b border-muted"
        style={{ gridTemplateColumns: `60px 1fr` }}
      >
        <div className="border-r border-muted/50" />
        <div className="py-2 text-center">
          <div className="text-sm font-bold text-navy-text">
            {formatDayHeader(date, locale)}
          </div>
        </div>
      </div>

      <TimeGrid
        days={days}
        events={events}
        locale={locale}
        onEventClick={onEventClick}
        onSlotClick={onSlotClick}
      />
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

const EventCalendar = forwardRef<HTMLDivElement, EventCalendarProps>(
  (
    {
      events = [],
      view: viewProp,
      defaultView = "month",
      onViewChange,
      date: dateProp,
      defaultDate,
      onDateChange,
      onEventClick,
      onSlotClick,
      onEventDrop: _onEventDrop,
      locale = "en-US",
      weekStartsOn = 0,
      className,
    },
    ref
  ) => {
    const { t } = useLocale();

    const [view, setView] = useControllable<CalendarView>({
      value: viewProp,
      defaultValue: defaultView,
      onChange: onViewChange,
    });

    const [date, setDate] = useControllable<Date>({
      value: dateProp,
      defaultValue: defaultDate ?? new Date(),
      onChange: onDateChange,
    });

    const goToToday = useCallback(() => {
      setDate(new Date());
    }, [setDate]);

    const goToPrev = useCallback(() => {
      switch (view) {
        case "month":
          setDate(addMonths(date, -1));
          break;
        case "week":
          setDate(addDays(date, -7));
          break;
        case "day":
          setDate(addDays(date, -1));
          break;
      }
    }, [view, date, setDate]);

    const goToNext = useCallback(() => {
      switch (view) {
        case "month":
          setDate(addMonths(date, 1));
          break;
        case "week":
          setDate(addDays(date, 7));
          break;
        case "day":
          setDate(addDays(date, 1));
          break;
      }
    }, [view, date, setDate]);

    const handleDayClick = useCallback(
      (day: Date) => {
        setDate(day);
        setView("day");
      },
      [setDate, setView]
    );

    const headerLabel = useMemo(() => {
      switch (view) {
        case "month":
          return formatMonthYear(date, locale);
        case "week":
          return formatWeekRange(date, weekStartsOn, locale);
        case "day":
          return formatDayHeader(date, locale);
      }
    }, [view, date, locale, weekStartsOn]);

    // Keyboard navigation at the container level
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            goToPrev();
            break;
          case "ArrowRight":
            e.preventDefault();
            goToNext();
            break;
          case "Enter":
            // Enter on the calendar selects current date in day view
            break;
        }
      },
      [goToPrev, goToNext]
    );

    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface border border-muted rounded-2xl overflow-hidden",
          className
        )}
        onKeyDown={handleKeyDown}
        data-testid="event-calendar"
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-3 border-b border-muted">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={goToToday}
              className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-medium rounded-lg border border-muted bg-surface hover:bg-muted/30 text-navy-text transition-colors"
            >
              {t("eventcalendar.today", "Today")}
            </button>

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={goToPrev}
                className="p-1 sm:p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                aria-label={t("eventcalendar.previous", "Previous")}
              >
                <Icon name="chevron_left" size="sm" className="text-muted-foreground" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="p-1 sm:p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                aria-label={t("eventcalendar.next", "Next")}
              >
                <Icon name="chevron_right" size="sm" className="text-muted-foreground" />
              </button>
            </div>

            <h2 className="text-xs sm:text-sm font-bold text-secondary ml-1 sm:ml-2">
              {headerLabel}
            </h2>
          </div>

          <ViewSwitcher view={view} onViewChange={setView} />
        </div>

        {/* Body */}
        <div>
          {view === "month" && (
            <MonthView
              date={date}
              events={events}
              weekStartsOn={weekStartsOn}
              locale={locale}
              onEventClick={onEventClick}
              onSlotClick={onSlotClick}
              onDayClick={handleDayClick}
            />
          )}
          {view === "week" && (
            <WeekView
              date={date}
              events={events}
              weekStartsOn={weekStartsOn}
              locale={locale}
              onEventClick={onEventClick}
              onSlotClick={onSlotClick}
            />
          )}
          {view === "day" && (
            <DayView
              date={date}
              events={events}
              locale={locale}
              onEventClick={onEventClick}
              onSlotClick={onSlotClick}
            />
          )}
        </div>
      </div>
    );
  }
);

EventCalendar.displayName = "EventCalendar";

export { EventCalendar };
export type { EventCalendarProps, CalendarEvent, CalendarView };
