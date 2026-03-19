"use client";

import {
  forwardRef,
  useState,
  useEffect,
  useId,
  type HTMLAttributes,
} from "react";
import { cn } from "../../../lib/utils";
import type { ChartColor, ChartEventProps, TooltipProps } from "./chart-types";
import { resolveColors, resolveColor } from "./chart-colors";
import { ChartTooltip } from "./chart-tooltip";
import { ChartLegend } from "./chart-legend";
import { formatValue, prefersReducedMotion } from "./chart-utils";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type ScatterDataPoint = {
  x: number;
  y: number;
  /** Bubble diameter — overrides `dotSize` for this point */
  size?: number;
  /** Label shown in tooltip instead of coordinates */
  label?: string;
};

type ScatterSeries = {
  name: string;
  data: ScatterDataPoint[];
  color?: ChartColor;
};

type ScatterChartProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Named data series to plot */
  series: ScatterSeries[];
  /** Named or hex colors for series (overridden by per-series color) */
  colors?: ChartColor[];
  /** Chart height in pixels */
  height?: number;
  /** Show grid lines */
  showGrid?: boolean;
  /** Show a legend */
  showLegend?: boolean;
  /** Legend placement */
  legendPosition?: "top" | "bottom" | "left" | "right";
  /** Show tooltip on hover */
  showTooltip?: boolean;
  /** X-axis title */
  xLabel?: string;
  /** Y-axis title */
  yLabel?: string;
  /** Default dot diameter */
  dotSize?: number;
  /** Format values in tooltip */
  valueFormatter?: (value: number) => string;
  /** Custom tooltip component */
  customTooltip?: React.ComponentType<TooltipProps>;
  /** Callback when a point is clicked */
  onValueChange?: (value: ChartEventProps | null) => void;
  /** Animate on mount */
  animate?: boolean;
  /** Accessible label for the SVG */
  ariaLabel?: string;
  /** Additional CSS classes */
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*                                Constants                                   */
/* -------------------------------------------------------------------------- */

const PADDING = { top: 20, right: 20, bottom: 50, left: 60 };
const SVG_WIDTH = 500;

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

const ScatterChart = forwardRef<HTMLDivElement, ScatterChartProps>(
  (
    {
      series,
      colors,
      height = 300,
      showGrid = true,
      showLegend = false,
      legendPosition = "bottom",
      showTooltip = true,
      xLabel,
      yLabel,
      dotSize = 6,
      valueFormatter,
      customTooltip,
      onValueChange,
      animate = true,
      ariaLabel,
      className,
      ...props
    },
    ref
  ) => {
    const instanceId = useId();
    const shouldAnimate = animate && !prefersReducedMotion();
    const [mounted, setMounted] = useState(!shouldAnimate);
    const [hoveredPoint, setHoveredPoint] = useState<{
      seriesIndex: number;
      pointIndex: number;
    } | null>(null);
    const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

    useEffect(() => {
      if (shouldAnimate) {
        const timer = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(timer);
      }
    }, [shouldAnimate]);

    const resolvedColors = resolveColors(colors, series.length);

    // Per-series resolved color, respecting per-series color prop
    const seriesColors = series.map((s, i) =>
      s.color ? resolveColor(s.color) : resolvedColors[i]
    );

    /* ----------------------------- empty state ----------------------------- */

    const visibleSeries = series.filter((s) => !hiddenSeries.has(s.name));
    const allPoints = visibleSeries.flatMap((s) => s.data);

    if (!series || series.length === 0 || allPoints.length === 0) {
      return (
        <div
          ref={ref}
          className={cn(
            "w-full flex items-center justify-center text-gray-500",
            className
          )}
          style={{ height }}
          {...props}
        >
          <svg
            role="img"
            aria-label={ariaLabel || "Empty scatter chart"}
            width="100%"
            height={height}
            viewBox={`0 0 ${SVG_WIDTH} ${height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <text
              x={SVG_WIDTH / 2}
              y={height / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill="currentColor"
              fontSize="14"
            >
              No data available
            </text>
          </svg>
        </div>
      );
    }

    /* ------------------------------ scaling ------------------------------- */

    const xValues = allPoints.map((p) => p.x);
    const yValues = allPoints.map((p) => p.y);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    const xRange = xMax - xMin || 1;
    const yRange = yMax - yMin || 1;
    const xPad = xRange * 0.1;
    const yPad = yRange * 0.1;
    const xMinP = xMin - xPad;
    const xMaxP = xMax + xPad;
    const yMinP = yMin - yPad;
    const yMaxP = yMax + yPad;

    const chartWidth = SVG_WIDTH - PADDING.left - PADDING.right;
    const chartHeight = height - PADDING.top - PADDING.bottom;

    function scaleX(val: number): number {
      return PADDING.left + ((val - xMinP) / (xMaxP - xMinP)) * chartWidth;
    }
    function scaleY(val: number): number {
      return (
        PADDING.top +
        chartHeight -
        ((val - yMinP) / (yMaxP - yMinP)) * chartHeight
      );
    }

    const gridCount = 5;
    const xGridValues = Array.from(
      { length: gridCount + 1 },
      (_, i) => xMinP + (i / gridCount) * (xMaxP - xMinP)
    );
    const yGridValues = Array.from(
      { length: gridCount + 1 },
      (_, i) => yMinP + (i / gridCount) * (yMaxP - yMinP)
    );

    const fmt = valueFormatter || formatValue;

    /* -------------------- interaction handlers -------------------- */

    function handlePointClick(seriesName: string, point: ScatterDataPoint) {
      onValueChange?.({
        eventType: "dot",
        categoryClicked: seriesName,
        x: point.x,
        y: point.y,
        ...(point.label ? { label: point.label } : {}),
      });
    }

    function handleLegendToggle(name: string) {
      setHiddenSeries((prev) => {
        const next = new Set(prev);
        if (next.has(name)) {
          next.delete(name);
        } else {
          if (next.size < series.length - 1) {
            next.add(name);
          }
        }
        return next;
      });
    }

    /* ----------------------- tooltip state ----------------------- */

    const hoveredData =
      hoveredPoint !== null
        ? {
            series: series[hoveredPoint.seriesIndex],
            point:
              series[hoveredPoint.seriesIndex].data[hoveredPoint.pointIndex],
            color: seriesColors[hoveredPoint.seriesIndex],
          }
        : null;

    const tooltipPayload = hoveredData
      ? [
          {
            name: hoveredData.point.label || hoveredData.series.name,
            value: hoveredData.point.y,
            color: hoveredData.color,
          },
        ]
      : [];
    const tooltipLabel = hoveredData
      ? hoveredData.point.label ||
        `(${fmt(hoveredData.point.x)}, ${fmt(hoveredData.point.y)})`
      : "";
    const tooltipSvgX = hoveredData
      ? scaleX(hoveredData.point.x)
      : 0;
    const tooltipSvgY = hoveredData
      ? scaleY(hoveredData.point.y)
      : 0;

    /* ----------------------------- layout ------------------------------ */

    const isVerticalLegend =
      legendPosition === "left" || legendPosition === "right";
    const wrapperClass = cn(
      "inline-flex w-full",
      isVerticalLegend
        ? legendPosition === "left"
          ? "flex-row-reverse items-center gap-3"
          : "flex-row items-center gap-3"
        : legendPosition === "top"
          ? "flex-col-reverse gap-1"
          : "flex-col gap-1",
      className
    );

    const animId = instanceId.replace(/:/g, "");

    /* ----------------------------- render ------------------------------ */

    return (
      <div ref={ref} className={wrapperClass} {...props}>
        <svg
          role="img"
          aria-label={ariaLabel || "Scatter chart"}
          width="100%"
          height={height}
          viewBox={`0 0 ${SVG_WIDTH} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className="flex-1"
        >
          {/* Animation keyframes */}
          {shouldAnimate && (
            <defs>
              <style>
                {`
                  @keyframes scatter-pop-${animId} {
                    from { r: 0; opacity: 0; }
                    to   { opacity: 1; }
                  }
                `}
              </style>
            </defs>
          )}

          {/* Grid lines */}
          {showGrid && (
            <g>
              {yGridValues.map((val, i) => {
                const y = scaleY(val);
                return (
                  <line
                    key={`h-grid-${i}`}
                    x1={PADDING.left}
                    y1={y}
                    x2={SVG_WIDTH - PADDING.right}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeDasharray="4,4"
                  />
                );
              })}
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
            x2={SVG_WIDTH - PADDING.right}
            y2={PADDING.top + chartHeight}
            stroke="#d1d5db"
          />

          {/* Axis tick labels */}
          <g>
            {xGridValues.map((val, i) => (
              <text
                key={`x-tick-${i}`}
                x={scaleX(val)}
                y={PADDING.top + chartHeight + 16}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="10"
              >
                {fmt(val)}
              </text>
            ))}
            {yGridValues.map((val, i) => (
              <text
                key={`y-tick-${i}`}
                x={PADDING.left - 8}
                y={scaleY(val) + 4}
                textAnchor="end"
                fill="#9ca3af"
                fontSize="10"
              >
                {fmt(val)}
              </text>
            ))}
          </g>

          {/* Axis titles */}
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
          {series.map((s, si) => {
            if (hiddenSeries.has(s.name)) return null;
            const color = seriesColors[si];
            return s.data.map((point, pi) => {
              const px = scaleX(point.x);
              const py = scaleY(point.y);
              const r = point.size ? point.size / 2 : dotSize / 2;
              const isHovered =
                hoveredPoint?.seriesIndex === si &&
                hoveredPoint?.pointIndex === pi;
              const displayR = isHovered ? r * 1.4 : r;

              // Stagger animation delay per point
              const delay = shouldAnimate
                ? (si * s.data.length + pi) * 0.02
                : 0;

              return (
                <g key={`point-${si}-${pi}`}>
                  {/* Larger invisible hit area */}
                  <circle
                    cx={px}
                    cy={py}
                    r={Math.max(r + 4, 10)}
                    fill="transparent"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() =>
                      setHoveredPoint({ seriesIndex: si, pointIndex: pi })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                    onClick={() => handlePointClick(s.name, point)}
                  />
                  <circle
                    data-testid={`scatter-point-${si}-${pi}`}
                    cx={px}
                    cy={py}
                    r={mounted ? displayR : 0}
                    fill={color}
                    opacity={
                      mounted
                        ? isHovered
                          ? 1
                          : 0.75
                        : 0
                    }
                    style={{
                      transition: shouldAnimate
                        ? `r 0.3s ease ${delay}s, opacity 0.3s ease ${delay}s`
                        : "r 0.15s ease, opacity 0.2s ease",
                      cursor: "pointer",
                      pointerEvents: "none",
                    }}
                  />
                </g>
              );
            });
          })}

          {/* Tooltip */}
          {showTooltip && (
            <ChartTooltip
              active={hoveredPoint !== null}
              payload={tooltipPayload}
              label={tooltipLabel}
              x={tooltipSvgX}
              y={tooltipSvgY}
              viewBoxWidth={SVG_WIDTH}
              valueFormatter={valueFormatter}
              customTooltip={customTooltip}
            />
          )}
        </svg>

        {/* Legend */}
        {showLegend && (
          <ChartLegend
            entries={series.map((s, i) => ({
              name: s.name,
              color: seriesColors[i],
            }))}
            position={legendPosition}
            onToggle={handleLegendToggle}
            hiddenSeries={hiddenSeries}
          />
        )}
      </div>
    );
  }
);
ScatterChart.displayName = "ScatterChart";

export { ScatterChart };
export type { ScatterChartProps, ScatterSeries, ScatterDataPoint };
