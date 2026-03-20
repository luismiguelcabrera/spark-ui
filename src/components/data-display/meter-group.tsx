import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

// ── Types ───────────────────────────────────────────────────────────────

type MeterGroupItem = {
  label: string;
  value: number;
  color?: string;
};

type MeterGroupSize = "sm" | "md" | "lg";

type MeterGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Array of items to display as segments */
  items: MeterGroupItem[];
  /** Maximum value (total), default 100 */
  max?: number;
  /** Show item labels below the bar */
  showLabels?: boolean;
  /** Show item values/percentages below the bar */
  showValues?: boolean;
  /** Height of the progress bar */
  size?: MeterGroupSize;
};

// ── Size map ────────────────────────────────────────────────────────────

const sizeMap: Record<MeterGroupSize, string> = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

// ── Component ───────────────────────────────────────────────────────────

const MeterGroup = forwardRef<HTMLDivElement, MeterGroupProps>(
  (
    {
      items,
      max = 100,
      showLabels = true,
      showValues = true,
      size = "md",
      className,
      ...props
    },
    ref,
  ) => {
    const clampedMax = Math.max(max, 0) || 100;
    const total = items.reduce((sum, item) => sum + Math.max(0, item.value), 0);
    const clampedTotal = Math.min(total, clampedMax);

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {/* Stacked bar */}
        <div
          role="meter"
          aria-valuenow={clampedTotal}
          aria-valuemin={0}
          aria-valuemax={clampedMax}
          aria-label="Meter group"
          className={cn(
            "flex w-full overflow-hidden rounded-full bg-muted",
            sizeMap[size],
          )}
        >
          {items.map((item, index) => {
            const pct = (Math.max(0, item.value) / clampedMax) * 100;
            return (
              <div
                key={index}
                className={cn(
                  "transition-all duration-500 motion-reduce:transition-none",
                  item.color || "bg-primary",
                  index === 0 && "rounded-l-full",
                  index === items.length - 1 && "rounded-r-full",
                )}
                style={{ width: `${Math.min(pct, 100)}%` }}
                title={`${item.label}: ${item.value}`}
              />
            );
          })}
        </div>

        {/* Labels */}
        {(showLabels || showValues) && items.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5 text-sm">
                <span
                  className={cn(
                    "inline-block h-2.5 w-2.5 rounded-full",
                    item.color || "bg-primary",
                  )}
                  aria-hidden="true"
                />
                {showLabels && (
                  <span className="text-muted-foreground">{item.label}</span>
                )}
                {showValues && (
                  <span className="font-medium text-navy-text">
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);
MeterGroup.displayName = "MeterGroup";

export { MeterGroup };
export type { MeterGroupProps, MeterGroupItem, MeterGroupSize };
