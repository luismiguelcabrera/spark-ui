"use client";

import { forwardRef, useState, useEffect, useCallback, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type CountdownProps = HTMLAttributes<HTMLDivElement> & {
  /** Target date/time to count down to */
  targetDate: Date | string | number;
  /** Callback when countdown reaches zero */
  onComplete?: () => void;
  /** Whether to show days */
  showDays?: boolean;
  /** Whether to show hours */
  showHours?: boolean;
  /** Whether to show minutes */
  showMinutes?: boolean;
  /** Whether to show seconds */
  showSeconds?: boolean;
  /** Visual variant */
  variant?: "default" | "cards" | "minimal" | "compact";
  /** Size */
  size?: "sm" | "md" | "lg";
  /** Separator between units */
  separator?: string;
  /** Labels for units */
  labels?: { days?: string; hours?: string; minutes?: string; seconds?: string };
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
};

function calcTimeLeft(target: Date): TimeLeft {
  const total = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

const sizeMap = {
  sm: { value: "text-lg font-bold", label: "text-[10px]", card: "w-12 h-12" },
  md: { value: "text-2xl font-bold", label: "text-xs", card: "w-16 h-16" },
  lg: { value: "text-4xl font-bold", label: "text-sm", card: "w-20 h-20" },
};

const Countdown = forwardRef<HTMLDivElement, CountdownProps>(
  (
    {
      className,
      targetDate,
      onComplete,
      showDays = true,
      showHours = true,
      showMinutes = true,
      showSeconds = true,
      variant = "default",
      size = "md",
      separator = ":",
      labels = {},
      ...props
    },
    ref
  ) => {
    const target = new Date(targetDate);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(target));
    const completedRef = useCallback(
      (t: TimeLeft) => {
        if (t.total <= 0) onComplete?.();
      },
      [onComplete]
    );

    useEffect(() => {
      const timer = setInterval(() => {
        const t = calcTimeLeft(target);
        setTimeLeft(t);
        if (t.total <= 0) {
          clearInterval(timer);
          completedRef(t);
        }
      }, 1000);
      return () => clearInterval(timer);
    }, [target.getTime(), completedRef]);

    const sizes = sizeMap[size];
    const defaultLabels = {
      days: labels.days ?? "Days",
      hours: labels.hours ?? "Hours",
      minutes: labels.minutes ?? "Min",
      seconds: labels.seconds ?? "Sec",
    };

    const units: { value: number; label: string; show: boolean }[] = [
      { value: timeLeft.days, label: defaultLabels.days, show: showDays },
      { value: timeLeft.hours, label: defaultLabels.hours, show: showHours },
      { value: timeLeft.minutes, label: defaultLabels.minutes, show: showMinutes },
      { value: timeLeft.seconds, label: defaultLabels.seconds, show: showSeconds },
    ].filter((u) => u.show);

    if (variant === "compact") {
      const parts: string[] = [];
      if (showDays && timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
      if (showHours) parts.push(`${pad(timeLeft.hours)}h`);
      if (showMinutes) parts.push(`${pad(timeLeft.minutes)}m`);
      if (showSeconds) parts.push(`${pad(timeLeft.seconds)}s`);
      return (
        <span ref={ref} className={cn(sizes.value, "tabular-nums text-secondary", className)} {...props}>
          {parts.join(" ")}
        </span>
      );
    }

    if (variant === "minimal") {
      return (
        <div ref={ref} className={cn("flex items-baseline gap-1 tabular-nums", className)} {...props}>
          {units.map((unit, i) => (
            <span key={unit.label}>
              <span className={cn(sizes.value, "text-secondary")}>{pad(unit.value)}</span>
              {i < units.length - 1 && (
                <span className={cn(sizes.value, "text-slate-300 mx-0.5")}>{separator}</span>
              )}
            </span>
          ))}
        </div>
      );
    }

    if (variant === "cards") {
      return (
        <div ref={ref} className={cn("flex items-center gap-3", className)} {...props}>
          {units.map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl bg-slate-50 border border-slate-200",
                  sizes.card
                )}
              >
                <span className={cn(sizes.value, "text-secondary tabular-nums leading-none")}>
                  {pad(unit.value)}
                </span>
                <span className={cn(sizes.label, "text-slate-400 mt-0.5")}>{unit.label}</span>
              </div>
              {i < units.length - 1 && (
                <span className={cn(sizes.value, "text-slate-300")}>{separator}</span>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Default variant
    return (
      <div ref={ref} className={cn("flex items-center gap-4", className)} {...props}>
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className={cn(sizes.value, "text-secondary tabular-nums")}>{pad(unit.value)}</span>
              <span className={cn(sizes.label, "text-slate-400 uppercase tracking-wider")}>{unit.label}</span>
            </div>
            {i < units.length - 1 && (
              <span className={cn(sizes.value, "text-slate-200 -mt-4")}>{separator}</span>
            )}
          </div>
        ))}
      </div>
    );
  }
);
Countdown.displayName = "Countdown";

export { Countdown };
export type { CountdownProps };
