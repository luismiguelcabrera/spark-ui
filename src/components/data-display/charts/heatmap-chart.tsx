"use client";

import { forwardRef, useState, useMemo, useCallback, useId, type HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";
import type { ChartEventProps, TooltipProps } from "./chart-types";
import { ChartTooltip } from "./chart-tooltip";
import { formatValue } from "./chart-utils";

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
  /** Color scale: [min, max] or diverging [min, mid, max] */
  colorScale?: [string, string] | [string, string, string];
  /** Show values in cells */
  showValues?: boolean;
  /** Show color legend bar */
  showLegend?: boolean;
  /** Show tooltip on hover */
  showTooltip?: boolean;
  /** Custom value formatter */
  valueFormatter?: (value: number) => string;
  /** Custom tooltip component */
  customTooltip?: React.ComponentType<TooltipProps>;
  /** Click handler */
  onValueChange?: (value: ChartEventProps | null) => void;
  /** Accessible label for the chart */
  ariaLabel?: string;
  /** Additional CSS classes */
  className?: string;
};

const SVG_WIDTH = 500;
const PADDING = { top: 10, right: 20, bottom: 40, left: 70 };
const LEGEND_HEIGHT = 30;

/** Parse a hex color into [r, g, b] */
function parseHex(hex: string): [number, number, number] {
  const h = hex.startsWith("#") ? hex.slice(1) : hex;
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** Linearly interpolate between two colors */
function lerpColor(
  c1: [number, number, number],
  c2: [number, number, number],
  t: number
): string {
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
  return `rgb(${r},${g},${b})`;
}

/** Get relative luminance for contrast-based text color */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

const HeatmapChart = forwardRef<HTMLDivElement, HeatmapChartProps>(
  (
    {
      data,
      xLabels: xLabelsProp,
      yLabels: yLabelsProp,
      height = 300,
      colorScale = ["#eff6ff", "#1d4ed8"],
      showValues = false,
      showLegend = false,
      showTooltip = true,
      valueFormatter,
      customTooltip,
      onValueChange,
      ariaLabel,
      className,
      ...props
    },
    ref
  ) => {
    const [hoveredCell, setHoveredCell] = useState<{ x: string; y: string; xi: number; yi: number } | null>(null);
    const gradientId = `heatmap-legend-${useId().replace(/:/g, "")}`;

    const fmt = valueFormatter || formatValue;

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

    // Build a lookup map
    const valueMap = useMemo(() => {
      const map = new Map<string, number>();
      data.forEach((d) => map.set(`${d.x}|${d.y}`, d.value));
      return map;
    }, [data]);

    // Parse color scale stops
    const colorStops = useMemo(() => colorScale.map(parseHex), [colorScale]);
    const isDiverging = colorScale.length === 3;

    const handleClick = useCallback(
      (xLabel: string, yLabel: string, value: number) => {
        if (!onValueChange) return;
        onValueChange({
          eventType: "cell",
          categoryClicked: `${xLabel} / ${yLabel}`,
          x: xLabel,
          y: yLabel,
          value,
        });
      },
      [onValueChange]
    );

    if (!data || data.length === 0) {
      return (
        <div
          ref={ref}
          className={cn("w-full flex items-center justify-center text-gray-500", className)}
          style={{ height }}
          {...props}
        >
          <svg
            role="img"
            aria-label={ariaLabel || "Empty heatmap chart"}
            width="100%"
            height={height}
            viewBox={`0 0 ${SVG_WIDTH} ${height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <text x={SVG_WIDTH / 2} y={height / 2} textAnchor="middle" fill="currentColor" fontSize="14">
              No data available
            </text>
          </svg>
        </div>
      );
    }

    const values = data.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;

    /** Interpolate color for a normalized value [0, 1] */
    function interpolateColor(normalized: number): string {
      if (isDiverging) {
        // 3-stop: [min, mid, max]
        if (normalized <= 0.5) {
          return lerpColor(colorStops[0] as [number, number, number], colorStops[1] as [number, number, number], normalized * 2);
        }
        return lerpColor(colorStops[1] as [number, number, number], colorStops[2] as [number, number, number], (normalized - 0.5) * 2);
      }
      // 2-stop: [min, max]
      return lerpColor(colorStops[0] as [number, number, number], colorStops[1] as [number, number, number], normalized);
    }

    /** Get text color for contrast */
    function getTextColor(normalized: number): string {
      const hex = interpolateColor(normalized);
      // Parse rgb() format
      const match = hex.match(/rgb\((\d+),(\d+),(\d+)\)/);
      if (!match) return "#374151";
      const lum = getLuminance(+match[1], +match[2], +match[3]);
      return lum > 0.4 ? "#1f2937" : "#ffffff";
    }

    const totalHeight = showLegend ? height + LEGEND_HEIGHT + 10 : height;
    const chartWidth = SVG_WIDTH - PADDING.left - PADDING.right;
    const chartHeight = height - PADDING.top - PADDING.bottom;

    const cellWidth = xLabels.length > 0 ? chartWidth / xLabels.length : 0;
    const cellHeight = yLabels.length > 0 ? chartHeight / yLabels.length : 0;
    const cellGap = 1;

    // Build tooltip payload
    const tooltipPayload =
      hoveredCell !== null
        ? [
            {
              name: `${hoveredCell.x} / ${hoveredCell.y}`,
              value: valueMap.get(`${hoveredCell.x}|${hoveredCell.y}`) ?? 0,
              color: interpolateColor(
                ((valueMap.get(`${hoveredCell.x}|${hoveredCell.y}`) ?? minValue) - minValue) / valueRange
              ),
            },
          ]
        : [];

    const tooltipX =
      hoveredCell !== null ? PADDING.left + hoveredCell.xi * cellWidth + cellWidth : 0;
    const tooltipY =
      hoveredCell !== null ? PADDING.top + hoveredCell.yi * cellHeight + cellHeight / 2 : 0;

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <svg
          role="img"
          aria-label={ariaLabel || "Heatmap chart"}
          width="100%"
          height={totalHeight}
          viewBox={`0 0 ${SVG_WIDTH} ${totalHeight}`}
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
                    onMouseEnter={() =>
                      setHoveredCell({ x: xLabel, y: yLabel, xi, yi })
                    }
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={() => handleClick(xLabel, yLabel, value)}
                    className={onValueChange ? "cursor-pointer" : undefined}
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
                      style={{ pointerEvents: "none" }}
                    >
                      {fmt(value)}
                    </text>
                  )}
                </g>
              );
            })
          )}

          {/* Color legend bar */}
          {showLegend && (
            <g>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={colorScale[0]} />
                  {isDiverging && <stop offset="50%" stopColor={colorScale[1]} />}
                  <stop offset="100%" stopColor={colorScale[colorScale.length - 1]} />
                </linearGradient>
              </defs>
              <rect
                data-testid="heatmap-legend"
                x={PADDING.left}
                y={height + 4}
                width={chartWidth}
                height={12}
                rx={2}
                fill={`url(#${gradientId})`}
              />
              <text x={PADDING.left} y={height + 30} textAnchor="start" fill="#9ca3af" fontSize="10">
                {fmt(minValue)}
              </text>
              {isDiverging && (
                <text
                  x={PADDING.left + chartWidth / 2}
                  y={height + 30}
                  textAnchor="middle"
                  fill="#9ca3af"
                  fontSize="10"
                >
                  {fmt((minValue + maxValue) / 2)}
                </text>
              )}
              <text
                x={PADDING.left + chartWidth}
                y={height + 30}
                textAnchor="end"
                fill="#9ca3af"
                fontSize="10"
              >
                {fmt(maxValue)}
              </text>
            </g>
          )}

          {/* Tooltip */}
          {showTooltip && hoveredCell !== null && (
            <ChartTooltip
              active
              payload={tooltipPayload}
              label={`${hoveredCell.x} / ${hoveredCell.y}`}
              x={tooltipX}
              y={tooltipY}
              viewBoxWidth={SVG_WIDTH}
              valueFormatter={valueFormatter}
              customTooltip={customTooltip}
            />
          )}
        </svg>
      </div>
    );
  }
);
HeatmapChart.displayName = "HeatmapChart";

export { HeatmapChart };
export type { HeatmapChartProps, HeatmapDataPoint };
