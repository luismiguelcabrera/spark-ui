"use client";

import { forwardRef, useState, type HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";

const DEFAULT_SERIES_COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

type AreaChartDataPoint = {
  label: string;
  value: number;
};

type AreaChartSeries = {
  data: AreaChartDataPoint[];
  color?: string;
  name?: string;
};

type AreaChartProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  /** Single series data (used when `series` is not provided) */
  data?: AreaChartDataPoint[];
  /** Multiple series */
  series?: AreaChartSeries[];
  /** Chart height in pixels */
  height?: number;
  /** Show grid lines */
  showGrid?: boolean;
  /** Stack multiple series on top of each other */
  stacked?: boolean;
  /** Use gradient fill instead of solid */
  gradient?: boolean;
  /** Default area color (CSS color string) */
  color?: string;
  /** Additional CSS classes */
  className?: string;
};

const PADDING = { top: 20, right: 20, bottom: 40, left: 50 };

const AreaChart = forwardRef<HTMLDivElement, AreaChartProps>(
  (
    {
      data,
      series,
      height = 300,
      showGrid = true,
      stacked = false,
      gradient = true,
      color = "#6366f1",
      className,
      ...props
    },
    ref
  ) => {
    const [hoveredPoint, setHoveredPoint] = useState<{
      seriesIndex: number;
      pointIndex: number;
    } | null>(null);

    // Normalize to multi-series format
    const allSeries: AreaChartSeries[] = series
      ? series
      : data
        ? [{ data, color, name: "Series 1" }]
        : [];

    if (allSeries.length === 0 || allSeries.every((s) => s.data.length === 0)) {
      return (
        <div
          ref={ref}
          className={cn("w-full flex items-center justify-center text-gray-500", className)}
          style={{ height }}
          {...props}
        >
          <svg
            role="img"
            aria-label="Empty area chart"
            width="100%"
            height={height}
            viewBox={`0 0 500 ${height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <text x="250" y={height / 2} textAnchor="middle" fill="currentColor" fontSize="14">
              No data available
            </text>
          </svg>
        </div>
      );
    }

    // Use labels from the first series (or longest)
    const primarySeries = allSeries.reduce((a, b) =>
      a.data.length >= b.data.length ? a : b
    );
    const labels = primarySeries.data.map((d) => d.label);
    const numPoints = labels.length;

    // Calculate stacked values if needed
    const stackedValues: number[][] = [];
    if (stacked && allSeries.length > 1) {
      for (let si = 0; si < allSeries.length; si++) {
        stackedValues[si] = [];
        for (let pi = 0; pi < numPoints; pi++) {
          const prevVal = si > 0 ? stackedValues[si - 1][pi] : 0;
          const curVal = allSeries[si].data[pi]?.value ?? 0;
          stackedValues[si][pi] = prevVal + curVal;
        }
      }
    }

    // Compute max value
    let maxValue: number;
    if (stacked && stackedValues.length > 0) {
      maxValue = Math.max(...stackedValues[stackedValues.length - 1], 1);
    } else {
      maxValue = Math.max(
        ...allSeries.flatMap((s) => s.data.map((d) => d.value)),
        1
      );
    }
    const niceMax = getNiceMax(maxValue);
    const gridLines = getGridLines(niceMax);

    const chartWidth = 500 - PADDING.left - PADDING.right;
    const chartHeight = height - PADDING.top - PADDING.bottom;
    const baseline = PADDING.top + chartHeight;

    // Compute points for each series
    const seriesPoints = allSeries.map((s, si) =>
      Array.from({ length: numPoints }, (_, pi) => {
        const x = PADDING.left + (pi / Math.max(numPoints - 1, 1)) * chartWidth;
        const val =
          stacked && stackedValues.length > 0
            ? stackedValues[si][pi]
            : (s.data[pi]?.value ?? 0);
        const y = PADDING.top + chartHeight - (val / niceMax) * chartHeight;
        return { x, y, value: s.data[pi]?.value ?? 0 };
      })
    );

    // For stacked area, the bottom of each area is the top of the previous series
    const getAreaPath = (si: number): string => {
      const pts = seriesPoints[si];
      if (pts.length === 0) return "";

      let path = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        path += ` L ${pts[i].x} ${pts[i].y}`;
      }

      if (stacked && si > 0) {
        // Close down to the previous series line
        const prevPts = seriesPoints[si - 1];
        for (let i = prevPts.length - 1; i >= 0; i--) {
          path += ` L ${prevPts[i].x} ${prevPts[i].y}`;
        }
      } else {
        // Close to baseline
        path += ` L ${pts[pts.length - 1].x} ${baseline} L ${pts[0].x} ${baseline}`;
      }
      path += " Z";
      return path;
    };

    const getLinePath = (si: number): string => {
      const pts = seriesPoints[si];
      if (pts.length === 0) return "";
      return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <svg
          role="img"
          aria-label="Area chart"
          width="100%"
          height={height}
          viewBox={`0 0 500 ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {allSeries.map((s, si) => {
              const c = s.color || DEFAULT_SERIES_COLORS[si % DEFAULT_SERIES_COLORS.length];
              return (
                <linearGradient
                  key={`grad-${si}`}
                  id={`area-gradient-${si}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={c} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={c} stopOpacity="0.02" />
                </linearGradient>
              );
            })}
          </defs>

          {/* Grid */}
          {showGrid &&
            gridLines.map((val, i) => {
              const y = PADDING.top + chartHeight - (val / niceMax) * chartHeight;
              return (
                <g key={`grid-${i}`}>
                  <line
                    x1={PADDING.left}
                    y1={y}
                    x2={500 - PADDING.right}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={PADDING.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fill="#9ca3af"
                    fontSize="11"
                  >
                    {formatValue(val)}
                  </text>
                </g>
              );
            })}

          {/* Axes */}
          <line
            x1={PADDING.left}
            y1={PADDING.top}
            x2={PADDING.left}
            y2={baseline}
            stroke="#d1d5db"
          />
          <line
            x1={PADDING.left}
            y1={baseline}
            x2={500 - PADDING.right}
            y2={baseline}
            stroke="#d1d5db"
          />

          {/* X-axis labels */}
          {Array.from({ length: numPoints }, (_, pi) => {
            const x = PADDING.left + (pi / Math.max(numPoints - 1, 1)) * chartWidth;
            const lbl = labels[pi];
            return (
              <text
                key={`xlabel-${pi}`}
                x={x}
                y={baseline + 16}
                textAnchor="middle"
                fill="#6b7280"
                fontSize="11"
              >
                {lbl.length > 8 ? `${lbl.slice(0, 7)}...` : lbl}
              </text>
            );
          })}

          {/* Areas (render bottom-up for stacked so earlier series are on top visually) */}
          {(stacked ? [...allSeries.keys()].reverse() : [...allSeries.keys()]).map((si) => {
            const c =
              allSeries[si].color ||
              DEFAULT_SERIES_COLORS[si % DEFAULT_SERIES_COLORS.length];
            return (
              <path
                key={`area-${si}`}
                d={getAreaPath(si)}
                fill={gradient ? `url(#area-gradient-${si})` : c}
                opacity={gradient ? 1 : 0.25}
                data-testid={`area-fill-${si}`}
              />
            );
          })}

          {/* Lines */}
          {allSeries.map((s, si) => {
            const c =
              s.color || DEFAULT_SERIES_COLORS[si % DEFAULT_SERIES_COLORS.length];
            return (
              <path
                key={`line-${si}`}
                d={getLinePath(si)}
                fill="none"
                stroke={c}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                data-testid={`area-line-${si}`}
              />
            );
          })}

          {/* Data points and hover interaction */}
          {allSeries.map((s, si) => {
            const pts = seriesPoints[si];
            const c =
              s.color || DEFAULT_SERIES_COLORS[si % DEFAULT_SERIES_COLORS.length];
            return pts.map((p, pi) => {
              const isHovered =
                hoveredPoint?.seriesIndex === si && hoveredPoint?.pointIndex === pi;
              return (
                <g key={`dot-${si}-${pi}`}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={12}
                    fill="transparent"
                    onMouseEnter={() =>
                      setHoveredPoint({ seriesIndex: si, pointIndex: pi })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <circle
                    data-testid={`area-dot-${si}-${pi}`}
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 5 : 3}
                    fill={isHovered ? c : "#fff"}
                    stroke={c}
                    strokeWidth={2}
                    style={{ transition: "r 0.15s ease" }}
                  />
                  {isHovered && (
                    <g>
                      <rect
                        x={p.x - 30}
                        y={p.y - 32}
                        width={60}
                        height={22}
                        rx={4}
                        fill="#1f2937"
                      />
                      <text
                        x={p.x}
                        y={p.y - 17}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="11"
                        fontWeight="500"
                      >
                        {formatValue(p.value)}
                      </text>
                    </g>
                  )}
                </g>
              );
            });
          })}
        </svg>
      </div>
    );
  }
);
AreaChart.displayName = "AreaChart";

function getNiceMax(max: number): number {
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
  const normalized = max / magnitude;
  if (normalized <= 1) return magnitude;
  if (normalized <= 2) return 2 * magnitude;
  if (normalized <= 5) return 5 * magnitude;
  return 10 * magnitude;
}

function getGridLines(max: number, count = 5): number[] {
  const step = max / count;
  return Array.from({ length: count + 1 }, (_, i) => i * step);
}

function formatValue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(Math.round(value));
}

export { AreaChart };
export type { AreaChartProps, AreaChartDataPoint, AreaChartSeries };
