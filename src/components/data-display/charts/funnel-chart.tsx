"use client";

import { forwardRef, useState, useCallback, useId, type HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";
import type { ChartColor, ChartEventProps, TooltipProps } from "./chart-types";
import { resolveColors } from "./chart-colors";
import { ChartTooltip } from "./chart-tooltip";
import { formatValue, prefersReducedMotion } from "./chart-utils";

type FunnelChartDataPoint = {
  /** Stage name */
  name: string;
  /** Numeric value for this stage */
  value: number;
  /** Optional per-segment color override */
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
  /** Color palette for segments */
  colors?: ChartColor[];
  /** Custom value formatter */
  valueFormatter?: (value: number) => string;
  /** Show tooltip on hover */
  showTooltip?: boolean;
  /** Custom tooltip component */
  customTooltip?: React.ComponentType<TooltipProps>;
  /** Click handler */
  onValueChange?: (value: ChartEventProps | null) => void;
  /** Animate on mount */
  animate?: boolean;
  /** Accessible label for the chart */
  ariaLabel?: string;
  /** Additional CSS classes */
  className?: string;
};

const SVG_WIDTH = 500;

const FunnelChart = forwardRef<HTMLDivElement, FunnelChartProps>(
  (
    {
      data,
      height = 300,
      showLabels = true,
      showValues = true,
      showPercentage = false,
      orientation = "vertical",
      colors,
      valueFormatter,
      showTooltip = true,
      customTooltip,
      onValueChange,
      animate = true,
      ariaLabel,
      className,
      ...props
    },
    ref
  ) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const uid = useId().replace(/:/g, "");
    const shouldAnimate = animate && !prefersReducedMotion();

    const fmt = valueFormatter || formatValue;

    const handleClick = useCallback(
      (index: number) => {
        if (!onValueChange) return;
        const d = data[index];
        onValueChange({
          eventType: "segment",
          categoryClicked: d.name,
          value: d.value,
          index,
        });
      },
      [onValueChange, data]
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
            aria-label={ariaLabel || "Empty funnel chart"}
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

    const resolvedColors = resolveColors(colors, data.length);
    const segmentColors = data.map((d, i) => d.color || resolvedColors[i]);
    const maxValue = Math.max(...data.map((d) => d.value), 1);
    const firstValue = data[0].value || 1;

    // Build tooltip payload for hovered segment
    const tooltipPayload =
      hoveredIndex !== null
        ? [
            {
              name: data[hoveredIndex].name,
              value: data[hoveredIndex].value,
              color: segmentColors[hoveredIndex],
            },
          ]
        : [];

    const tooltipLabel =
      hoveredIndex !== null
        ? showPercentage
          ? `${Math.round((data[hoveredIndex].value / firstValue) * 100)}%`
          : ""
        : "";

    if (orientation === "horizontal") {
      const padding = { top: 20, bottom: 40, left: 20, right: 20 };
      const chartWidth = SVG_WIDTH - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;
      const segmentWidth = chartWidth / data.length;
      const gap = 2;

      return (
        <div ref={ref} className={cn("w-full", className)} {...props}>
          <svg
            role="img"
            aria-label={ariaLabel || "Funnel chart"}
            width="100%"
            height={height}
            viewBox={`0 0 ${SVG_WIDTH} ${height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {data.map((d, i) => {
              const heightRatio = d.value / maxValue;
              const nextHeightRatio =
                i < data.length - 1 ? data[i + 1].value / maxValue : heightRatio * 0.6;
              const leftH = chartHeight * heightRatio;
              const rightH = chartHeight * nextHeightRatio;
              const x = padding.left + i * segmentWidth + gap / 2;
              const w = segmentWidth - gap;
              const centerY = padding.top + chartHeight / 2;
              const segColor = segmentColors[i];
              const isHovered = hoveredIndex === i;
              const percentage = Math.round((d.value / firstValue) * 100);

              const y1 = centerY - leftH / 2;
              const y2 = centerY + leftH / 2;
              const y3 = centerY + rightH / 2;
              const y4 = centerY - rightH / 2;
              const points = `${x},${y1} ${x},${y2} ${x + w},${y3} ${x + w},${y4}`;

              return (
                <g key={`funnel-h-${i}`}>
                  <polygon
                    data-testid={`funnel-segment-${i}`}
                    points={points}
                    fill={segColor}
                    opacity={isHovered ? 1 : 0.85}
                    style={{
                      transition: "opacity 0.2s",
                      ...(shouldAnimate
                        ? {
                            animation: `funnel-fade-in-${uid} 0.5s ease-out ${i * 0.08}s both`,
                          }
                        : {}),
                    }}
                    onMouseEnter={(e) => {
                      setHoveredIndex(i);
                      const rect = (e.target as SVGElement).ownerSVGElement?.getBoundingClientRect();
                      if (rect) {
                        setTooltipPos({ x: x + w / 2, y: centerY - leftH / 2 });
                      }
                    }}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => handleClick(i)}
                    className={onValueChange ? "cursor-pointer" : undefined}
                  />

                  {showValues && (
                    <text
                      x={x + w / 2}
                      y={centerY + 4}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="11"
                      fontWeight="600"
                      style={{ pointerEvents: "none" }}
                    >
                      {fmt(d.value)}
                      {showPercentage ? ` (${percentage}%)` : ""}
                    </text>
                  )}

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
                      {d.name}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Animation keyframes */}
            {shouldAnimate && (
              <style>{`
                @keyframes funnel-fade-in-${uid} {
                  from { opacity: 0; transform: scale(0.95); }
                  to { opacity: 0.85; transform: scale(1); }
                }
              `}</style>
            )}

            {/* Tooltip */}
            {showTooltip && hoveredIndex !== null && (
              <ChartTooltip
                active
                payload={tooltipPayload}
                label={tooltipLabel}
                x={tooltipPos.x}
                y={tooltipPos.y}
                viewBoxWidth={SVG_WIDTH}
                valueFormatter={valueFormatter}
                customTooltip={customTooltip}
              />
            )}
          </svg>
        </div>
      );
    }

    // Vertical orientation (default)
    const padding = { top: 10, bottom: 10, left: 120, right: 20 };
    const chartWidth = SVG_WIDTH - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const segmentHeight = chartHeight / data.length;
    const gap = 2;

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <svg
          role="img"
          aria-label={ariaLabel || "Funnel chart"}
          width="100%"
          height={height}
          viewBox={`0 0 ${SVG_WIDTH} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Animation keyframes */}
          {shouldAnimate && (
            <style>{`
              @keyframes funnel-fade-in-${uid} {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 0.85; transform: scale(1); }
              }
            `}</style>
          )}

          {data.map((d, i) => {
            const widthRatio = d.value / maxValue;
            const nextWidthRatio =
              i < data.length - 1 ? data[i + 1].value / maxValue : widthRatio * 0.6;
            const topWidth = chartWidth * widthRatio;
            const bottomWidth = chartWidth * nextWidthRatio;
            const y = padding.top + i * segmentHeight + gap / 2;
            const h = segmentHeight - gap;
            const centerX = padding.left + chartWidth / 2;
            const segColor = segmentColors[i];
            const isHovered = hoveredIndex === i;
            const percentage = Math.round((d.value / firstValue) * 100);

            const x1 = centerX - topWidth / 2;
            const x2 = centerX + topWidth / 2;
            const x3 = centerX + bottomWidth / 2;
            const x4 = centerX - bottomWidth / 2;
            const points = `${x1},${y} ${x2},${y} ${x3},${y + h} ${x4},${y + h}`;

            return (
              <g key={`funnel-v-${i}`}>
                <polygon
                  data-testid={`funnel-segment-${i}`}
                  points={points}
                  fill={segColor}
                  opacity={isHovered ? 1 : 0.85}
                  style={{
                    transition: "opacity 0.2s",
                    ...(shouldAnimate
                      ? {
                          animation: `funnel-fade-in-${uid} 0.5s ease-out ${i * 0.08}s both`,
                        }
                      : {}),
                  }}
                  onMouseEnter={() => {
                    setHoveredIndex(i);
                    setTooltipPos({ x: centerX + topWidth / 2, y: y + h / 2 });
                  }}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleClick(i)}
                  className={onValueChange ? "cursor-pointer" : undefined}
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
                    {d.name}
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
                    style={{ pointerEvents: "none" }}
                  >
                    {showValues ? fmt(d.value) : ""}
                    {showValues && showPercentage ? " " : ""}
                    {showPercentage ? `(${percentage}%)` : ""}
                  </text>
                )}
              </g>
            );
          })}

          {/* Tooltip */}
          {showTooltip && hoveredIndex !== null && (
            <ChartTooltip
              active
              payload={tooltipPayload}
              label={tooltipLabel}
              x={tooltipPos.x}
              y={tooltipPos.y}
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
FunnelChart.displayName = "FunnelChart";

export { FunnelChart };
export type { FunnelChartProps, FunnelChartDataPoint };
