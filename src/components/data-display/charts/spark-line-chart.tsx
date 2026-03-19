"use client";

import { forwardRef, useMemo, useId, type HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";
import type { ChartColor, CurveType } from "./chart-types";
import { resolveColor } from "./chart-colors";
import { getPathForCurve, prefersReducedMotion } from "./chart-utils";

type SparkLineChartProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  /** Array of numeric values to plot */
  data: number[];
  /** Color for the line */
  color?: ChartColor;
  /** Chart height in pixels */
  height?: number;
  /** Chart width (number for px, string for CSS value like "100%") */
  width?: number | string;
  /** Curve interpolation type */
  curveType?: CurveType;
  /** Line stroke width (in viewBox units) */
  strokeWidth?: number;
  /** Animate the line on mount */
  animate?: boolean;
  /** Accessible label */
  ariaLabel?: string;
  /** Additional CSS classes */
  className?: string;
};

const SPARK_PADDING = 2;

const SparkLineChart = forwardRef<HTMLDivElement, SparkLineChartProps>(
  (
    {
      data,
      color = "primary",
      height = 32,
      width = "100%",
      curveType = "linear",
      strokeWidth = 1.5,
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

    // Compute viewBox dimensions from data
    const viewBoxWidth = useMemo(() => {
      if (data.length <= 1) return 100;
      return Math.max(100, (data.length - 1) * 8 + SPARK_PADDING * 2);
    }, [data.length]);

    const viewBoxHeight = height;

    // Build points
    const { path } = useMemo(() => {
      if (data.length === 0) return { path: "" };
      const minVal = Math.min(...data);
      const maxVal = Math.max(...data);
      const range = maxVal - minVal || 1;
      const usableHeight = viewBoxHeight - SPARK_PADDING * 2 - strokeWidth;
      const usableWidth = viewBoxWidth - SPARK_PADDING * 2;

      const points = data.map((val, i) => ({
        x: SPARK_PADDING + (data.length > 1 ? (i / (data.length - 1)) * usableWidth : usableWidth / 2),
        y: SPARK_PADDING + strokeWidth / 2 + usableHeight - ((val - minVal) / range) * usableHeight,
      }));

      return { path: getPathForCurve(curveType, points) };
    }, [data, viewBoxWidth, viewBoxHeight, curveType, strokeWidth]);

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
            aria-label={ariaLabel || "Empty sparkline"}
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

    // Approximate path length for animation
    const pathLength = viewBoxWidth * 1.5;

    return (
      <div
        ref={ref}
        className={cn("inline-flex", className)}
        style={{ height, width, ...style }}
        {...props}
      >
        <svg
          role="img"
          aria-label={ariaLabel || `Sparkline chart with ${data.length} values`}
          width="100%"
          height="100%"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          preserveAspectRatio="none"
        >
          {shouldAnimate && (
            <style>{`
              @keyframes spark-line-draw-${uid} {
                from { stroke-dashoffset: ${pathLength}; }
                to { stroke-dashoffset: 0; }
              }
            `}</style>
          )}
          <path
            d={path}
            fill="none"
            stroke={resolvedColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={
              shouldAnimate
                ? {
                    strokeDasharray: pathLength,
                    strokeDashoffset: 0,
                    animation: `spark-line-draw-${uid} 0.8s ease-out`,
                  }
                : undefined
            }
          />
        </svg>
      </div>
    );
  }
);
SparkLineChart.displayName = "SparkLineChart";

export { SparkLineChart };
export type { SparkLineChartProps };
