"use client";

import {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useId,
  useMemo,
  type HTMLAttributes,
} from "react";
import { cn } from "../../../lib/utils";
import type {
  ChartColor,
  TooltipProps,
  ChartEventProps,
  ReferenceLine,
  CurveType,
} from "./chart-types";
import { resolveColors } from "./chart-colors";
import {
  CHART_PADDING as PADDING,
  getNiceMax,
  getGridLines,
  formatValue,
  getPathForCurve,
  prefersReducedMotion,
} from "./chart-utils";
import { ChartTooltip } from "./chart-tooltip";
import { ChartLegend } from "./chart-legend";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type LineChartProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onAnimationEnd"
> & {
  /** Array of data objects */
  data: Record<string, unknown>[];
  /** Key used for the categorical (x) axis */
  index: string;
  /** Keys whose values are plotted as lines */
  categories: string[];
  /** Named or hex colors per category */
  colors?: ChartColor[];
  /** Chart height in viewBox units (default 300) */
  height?: number;
  /** Path interpolation type (default "linear") */
  curveType?: CurveType;
  /** Connect through null/undefined values (default false) */
  connectNulls?: boolean;
  /** Show data point dots (default true) */
  showDots?: boolean;
  /** Line stroke width (default 2) */
  strokeWidth?: number;
  /** Show grid lines (default true) */
  showGrid?: boolean;
  /** Show x-axis (default true) */
  showXAxis?: boolean;
  /** Show y-axis (default true) */
  showYAxis?: boolean;
  /** Show legend below chart (default false) */
  showLegend?: boolean;
  /** Show tooltip on hover (default true) */
  showTooltip?: boolean;
  /** Custom value formatter */
  valueFormatter?: (value: number) => string;
  /** Custom tooltip component */
  customTooltip?: React.ComponentType<TooltipProps>;
  /** Click handler for data points */
  onValueChange?: (value: ChartEventProps | null) => void;
  /** Horizontal / vertical reference lines */
  referenceLines?: ReferenceLine[];
  /** Animate line draw on mount (default true) */
  animate?: boolean;
  /** Label below x-axis */
  xAxisLabel?: string;
  /** Label beside y-axis */
  yAxisLabel?: string;
  /** Accessible label for the SVG */
  ariaLabel?: string;
  /** Additional CSS classes */
  className?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const VIEW_BOX_W = 500;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Point = { x: number; y: number };

function truncateLabel(label: string, max = 8): string {
  const s = String(label ?? "");
  return s.length > max ? `${s.slice(0, max - 1)}\u2026` : s;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const LineChart = forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      data,
      index,
      categories,
      colors,
      height = 300,
      curveType = "linear",
      connectNulls = false,
      showDots = true,
      strokeWidth = 2,
      showGrid = true,
      showXAxis = true,
      showYAxis = true,
      showLegend = false,
      showTooltip = true,
      valueFormatter,
      customTooltip,
      onValueChange,
      referenceLines,
      animate = true,
      xAxisLabel,
      yAxisLabel,
      ariaLabel,
      className,
      ...props
    },
    ref
  ) => {
    const uid = useId();

    // ---- State ----
    const [mounted, setMounted] = useState(!animate);
    const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    // ---- Mount animation ----
    useEffect(() => {
      if (animate && !prefersReducedMotion()) {
        const timer = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(timer);
      }
      setMounted(true);
    }, [animate]);

    // ---- Legend toggle ----
    const handleLegendToggle = useCallback((name: string) => {
      setHiddenSeries((prev) => {
        const next = new Set(prev);
        if (next.has(name)) next.delete(name);
        else next.add(name);
        return next;
      });
    }, []);

    // ---- Derived ----
    const resolvedColors = resolveColors(colors, categories.length);
    const visibleCategories = categories.filter((c) => !hiddenSeries.has(c));
    const fmt = valueFormatter ?? formatValue;
    const noMotion = prefersReducedMotion();

    // ---- Empty state ----
    if (!data || data.length === 0) {
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
            aria-label={ariaLabel ?? "Empty line chart"}
            width="100%"
            height={height}
            viewBox={`0 0 ${VIEW_BOX_W} ${height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <text
              x={VIEW_BOX_W / 2}
              y={height / 2}
              textAnchor="middle"
              fill="currentColor"
              fontSize="14"
            >
              No data available
            </text>
          </svg>
        </div>
      );
    }

    // ---- Layout ----
    const chartWidth = VIEW_BOX_W - PADDING.left - PADDING.right;
    const chartHeight = height - PADDING.top - PADDING.bottom;
    const baseline = PADDING.top + chartHeight;

    // ---- Compute per-category values ----
    const labels = data.map((d) => String(d[index] ?? ""));

    // Max value across visible series (ignoring nulls)
    const maxVal = useMemo(() => {
      let m = 0;
      for (const d of data) {
        for (const cat of visibleCategories) {
          const v = d[cat];
          if (v != null && typeof v === "number" && v > m) m = v;
        }
      }
      return Math.max(m, 1);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, visibleCategories.join(",")]);

    const niceMax = getNiceMax(maxVal);
    const gridLines = getGridLines(niceMax);

    // X positions per data point
    const xPositions = data.map(
      (_, i) =>
        PADDING.left + (i / Math.max(data.length - 1, 1)) * chartWidth
    );

    // ---- Build paths and points per visible category ----
    type SeriesData = {
      cat: string;
      colorIdx: number;
      color: string;
      path: string;
      points: (Point & { value: number | null; dataIdx: number })[];
    };

    const seriesData: SeriesData[] = visibleCategories.map((cat) => {
      const colorIdx = categories.indexOf(cat);
      const color = resolvedColors[colorIdx];

      // Build all points, handling nulls
      const allPoints: (Point & { value: number | null; dataIdx: number })[] =
        data.map((d, i) => {
          const raw = d[cat];
          const isNull = raw == null || typeof raw !== "number";
          const val = isNull ? null : (raw as number);
          return {
            x: xPositions[i],
            y: val != null ? PADDING.top + chartHeight - (val / niceMax) * chartHeight : baseline,
            value: val,
            dataIdx: i,
          };
        });

      // Build path segments
      let path = "";
      if (connectNulls) {
        // Filter out null points, draw one continuous path
        const validPts = allPoints.filter((p) => p.value != null);
        path = getPathForCurve(
          curveType,
          validPts.map((p) => ({ x: p.x, y: p.y }))
        );
      } else {
        // Split into segments at nulls
        const segments: Point[][] = [];
        let current: Point[] = [];
        for (const p of allPoints) {
          if (p.value != null) {
            current.push({ x: p.x, y: p.y });
          } else {
            if (current.length > 0) {
              segments.push(current);
              current = [];
            }
          }
        }
        if (current.length > 0) segments.push(current);

        path = segments
          .map((seg) => getPathForCurve(curveType, seg))
          .join(" ");
      }

      return { cat, colorIdx, color, path, points: allPoints };
    });

    // ---- Reference lines ----
    function renderReferenceLines() {
      if (!referenceLines || referenceLines.length === 0) return null;
      return referenceLines.map((rl, ri) => {
        if (rl.y != null) {
          const yPos =
            PADDING.top + chartHeight - (rl.y / niceMax) * chartHeight;
          return (
            <g key={`ref-${ri}`}>
              <line
                x1={PADDING.left}
                y1={yPos}
                x2={VIEW_BOX_W - PADDING.right}
                y2={yPos}
                stroke={rl.color ?? "#ef4444"}
                strokeDasharray={rl.strokeDasharray ?? "6 3"}
                strokeWidth={1.5}
              />
              {rl.label && (
                <text
                  x={VIEW_BOX_W - PADDING.right + 4}
                  y={yPos + 4}
                  fill={rl.color ?? "#ef4444"}
                  fontSize="10"
                  fontWeight="500"
                >
                  {rl.label}
                </text>
              )}
            </g>
          );
        }
        if (rl.x != null) {
          const gIdx = labels.indexOf(String(rl.x));
          if (gIdx === -1) return null;
          const xPos = xPositions[gIdx];
          return (
            <g key={`ref-${ri}`}>
              <line
                x1={xPos}
                y1={PADDING.top}
                x2={xPos}
                y2={baseline}
                stroke={rl.color ?? "#ef4444"}
                strokeDasharray={rl.strokeDasharray ?? "6 3"}
                strokeWidth={1.5}
              />
              {rl.label && (
                <text
                  x={xPos}
                  y={PADDING.top - 6}
                  textAnchor="middle"
                  fill={rl.color ?? "#ef4444"}
                  fontSize="10"
                  fontWeight="500"
                >
                  {rl.label}
                </text>
              )}
            </g>
          );
        }
        return null;
      });
    }

    // ---- Tooltip payload for a given data index ----
    function getTooltipPayload(dataIdx: number) {
      return visibleCategories
        .map((cat) => {
          const colorIdx = categories.indexOf(cat);
          const raw = data[dataIdx][cat];
          const val = typeof raw === "number" ? raw : 0;
          return {
            name: cat,
            value: val,
            color: resolvedColors[colorIdx],
          };
        })
        .filter((e) => data[dataIdx][e.name] != null);
    }

    // ---- Click handler ----
    function handlePointClick(dataIdx: number, cat: string) {
      if (!onValueChange) return;
      onValueChange({
        eventType: "dot",
        categoryClicked: cat,
        ...data[dataIdx],
      });
    }

    // ---- Animation: stroke-dashoffset technique ----
    // We estimate a generous path length for the animation
    const estimatedPathLength = chartWidth + chartHeight;

    // Legend entries
    const legendEntries = categories.map((cat, i) => ({
      name: cat,
      color: resolvedColors[i],
    }));

    // ---- Render ----
    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <svg
          role="img"
          aria-label={ariaLabel ?? "Line chart"}
          width="100%"
          height={height}
          viewBox={`0 0 ${VIEW_BOX_W} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* ---- Grid ---- */}
          {showGrid &&
            gridLines.map((val, i) => {
              const y =
                PADDING.top + chartHeight - (val / niceMax) * chartHeight;
              return (
                <line
                  key={`grid-${i}`}
                  x1={PADDING.left}
                  y1={y}
                  x2={VIEW_BOX_W - PADDING.right}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeDasharray="4 4"
                />
              );
            })}

          {/* ---- Y axis ---- */}
          {showYAxis && (
            <>
              <line
                x1={PADDING.left}
                y1={PADDING.top}
                x2={PADDING.left}
                y2={baseline}
                stroke="#d1d5db"
              />
              {gridLines.map((val, i) => {
                const y =
                  PADDING.top + chartHeight - (val / niceMax) * chartHeight;
                return (
                  <text
                    key={`ylabel-${i}`}
                    x={PADDING.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fill="#9ca3af"
                    fontSize="11"
                  >
                    {fmt(val)}
                  </text>
                );
              })}
              {yAxisLabel && (
                <text
                  x={12}
                  y={PADDING.top + chartHeight / 2}
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize="11"
                  transform={`rotate(-90, 12, ${PADDING.top + chartHeight / 2})`}
                >
                  {yAxisLabel}
                </text>
              )}
            </>
          )}

          {/* ---- X axis ---- */}
          {showXAxis && (
            <>
              <line
                x1={PADDING.left}
                y1={baseline}
                x2={VIEW_BOX_W - PADDING.right}
                y2={baseline}
                stroke="#d1d5db"
              />
              {labels.map((lbl, i) => (
                <text
                  key={`xlabel-${i}`}
                  x={xPositions[i]}
                  y={baseline + 16}
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize="11"
                >
                  {truncateLabel(lbl)}
                </text>
              ))}
              {xAxisLabel && (
                <text
                  x={PADDING.left + chartWidth / 2}
                  y={baseline + 32}
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize="11"
                >
                  {xAxisLabel}
                </text>
              )}
            </>
          )}

          {/* ---- Reference lines ---- */}
          {renderReferenceLines()}

          {/* ---- Lines ---- */}
          {seriesData.map((s) => (
            <path
              key={`line-${s.cat}`}
              data-testid={`line-${s.cat}`}
              d={s.path}
              fill="none"
              stroke={s.color}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
              style={
                !noMotion && animate
                  ? {
                      strokeDasharray: estimatedPathLength,
                      strokeDashoffset: mounted ? 0 : estimatedPathLength,
                      transition: "stroke-dashoffset 1s ease-out",
                    }
                  : undefined
              }
            />
          ))}

          {/* ---- Crosshair on hover ---- */}
          {hoveredIdx != null && showTooltip && (
            <line
              x1={xPositions[hoveredIdx]}
              y1={PADDING.top}
              x2={xPositions[hoveredIdx]}
              y2={baseline}
              stroke="#9ca3af"
              strokeWidth={1}
              strokeDasharray="4 3"
              style={{ pointerEvents: "none" }}
            />
          )}

          {/* ---- Data point dots ---- */}
          {seriesData.map((s) =>
            s.points.map((p) => {
              if (p.value == null) return null;
              const isHoveredCol = hoveredIdx === p.dataIdx;
              return (
                <g key={`dot-${s.cat}-${p.dataIdx}`}>
                  {/* Larger invisible hit area */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={12}
                    fill="transparent"
                    style={{ cursor: onValueChange ? "pointer" : undefined }}
                    onMouseEnter={() => setHoveredIdx(p.dataIdx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onClick={() => handlePointClick(p.dataIdx, s.cat)}
                  />
                  {showDots && (
                    <circle
                      data-testid={`dot-${s.cat}-${p.dataIdx}`}
                      cx={p.x}
                      cy={p.y}
                      r={isHoveredCol ? 5 : 3.5}
                      fill={isHoveredCol ? s.color : "#fff"}
                      stroke={s.color}
                      strokeWidth={2}
                      style={{
                        transition: noMotion ? undefined : "r 0.15s ease",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </g>
              );
            })
          )}

          {/* ---- Invisible hover columns for axis tooltip ---- */}
          {showTooltip &&
            data.map((_, i) => {
              const colWidth =
                data.length > 1
                  ? chartWidth / (data.length - 1)
                  : chartWidth;
              const x =
                data.length > 1
                  ? xPositions[i] - colWidth / 2
                  : PADDING.left;
              return (
                <rect
                  key={`hover-col-${i}`}
                  x={Math.max(PADDING.left, x)}
                  y={PADDING.top}
                  width={Math.min(
                    colWidth,
                    VIEW_BOX_W - PADDING.right - Math.max(PADDING.left, x)
                  )}
                  height={chartHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{ pointerEvents: "all" }}
                />
              );
            })}

          {/* ---- Tooltip ---- */}
          {showTooltip && hoveredIdx != null && (
            <ChartTooltip
              active
              payload={getTooltipPayload(hoveredIdx)}
              label={labels[hoveredIdx]}
              x={xPositions[hoveredIdx]}
              y={PADDING.top + chartHeight / 3}
              viewBoxWidth={VIEW_BOX_W}
              valueFormatter={valueFormatter}
              customTooltip={customTooltip}
            />
          )}
        </svg>

        {/* ---- Legend ---- */}
        {showLegend && (
          <ChartLegend
            entries={legendEntries}
            onToggle={handleLegendToggle}
            hiddenSeries={hiddenSeries}
          />
        )}
      </div>
    );
  }
);

LineChart.displayName = "LineChart";

export { LineChart };
export type { LineChartProps };
