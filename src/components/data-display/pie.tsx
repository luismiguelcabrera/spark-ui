import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type PieSegment = {
  /** Numeric value for this segment */
  value: number;
  /** CSS color string */
  color: string;
  /** Optional label for accessibility */
  label?: string;
};

type PieProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Data segments for the pie chart */
  data: PieSegment[];
  /** Overall size in pixels (width & height) */
  size?: number;
  /** Render as donut chart */
  donut?: boolean;
  /** Stroke width for donut mode (default 40) */
  strokeWidth?: number;
  /** Content rendered in the center of a donut chart */
  children?: ReactNode;
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

const Pie = forwardRef<HTMLDivElement, PieProps>(
  (
    {
      className,
      data,
      size = 200,
      donut = false,
      strokeWidth = 40,
      children,
      ...props
    },
    ref,
  ) => {
    const total = data.reduce((sum, d) => sum + d, 0);
    const totalValue = data.reduce((sum, d) => sum + d.value, 0);
    const radius = size / 2;
    const center = size / 2;
    const effectiveStrokeWidth = donut ? strokeWidth : radius;
    const circleRadius = donut ? radius - strokeWidth / 2 : radius / 2;
    const circumference = 2 * Math.PI * circleRadius;

    // Build accessible label
    const ariaLabel =
      "Pie chart: " +
      data
        .map((d) => {
          const pct = totalValue > 0 ? ((d.value / totalValue) * 100).toFixed(1) : "0.0";
          return `${d.label ?? d.color} ${pct}%`;
        })
        .join(", ");

    let cumulativePercent = 0;

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={ariaLabel}
        >
          {totalValue > 0 &&
            data.map((segment, i) => {
              const percent = segment.value / totalValue;
              const dashLength = circumference * percent;
              const dashOffset = circumference * (1 - cumulativePercent);
              // Rotate -90deg so first segment starts at top
              const rotation = -90;

              cumulativePercent += percent;

              return (
                <circle
                  key={i}
                  cx={center}
                  cy={center}
                  r={circleRadius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={effectiveStrokeWidth}
                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                  strokeDashoffset={dashOffset}
                  transform={`rotate(${rotation} ${center} ${center})`}
                />
              );
            })}
          {/* Empty state: show a gray ring */}
          {totalValue === 0 && (
            <circle
              cx={center}
              cy={center}
              r={circleRadius}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={effectiveStrokeWidth}
            />
          )}
        </svg>

        {/* Donut center content */}
        {donut && children && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            {children}
          </div>
        )}
      </div>
    );
  },
);
Pie.displayName = "Pie";

export { Pie };
export type { PieProps, PieSegment };
