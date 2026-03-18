"use client";

import { forwardRef, useState, useMemo, type HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";

type HeatmapDataPoint = {
  x: string;
  y: string;
  value: number;
};

type HeatmapChartProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  /** Array of data points with x, y, and value */
  data: HeatmapDataPoint[];
  /** X-axis labels (auto-derived from data if not provided) */
  xLabels?: string[];
  /** Y-axis labels (auto-derived from data if not provided) */
  yLabels?: string[];
  /** Chart height in pixels */
  height?: number;
  /** Color range [min color, max color] */
  colorRange?: [string, string];
  /** Show values in cells */
  showValues?: boolean;
  /** Show color legend bar */
  showLegend?: boolean;
  /** Additional CSS classes */
  className?: string;
};

const PADDING = { top: 10, right: 20, bottom: 40, left: 70 };
const LEGEND_HEIGHT = 30;

const HeatmapChart = forwardRef<HTMLDivElement, HeatmapChartProps>(
  (
    {
      data,
      xLabels: xLabelsProp,
      yLabels: yLabelsProp,
      height = 300,
      colorRange = ["#eff6ff", "#1d4ed8"],
      showValues = false,
      showLegend = false,
      className,
      ...props
    },
    ref
  ) => {
    const [hoveredCell, setHoveredCell] = useState<{ x: string; y: string } | null>(null);

    // Auto-derive labels from data if not provided
    const xLabels = useMemo(() => {
      if (xLabelsProp) return xLabelsProp;
      const unique = new Set<string>();
      data.forEach((d) => unique.add(d.x));
      return Array.from(unique);
    }, [xLabelsProp, data]);

    const yLabels = useMemo(() => {
      if (yLabelsProp) return yLabelsProp;
      const unique = new Set<string>();
      data.forEach((d) => unique.add(d.y));
      return Array.from(unique);
    }, [yLabelsProp, data]);

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
            aria-label="Empty heatmap chart"
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

    // Build a lookup map
    const valueMap = useMemo(() => {
      const map = new Map<string, number>();
      data.forEach((d) => map.set(`${d.x}|${d.y}`, d.value));
      return map;
    }, [data]);

    const values = data.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;

    const svgWidth = 500;
    const totalHeight = showLegend ? height + LEGEND_HEIGHT + 10 : height;
    const chartWidth = svgWidth - PADDING.left - PADDING.right;
    const chartHeight = height - PADDING.top - PADDING.bottom;

    const cellWidth = xLabels.length > 0 ? chartWidth / xLabels.length : 0;
    const cellHeight = yLabels.length > 0 ? chartHeight / yLabels.length : 0;
    const cellGap = 1;

    function interpolateColor(normalized: number): string {
      const r1 = parseInt(colorRange[0].slice(1, 3), 16);
      const g1 = parseInt(colorRange[0].slice(3, 5), 16);
      const b1 = parseInt(colorRange[0].slice(5, 7), 16);
      const r2 = parseInt(colorRange[1].slice(1, 3), 16);
      const g2 = parseInt(colorRange[1].slice(3, 5), 16);
      const b2 = parseInt(colorRange[1].slice(5, 7), 16);

      const r = Math.round(r1 + (r2 - r1) * normalized);
      const g = Math.round(g1 + (g2 - g1) * normalized);
      const b = Math.round(b1 + (b2 - b1) * normalized);

      return `rgb(${r},${g},${b})`;
    }

    // Determine text color (dark text on light bg, white text on dark bg)
    function getTextColor(normalized: number): string {
      return normalized > 0.5 ? "#fff" : "#374151";
    }

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <svg
          role="img"
          aria-label="Heatmap chart"
          width="100%"
          height={totalHeight}
          viewBox={`0 0 ${svgWidth} ${totalHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Y-axis labels */}
          {yLabels.map((label, yi) => (
            <text
              key={`y-label-${yi}`}
              data-testid={`heatmap-y-label-${yi}`}
              x={PADDING.left - 8}
              y={PADDING.top + yi * cellHeight + cellHeight / 2 + 4}
              textAnchor="end"
              fill="#6b7280"
              fontSize="11"
            >
              {label.length > 8 ? `${label.slice(0, 7)}...` : label}
            </text>
          ))}

          {/* X-axis labels */}
          {xLabels.map((label, xi) => (
            <text
              key={`x-label-${xi}`}
              data-testid={`heatmap-x-label-${xi}`}
              x={PADDING.left + xi * cellWidth + cellWidth / 2}
              y={PADDING.top + chartHeight + 16}
              textAnchor="middle"
              fill="#6b7280"
              fontSize="11"
            >
              {label.length > 6 ? `${label.slice(0, 5)}...` : label}
            </text>
          ))}

          {/* Cells */}
          {yLabels.map((yLabel, yi) =>
            xLabels.map((xLabel, xi) => {
              const value = valueMap.get(`${xLabel}|${yLabel}`) ?? 0;
              const normalized = (value - minValue) / valueRange;
              const cellColor = interpolateColor(normalized);
              const isHovered = hoveredCell?.x === xLabel && hoveredCell?.y === yLabel;
              const x = PADDING.left + xi * cellWidth + cellGap / 2;
              const y = PADDING.top + yi * cellHeight + cellGap / 2;
              const w = cellWidth - cellGap;
              const h = cellHeight - cellGap;

              return (
                <g key={`cell-${xi}-${yi}`}>
                  <rect
                    data-testid={`heatmap-cell-${xi}-${yi}`}
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill={cellColor}
                    rx={2}
                    opacity={isHovered ? 1 : 0.9}
                    stroke={isHovered ? "#374151" : "none"}
                    strokeWidth={isHovered ? 1.5 : 0}
                    style={{ transition: "opacity 0.2s" }}
                    onMouseEnter={() => setHoveredCell({ x: xLabel, y: yLabel })}
                    onMouseLeave={() => setHoveredCell(null)}
                  />

                  {/* Value text inside cell */}
                  {showValues && w > 20 && h > 14 && (
                    <text
                      x={x + w / 2}
                      y={y + h / 2 + 4}
                      textAnchor="middle"
                      fill={getTextColor(normalized)}
                      fontSize={Math.min(10, h * 0.4)}
                      fontWeight="500"
                    >
                      {formatValue(value)}
                    </text>
                  )}

                  {/* Hover tooltip */}
                  {isHovered && (
                    <g>
                      <rect
                        x={x + w / 2 - 35}
                        y={y - 28}
                        width={70}
                        height={22}
                        rx={4}
                        fill="#1f2937"
                      />
                      <text
                        x={x + w / 2}
                        y={y - 13}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="10"
                        fontWeight="500"
                      >
                        {formatValue(value)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })
          )}

          {/* Color legend bar */}
          {showLegend && (
            <g>
              <defs>
                <linearGradient id="heatmap-legend-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={colorRange[0]} />
                  <stop offset="100%" stopColor={colorRange[1]} />
                </linearGradient>
              </defs>
              <rect
                data-testid="heatmap-legend"
                x={PADDING.left}
                y={height + 4}
                width={chartWidth}
                height={12}
                rx={2}
                fill="url(#heatmap-legend-gradient)"
              />
              <text
                x={PADDING.left}
                y={height + 30}
                textAnchor="start"
                fill="#9ca3af"
                fontSize="10"
              >
                {formatValue(minValue)}
              </text>
              <text
                x={PADDING.left + chartWidth}
                y={height + 30}
                textAnchor="end"
                fill="#9ca3af"
                fontSize="10"
              >
                {formatValue(maxValue)}
              </text>
            </g>
          )}
        </svg>
      </div>
    );
  }
);
HeatmapChart.displayName = "HeatmapChart";

function formatValue(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1);
}

export { HeatmapChart };
export type { HeatmapChartProps, HeatmapDataPoint };
