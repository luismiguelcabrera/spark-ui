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
  getAreaPathForCurve,
  prefersReducedMotion,
} from "./chart-utils";
import { ChartTooltip } from "./chart-tooltip";
import { ChartLegend } from "./chart-legend";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AreaChartType = "default" | "stacked" | "percent";
type AreaFill = "gradient" | "solid" | "none";

type AreaChartProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onAnimationEnd"
> & {
  /** Array of data objects */
  data: Record<string, unknown>[];
  /** Key used for the categorical (x) axis */
  index: string;
  /** Keys whose values are plotted as areas */
  categories: string[];
  /** Named or hex colors per category */
  colors?: ChartColor[];
  /** Chart height in viewBox units (default 300) */
  height?: number;
  /** Stacking mode (default "default") */
  type?: AreaChartType;
  /** Area fill style (default "gradient") */
  fill?: AreaFill;
  /** Path interpolation type (default "linear") */
  curveType?: CurveType;
  /** Connect through null/undefined values (default false) */
  connectNulls?: boolean;
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
  /** Animate area reveal on mount (default true) */
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

const AreaChart = forwardRef<HTMLDivElement, AreaChartProps>(
  (
    {
      data,
      index,
      categories,
      colors,
      height = 300,
      type = "default",
      fill = "gradient",
      curveType = "linear",
      connectNulls = false,
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
            aria-label={ariaLabel ?? "Empty area chart"}
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

    // ---- Labels and x positions ----
    const labels = data.map((d) => String(d[index] ?? ""));
    const xPositions = data.map(
      (_, i) =>
        PADDING.left + (i / Math.max(data.length - 1, 1)) * chartWidth
    );

    // ---- Raw values per category per data point ----
    const rawValues: Record<string, (number | null)[]> = {};
    for (const cat of visibleCategories) {
      rawValues[cat] = data.map((d) => {
        const v = d[cat];
        return v != null && typeof v === "number" ? v : null;
      });
    }

    // ---- Compute stacked values ----
    // stackedValues[catIdx][dataIdx] = cumulative value at this category level
    const isStacked = type === "stacked" || type === "percent";

    // For stacking, compute cumulative sums per data point
    const stackedCumulative: number[][] = []; // [catIdx][dataIdx]
    if (isStacked) {
      for (let ci = 0; ci < visibleCategories.length; ci++) {
        const cat = visibleCategories[ci];
        stackedCumulative[ci] = data.map((_, di) => {
          let sum = 0;
          for (let k = 0; k <= ci; k++) {
            const v = rawValues[visibleCategories[k]]?.[di];
            sum += Math.max(0, v ?? 0);
          }
          return sum;
        });
      }
    }

    // ---- Compute totals per data point for percent mode ----
    const totalsPerPoint: number[] = data.map((_, di) =>
      visibleCategories.reduce(
        (s, cat) => s + Math.max(0, rawValues[cat]?.[di] ?? 0),
        0
      )
    );

    // ---- Max value ----
    const maxVal = useMemo(() => {
      if (type === "percent") return 100;
      if (isStacked && stackedCumulative.length > 0) {
        return Math.max(
          ...stackedCumulative[stackedCumulative.length - 1],
          1
        );
      }
      let m = 0;
      for (const cat of visibleCategories) {
        for (const v of rawValues[cat] ?? []) {
          if (v != null && v > m) m = v;
        }
      }
      return Math.max(m, 1);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, type, visibleCategories.join(",")]);

    const niceMax = type === "percent" ? 100 : getNiceMax(maxVal);
    const gridLineValues = getGridLines(niceMax);

    // ---- Helper: value to y coordinate ----
    function valToY(val: number): number {
      return PADDING.top + chartHeight - (val / niceMax) * chartHeight;
    }

    // ---- Build series render data ----
    type SeriesRender = {
      cat: string;
      colorIdx: number;
      color: string;
      linePath: string;
      areaPath: string;
      points: { x: number; y: number; value: number | null; dataIdx: number }[];
    };

    const seriesRenderData: SeriesRender[] = visibleCategories.map(
      (cat, ci) => {
        const colorIdx = categories.indexOf(cat);
        const color = resolvedColors[colorIdx];

        // Compute y values depending on stacking
        const points = data.map((_, di) => {
          const rawVal = rawValues[cat]?.[di];
          if (rawVal == null) {
            return { x: xPositions[di], y: baseline, value: null, dataIdx: di };
          }

          let yVal: number;
          if (isStacked) {
            const cumVal = stackedCumulative[ci][di];
            if (type === "percent") {
              const total = totalsPerPoint[di];
              yVal = total > 0 ? (cumVal / total) * 100 : 0;
            } else {
              yVal = cumVal;
            }
          } else {
            yVal = rawVal;
          }

          return {
            x: xPositions[di],
            y: valToY(yVal),
            value: rawVal,
            dataIdx: di,
          };
        });

        // Build line path (only through non-null points)
        const validPoints = connectNulls
          ? points.filter((p) => p.value != null)
          : points;

        let linePath = "";
        let areaPath = "";

        if (connectNulls) {
          const pts = validPoints.map((p) => ({ x: p.x, y: p.y }));
          linePath = getPathForCurve(curveType, pts);

          // Area path: close to the bottom of this series
          if (isStacked && ci > 0) {
            // Bottom is the previous series' cumulative line
            areaPath = buildStackedAreaPath(pts, ci, curveType);
          } else {
            areaPath = getAreaPathForCurve(curveType, pts, baseline);
          }
        } else {
          // Split at nulls into segments
          const segments: Point[][] = [];
          let current: Point[] = [];
          for (const p of points) {
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

          linePath = segments
            .map((seg) => getPathForCurve(curveType, seg))
            .join(" ");

          if (isStacked && ci > 0) {
            areaPath = segments
              .map((seg) => buildStackedAreaPathSegment(seg, ci, curveType))
              .join(" ");
          } else {
            areaPath = segments
              .map((seg) => getAreaPathForCurve(curveType, seg, baseline))
              .join(" ");
          }
        }

        return { cat, colorIdx, color, linePath, areaPath, points };
      }
    );

    // Helper: build a stacked area path where the bottom is the previous series
    function buildStackedAreaPath(
      topPts: Point[],
      catIdx: number,
      curve: CurveType
    ): string {
      if (topPts.length === 0) return "";
      // Get bottom line (previous cumulative values at same x positions)
      const bottomPts = topPts
        .map((tp) => {
          // Find corresponding data index by x position
          const di = xPositions.findIndex((xp) => Math.abs(xp - tp.x) < 0.01);
          if (di === -1) return null;
          const prevCum = stackedCumulative[catIdx - 1]?.[di] ?? 0;
          let yVal: number;
          if (type === "percent") {
            const total = totalsPerPoint[di];
            yVal = total > 0 ? (prevCum / total) * 100 : 0;
          } else {
            yVal = prevCum;
          }
          return { x: tp.x, y: valToY(yVal) };
        })
        .filter(Boolean) as Point[];

      const topPath = getPathForCurve(curve, topPts);
      const bottomReversed = [...bottomPts].reverse();
      const bottomPath = getPathForCurve(curve, bottomReversed);

      // Connect: top line forward, then bottom line backward
      // Replace leading "M" of bottom path with "L"
      const bottomConnector = bottomPath.replace(/^M/, "L");
      return `${topPath} ${bottomConnector} Z`;
    }

    function buildStackedAreaPathSegment(
      topPts: Point[],
      catIdx: number,
      curve: CurveType
    ): string {
      return buildStackedAreaPath(topPts, catIdx, curve);
    }

    // ---- Reference lines ----
    function renderReferenceLines() {
      if (!referenceLines || referenceLines.length === 0) return null;
      return referenceLines.map((rl, ri) => {
        if (rl.y != null) {
          const yPos = valToY(rl.y);
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

    // ---- Tooltip payload ----
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

    // ---- Click ----
    function handlePointClick(dataIdx: number, cat: string) {
      if (!onValueChange) return;
      onValueChange({
        eventType: "area",
        categoryClicked: cat,
        ...data[dataIdx],
      });
    }

    // ---- Animation ----
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
          aria-label={ariaLabel ?? "Area chart"}
          width="100%"
          height={height}
          viewBox={`0 0 ${VIEW_BOX_W} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* ---- Gradient defs ---- */}
          {fill === "gradient" && (
            <defs>
              {visibleCategories.map((cat) => {
                const colorIdx = categories.indexOf(cat);
                const c = resolvedColors[colorIdx];
                return (
                  <linearGradient
                    key={`grad-${cat}`}
                    id={`area-grad-${uid}-${cat}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={c} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={c} stopOpacity="0.02" />
                  </linearGradient>
                );
              })}
            </defs>
          )}

          {/* ---- Grid ---- */}
          {showGrid &&
            gridLineValues.map((val, i) => {
              const y = valToY(val);
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
              {gridLineValues.map((val, i) => {
                const y = valToY(val);
                return (
                  <text
                    key={`ylabel-${i}`}
                    x={PADDING.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fill="#9ca3af"
                    fontSize="11"
                  >
                    {type === "percent" ? `${Math.round(val)}%` : fmt(val)}
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

          {/* ---- Area fills (render in reverse for stacked so first series is on top) ---- */}
          {(isStacked
            ? [...seriesRenderData].reverse()
            : seriesRenderData
          ).map((s) => {
            if (fill === "none") return null;
            let fillValue: string;
            if (fill === "gradient") {
              fillValue = `url(#area-grad-${uid}-${s.cat})`;
            } else {
              fillValue = s.color;
            }
            return (
              <path
                key={`area-${s.cat}`}
                data-testid={`area-fill-${s.cat}`}
                d={s.areaPath}
                fill={fillValue}
                opacity={
                  fill === "gradient"
                    ? mounted ? 1 : 0
                    : fill === "solid"
                      ? mounted ? 0.25 : 0
                      : 0
                }
                style={
                  noMotion
                    ? undefined
                    : { transition: "opacity 0.8s ease-out" }
                }
              />
            );
          })}

          {/* ---- Lines ---- */}
          {seriesRenderData.map((s) => (
            <path
              key={`line-${s.cat}`}
              data-testid={`area-line-${s.cat}`}
              d={s.linePath}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
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

          {/* ---- Data point dots (only on hover for area chart to avoid clutter) ---- */}
          {seriesRenderData.map((s) =>
            s.points.map((p) => {
              if (p.value == null) return null;
              const isHoveredCol = hoveredIdx === p.dataIdx;
              return (
                <g key={`dot-${s.cat}-${p.dataIdx}`}>
                  {/* Invisible hit area */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={12}
                    fill="transparent"
                    style={{
                      cursor: onValueChange ? "pointer" : undefined,
                    }}
                    onMouseEnter={() => setHoveredIdx(p.dataIdx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onClick={() => handlePointClick(p.dataIdx, s.cat)}
                  />
                  {isHoveredCol && (
                    <circle
                      data-testid={`area-dot-${s.cat}-${p.dataIdx}`}
                      cx={p.x}
                      cy={p.y}
                      r={4}
                      fill={s.color}
                      stroke="#fff"
                      strokeWidth={2}
                      style={{ pointerEvents: "none" }}
                    />
                  )}
                </g>
              );
            })
          )}

          {/* ---- Invisible hover columns ---- */}
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

AreaChart.displayName = "AreaChart";

export { AreaChart };
export type { AreaChartProps, AreaChartType, AreaFill };
