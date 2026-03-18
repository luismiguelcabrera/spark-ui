"use client";

import { forwardRef, useState, type HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";

type LineChartDataPoint = {
  label: string;
  value: number;
};

type LineChartProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  /** Array of data points */
  data: LineChartDataPoint[];
  /** Chart height in pixels */
  height?: number;
  /** Show grid lines */
  showGrid?: boolean;
  /** Show data point dots */
  showDots?: boolean;
  /** Fill area under the line */
  showArea?: boolean;
  /** Use smooth bezier curves instead of straight lines */
  smooth?: boolean;
  /** Line color (CSS color string) */
  color?: string;
  /** Line stroke width */
  strokeWidth?: number;
  /** Additional CSS classes */
  className?: string;
};

const PADDING = { top: 20, right: 20, bottom: 40, left: 50 };

const LineChart = forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      data,
      height = 300,
      showGrid = true,
      showDots = true,
      showArea = false,
      smooth = false,
      color = "#6366f1",
      strokeWidth = 2,
      className,
      ...props
    },
    ref
  ) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
            aria-label="Empty line chart"
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

    const maxValue = Math.max(...data.map((d) => d.value), 1);
    const niceMax = getNiceMax(maxValue);
    const gridLines = getGridLines(niceMax);

    const chartWidth = 500 - PADDING.left - PADDING.right;
    const chartHeight = height - PADDING.top - PADDING.bottom;

    // Calculate data point positions
    const points = data.map((d, i) => ({
      x: PADDING.left + (i / Math.max(data.length - 1, 1)) * chartWidth,
      y: PADDING.top + chartHeight - (d.value / niceMax) * chartHeight,
      value: d.value,
      label: d.label,
    }));

    const linePath = smooth ? getSmoothPath(points) : getStraightPath(points);
    const areaPath = smooth
      ? getSmoothAreaPath(points, PADDING.top + chartHeight)
      : getStraightAreaPath(points, PADDING.top + chartHeight);

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <svg
          role="img"
          aria-label="Line chart"
          width="100%"
          height={height}
          viewBox={`0 0 500 ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="line-area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
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
            x2={500 - PADDING.right}
            y2={PADDING.top + chartHeight}
            stroke="#d1d5db"
          />

          {/* X-axis labels */}
          {points.map((p, i) => (
            <text
              key={`label-${i}`}
              x={p.x}
              y={PADDING.top + chartHeight + 16}
              textAnchor="middle"
              fill="#6b7280"
              fontSize="11"
            >
              {data[i].label.length > 8 ? `${data[i].label.slice(0, 7)}...` : data[i].label}
            </text>
          ))}

          {/* Area fill */}
          {showArea && (
            <path
              d={areaPath}
              fill="url(#line-area-gradient)"
              data-testid="line-area"
            />
          )}

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
            data-testid="line-path"
          />

          {/* Data points */}
          {showDots &&
            points.map((p, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <g key={`dot-${i}`}>
                  {/* Invisible larger hit area */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={12}
                    fill="transparent"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                  <circle
                    data-testid={`dot-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 5 : 3.5}
                    fill={isHovered ? color : "#fff"}
                    stroke={color}
                    strokeWidth={2}
                    style={{ transition: "r 0.15s ease" }}
                  />
                  {/* Tooltip on hover */}
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
            })}
        </svg>
      </div>
    );
  }
);
LineChart.displayName = "LineChart";

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

function getStraightPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

function getSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return points.length === 1 ? `M ${points[0].x} ${points[0].y}` : "";

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}

function getStraightAreaPath(
  points: { x: number; y: number }[],
  baseline: number
): string {
  if (points.length === 0) return "";
  const linePath = getStraightPath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${linePath} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
}

function getSmoothAreaPath(
  points: { x: number; y: number }[],
  baseline: number
): string {
  if (points.length === 0) return "";
  const linePath = getSmoothPath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${linePath} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
}

function formatValue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(Math.round(value));
}

export { LineChart };
export type { LineChartProps, LineChartDataPoint };
