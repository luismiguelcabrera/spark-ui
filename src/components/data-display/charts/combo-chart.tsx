"use client";

import { forwardRef, useState, useMemo, useEffect, useCallback, type HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";
import type { ChartColor, ChartEventProps, CurveType, ReferenceLine, TooltipProps } from "./chart-types";
import { resolveColors } from "./chart-colors";
import { ChartTooltip } from "./chart-tooltip";
import { ChartLegend } from "./chart-legend";
import {
  CHART_PADDING as PADDING,
  getNiceMax,
  getGridLines,
  formatValue,
  getPathForCurve,
  prefersReducedMotion,
} from "./chart-utils";

type ComboBarSeries = {
  /** Which data keys to render as bars */
  categories: string[];
  /** Bar color palette */
  colors?: ChartColor[];
  /** Stacking mode */
  type?: "default" | "stacked" | "percent";
  /** Value formatter for bar values */
  valueFormatter?: (value: number) => string;
  /** Left Y-axis label */
  yAxisLabel?: string;
};

type ComboLineSeries = {
  /** Which data keys to render as lines */
  categories: string[];
  /** Line color palette */
  colors?: ChartColor[];
  /** Curve interpolation type */
  curveType?: CurveType;
  /** Connect across null/undefined values */
  connectNulls?: boolean;
  /** Show data point dots */
  showDots?: boolean;
  /** Line stroke width */
  strokeWidth?: number;
  /** Value formatter for line values */
  valueFormatter?: (value: number) => string;
  /** Right Y-axis label (when biaxial) */
  yAxisLabel?: string;
};

type ComboChartProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  /** Array of data objects keyed by category names */
  data: Record<string, unknown>[];
  /** Key in data objects used as X-axis labels */
  index: string;
  /** Bar series configuration */
  barSeries: ComboBarSeries;
  /** Line series configuration */
  lineSeries: ComboLineSeries;
  /** Chart height in pixels */
  height?: number;
  /** Use independent Y-axes: bars left, lines right */
  enableBiaxial?: boolean;
  /** Show grid lines */
  showGrid?: boolean;
  /** Show X-axis */
  showXAxis?: boolean;
  /** Show legend */
  showLegend?: boolean;
  /** Show tooltip on hover */
  showTooltip?: boolean;
  /** Global value formatter (overridden by series-level formatters) */
  valueFormatter?: (value: number) => string;
  /** Custom tooltip component */
  customTooltip?: React.ComponentType<TooltipProps>;
  /** Click handler */
  onValueChange?: (value: ChartEventProps | null) => void;
  /** Reference lines */
  referenceLines?: ReferenceLine[];
  /** Animate on mount */
  animate?: boolean;
  /** X-axis label */
  xAxisLabel?: string;
  /** Accessible label for the chart */
  ariaLabel?: string;
  /** Additional CSS classes */
  className?: string;
};

const SVG_WIDTH = 500;

const ComboChart = forwardRef<HTMLDivElement, ComboChartProps>(
  (
    {
      data,
      index,
      barSeries,
      lineSeries,
      height = 300,
      enableBiaxial = false,
      showGrid = true,
      showXAxis = true,
      showLegend = false,
      showTooltip = true,
      valueFormatter: globalFormatter,
      customTooltip,
      onValueChange,
      referenceLines = [],
      animate = true,
      xAxisLabel,
      ariaLabel,
      className,
      ...props
    },
    ref
  ) => {
    const [mounted, setMounted] = useState(!animate);
    const [hoveredX, setHoveredX] = useState<number | null>(null);
    const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

    const shouldAnimate = animate && !prefersReducedMotion();

    useEffect(() => {
      if (shouldAnimate) {
        const timer = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(timer);
      }
    }, [shouldAnimate]);

    const handleClick = useCallback(
      (category: string, xIndex: number) => {
        if (!onValueChange) return;
        const xLabel = String(data[xIndex]?.[index] ?? "");
        onValueChange({
          eventType: "dataPoint",
          categoryClicked: category,
          xLabel,
          xIndex,
        });
      },
      [onValueChange, data, index]
    );

    const handleToggleSeries = useCallback((name: string) => {
      setHiddenSeries((prev) => {
        const next = new Set(prev);
        if (next.has(name)) {
          next.delete(name);
        } else {
          next.add(name);
        }
        return next;
      });
    }, []);

    // Resolve colors
    const barColors = useMemo(
      () => resolveColors(barSeries.colors, barSeries.categories.length),
      [barSeries.colors, barSeries.categories.length]
    );
    const lineColors = useMemo(
      () => resolveColors(lineSeries.colors, lineSeries.categories.length),
      [lineSeries.colors, lineSeries.categories.length]
    );

    // Empty state
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
            aria-label={ariaLabel || "Empty combo chart"}
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

    // Derive labels
    const labels = data.map((d) => String(d[index] ?? ""));
    const numPoints = labels.length;

    // Compute visible bar categories
    const visibleBarCats = barSeries.categories.filter((c) => !hiddenSeries.has(c));
    const visibleLineCats = lineSeries.categories.filter((c) => !hiddenSeries.has(c));

    // Compute max values for bar axis (left Y)
    const barStackType = barSeries.type || "default";
    const barMaxRaw = useMemo(() => {
      if (visibleBarCats.length === 0) return 1;
      if (barStackType === "percent") return 100;
      if (barStackType === "stacked") {
        return Math.max(
          ...data.map((d) =>
            visibleBarCats.reduce((sum, cat) => sum + (Number(d[cat]) || 0), 0)
          ),
          1
        );
      }
      return Math.max(
        ...data.flatMap((d) => visibleBarCats.map((cat) => Number(d[cat]) || 0)),
        1
      );
    }, [data, visibleBarCats, barStackType]);

    // Compute max values for line axis (right Y when biaxial, or shared)
    const lineMaxRaw = useMemo(() => {
      if (visibleLineCats.length === 0) return 1;
      return Math.max(
        ...data.flatMap((d) => visibleLineCats.map((cat) => Number(d[cat]) || 0)),
        1
      );
    }, [data, visibleLineCats]);

    // Unified or biaxial scales
    const barNiceMax = getNiceMax(barMaxRaw);
    const lineNiceMax = enableBiaxial ? getNiceMax(lineMaxRaw) : barNiceMax;
    const leftNiceMax = barNiceMax;
    const rightNiceMax = lineNiceMax;

    // If not biaxial, use a single unified max
    const unifiedMax = enableBiaxial
      ? leftNiceMax
      : getNiceMax(Math.max(barMaxRaw, lineMaxRaw));
    const leftMax = enableBiaxial ? leftNiceMax : unifiedMax;
    const rightMax = enableBiaxial ? rightNiceMax : unifiedMax;

    const leftGridLines = getGridLines(leftMax);

    // Layout
    const rightAxisWidth = enableBiaxial ? 40 : 0;
    const pad = {
      ...PADDING,
      right: PADDING.right + rightAxisWidth,
    };
    const chartWidth = SVG_WIDTH - pad.left - pad.right;
    const chartHeight = height - pad.top - pad.bottom;
    const baseline = pad.top + chartHeight;
    const slotWidth = numPoints > 0 ? chartWidth / numPoints : 0;

    // Bar geometry
    const barCount = visibleBarCats.length;
    const totalBarGroupWidth = slotWidth * 0.6;
    const singleBarWidth = barCount > 0 ? totalBarGroupWidth / barCount : 0;

    // Formatters
    const barFmt = barSeries.valueFormatter || globalFormatter || formatValue;
    const lineFmt = lineSeries.valueFormatter || globalFormatter || formatValue;

    // Build legend entries
    const legendEntries = [
      ...barSeries.categories.map((cat, i) => ({
        name: cat,
        color: barColors[i],
      })),
      ...lineSeries.categories.map((cat, i) => ({
        name: cat,
        color: lineColors[i],
      })),
    ];

    // Line curve settings
    const curveType = lineSeries.curveType || "linear";
    const connectNulls = lineSeries.connectNulls ?? false;
    const showDots = lineSeries.showDots ?? true;
    const lineStrokeWidth = lineSeries.strokeWidth ?? 2;

    // Build tooltip payload for hovered X position
    const tooltipPayload = useMemo(() => {
      if (hoveredX === null) return [];
      const d = data[hoveredX];
      if (!d) return [];
      const entries: { name: string; value: number; color: string }[] = [];

      visibleBarCats.forEach((cat, i) => {
        const val = Number(d[cat]) || 0;
        entries.push({ name: cat, value: val, color: barColors[barSeries.categories.indexOf(cat)] });
      });
      visibleLineCats.forEach((cat) => {
        const val = Number(d[cat]) || 0;
        entries.push({ name: cat, value: val, color: lineColors[lineSeries.categories.indexOf(cat)] });
      });

      return entries;
    }, [hoveredX, data, visibleBarCats, visibleLineCats, barColors, lineColors, barSeries.categories, lineSeries.categories]);

    const totalHeight = showLegend ? height + 40 : height;

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <svg
          role="img"
          aria-label={ariaLabel || "Combo chart"}
          width="100%"
          height={totalHeight}
          viewBox={`0 0 ${SVG_WIDTH} ${totalHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid */}
          {showGrid &&
            leftGridLines.map((val, i) => {
              const y = pad.top + chartHeight - (val / leftMax) * chartHeight;
              return (
                <g key={`grid-${i}`}>
                  <line
                    x1={pad.left}
                    y1={y}
                    x2={pad.left + chartWidth}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeDasharray="4,4"
                  />
                  <text x={pad.left - 8} y={y + 4} textAnchor="end" fill="#9ca3af" fontSize="11">
                    {barFmt(val)}
                  </text>
                </g>
              );
            })}

          {/* Right Y-axis labels (biaxial) */}
          {enableBiaxial &&
            getGridLines(rightMax).map((val, i) => {
              const y = pad.top + chartHeight - (val / rightMax) * chartHeight;
              return (
                <text
                  key={`right-grid-${i}`}
                  x={pad.left + chartWidth + 8}
                  y={y + 4}
                  textAnchor="start"
                  fill="#9ca3af"
                  fontSize="11"
                >
                  {lineFmt(val)}
                </text>
              );
            })}

          {/* Y axes */}
          <line x1={pad.left} y1={pad.top} x2={pad.left} y2={baseline} stroke="#d1d5db" />
          {enableBiaxial && (
            <line
              x1={pad.left + chartWidth}
              y1={pad.top}
              x2={pad.left + chartWidth}
              y2={baseline}
              stroke="#d1d5db"
            />
          )}

          {/* X axis */}
          <line x1={pad.left} y1={baseline} x2={pad.left + chartWidth} y2={baseline} stroke="#d1d5db" />

          {/* Y-axis labels */}
          {barSeries.yAxisLabel && (
            <text
              x={12}
              y={pad.top + chartHeight / 2}
              textAnchor="middle"
              fill="#6b7280"
              fontSize="11"
              transform={`rotate(-90, 12, ${pad.top + chartHeight / 2})`}
            >
              {barSeries.yAxisLabel}
            </text>
          )}
          {enableBiaxial && lineSeries.yAxisLabel && (
            <text
              x={SVG_WIDTH - 8}
              y={pad.top + chartHeight / 2}
              textAnchor="middle"
              fill="#6b7280"
              fontSize="11"
              transform={`rotate(90, ${SVG_WIDTH - 8}, ${pad.top + chartHeight / 2})`}
            >
              {lineSeries.yAxisLabel}
            </text>
          )}

          {/* X-axis labels */}
          {showXAxis &&
            labels.map((lbl, i) => (
              <text
                key={`xlabel-${i}`}
                x={pad.left + (i + 0.5) * slotWidth}
                y={baseline + 16}
                textAnchor="middle"
                fill="#6b7280"
                fontSize="11"
              >
                {lbl.length > 8 ? `${lbl.slice(0, 7)}...` : lbl}
              </text>
            ))}

          {/* X-axis label */}
          {xAxisLabel && (
            <text
              x={pad.left + chartWidth / 2}
              y={baseline + 32}
              textAnchor="middle"
              fill="#6b7280"
              fontSize="11"
            >
              {xAxisLabel}
            </text>
          )}

          {/* ── Bar series ── */}
          {visibleBarCats.map((cat, barIdx) => {
            const colorIdx = barSeries.categories.indexOf(cat);
            const c = barColors[colorIdx];

            return (
              <g key={`bar-series-${cat}`}>
                {data.map((d, pi) => {
                  const rawVal = Number(d[cat]) || 0;
                  let barH: number;
                  let barY: number;

                  if (barStackType === "stacked" || barStackType === "percent") {
                    // Compute stack offset
                    let stackBelow = 0;
                    let totalForPercent = 0;
                    for (let ci = 0; ci < barIdx; ci++) {
                      const prevCat = visibleBarCats[ci];
                      stackBelow += Number(d[prevCat]) || 0;
                    }
                    if (barStackType === "percent") {
                      totalForPercent = visibleBarCats.reduce(
                        (sum, c2) => sum + (Number(d[c2]) || 0),
                        0
                      );
                      const pctBelow = totalForPercent > 0 ? (stackBelow / totalForPercent) * 100 : 0;
                      const pctVal = totalForPercent > 0 ? (rawVal / totalForPercent) * 100 : 0;
                      barH = mounted ? (pctVal / leftMax) * chartHeight : 0;
                      barY = pad.top + chartHeight - (pctBelow / leftMax) * chartHeight - barH;
                    } else {
                      barH = mounted ? (rawVal / leftMax) * chartHeight : 0;
                      barY =
                        pad.top + chartHeight - (stackBelow / leftMax) * chartHeight - barH;
                    }

                    // For stacked: full-width bars
                    const stackBarWidth = totalBarGroupWidth;
                    const sx = pad.left + pi * slotWidth + (slotWidth - stackBarWidth) / 2;
                    return (
                      <rect
                        key={`bar-${cat}-${pi}`}
                        data-testid={`combo-bar-${colorIdx}-${pi}`}
                        x={sx}
                        y={barY}
                        width={Math.max(0, stackBarWidth - 2)}
                        height={Math.max(0, barH)}
                        fill={c}
                        opacity={hoveredX === pi ? 1 : 0.85}
                        rx={2}
                        style={{
                          transition: shouldAnimate
                            ? "height 0.6s ease-out, y 0.6s ease-out, opacity 0.2s"
                            : "opacity 0.2s",
                        }}
                        onClick={() => handleClick(cat, pi)}
                        className={onValueChange ? "cursor-pointer" : undefined}
                      />
                    );
                  }

                  // Default (grouped)
                  barH = mounted ? (rawVal / leftMax) * chartHeight : 0;
                  barY = pad.top + chartHeight - barH;
                  const groupStart = pad.left + pi * slotWidth + (slotWidth - totalBarGroupWidth) / 2;
                  const x = groupStart + barIdx * singleBarWidth;

                  return (
                    <rect
                      key={`bar-${cat}-${pi}`}
                      data-testid={`combo-bar-${colorIdx}-${pi}`}
                      x={x}
                      y={barY}
                      width={Math.max(0, singleBarWidth - 2)}
                      height={Math.max(0, barH)}
                      fill={c}
                      opacity={hoveredX === pi ? 1 : 0.85}
                      rx={2}
                      style={{
                        transition: shouldAnimate
                          ? "height 0.6s ease-out, y 0.6s ease-out, opacity 0.2s"
                          : "opacity 0.2s",
                      }}
                      onClick={() => handleClick(cat, pi)}
                      className={onValueChange ? "cursor-pointer" : undefined}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* ── Line series ── */}
          {visibleLineCats.map((cat) => {
            const colorIdx = lineSeries.categories.indexOf(cat);
            const c = lineColors[colorIdx];
            const useMax = enableBiaxial ? rightMax : leftMax;

            // Build points, handling nulls
            const allPoints: ({ x: number; y: number; value: number } | null)[] = data.map(
              (d, i) => {
                const rawVal = d[cat];
                if (rawVal == null || rawVal === "") {
                  return connectNulls ? null : null;
                }
                const val = Number(rawVal) || 0;
                return {
                  x: pad.left + (i + 0.5) * slotWidth,
                  y: pad.top + chartHeight - (val / useMax) * chartHeight,
                  value: val,
                };
              }
            );

            // Build path segments (split on nulls unless connectNulls)
            let segments: { x: number; y: number }[][] = [];
            if (connectNulls) {
              const pts = allPoints.filter((p): p is { x: number; y: number; value: number } => p !== null);
              if (pts.length > 0) segments = [pts];
            } else {
              let current: { x: number; y: number }[] = [];
              allPoints.forEach((p) => {
                if (p) {
                  current.push(p);
                } else if (current.length > 0) {
                  segments.push(current);
                  current = [];
                }
              });
              if (current.length > 0) segments.push(current);
            }

            return (
              <g key={`line-series-${cat}`}>
                {segments.map((seg, si) => (
                  <path
                    key={`line-${cat}-${si}`}
                    data-testid={`combo-line-${colorIdx}`}
                    d={getPathForCurve(curveType, seg)}
                    fill="none"
                    stroke={c}
                    strokeWidth={lineStrokeWidth}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                ))}
                {showDots &&
                  allPoints.map((p, pi) => {
                    if (!p) return null;
                    const isHovered = hoveredX === pi;
                    return (
                      <circle
                        key={`dot-${cat}-${pi}`}
                        data-testid={`combo-dot-${colorIdx}-${pi}`}
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 5 : 3.5}
                        fill={isHovered ? c : "#fff"}
                        stroke={c}
                        strokeWidth={2}
                        style={{ transition: "r 0.15s ease" }}
                        onClick={() => handleClick(cat, pi)}
                        className={onValueChange ? "cursor-pointer" : undefined}
                      />
                    );
                  })}
              </g>
            );
          })}

          {/* ── Reference lines ── */}
          {referenceLines.map((rl, ri) => {
            if (rl.y != null) {
              const y = pad.top + chartHeight - (rl.y / leftMax) * chartHeight;
              return (
                <g key={`ref-${ri}`}>
                  <line
                    x1={pad.left}
                    y1={y}
                    x2={pad.left + chartWidth}
                    y2={y}
                    stroke={rl.color || "#ef4444"}
                    strokeDasharray={rl.strokeDasharray || "6,3"}
                    strokeWidth={1.5}
                  />
                  {rl.label && (
                    <text x={pad.left + chartWidth + 4} y={y + 4} fill={rl.color || "#ef4444"} fontSize="10">
                      {rl.label}
                    </text>
                  )}
                </g>
              );
            }
            if (rl.x != null) {
              const xIdx = labels.indexOf(String(rl.x));
              if (xIdx < 0) return null;
              const x = pad.left + (xIdx + 0.5) * slotWidth;
              return (
                <g key={`ref-${ri}`}>
                  <line
                    x1={x}
                    y1={pad.top}
                    x2={x}
                    y2={baseline}
                    stroke={rl.color || "#ef4444"}
                    strokeDasharray={rl.strokeDasharray || "6,3"}
                    strokeWidth={1.5}
                  />
                  {rl.label && (
                    <text x={x + 4} y={pad.top - 4} fill={rl.color || "#ef4444"} fontSize="10">
                      {rl.label}
                    </text>
                  )}
                </g>
              );
            }
            return null;
          })}

          {/* ── Hover interaction: invisible columns per X slot ── */}
          {labels.map((_, i) => {
            const x = pad.left + i * slotWidth;
            return (
              <rect
                key={`hover-${i}`}
                x={x}
                y={pad.top}
                width={slotWidth}
                height={chartHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredX(i)}
                onMouseLeave={() => setHoveredX(null)}
              />
            );
          })}

          {/* ── Crosshair + tooltip ── */}
          {hoveredX !== null && (
            <g>
              <line
                x1={pad.left + (hoveredX + 0.5) * slotWidth}
                y1={pad.top}
                x2={pad.left + (hoveredX + 0.5) * slotWidth}
                y2={baseline}
                stroke="#9ca3af"
                strokeDasharray="3,3"
                strokeWidth={1}
              />

              {showTooltip && tooltipPayload.length > 0 && (
                <ChartTooltip
                  active
                  payload={tooltipPayload}
                  label={labels[hoveredX] || ""}
                  x={pad.left + (hoveredX + 0.5) * slotWidth}
                  y={pad.top + 10}
                  viewBoxWidth={SVG_WIDTH}
                  valueFormatter={globalFormatter}
                  customTooltip={customTooltip}
                />
              )}
            </g>
          )}
        </svg>

        {/* Legend (HTML-based) */}
        {showLegend && (
          <ChartLegend
            entries={legendEntries}
            position="bottom"
            onToggle={handleToggleSeries}
            hiddenSeries={hiddenSeries}
          />
        )}
      </div>
    );
  }
);
ComboChart.displayName = "ComboChart";

export { ComboChart };
export type { ComboChartProps, ComboBarSeries, ComboLineSeries };
