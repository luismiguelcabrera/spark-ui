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

type FunnelChartDataPoint = {
  label: string;
  value: number;
  color?: string;
};

type FunnelChartProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  /** Array of funnel stages (should be ordered from largest to smallest) */
  data: FunnelChartDataPoint[];
  /** Chart height in pixels */
  height?: number;
  /** Show stage labels */
  showLabels?: boolean;
  /** Show value numbers */
  showValues?: boolean;
  /** Show percentage of first stage */
  showPercentage?: boolean;
  /** Orientation */
  orientation?: "vertical" | "horizontal";
  /** Additional CSS classes */
  className?: string;
};

const FunnelChart = forwardRef<HTMLDivElement, FunnelChartProps>(
  (
    {
      data,
      height = 300,
      showLabels = true,
      showValues = true,
      showPercentage = false,
      orientation = "vertical",
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
            aria-label="Empty funnel chart"
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
    const firstValue = data[0].value || 1;

    if (orientation === "horizontal") {
      return renderHorizontal(
        data,
        height,
        maxValue,
        firstValue,
        showLabels,
        showValues,
        showPercentage,
        hoveredIndex,
        setHoveredIndex,
        ref, // eslint-disable-line react-hooks/refs -- intentional: forward ref to render helper
        className,
        props
      );
    }

    return renderVertical(
      data,
      height,
      maxValue,
      firstValue,
      showLabels,
      showValues,
      showPercentage,
      hoveredIndex,
      setHoveredIndex,
      ref, // eslint-disable-line react-hooks/refs -- intentional: forward ref to render helper
      className,
      props
    );
  }
);
FunnelChart.displayName = "FunnelChart";

function renderVertical(
  data: FunnelChartDataPoint[],
  height: number,
  maxValue: number,
  firstValue: number,
  showLabels: boolean,
  showValues: boolean,
  showPercentage: boolean,
  hoveredIndex: number | null,
  setHoveredIndex: (i: number | null) => void,
  ref: React.ForwardedRef<HTMLDivElement>,
  className: string | undefined,
  props: Record<string, unknown>
) {
  const svgWidth = 500;
  const padding = { top: 10, bottom: 10, left: 120, right: 20 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const segmentHeight = chartHeight / data.length;
  const gap = 2;

  return (
    <div ref={ref} className={cn("w-full", className)} {...(props as HTMLAttributes<HTMLDivElement>)}>
      <svg
        role="img"
        aria-label="Funnel chart"
        width="100%"
        height={height}
        viewBox={`0 0 ${svgWidth} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {data.map((d, i) => {
          const widthRatio = d.value / maxValue;
          const nextWidthRatio = i < data.length - 1 ? data[i + 1].value / maxValue : widthRatio * 0.6;
          const topWidth = chartWidth * widthRatio;
          const bottomWidth = chartWidth * nextWidthRatio;
          const y = padding.top + i * segmentHeight + gap / 2;
          const h = segmentHeight - gap;
          const centerX = padding.left + chartWidth / 2;
          const segColor = d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          const isHovered = hoveredIndex === i;

          // Trapezoid points
          const x1 = centerX - topWidth / 2;
          const x2 = centerX + topWidth / 2;
          const x3 = centerX + bottomWidth / 2;
          const x4 = centerX - bottomWidth / 2;

          const points = `${x1},${y} ${x2},${y} ${x3},${y + h} ${x4},${y + h}`;
          const percentage = Math.round((d.value / firstValue) * 100);

          return (
            <g key={`funnel-${i}`}>
              <polygon
                data-testid={`funnel-segment-${i}`}
                points={points}
                fill={segColor}
                opacity={isHovered ? 1 : 0.85}
                style={{ transition: "opacity 0.2s" }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />

              {/* Label on the left */}
              {showLabels && (
                <text
                  data-testid={`funnel-label-${i}`}
                  x={padding.left - 8}
                  y={y + h / 2 + 4}
                  textAnchor="end"
                  fill="#374151"
                  fontSize="12"
                  fontWeight="500"
                >
                  {d.label}
                </text>
              )}

              {/* Value and percentage centered on segment */}
              {(showValues || showPercentage) && (
                <text
                  x={centerX}
                  y={y + h / 2 + 4}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="12"
                  fontWeight="600"
                >
                  {showValues ? formatValue(d.value) : ""}
                  {showValues && showPercentage ? " " : ""}
                  {showPercentage ? `(${percentage}%)` : ""}
                </text>
              )}

              {/* Hover tooltip */}
              {isHovered && (
                <g>
                  <rect
                    x={centerX + topWidth / 2 + 8}
                    y={y + h / 2 - 12}
                    width={100}
                    height={24}
                    rx={4}
                    fill="#1f2937"
                  />
                  <text
                    x={centerX + topWidth / 2 + 58}
                    y={y + h / 2 + 3}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="11"
                    fontWeight="500"
                  >
                    {d.label}: {formatValue(d.value)}
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

function renderHorizontal(
  data: FunnelChartDataPoint[],
  height: number,
  maxValue: number,
  firstValue: number,
  showLabels: boolean,
  showValues: boolean,
  showPercentage: boolean,
  hoveredIndex: number | null,
  setHoveredIndex: (i: number | null) => void,
  ref: React.ForwardedRef<HTMLDivElement>,
  className: string | undefined,
  props: Record<string, unknown>
) {
  const svgWidth = 500;
  const padding = { top: 20, bottom: 40, left: 20, right: 20 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const segmentWidth = chartWidth / data.length;
  const gap = 2;

  return (
    <div ref={ref} className={cn("w-full", className)} {...(props as HTMLAttributes<HTMLDivElement>)}>
      <svg
        role="img"
        aria-label="Funnel chart"
        width="100%"
        height={height}
        viewBox={`0 0 ${svgWidth} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {data.map((d, i) => {
          const heightRatio = d.value / maxValue;
          const nextHeightRatio = i < data.length - 1 ? data[i + 1].value / maxValue : heightRatio * 0.6;
          const leftHeight = chartHeight * heightRatio;
          const rightHeight = chartHeight * nextHeightRatio;
          const x = padding.left + i * segmentWidth + gap / 2;
          const w = segmentWidth - gap;
          const centerY = padding.top + chartHeight / 2;
          const segColor = d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          const isHovered = hoveredIndex === i;

          // Trapezoid points (horizontal)
          const y1 = centerY - leftHeight / 2;
          const y2 = centerY + leftHeight / 2;
          const y3 = centerY + rightHeight / 2;
          const y4 = centerY - rightHeight / 2;

          const points = `${x},${y1} ${x},${y2} ${x + w},${y3} ${x + w},${y4}`;
          const percentage = Math.round((d.value / firstValue) * 100);

          return (
            <g key={`funnel-${i}`}>
              <polygon
                data-testid={`funnel-segment-${i}`}
                points={points}
                fill={segColor}
                opacity={isHovered ? 1 : 0.85}
                style={{ transition: "opacity 0.2s" }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />

              {/* Value centered on segment */}
              {showValues && (
                <text
                  x={x + w / 2}
                  y={centerY + 4}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="11"
                  fontWeight="600"
                >
                  {formatValue(d.value)}
                  {showPercentage ? ` (${percentage}%)` : ""}
                </text>
              )}

              {/* Label below */}
              {showLabels && (
                <text
                  data-testid={`funnel-label-${i}`}
                  x={x + w / 2}
                  y={height - padding.bottom + 16}
                  textAnchor="middle"
                  fill="#374151"
                  fontSize="11"
                  fontWeight="500"
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function formatValue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(Math.round(value));
}

export { FunnelChart };
export type { FunnelChartProps, FunnelChartDataPoint };
