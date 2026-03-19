"use client";

import { forwardRef, useState, type HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";

const DEFAULT_COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

type ScatterPoint = {
  x: number;
  y: number;
  label?: string;
  size?: number;
  color?: string;
};

type ScatterChartSeries = {
  data: ScatterPoint[];
  color?: string;
  name?: string;
};

type ScatterChartProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  /** Single-series data */
  data?: ScatterPoint[];
  /** Multi-series data */
  series?: ScatterChartSeries[];
  /** Chart width in pixels */
  width?: number;
  /** Chart height in pixels */
  height?: number;
  /** Show grid lines */
  showGrid?: boolean;
  /** Show axis labels */
  showLabels?: boolean;
  /** X-axis label */
  xLabel?: string;
  /** Y-axis label */
  yLabel?: string;
  /** Default dot size in pixels */
  dotSize?: number;
  /** Additional CSS classes */
  className?: string;
};

const PADDING = { top: 20, right: 20, bottom: 50, left: 60 };

const ScatterChart = forwardRef<HTMLDivElement, ScatterChartProps>(
  (
    {
      data,
      series,
      width = 500,
      height = 300,
      showGrid = true,
      showLabels = true,
      xLabel,
      yLabel,
      dotSize = 6,
      className,
      ...props
    },
    ref
  ) => {
    const [hoveredPoint, setHoveredPoint] = useState<{
      seriesIndex: number;
      pointIndex: number;
    } | null>(null);

    // Normalize into multi-series
    const allSeries: ScatterChartSeries[] = series
      ? series
      : data && data.length > 0
        ? [{ data, color: DEFAULT_COLORS[0], name: "default" }]
        : [];

    // Collect all points
    const allPoints = allSeries.flatMap((s) => s.data);

    if (allPoints.length === 0) {
      return (
        <div
          ref={ref}
          className={cn("w-full flex items-center justify-center text-gray-500", className)}
          style={{ height }}
          {...props}
        >
          <svg
            role="img"
            aria-label="Empty scatter chart"
            width="100%"
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <text x={width / 2} y={height / 2} textAnchor="middle" fill="currentColor" fontSize="14">
              No data available
            </text>
          </svg>
        </div>
      );
    }

    const xValues = allPoints.map((p) => p.x);
    const yValues = allPoints.map((p) => p.y);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    // Add 10% padding to ranges
    const xRange = xMax - xMin || 1;
    const yRange = yMax - yMin || 1;
    const xPadding = xRange * 0.1;
    const yPadding = yRange * 0.1;
    const xMinP = xMin - xPadding;
    const xMaxP = xMax + xPadding;
    const yMinP = yMin - yPadding;
    const yMaxP = yMax + yPadding;

    const chartWidth = width - PADDING.left - PADDING.right;
    const chartHeight = height - PADDING.top - PADDING.bottom;

    function scaleX(val: number): number {
      return PADDING.left + ((val - xMinP) / (xMaxP - xMinP)) * chartWidth;
    }

    function scaleY(val: number): number {
      return PADDING.top + chartHeight - ((val - yMinP) / (yMaxP - yMinP)) * chartHeight;
    }

    // Grid lines (5 levels each axis)
    const gridCount = 5;
    const xGridValues = Array.from(
      { length: gridCount + 1 },
      (_, i) => xMinP + (i / gridCount) * (xMaxP - xMinP)
    );
    const yGridValues = Array.from(
      { length: gridCount + 1 },
      (_, i) => yMinP + (i / gridCount) * (yMaxP - yMinP)
    );

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <svg
          role="img"
          aria-label="Scatter chart"
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {showGrid && (
            <g>
              {/* Horizontal grid lines */}
              {yGridValues.map((val, i) => {
                const y = scaleY(val);
                return (
                  <line
                    key={`h-grid-${i}`}
                    x1={PADDING.left}
                    y1={y}
                    x2={width - PADDING.right}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeDasharray="4,4"
                  />
                );
              })}
              {/* Vertical grid lines */}
              {xGridValues.map((val, i) => {
                const x = scaleX(val);
                return (
                  <line
                    key={`v-grid-${i}`}
                    x1={x}
                    y1={PADDING.top}
                    x2={x}
                    y2={PADDING.top + chartHeight}
                    stroke="#e5e7eb"
                    strokeDasharray="4,4"
                  />
                );
              })}
            </g>
          )}

          {/* Y axis */}
          <line
            x1={PADDING.left}
            y1={PADDING.top}
            x2={PADDING.left}
            y2={PADDING.top + chartHeight}
            stroke="#d1d5db"
          />

          {/* X axis */}
          <line
            x1={PADDING.left}
            y1={PADDING.top + chartHeight}
            x2={width - PADDING.right}
            y2={PADDING.top + chartHeight}
            stroke="#d1d5db"
          />

          {/* Axis tick labels */}
          {showLabels && (
            <g>
              {/* X axis tick labels */}
              {xGridValues.map((val, i) => (
                <text
                  key={`x-label-${i}`}
                  x={scaleX(val)}
                  y={PADDING.top + chartHeight + 16}
                  textAnchor="middle"
                  fill="#9ca3af"
                  fontSize="10"
                >
                  {formatValue(val)}
                </text>
              ))}
              {/* Y axis tick labels */}
              {yGridValues.map((val, i) => (
                <text
                  key={`y-label-${i}`}
                  x={PADDING.left - 8}
                  y={scaleY(val) + 4}
                  textAnchor="end"
                  fill="#9ca3af"
                  fontSize="10"
                >
                  {formatValue(val)}
                </text>
              ))}
            </g>
          )}

          {/* Axis labels */}
          {xLabel && (
            <text
              x={PADDING.left + chartWidth / 2}
              y={height - 6}
              textAnchor="middle"
              fill="#6b7280"
              fontSize="12"
              data-testid="scatter-x-label"
            >
              {xLabel}
            </text>
          )}
          {yLabel && (
            <text
              x={14}
              y={PADDING.top + chartHeight / 2}
              textAnchor="middle"
              fill="#6b7280"
              fontSize="12"
              transform={`rotate(-90, 14, ${PADDING.top + chartHeight / 2})`}
              data-testid="scatter-y-label"
            >
              {yLabel}
            </text>
          )}

          {/* Data points */}
          {allSeries.map((s, seriesIndex) => {
            const seriesColor = s.color || DEFAULT_COLORS[seriesIndex % DEFAULT_COLORS.length];
            return s.data.map((point, pointIndex) => {
              const cx = scaleX(point.x);
              const cy = scaleY(point.y);
              const pointColor = point.color || seriesColor;
              const r = point.size ? point.size / 2 : dotSize / 2;
              const isHovered =
                hoveredPoint?.seriesIndex === seriesIndex &&
                hoveredPoint?.pointIndex === pointIndex;

              return (
                <g key={`point-${seriesIndex}-${pointIndex}`}>
                  {/* Invisible larger hit area */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={Math.max(r + 4, 10)}
                    fill="transparent"
                    onMouseEnter={() => setHoveredPoint({ seriesIndex, pointIndex })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <circle
                    data-testid={`scatter-point-${seriesIndex}-${pointIndex}`}
                    cx={cx}
                    cy={cy}
                    r={isHovered ? r * 1.3 : r}
                    fill={pointColor}
                    opacity={isHovered ? 1 : 0.75}
                    style={{ transition: "r 0.15s ease, opacity 0.2s" }}
                  />

                  {/* Tooltip on hover */}
                  {isHovered && (
                    <g>
                      <rect
                        x={cx - 40}
                        y={cy - 36}
                        width={80}
                        height={24}
                        rx={4}
                        fill="#1f2937"
                      />
                      <text
                        x={cx}
                        y={cy - 20}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="10"
                        fontWeight="500"
                      >
                        {point.label || `(${formatValue(point.x)}, ${formatValue(point.y)})`}
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
ScatterChart.displayName = "ScatterChart";

function formatValue(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1);
}

export { ScatterChart, DEFAULT_COLORS as SCATTER_DEFAULT_COLORS };
export type { ScatterChartProps, ScatterPoint, ScatterChartSeries };
