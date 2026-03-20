import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

// ── Types ───────────────────────────────────────────────────────────────

type StatisticTrend = {
  value: number;
  /** When true, positive values show green (good), negative show red (bad). Default true. */
  isUpGood?: boolean;
};

type StatisticProps = Omit<HTMLAttributes<HTMLDivElement>, "title" | "prefix"> & {
  /** Label above the value */
  title: string;
  /** The statistic value */
  value: number | string;
  /** Element rendered before the value (e.g., currency symbol) */
  prefix?: ReactNode;
  /** Element rendered after the value (e.g., unit) */
  suffix?: ReactNode;
  /** Number of decimal places for numeric values */
  precision?: number;
  /** Trend indicator with arrow and color */
  trend?: StatisticTrend;
  /** Show a loading skeleton */
  loading?: boolean;
};

// ── Helpers ─────────────────────────────────────────────────────────────

function formatValue(value: number | string, precision?: number): string {
  if (typeof value === "string") return value;

  const formatted =
    precision !== undefined ? value.toFixed(precision) : String(value);

  // Add thousand separators
  const [intPart, decPart] = formatted.split(".");
  const withSeparators = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart !== undefined
    ? `${withSeparators}.${decPart}`
    : withSeparators;
}

// ── Component ───────────────────────────────────────────────────────────

const Statistic = forwardRef<HTMLDivElement, StatisticProps>(
  (
    {
      title,
      value,
      prefix,
      suffix,
      precision,
      trend,
      loading = false,
      className,
      ...props
    },
    ref,
  ) => {
    const formattedValue = formatValue(value, precision);

    // Trend color logic
    const trendIsPositive = trend && trend.value > 0;
    const trendIsNegative = trend && trend.value < 0;
    const isUpGood = trend?.isUpGood !== false; // default true

    let trendColorClass = "text-muted-foreground";
    if (trend && trend.value !== 0) {
      const isGood = isUpGood ? trendIsPositive : trendIsNegative;
      trendColorClass = isGood ? "text-success" : "text-destructive";
    }

    const trendArrow = trendIsPositive ? "\u2191" : trendIsNegative ? "\u2193" : "";

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn("animate-pulse motion-reduce:animate-none", className)}
          aria-busy="true"
          {...props}
        >
          <div className="mb-1 h-4 w-20 rounded bg-muted" />
          <div className="h-8 w-32 rounded bg-muted" />
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("space-y-1", className)} {...props}>
        {/* Title */}
        <p className="text-sm font-medium text-muted-foreground">{title}</p>

        {/* Value row */}
        <div className="flex items-baseline gap-1">
          {prefix && (
            <span className="text-lg text-muted-foreground">{prefix}</span>
          )}
          <span className="text-3xl font-bold tracking-tight text-navy-text">
            {formattedValue}
          </span>
          {suffix && (
            <span className="text-lg text-muted-foreground">{suffix}</span>
          )}
        </div>

        {/* Trend */}
        {trend && (
          <p
            className={cn("flex items-center gap-1 text-sm font-medium", trendColorClass)}
            aria-label={`Trend: ${trend.value > 0 ? "+" : ""}${trend.value}%`}
          >
            {trendArrow && (
              <span aria-hidden="true">{trendArrow}</span>
            )}
            <span>
              {Math.abs(trend.value)}%
            </span>
          </p>
        )}
      </div>
    );
  },
);
Statistic.displayName = "Statistic";

export { Statistic };
export type { StatisticProps, StatisticTrend };
