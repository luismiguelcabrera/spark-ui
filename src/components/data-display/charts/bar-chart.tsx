"use client";

import { forwardRef, useState, useEffect, type HTMLAttributes } from "react";
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

type BarChartDataPoint = {
  label: string;
  value: number;
  color?: string;
};

type BarChartProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  /** Array of data points to render */
  data: BarChartDataPoint[];
  /** Chart height in pixels */
  height?: number;
  /** Show grid lines */
  showGrid?: boolean;
  /** Show value labels on bars */
  showValues?: boolean;
  /** Bar orientation */
  orientation?: "vertical" | "horizontal";
  /** Animate bars on mount */
  animate?: boolean;
  /** Default bar color (CSS color string) */
  color?: string;
  /** Additional CSS classes */
  className?: string;
};

const PADDING = { top: 20, right: 20, bottom: 40, left: 50 };

const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      data,
      height = 300,
      showGrid = true,
      showValues = false,
      orientation = "vertical",
      animate = true,
      color = "#6366f1",
      className,
      ...props
    },
    ref
  ) => {
    const [mounted, setMounted] = useState(!animate);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
      if (animate) {
        const timer = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(timer);
      }
    }, [animate]);

    if (!data || data.length === 0) {
      return (
        <div
          ref={ref}
          className={cn("w-full flex items-center justify-center text-gray-400", className)}
          style={{ height }}
          {...props}
        >
          <svg
            role="img"
            aria-label="Empty bar chart"
            width="100%"
            height={height}
            viewBox={`0 0 400 ${height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <text x="200" y={height / 2} textAnchor="middle" fill="currentColor" fontSize="14">
              No data available
            </text>
          </svg>
        </div>
      );
    }

    const maxValue = Math.max(...data.map((d) => d.value), 1);
    const niceMax = getNiceMax(maxValue);
    const gridLines = getGridLines(niceMax);

    if (orientation === "horizontal") {
      return (
        <div ref={ref} className={cn("w-full", className)} {...props}>
          <svg
            role="img"
            aria-label="Bar chart"
            width="100%"
            height={Math.max(height, data.length * 40 + PADDING.top + PADDING.bottom)}
            viewBox={`0 0 500 ${Math.max(height, data.length * 40 + PADDING.top + PADDING.bottom)}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {renderHorizontalBars(
              data,
              niceMax,
              gridLines,
              showGrid,
              showValues,
              mounted,
              hoveredIndex,
              setHoveredIndex,
              color
            )}
          </svg>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <svg
          role="img"
          aria-label="Bar chart"
          width="100%"
          height={height}
          viewBox={`0 0 500 ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {renderVerticalBars(
            data,
            height,
            niceMax,
            gridLines,
            showGrid,
            showValues,
            mounted,
            hoveredIndex,
            setHoveredIndex,
            color
          )}
        </svg>
      </div>
    );
  }
);
BarChart.displayName = "BarChart";

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

function renderVerticalBars(
  data: BarChartDataPoint[],
  height: number,
  niceMax: number,
  gridLines: number[],
  showGrid: boolean,
  showValues: boolean,
  mounted: boolean,
  hoveredIndex: number | null,
  setHoveredIndex: (i: number | null) => void,
  defaultColor: string
) {
  const chartWidth = 500 - PADDING.left - PADDING.right;
  const chartHeight = height - PADDING.top - PADDING.bottom;
  const barWidth = Math.min(40, (chartWidth / data.length) * 0.6);
  const barGap = (chartWidth - barWidth * data.length) / (data.length + 1);

  return (
    <g>
      {/* Grid lines */}
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

      {/* Y axis line */}
      <line
        x1={PADDING.left}
        y1={PADDING.top}
        x2={PADDING.left}
        y2={PADDING.top + chartHeight}
        stroke="#d1d5db"
      />

      {/* X axis line */}
      <line
        x1={PADDING.left}
        y1={PADDING.top + chartHeight}
        x2={500 - PADDING.right}
        y2={PADDING.top + chartHeight}
        stroke="#d1d5db"
      />

      {/* Bars */}
      {data.map((d, i) => {
        const barHeight = mounted ? (d.value / niceMax) * chartHeight : 0;
        const x = PADDING.left + barGap + i * (barWidth + barGap);
        const y = PADDING.top + chartHeight - barHeight;
        const barColor = d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length] || defaultColor;
        const isHovered = hoveredIndex === i;

        return (
          <g key={`bar-${i}`}>
            <rect
              data-testid={`bar-${i}`}
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(0, barHeight)}
              fill={barColor}
              opacity={isHovered ? 1 : 0.85}
              rx={2}
              style={{
                transition: "height 0.6s ease-out, y 0.6s ease-out, opacity 0.2s",
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            {/* X-axis label */}
            <text
              x={x + barWidth / 2}
              y={PADDING.top + chartHeight + 16}
              textAnchor="middle"
              fill="#6b7280"
              fontSize="11"
            >
              {d.label.length > 8 ? `${d.label.slice(0, 7)}...` : d.label}
            </text>

            {/* Value label on bar */}
            {showValues && mounted && (
              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                fill="#374151"
                fontSize="11"
                fontWeight="600"
              >
                {formatValue(d.value)}
              </text>
            )}

            {/* Tooltip on hover */}
            {isHovered && (
              <g>
                <rect
                  x={x + barWidth / 2 - 30}
                  y={y - 32}
                  width={60}
                  height={22}
                  rx={4}
                  fill="#1f2937"
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 17}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="11"
                  fontWeight="500"
                >
                  {formatValue(d.value)}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

function renderHorizontalBars(
  data: BarChartDataPoint[],
  niceMax: number,
  gridLines: number[],
  showGrid: boolean,
  showValues: boolean,
  mounted: boolean,
  hoveredIndex: number | null,
  setHoveredIndex: (i: number | null) => void,
  defaultColor: string
) {
  const totalHeight = data.length * 40 + PADDING.top + PADDING.bottom;
  const chartWidth = 500 - PADDING.left - PADDING.right;
  const chartHeight = totalHeight - PADDING.top - PADDING.bottom;
  const barHeight = Math.min(25, (chartHeight / data.length) * 0.7);
  const barGap = (chartHeight - barHeight * data.length) / (data.length + 1);

  return (
    <g>
      {/* Vertical grid lines */}
      {showGrid &&
        gridLines.map((val, i) => {
          const x = PADDING.left + (val / niceMax) * chartWidth;
          return (
            <g key={`grid-${i}`}>
              <line
                x1={x}
                y1={PADDING.top}
                x2={x}
                y2={PADDING.top + chartHeight}
                stroke="#e5e7eb"
                strokeDasharray="4,4"
              />
              <text
                x={x}
                y={PADDING.top + chartHeight + 16}
                textAnchor="middle"
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
        y2={PADDING.top + chartHeight}
        stroke="#d1d5db"
      />
      <line
        x1={PADDING.left}
        y1={PADDING.top + chartHeight}
        x2={500 - PADDING.right}
        y2={PADDING.top + chartHeight}
        stroke="#d1d5db"
      />

      {/* Bars */}
      {data.map((d, i) => {
        const barW = mounted ? (d.value / niceMax) * chartWidth : 0;
        const y = PADDING.top + barGap + i * (barHeight + barGap);
        const barColor = d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length] || defaultColor;
        const isHovered = hoveredIndex === i;

        return (
          <g key={`bar-${i}`}>
            <rect
              data-testid={`bar-${i}`}
              x={PADDING.left}
              y={y}
              width={Math.max(0, barW)}
              height={barHeight}
              fill={barColor}
              opacity={isHovered ? 1 : 0.85}
              rx={2}
              style={{
                transition: "width 0.6s ease-out, opacity 0.2s",
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            {/* Y-axis label */}
            <text
              x={PADDING.left - 8}
              y={y + barHeight / 2 + 4}
              textAnchor="end"
              fill="#6b7280"
              fontSize="11"
            >
              {d.label.length > 8 ? `${d.label.slice(0, 7)}...` : d.label}
            </text>

            {/* Value on bar */}
            {showValues && mounted && (
              <text
                x={PADDING.left + barW + 6}
                y={y + barHeight / 2 + 4}
                textAnchor="start"
                fill="#374151"
                fontSize="11"
                fontWeight="600"
              >
                {formatValue(d.value)}
              </text>
            )}

            {/* Hover tooltip */}
            {isHovered && (
              <g>
                <rect
                  x={PADDING.left + barW + 4}
                  y={y + barHeight / 2 - 14}
                  width={60}
                  height={22}
                  rx={4}
                  fill="#1f2937"
                />
                <text
                  x={PADDING.left + barW + 34}
                  y={y + barHeight / 2 + 1}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="11"
                  fontWeight="500"
                >
                  {formatValue(d.value)}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

function formatValue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(Math.round(value));
}

export { BarChart, DEFAULT_COLORS };
export type { BarChartProps, BarChartDataPoint };
