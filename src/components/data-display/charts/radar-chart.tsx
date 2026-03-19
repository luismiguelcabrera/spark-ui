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

type RadarChartDataPoint = {
  label: string;
  value: number;
  max?: number;
};

type RadarChartSeries = {
  data: { label: string; value: number }[];
  color?: string;
  name?: string;
};

type RadarChartProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  /** Single-series data */
  data?: RadarChartDataPoint[];
  /** Multi-series data */
  series?: RadarChartSeries[];
  /** Chart size in pixels */
  size?: number;
  /** Show concentric grid lines */
  showGrid?: boolean;
  /** Show axis labels */
  showLabels?: boolean;
  /** Show data point dots */
  showDots?: boolean;
  /** Fill opacity 0-1 */
  fillOpacity?: number;
  /** Default color for single-series */
  color?: string;
  /** Additional CSS classes */
  className?: string;
};

const RadarChart = forwardRef<HTMLDivElement, RadarChartProps>(
  (
    {
      data,
      series,
      size = 300,
      showGrid = true,
      showLabels = true,
      showDots = true,
      fillOpacity = 0.2,
      color = "#6366f1",
      className,
      ...props
    },
    ref
  ) => {
    const [hoveredSeries, setHoveredSeries] = useState<number | null>(null);

    // Normalize into multi-series format
    const allSeries: RadarChartSeries[] = series
      ? series
      : data && data.length > 0
        ? [{ data: data.map((d) => ({ label: d.label, value: d.value })), color, name: "default" }]
        : [];

    // Derive max values per axis from data or explicit max
    const axisLabels =
      allSeries.length > 0
        ? allSeries[0].data.map((d) => d.label)
        : data
          ? data.map((d) => d.label)
          : [];
    const axisCount = axisLabels.length;

    if (axisCount === 0 || allSeries.length === 0) {
      return (
        <div
          ref={ref}
          className={cn("flex items-center justify-center text-gray-500", className)}
          style={{ width: size, height: size }}
          {...props}
        >
          <svg
            role="img"
            aria-label="Empty radar chart"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            <text x={size / 2} y={size / 2} textAnchor="middle" fill="currentColor" fontSize="14">
              No data available
            </text>
          </svg>
        </div>
      );
    }

    // Compute max for each axis
    const axisMaxValues = axisLabels.map((_, axisIndex) => {
      let max = 0;
      for (const s of allSeries) {
        if (s.data[axisIndex]) {
          max = Math.max(max, s.data[axisIndex].value);
        }
      }
      // If original data had per-point max, use it
      if (data && data[axisIndex]?.max !== undefined) {
        max = data[axisIndex].max!;
      }
      return max || 1;
    });

    const _globalMax = Math.max(...axisMaxValues);
    const cx = size / 2;
    const cy = size / 2;
    const radius = (size - 80) / 2; // Leave room for labels
    const gridLevels = 5;

    // Get point on the radar for a given axis index and normalized value (0-1)
    function getPoint(axisIndex: number, normalizedValue: number): { x: number; y: number } {
      const angle = (Math.PI * 2 * axisIndex) / axisCount - Math.PI / 2;
      return {
        x: cx + Math.cos(angle) * radius * normalizedValue,
        y: cy + Math.sin(angle) * radius * normalizedValue,
      };
    }

    // Build polygon points for a grid level
    function getGridPolygon(level: number): string {
      const normalized = level / gridLevels;
      return Array.from({ length: axisCount })
        .map((_, i) => {
          const p = getPoint(i, normalized);
          return `${p.x},${p.y}`;
        })
        .join(" ");
    }

    // Build polygon points for a data series
    function getSeriesPolygon(s: RadarChartSeries): string {
      return s.data
        .map((d, i) => {
          const normalized = d.value / (axisMaxValues[i] || 1);
          const clamped = Math.min(1, Math.max(0, normalized));
          const p = getPoint(i, clamped);
          return `${p.x},${p.y}`;
        })
        .join(" ");
    }

    return (
      <div ref={ref} className={cn("inline-block", className)} {...props}>
        <svg
          role="img"
          aria-label="Radar chart"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Concentric grid polygons */}
          {showGrid &&
            Array.from({ length: gridLevels }).map((_, level) => (
              <polygon
                key={`grid-${level}`}
                data-testid={`radar-grid-${level}`}
                points={getGridPolygon(level + 1)}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={1}
              />
            ))}

          {/* Axis lines from center to each vertex */}
          {Array.from({ length: axisCount }).map((_, i) => {
            const p = getPoint(i, 1);
            return (
              <line
                key={`axis-${i}`}
                data-testid={`radar-axis-${i}`}
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke="#d1d5db"
                strokeWidth={1}
              />
            );
          })}

          {/* Data series polygons */}
          {allSeries.map((s, seriesIndex) => {
            const seriesColor = s.color || DEFAULT_COLORS[seriesIndex % DEFAULT_COLORS.length];
            const isHovered = hoveredSeries === seriesIndex;
            const opacity = hoveredSeries !== null && !isHovered ? fillOpacity * 0.3 : fillOpacity;

            return (
              <g key={`series-${seriesIndex}`}>
                <polygon
                  data-testid={`radar-polygon-${seriesIndex}`}
                  points={getSeriesPolygon(s)}
                  fill={seriesColor}
                  fillOpacity={opacity}
                  stroke={seriesColor}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  style={{ transition: "fill-opacity 0.2s, stroke-width 0.2s" }}
                  onMouseEnter={() => setHoveredSeries(seriesIndex)}
                  onMouseLeave={() => setHoveredSeries(null)}
                />

                {/* Data point dots */}
                {showDots &&
                  s.data.map((d, i) => {
                    const normalized = d.value / (axisMaxValues[i] || 1);
                    const clamped = Math.min(1, Math.max(0, normalized));
                    const p = getPoint(i, clamped);
                    return (
                      <circle
                        key={`dot-${seriesIndex}-${i}`}
                        data-testid={`radar-dot-${seriesIndex}-${i}`}
                        cx={p.x}
                        cy={p.y}
                        r={3}
                        fill={seriesColor}
                        stroke="#fff"
                        strokeWidth={1.5}
                        onMouseEnter={() => setHoveredSeries(seriesIndex)}
                        onMouseLeave={() => setHoveredSeries(null)}
                      />
                    );
                  })}
              </g>
            );
          })}

          {/* Labels at each vertex */}
          {showLabels &&
            axisLabels.map((label, i) => {
              const p = getPoint(i, 1.15);
              const angle = (Math.PI * 2 * i) / axisCount - Math.PI / 2;
              const anchor =
                Math.abs(Math.cos(angle)) < 0.1
                  ? "middle"
                  : Math.cos(angle) > 0
                    ? "start"
                    : "end";
              return (
                <text
                  key={`label-${i}`}
                  data-testid={`radar-label-${i}`}
                  x={p.x}
                  y={p.y}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fill="#6b7280"
                  fontSize="11"
                >
                  {label}
                </text>
              );
            })}
        </svg>
      </div>
    );
  }
);
RadarChart.displayName = "RadarChart";

export { RadarChart, DEFAULT_COLORS };
export type { RadarChartProps, RadarChartDataPoint, RadarChartSeries };
