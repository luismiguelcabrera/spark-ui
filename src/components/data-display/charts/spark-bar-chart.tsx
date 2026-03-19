"use client";

import { forwardRef, useMemo, useId, type HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";
import type { ChartColor } from "./chart-types";
import { resolveColor } from "./chart-colors";
import { prefersReducedMotion } from "./chart-utils";

type SparkBarChartProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  /** Array of numeric values to plot */
  data: number[];
  /** Color for the bars */
  color?: ChartColor;
  /** Chart height in pixels */
  height?: number;
  /** Chart width (number for px, string for CSS value like "100%") */
  width?: number | string;
  /** Gap between bars in viewBox units */
  barGap?: number;
  /** Animate the bars on mount */
  animate?: boolean;
  /** Accessible label */
  ariaLabel?: string;
  /** Additional CSS classes */
  className?: string;
};

const SPARK_PADDING = 1;

const SparkBarChart = forwardRef<HTMLDivElement, SparkBarChartProps>(
  (
    {
      data,
      color = "primary",
      height = 32,
      width = "100%",
      barGap = 1,
      animate = true,
      ariaLabel,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const uid = useId().replace(/:/g, "");
    const resolvedColor = resolveColor(color);
    const shouldAnimate = animate && !prefersReducedMotion();

    // Compute viewBox
    const viewBoxWidth = useMemo(() => {
      if (data.length === 0) return 100;
      return Math.max(100, data.length * 6 + SPARK_PADDING * 2);
    }, [data.length]);

    const viewBoxHeight = height;

    // Build bars
    const bars = useMemo(() => {
      if (data.length === 0) return [];
      const minVal = Math.min(...data, 0); // include 0 as baseline
      const maxVal = Math.max(...data);
      const range = maxVal - minVal || 1;
      const usableHeight = viewBoxHeight - SPARK_PADDING * 2;
      const usableWidth = viewBoxWidth - SPARK_PADDING * 2;
      const totalGap = (data.length - 1) * barGap;
      const barWidth = Math.max(1, (usableWidth - totalGap) / data.length);

      return data.map((val, i) => {
        const normalizedHeight = ((val - minVal) / range) * usableHeight;
        const barH = Math.max(0.5, normalizedHeight); // minimum bar height for visibility
        const x = SPARK_PADDING + i * (barWidth + barGap);
        const y = SPARK_PADDING + usableHeight - barH;
        return { x, y, width: barWidth, height: barH, index: i };
      });
    }, [data, viewBoxWidth, viewBoxHeight, barGap]);

    if (!data || data.length === 0) {
      return (
        <div
          ref={ref}
          className={cn("inline-flex items-center justify-center text-gray-400", className)}
          style={{ height, width, ...style }}
          {...props}
        >
          <svg
            role="img"
            aria-label={ariaLabel || "Empty spark bar chart"}
            width="100%"
            height={height}
            viewBox={`0 0 100 ${height}`}
            preserveAspectRatio="none"
          >
            <text x="50" y={height / 2 + 3} textAnchor="middle" fill="currentColor" fontSize="10">
              No data available
            </text>
          </svg>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("inline-flex", className)}
        style={{ height, width, ...style }}
        {...props}
      >
        <svg
          role="img"
          aria-label={ariaLabel || `Spark bar chart with ${data.length} values`}
          width="100%"
          height="100%"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          preserveAspectRatio="none"
        >
          {shouldAnimate && (
            <style>{`
              @keyframes spark-bar-grow-${uid} {
                from { transform: scaleY(0); }
                to { transform: scaleY(1); }
              }
            `}</style>
          )}
          {bars.map((bar) => (
            <rect
              key={`spark-bar-${bar.index}`}
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              fill={resolvedColor}
              rx={0.5}
              style={
                shouldAnimate
                  ? {
                      transformOrigin: `${bar.x + bar.width / 2}px ${viewBoxHeight}px`,
                      animation: `spark-bar-grow-${uid} 0.5s ease-out ${bar.index * 0.02}s both`,
                    }
                  : undefined
              }
            />
          ))}
        </svg>
      </div>
    );
  }
);
SparkBarChart.displayName = "SparkBarChart";

export { SparkBarChart };
export type { SparkBarChartProps };
