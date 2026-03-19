"use client";

import { forwardRef, useState, useMemo, useCallback } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { useControllable } from "../../hooks/use-controllable";
import { useLocale } from "../../lib/locale";

// ── Types ───────────────────────────────────────────────────────────────────

type CronParts = {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
};

type CronInputProps = {
  /** Cron string e.g. "0 9 * * 1-5" */
  value?: string;
  /** Default cron value */
  defaultValue?: string;
  /** Callback when cron value changes */
  onChange?: (value: string) => void;
  /** Label for the input */
  label?: string;
  /** Error message */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Display mode */
  mode?: "basic" | "advanced";
  /** Additional class names */
  className?: string;
};

type TabId = "minute" | "hourly" | "daily" | "weekly" | "monthly";

// ── Pure functions ──────────────────────────────────────────────────────────

function parseCron(cron: string): CronParts {
  const parts = cron.trim().split(/\s+/);
  return {
    minute: parts[0] ?? "*",
    hour: parts[1] ?? "*",
    dayOfMonth: parts[2] ?? "*",
    month: parts[3] ?? "*",
    dayOfWeek: parts[4] ?? "*",
  };
}

function buildCron(parts: CronParts): string {
  return `${parts.minute} ${parts.hour} ${parts.dayOfMonth} ${parts.month} ${parts.dayOfWeek}`;
}

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// cron uses 1=Mon..7=Sun (or 0=Sun), we use 1=Mon..7=Sun
const DAY_CRON_MAP: Record<number, string> = {
  0: "1", // Mon
  1: "2", // Tue
  2: "3", // Wed
  3: "4", // Thu
  4: "5", // Fri
  5: "6", // Sat
  6: "7", // Sun (or 0)
};

function describeCron(cron: string): string {
  const parts = parseCron(cron);
  const { minute, hour, dayOfMonth, dayOfWeek } = parts;

  // Every minute
  if (minute === "*" && hour === "*" && dayOfMonth === "*" && dayOfWeek === "*") {
    return "Every minute";
  }

  // Every N minutes
  const everyNMin = minute.match(/^\*\/(\d+)$/);
  if (everyNMin && hour === "*" && dayOfMonth === "*" && dayOfWeek === "*") {
    return `Every ${everyNMin[1]} minutes`;
  }

  // Every hour (at minute 0)
  if (minute === "0" && hour === "*" && dayOfMonth === "*" && dayOfWeek === "*") {
    return "Every hour";
  }

  // Format time helper
  const pad = (n: string) => n.padStart(2, "0");
  const formatTime = (h: string, m: string) => `${pad(h)}:${pad(m)}`;

  // At specific time, every day
  if (/^\d+$/.test(minute) && /^\d+$/.test(hour) && dayOfMonth === "*" && dayOfWeek === "*") {
    return `At ${formatTime(hour, minute)}, every day`;
  }

  // At specific time on specific days of week
  if (/^\d+$/.test(minute) && /^\d+$/.test(hour) && dayOfMonth === "*" && dayOfWeek !== "*") {
    const dayDesc = describeDaysOfWeek(dayOfWeek);
    return `At ${formatTime(hour, minute)}, ${dayDesc}`;
  }

  // At specific time on specific day of month
  if (/^\d+$/.test(minute) && /^\d+$/.test(hour) && /^\d+$/.test(dayOfMonth) && dayOfWeek === "*") {
    return `At ${formatTime(hour, minute)}, on day ${dayOfMonth} of the month`;
  }

  // Fallback: return a basic description
  return `${minute} ${hour} ${dayOfMonth} ${parts.month} ${dayOfWeek}`;
}

function describeDaysOfWeek(dayOfWeek: string): string {
  // Handle range like 1-5
  const rangeMatch = dayOfWeek.match(/^(\d+)-(\d+)$/);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1]);
    const end = parseInt(rangeMatch[2]);
    const startName = cronDayToName(start);
    const endName = cronDayToName(end);
    return `${startName} through ${endName}`;
  }

  // Handle comma-separated like 1,3,5
  if (dayOfWeek.includes(",")) {
    const days = dayOfWeek.split(",").map((d) => cronDayToName(parseInt(d.trim())));
    if (days.length === 1) return `every ${days[0]}`;
    if (days.length === 2) return `every ${days[0]} and ${days[1]}`;
    const last = days.pop();
    return `every ${days.join(", ")}, and ${last}`;
  }

  // Single day
  if (/^\d+$/.test(dayOfWeek)) {
    return `every ${cronDayToName(parseInt(dayOfWeek))}`;
  }

  return dayOfWeek;
}

function cronDayToName(cronDay: number): string {
  // cron: 0 or 7 = Sunday, 1 = Monday, ..., 6 = Saturday
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  if (cronDay === 7) return "Sunday";
  return names[cronDay] ?? `Day ${cronDay}`;
}

function getNextRuns(cron: string, count: number = 3): Date[] {
  const parts = parseCron(cron);
  const { minute, hour, dayOfMonth, dayOfWeek } = parts;
  const results: Date[] = [];
  const now = new Date();
  const candidate = new Date(now);
  candidate.setSeconds(0);
  candidate.setMilliseconds(0);

  // Advance by 1 minute to start from next run
  candidate.setMinutes(candidate.getMinutes() + 1);

  // Simple implementation for common patterns
  const maxIterations = 525600; // 1 year of minutes

  // Every N minutes pattern
  const everyNMin = minute.match(/^\*\/(\d+)$/);

  for (let i = 0; i < maxIterations && results.length < count; i++) {
    let minuteMatch = false;
    let hourMatch = false;
    let dayOfMonthMatch = false;
    let dayOfWeekMatch = false;

    const cMin = candidate.getMinutes();
    const cHour = candidate.getHours();
    const cDom = candidate.getDate();
    const cDow = candidate.getDay(); // 0=Sun, 1=Mon..6=Sat

    // Check minute
    if (minute === "*") {
      minuteMatch = true;
    } else if (everyNMin) {
      minuteMatch = cMin % parseInt(everyNMin[1]) === 0;
    } else if (/^\d+$/.test(minute)) {
      minuteMatch = cMin === parseInt(minute);
    } else {
      // Complex pattern - bail out
      return results;
    }

    // Check hour
    if (hour === "*") {
      hourMatch = true;
    } else if (/^\d+$/.test(hour)) {
      hourMatch = cHour === parseInt(hour);
    } else {
      return results;
    }

    // Check day of month
    if (dayOfMonth === "*") {
      dayOfMonthMatch = true;
    } else if (/^\d+$/.test(dayOfMonth)) {
      dayOfMonthMatch = cDom === parseInt(dayOfMonth);
    } else {
      return results;
    }

    // Check day of week
    if (dayOfWeek === "*") {
      dayOfWeekMatch = true;
    } else if (/^\d+$/.test(dayOfWeek)) {
      const cronDow = parseInt(dayOfWeek);
      dayOfWeekMatch = cDow === cronDow || (cronDow === 7 && cDow === 0);
    } else if (/^\d+-\d+$/.test(dayOfWeek)) {
      const [start, end] = dayOfWeek.split("-").map(Number);
      // Convert JS day (0=Sun) to cron day (0=Sun, 1=Mon..6=Sat)
      dayOfWeekMatch = cDow >= start && cDow <= end;
    } else if (dayOfWeek.includes(",")) {
      const days = dayOfWeek.split(",").map(Number);
      dayOfWeekMatch = days.includes(cDow) || (days.includes(7) && cDow === 0);
    } else {
      return results;
    }

    if (minuteMatch && hourMatch && dayOfMonthMatch && dayOfWeekMatch) {
      results.push(new Date(candidate));
    }

    candidate.setMinutes(candidate.getMinutes() + 1);
  }

  return results;
}

// ── Helpers for basic mode ──────────────────────────────────────────────────

function detectTab(parts: CronParts): TabId {
  const { minute, hour, dayOfMonth, dayOfWeek } = parts;

  // Monthly: specific day of month
  if (/^\d+$/.test(dayOfMonth) && dayOfMonth !== "*") return "monthly";

  // Weekly: specific day(s) of week
  if (dayOfWeek !== "*") return "weekly";

  // Daily: specific hour
  if (/^\d+$/.test(hour) && hour !== "*") return "daily";

  // Hourly: specific minute, every hour
  if (/^\d+$/.test(minute) && hour === "*") return "hourly";

  // Every N minutes
  if (minute.startsWith("*/")) return "minute";

  return "minute";
}

// ── Component ───────────────────────────────────────────────────────────────

const CronInput = forwardRef<HTMLDivElement, CronInputProps>(
  (
    {
      value,
      defaultValue = "* * * * *",
      onChange,
      label,
      error,
      disabled = false,
      mode = "basic",
      className,
    },
    ref
  ) => {
    const { t } = useLocale();
    const [cronValue, setCronValue] = useControllable({
      value,
      defaultValue,
      onChange,
    });

    const parts = useMemo(() => parseCron(cronValue), [cronValue]);
    const description = useMemo(() => describeCron(cronValue), [cronValue]);
    const nextRuns = useMemo(() => getNextRuns(cronValue, 3), [cronValue]);

    const [activeTab, setActiveTab] = useState<TabId>(() => detectTab(parts));

    const updateCron = useCallback(
      (newParts: Partial<CronParts>) => {
        const merged = { ...parseCron(cronValue), ...newParts };
        const newCron = buildCron(merged);
        setCronValue(newCron);
      },
      [cronValue, setCronValue]
    );

    const tabs: { id: TabId; labelKey: string; fallback: string }[] = [
      { id: "minute", labelKey: "cron.minute", fallback: "Minute" },
      { id: "hourly", labelKey: "cron.hourly", fallback: "Hourly" },
      { id: "daily", labelKey: "cron.daily", fallback: "Daily" },
      { id: "weekly", labelKey: "cron.weekly", fallback: "Weekly" },
      { id: "monthly", labelKey: "cron.monthly", fallback: "Monthly" },
    ];

    const handleTabChange = (tabId: TabId) => {
      setActiveTab(tabId);
      // Set a sensible default cron for each tab
      switch (tabId) {
        case "minute":
          setCronValue("*/5 * * * *");
          break;
        case "hourly":
          setCronValue("0 * * * *");
          break;
        case "daily":
          setCronValue("0 9 * * *");
          break;
        case "weekly":
          setCronValue("0 9 * * 1");
          break;
        case "monthly":
          setCronValue("0 9 1 * *");
          break;
      }
    };

    const formatDate = (date: Date): string => {
      return date.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const selectClasses =
      "h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed";

    const dayButtonBase =
      "w-9 h-9 rounded-lg text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1";
    const dayButtonActive = "bg-primary text-white border-primary";
    const dayButtonInactive =
      "border-slate-200 text-slate-600 hover:bg-slate-50";

    // ── Minute tab state ──────────────────────────────────────────────
    const everyNMatch = parts.minute.match(/^\*\/(\d+)$/);
    const everyNMinutes = everyNMatch ? parseInt(everyNMatch[1]) : 5;

    // ── Hourly tab state ──────────────────────────────────────────────
    const hourlyMinute = /^\d+$/.test(parts.minute) ? parseInt(parts.minute) : 0;

    // ── Daily tab state ───────────────────────────────────────────────
    const dailyHour = /^\d+$/.test(parts.hour) ? parseInt(parts.hour) : 9;
    const dailyMinute = /^\d+$/.test(parts.minute) ? parseInt(parts.minute) : 0;

    // ── Weekly tab state ──────────────────────────────────────────────
    const weeklyHour = /^\d+$/.test(parts.hour) ? parseInt(parts.hour) : 9;
    const weeklyMinute = /^\d+$/.test(parts.minute) ? parseInt(parts.minute) : 0;
    const selectedDays = useMemo(() => {
      if (parts.dayOfWeek === "*") return new Set<number>();
      const days = new Set<number>();
      // Handle ranges (e.g., "1-5") and lists (e.g., "1,3,5")
      const segments = parts.dayOfWeek.split(",");
      for (const seg of segments) {
        const range = seg.match(/^(\d+)-(\d+)$/);
        if (range) {
          for (let i = parseInt(range[1]); i <= parseInt(range[2]); i++) {
            days.add(i);
          }
        } else if (/^\d+$/.test(seg.trim())) {
          days.add(parseInt(seg.trim()));
        }
      }
      return days;
    }, [parts.dayOfWeek]);

    // ── Monthly tab state ─────────────────────────────────────────────
    const monthlyDay = /^\d+$/.test(parts.dayOfMonth)
      ? parseInt(parts.dayOfMonth)
      : 1;
    const monthlyHour = /^\d+$/.test(parts.hour) ? parseInt(parts.hour) : 9;
    const monthlyMinute = /^\d+$/.test(parts.minute)
      ? parseInt(parts.minute)
      : 0;

    const toggleDay = (cronDay: number) => {
      const newDays = new Set(selectedDays);
      if (newDays.has(cronDay)) {
        newDays.delete(cronDay);
      } else {
        newDays.add(cronDay);
      }
      const sorted = Array.from(newDays).sort((a, b) => a - b);
      const dowStr = sorted.length === 0 ? "*" : sorted.join(",");
      updateCron({
        minute: String(weeklyMinute),
        hour: String(weeklyHour),
        dayOfMonth: "*",
        dayOfWeek: dowStr,
      });
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-3", className)}
        aria-disabled={disabled || undefined}
      >
        {label && (
          <label className="text-sm font-medium text-slate-700">{label}</label>
        )}

        {mode === "basic" ? (
          <div>
            {/* Tabs row */}
            <div
              className="flex gap-1 bg-slate-100 rounded-lg p-1"
              role="tablist"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  disabled={disabled}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    activeTab === tab.id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-700"
                  )}
                >
                  {t(tab.labelKey, tab.fallback)}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="mt-3 space-y-3" role="tabpanel">
              {activeTab === "minute" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">
                    {t("cron.everyXMinutes", "Every {0} minutes").split("{0}")[0]}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={59}
                    value={everyNMinutes}
                    disabled={disabled}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(59, parseInt(e.target.value) || 1));
                      updateCron({
                        minute: `*/${val}`,
                        hour: "*",
                        dayOfMonth: "*",
                        dayOfWeek: "*",
                      });
                    }}
                    className={cn(selectClasses, "w-20")}
                  />
                  <span className="text-sm text-slate-600">
                    {t("cron.everyXMinutes", "Every {0} minutes").split("{0}")[1] || "minutes"}
                  </span>
                </div>
              )}

              {activeTab === "hourly" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">
                    {t("cron.atMinute", "At minute")}
                  </span>
                  <select
                    value={hourlyMinute}
                    disabled={disabled}
                    onChange={(e) =>
                      updateCron({
                        minute: e.target.value,
                        hour: "*",
                        dayOfMonth: "*",
                        dayOfWeek: "*",
                      })
                    }
                    className={selectClasses}
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-slate-600">of every hour</span>
                </div>
              )}

              {activeTab === "daily" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">
                    {t("cron.atTime", "At")}
                  </span>
                  <select
                    value={dailyHour}
                    disabled={disabled}
                    onChange={(e) =>
                      updateCron({
                        minute: String(dailyMinute),
                        hour: e.target.value,
                        dayOfMonth: "*",
                        dayOfWeek: "*",
                      })
                    }
                    className={selectClasses}
                    aria-label="Hour"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span className="text-slate-400">:</span>
                  <select
                    value={dailyMinute}
                    disabled={disabled}
                    onChange={(e) =>
                      updateCron({
                        minute: e.target.value,
                        hour: String(dailyHour),
                        dayOfMonth: "*",
                        dayOfWeek: "*",
                      })
                    }
                    className={selectClasses}
                    aria-label="Minute"
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === "weekly" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">
                      {t("cron.atTime", "At")}
                    </span>
                    <select
                      value={weeklyHour}
                      disabled={disabled}
                      onChange={(e) => {
                        const sorted = Array.from(selectedDays).sort((a, b) => a - b);
                        const dowStr = sorted.length === 0 ? "*" : sorted.join(",");
                        updateCron({
                          minute: String(weeklyMinute),
                          hour: e.target.value,
                          dayOfMonth: "*",
                          dayOfWeek: dowStr,
                        });
                      }}
                      className={selectClasses}
                      aria-label="Hour"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {String(i).padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                    <span className="text-slate-400">:</span>
                    <select
                      value={weeklyMinute}
                      disabled={disabled}
                      onChange={(e) => {
                        const sorted = Array.from(selectedDays).sort((a, b) => a - b);
                        const dowStr = sorted.length === 0 ? "*" : sorted.join(",");
                        updateCron({
                          minute: e.target.value,
                          hour: String(weeklyHour),
                          dayOfMonth: "*",
                          dayOfWeek: dowStr,
                        });
                      }}
                      className={selectClasses}
                      aria-label="Minute"
                    >
                      {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i}>
                          {String(i).padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {DAY_SHORT.map((day, index) => {
                      const cronDay = parseInt(DAY_CRON_MAP[index]);
                      const isActive = selectedDays.has(cronDay);
                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={disabled}
                          onClick={() => toggleDay(cronDay)}
                          aria-pressed={isActive}
                          className={cn(
                            dayButtonBase,
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            isActive ? dayButtonActive : dayButtonInactive
                          )}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "monthly" && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-slate-600">
                    {t("cron.atTime", "At")}
                  </span>
                  <select
                    value={monthlyHour}
                    disabled={disabled}
                    onChange={(e) =>
                      updateCron({
                        minute: String(monthlyMinute),
                        hour: e.target.value,
                        dayOfMonth: String(monthlyDay),
                        dayOfWeek: "*",
                      })
                    }
                    className={selectClasses}
                    aria-label="Hour"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span className="text-slate-400">:</span>
                  <select
                    value={monthlyMinute}
                    disabled={disabled}
                    onChange={(e) =>
                      updateCron({
                        minute: e.target.value,
                        hour: String(monthlyHour),
                        dayOfMonth: String(monthlyDay),
                        dayOfWeek: "*",
                      })
                    }
                    className={selectClasses}
                    aria-label="Minute"
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-slate-600">
                    {t("cron.onDay", "on day")}
                  </span>
                  <select
                    value={monthlyDay}
                    disabled={disabled}
                    onChange={(e) =>
                      updateCron({
                        minute: String(monthlyMinute),
                        hour: String(monthlyHour),
                        dayOfMonth: e.target.value,
                        dayOfWeek: "*",
                      })
                    }
                    className={selectClasses}
                    aria-label="Day of month"
                  >
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-slate-600">
                    {t("cron.ofMonth", "of the month")}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={cronValue}
              disabled={disabled}
              onChange={(e) => setCronValue(e.target.value)}
              className={cn(s.inputBase, s.inputFocus, s.inputDisabled, "font-mono")}
              aria-label="Cron expression"
              placeholder="* * * * *"
            />
          </div>
        )}

        {/* Human readable description */}
        <p className="text-sm text-slate-600">{description}</p>

        {/* Next runs */}
        {nextRuns.length > 0 && (
          <div className="text-xs text-slate-500">
            <span className="font-medium">
              {t("cron.nextRuns", "Next runs")}:
            </span>
            {nextRuns.map((date, i) => (
              <div key={i} className="ml-2 mt-0.5">
                {formatDate(date)}
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-xs text-red-600 font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
CronInput.displayName = "CronInput";

export { CronInput, describeCron, parseCron, buildCron, getNextRuns };
export type { CronInputProps, CronParts };
