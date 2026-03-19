"use client";

import { forwardRef, useMemo, useId, type HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";
import type { ChartColor, CurveType } from "./chart-types";
import { resolveColor } from "./chart-colors";
import { getPathForCurve, getAreaPathForCurve, prefersReducedMotion } from "./chart-utils";

type SparkAreaChartProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  /** Array of numeric values to plot */
  data: number[];
  /** Color for the line and fill */
  color?: ChartColor;
  /** Chart height in pixels */
  height?: number;
  /** Chart width (number for px, string for CSS value like "100%") */
  width?: number | string;
  /** Area fill mode */
  fill?: "gradient" | "solid" | "none";
  /** Curve interpolation type */
  curveType?: CurveType;
  /** Line stroke width (in viewBox units) */
  strokeWidth?: number;
  /** Animate on mount */
  animate?: boolean;
  /** Accessible label */
  ariaLabel?: string;
  /** Additional CSS classes */
  className?: string;
};

const SPARK_PADDING = 2;

const SparkAreaChart = forwardRef<HTMLDivElement, SparkAreaChartProps>(
  (
    {
      data,
      color = "primary",
      height = 32,
      width = "100%",
      fill = "gradient",
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
    const gradientId = `spark-area-grad-${uid}`;

    // Compute viewBox dimensions
    const viewBoxWidth = useMemo(() => {
      if (data.length <= 1) return 100;
      return Math.max(100, (data.length - 1) * 8 + SPARK_PADDING * 2);
    }, [data.length]);

    const viewBoxHeight = height;

    // Build paths
    const { linePath, areaPath, points } = useMemo(() => {
      if (data.length === 0) return { linePath: "", areaPath: "", points: [] };
      const minVal = Math.min(...data);
      const maxVal = Math.max(...data);
      const range = maxVal - minVal || 1;
      const usableHeight = viewBoxHeight - SPARK_PADDING * 2 - strokeWidth;
      const usableWidth = viewBoxWidth - SPARK_PADDING * 2;
      const baseline = viewBoxHeight - SPARK_PADDING;

      const pts = data.map((val, i) => ({
        x: SPARK_PADDING + (data.length > 1 ? (i / (data.length - 1)) * usableWidth : usableWidth / 2),
        y: SPARK_PADDING + strokeWidth / 2 + usableHeight - ((val - minVal) / range) * usableHeight,
      }));

      return {
        linePath: getPathForCurve(curveType, pts),
        areaPath: getAreaPathForCurve(curveType, pts, baseline),
        points: pts,
      };
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
            aria-label={ariaLabel || "Empty spark area chart"}
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

    // Approximate path length for line animation
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
          aria-label={ariaLabel || `Spark area chart with ${data.length} values`}
          width="100%"
          height="100%"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          preserveAspectRatio="none"
        >
          {/* Gradient definition */}
          {fill === "gradient" && (
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={resolvedColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor={resolvedColor} stopOpacity="0.02" />
              </linearGradient>
            </defs>
          )}

          {shouldAnimate && (
            <style>{`
              @keyframes spark-area-draw-${uid} {
                from { stroke-dashoffset: ${pathLength}; }
                to { stroke-dashoffset: 0; }
              }
              @keyframes spark-area-fill-${uid} {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `}</style>
          )}

          {/* Area fill */}
          {fill !== "none" && areaPath && (
            <path
              d={areaPath}
              fill={fill === "gradient" ? `url(#${gradientId})` : resolvedColor}
              opacity={fill === "solid" ? 0.2 : 1}
              style={
                shouldAnimate
                  ? {
                      animation: `spark-area-fill-${uid} 0.6s ease-out 0.2s both`,
                    }
                  : undefined
              }
            />
          )}

          {/* Line stroke */}
          <path
            d={linePath}
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
                    animation: `spark-area-draw-${uid} 0.8s ease-out`,
                  }
                : undefined
            }
          />
        </svg>
      </div>
    );
  }
);
SparkAreaChart.displayName = "SparkAreaChart";

export { SparkAreaChart };
export type { SparkAreaChartProps };
