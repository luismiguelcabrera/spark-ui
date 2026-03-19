"use client";

import {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useId,
  type HTMLAttributes,
} from "react";
import { cn } from "../../../lib/utils";
import type {
  ChartColor,
  TooltipProps,
  ChartEventProps,
  ReferenceLine,
} from "./chart-types";
import { resolveColors } from "./chart-colors";
import {
  CHART_PADDING as PADDING,
  getNiceMax,
  getGridLines,
  formatValue,
  prefersReducedMotion,
} from "./chart-utils";
import { ChartTooltip } from "./chart-tooltip";
import { ChartLegend } from "./chart-legend";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BarChartType = "default" | "stacked" | "percent";
type BarChartLayout = "vertical" | "horizontal";

type BarChartProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onAnimationEnd"
> & {
  /** Array of data objects */
  data: Record<string, unknown>[];
  /** Key used for the categorical (x) axis */
  index: string;
  /** Keys whose values are plotted as bars */
  categories: string[];
  /** Named or hex colors per category */
  colors?: ChartColor[];
  /** Chart height in viewBox units (default 300) */
  height?: number;
  /** Grouping mode (default "default") */
  type?: BarChartType;
  /** Bar orientation (default "vertical") */
  layout?: BarChartLayout;
  /** Gap between bar groups as CSS-like value (default "10%") */
  barCategoryGap?: string | number;
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
  /** Show value labels on bars (default false) */
  showDataLabels?: boolean;
  /** Custom value formatter */
  valueFormatter?: (value: number) => string;
  /** Custom tooltip component */
  customTooltip?: React.ComponentType<TooltipProps>;
  /** Click handler for individual bars */
  onValueChange?: (value: ChartEventProps | null) => void;
  /** Horizontal / vertical reference lines */
  referenceLines?: ReferenceLine[];
  /** Animate bars on mount (default true) */
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
// Helpers
// ---------------------------------------------------------------------------

const VIEW_BOX_W = 500;

/** Parse "10%" relative to a total, or return an absolute number. */
function resolveGap(gap: string | number, total: number): number {
  if (typeof gap === "number") return gap;
  if (gap.endsWith("%")) return (parseFloat(gap) / 100) * total;
  return parseFloat(gap) || 0;
}

/** Truncate a label string for axis display */
function truncateLabel(label: string, max = 8): string {
  const s = String(label ?? "");
  return s.length > max ? `${s.slice(0, max - 1)}\u2026` : s;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      data,
      index,
      categories,
      colors,
      height = 300,
      type = "default",
      layout = "vertical",
      barCategoryGap = "10%",
      showGrid = true,
      showXAxis = true,
      showYAxis = true,
      showLegend = false,
      showTooltip = true,
      showDataLabels = false,
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
    // ---- IDs (unique per instance for SVG defs) ----
    const uid = useId();
    const clipId = `bar-clip-${uid}`;

    // ---- State ----
    const [mounted, setMounted] = useState(!animate);
    const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());
    const [hoveredGroupIdx, setHoveredGroupIdx] = useState<number | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({
      x: 0,
      y: 0,
    });

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

    // ---- Derived data ----
    const resolvedColors = resolveColors(colors, categories.length);
    const visibleCategories = categories.filter((c) => !hiddenSeries.has(c));
    const fmt = valueFormatter ?? formatValue;

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
            aria-label={ariaLabel ?? "Empty bar chart"}
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

    // ---- Compute values ----
    // For each datum, compute per-category numeric values
    const groupValues: { label: string; values: Record<string, number> }[] =
      data.map((d) => ({
        label: String(d[index] ?? ""),
        values: Object.fromEntries(
          categories.map((cat) => [cat, Number(d[cat]) || 0])
        ),
      }));

    // Compute max value for axis scaling
    let maxVal = 0;
    if (type === "percent") {
      maxVal = 100;
    } else if (type === "stacked") {
      maxVal = Math.max(
        ...groupValues.map((g) =>
          visibleCategories.reduce((sum, cat) => sum + Math.max(0, g.values[cat] ?? 0), 0)
        ),
        1
      );
    } else {
      maxVal = Math.max(
        ...groupValues.flatMap((g) =>
          visibleCategories.map((cat) => Math.max(0, g.values[cat] ?? 0))
        ),
        1
      );
    }

    const niceMax = type === "percent" ? 100 : getNiceMax(maxVal);
    const gridLines = getGridLines(niceMax);

    // ---- Layout dimensions ----
    const isHorizontal = layout === "horizontal";
    const chartWidth = VIEW_BOX_W - PADDING.left - PADDING.right;
    const svgHeight = isHorizontal
      ? Math.max(height, groupValues.length * 40 + PADDING.top + PADDING.bottom)
      : height;
    const chartHeight = svgHeight - PADDING.top - PADDING.bottom;
    const baseline = PADDING.top + chartHeight;

    // ---- Bar geometry ----
    const numGroups = groupValues.length;
    const numBars = type === "default" ? visibleCategories.length : 1;
    const categorySize = isHorizontal
      ? chartHeight / numGroups
      : chartWidth / numGroups;
    const gapPx = resolveGap(barCategoryGap, categorySize);
    const groupSize = categorySize - gapPx;
    const singleBarSize = numBars > 0 ? groupSize / numBars : groupSize;
    const barSizeClamp = Math.min(
      isHorizontal ? 25 : 40,
      Math.max(2, singleBarSize)
    );

    // ---- Helper: compute rects per group ----
    function getBarRects(groupIdx: number) {
      const g = groupValues[groupIdx];
      const rects: {
        cat: string;
        colorIdx: number;
        x: number;
        y: number;
        w: number;
        h: number;
        value: number;
      }[] = [];

      if (isHorizontal) {
        // Horizontal layout: categories run along x (width), groups along y
        const groupY =
          PADDING.top + groupIdx * categorySize + gapPx / 2;

        if (type === "default") {
          visibleCategories.forEach((cat, ci) => {
            const val = g.values[cat] ?? 0;
            const barLength = mounted ? (Math.max(0, val) / niceMax) * chartWidth : 0;
            const yPos = groupY + ci * barSizeClamp;
            rects.push({
              cat,
              colorIdx: categories.indexOf(cat),
              x: PADDING.left,
              y: yPos,
              w: barLength,
              h: barSizeClamp,
              value: val,
            });
          });
        } else {
          // stacked / percent
          let cumWidth = 0;
          const total =
            type === "percent"
              ? visibleCategories.reduce(
                  (s, cat) => s + Math.max(0, g.values[cat] ?? 0),
                  0
                )
              : niceMax;
          visibleCategories.forEach((cat) => {
            const val = g.values[cat] ?? 0;
            const fraction = total > 0 ? Math.max(0, val) / total : 0;
            const barLength = mounted
              ? (type === "percent" ? fraction : Math.max(0, val) / niceMax) *
                chartWidth
              : 0;
            rects.push({
              cat,
              colorIdx: categories.indexOf(cat),
              x: PADDING.left + (mounted ? cumWidth : 0),
              y: groupY,
              w: barLength,
              h: groupSize,
              value: val,
            });
            if (mounted) cumWidth += barLength;
          });
        }
      } else {
        // Vertical layout
        const groupX =
          PADDING.left + groupIdx * categorySize + gapPx / 2;

        if (type === "default") {
          visibleCategories.forEach((cat, ci) => {
            const val = g.values[cat] ?? 0;
            const barH = mounted
              ? (Math.max(0, val) / niceMax) * chartHeight
              : 0;
            const xPos = groupX + ci * barSizeClamp;
            rects.push({
              cat,
              colorIdx: categories.indexOf(cat),
              x: xPos,
              y: baseline - barH,
              w: barSizeClamp,
              h: barH,
              value: val,
            });
          });
        } else {
          // stacked / percent
          let cumHeight = 0;
          const total =
            type === "percent"
              ? visibleCategories.reduce(
                  (s, cat) => s + Math.max(0, g.values[cat] ?? 0),
                  0
                )
              : niceMax;
          visibleCategories.forEach((cat) => {
            const val = g.values[cat] ?? 0;
            const fraction = total > 0 ? Math.max(0, val) / total : 0;
            const barH = mounted
              ? (type === "percent" ? fraction : Math.max(0, val) / niceMax) *
                chartHeight
              : 0;
            rects.push({
              cat,
              colorIdx: categories.indexOf(cat),
              x: groupX,
              y: baseline - (mounted ? cumHeight : 0) - barH,
              w: groupSize,
              h: barH,
              value: val,
            });
            if (mounted) cumHeight += barH;
          });
        }
      }
      return rects;
    }

    // ---- Tooltip payload ----
    function getTooltipPayload(groupIdx: number) {
      const g = groupValues[groupIdx];
      return visibleCategories.map((cat) => ({
        name: cat,
        value: g.values[cat] ?? 0,
        color: resolvedColors[categories.indexOf(cat)],
      }));
    }

    // ---- Click handler ----
    function handleBarClick(groupIdx: number, cat: string) {
      if (!onValueChange) return;
      const datum = data[groupIdx];
      onValueChange({
        eventType: "bar",
        categoryClicked: cat,
        ...datum,
      });
    }

    // ---- Reference line helpers ----
    function renderReferenceLines() {
      if (!referenceLines || referenceLines.length === 0) return null;
      return referenceLines.map((rl, ri) => {
        if (rl.y != null && !isHorizontal) {
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
          // Find group index matching x label
          const gIdx = groupValues.findIndex(
            (g) => g.label === String(rl.x)
          );
          if (gIdx === -1) return null;
          if (isHorizontal) {
            const yPos =
              PADDING.top + gIdx * categorySize + categorySize / 2;
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
          } else {
            const xPos =
              PADDING.left + gIdx * categorySize + categorySize / 2;
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
        }
        // y on horizontal
        if (rl.y != null && isHorizontal) {
          const xPos =
            PADDING.left + (rl.y / niceMax) * chartWidth;
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

    // ---- Transition style ----
    const noMotion = prefersReducedMotion();
    const transitionStyle = noMotion
      ? undefined
      : isHorizontal
        ? { transition: "width 0.6s ease-out, x 0.6s ease-out, opacity 0.2s" }
        : { transition: "height 0.6s ease-out, y 0.6s ease-out, opacity 0.2s" };

    // ---- Legend entries ----
    const legendEntries = categories.map((cat, i) => ({
      name: cat,
      color: resolvedColors[i],
    }));

    // ---- Render ----
    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <svg
          role="img"
          aria-label={ariaLabel ?? "Bar chart"}
          width="100%"
          height={svgHeight}
          viewBox={`0 0 ${VIEW_BOX_W} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <clipPath id={clipId}>
              <rect
                x={PADDING.left}
                y={PADDING.top}
                width={chartWidth}
                height={chartHeight}
              />
            </clipPath>
          </defs>

          {/* ---- Grid lines ---- */}
          {showGrid &&
            (isHorizontal
              ? // Vertical grid lines for horizontal layout
                gridLines.map((val, i) => {
                  const x = PADDING.left + (val / niceMax) * chartWidth;
                  return (
                    <line
                      key={`grid-${i}`}
                      x1={x}
                      y1={PADDING.top}
                      x2={x}
                      y2={baseline}
                      stroke="#e5e7eb"
                      strokeDasharray="4 4"
                    />
                  );
                })
              : // Horizontal grid lines for vertical layout
                gridLines.map((val, i) => {
                  const y =
                    PADDING.top +
                    chartHeight -
                    (val / niceMax) * chartHeight;
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
                }))}

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
              {isHorizontal
                ? // Category labels on y-axis for horizontal layout
                  groupValues.map((g, gi) => {
                    const yPos =
                      PADDING.top + gi * categorySize + categorySize / 2;
                    return (
                      <text
                        key={`ylabel-${gi}`}
                        x={PADDING.left - 8}
                        y={yPos + 4}
                        textAnchor="end"
                        fill="#6b7280"
                        fontSize="11"
                      >
                        {truncateLabel(g.label)}
                      </text>
                    );
                  })
                : // Numeric labels on y-axis for vertical layout
                  gridLines.map((val, i) => {
                    const y =
                      PADDING.top +
                      chartHeight -
                      (val / niceMax) * chartHeight;
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
              {isHorizontal
                ? // Numeric labels on x-axis for horizontal layout
                  gridLines.map((val, i) => {
                    const x = PADDING.left + (val / niceMax) * chartWidth;
                    return (
                      <text
                        key={`xlabel-${i}`}
                        x={x}
                        y={baseline + 16}
                        textAnchor="middle"
                        fill="#9ca3af"
                        fontSize="11"
                      >
                        {type === "percent" ? `${Math.round(val)}%` : fmt(val)}
                      </text>
                    );
                  })
                : // Category labels on x-axis for vertical layout
                  groupValues.map((g, gi) => {
                    const x =
                      PADDING.left + gi * categorySize + categorySize / 2;
                    return (
                      <text
                        key={`xlabel-${gi}`}
                        x={x}
                        y={baseline + 16}
                        textAnchor="middle"
                        fill="#6b7280"
                        fontSize="11"
                      >
                        {truncateLabel(g.label)}
                      </text>
                    );
                  })}
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

          {/* ---- Bars ---- */}
          <g clipPath={`url(#${clipId})`}>
            {groupValues.map((_, gi) => {
              const rects = getBarRects(gi);
              const isGroupHovered = hoveredGroupIdx === gi;

              return (
                <g key={`group-${gi}`}>
                  {rects.map((r, ri) => (
                    <rect
                      key={`bar-${gi}-${ri}`}
                      data-testid={`bar-${gi}-${ri}`}
                      x={r.x}
                      y={r.y}
                      width={Math.max(0, r.w)}
                      height={Math.max(0, r.h)}
                      fill={resolvedColors[r.colorIdx]}
                      opacity={
                        isGroupHovered
                          ? 1
                          : hoveredGroupIdx != null
                            ? 0.5
                            : 0.85
                      }
                      rx={2}
                      style={transitionStyle}
                      cursor={onValueChange ? "pointer" : undefined}
                      onClick={() => handleBarClick(gi, r.cat)}
                      onMouseEnter={(e) => {
                        setHoveredGroupIdx(gi);
                        // Compute tooltip position from the rect
                        const svgEl = (e.target as SVGRectElement).ownerSVGElement;
                        if (svgEl) {
                          const pt = svgEl.createSVGPoint();
                          pt.x = e.clientX;
                          pt.y = e.clientY;
                          const ctm = svgEl.getScreenCTM()?.inverse();
                          if (ctm) {
                            const svgPt = pt.matrixTransform(ctm);
                            setTooltipPos({ x: svgPt.x, y: svgPt.y });
                          }
                        }
                      }}
                      onMouseLeave={() => setHoveredGroupIdx(null)}
                    />
                  ))}

                  {/* Data labels */}
                  {showDataLabels &&
                    mounted &&
                    rects.map((r, ri) => {
                      if (r.h < 1 && r.w < 1) return null;
                      const labelX = isHorizontal
                        ? r.x + r.w + 6
                        : r.x + r.w / 2;
                      const labelY = isHorizontal
                        ? r.y + r.h / 2 + 4
                        : r.y - 6;
                      return (
                        <text
                          key={`label-${gi}-${ri}`}
                          x={labelX}
                          y={labelY}
                          textAnchor={isHorizontal ? "start" : "middle"}
                          fill="#374151"
                          fontSize="10"
                          fontWeight="600"
                        >
                          {type === "percent"
                            ? `${Math.round(
                                (r.value /
                                  Math.max(
                                    visibleCategories.reduce(
                                      (s, c) =>
                                        s +
                                        Math.max(
                                          0,
                                          groupValues[gi].values[c] ?? 0
                                        ),
                                      0
                                    ),
                                    1
                                  )) *
                                  100
                              )}%`
                            : fmt(r.value)}
                        </text>
                      );
                    })}
                </g>
              );
            })}
          </g>

          {/* ---- Invisible hover zones per group (for tooltip) ---- */}
          {showTooltip &&
            groupValues.map((_, gi) => {
              const zoneX = isHorizontal
                ? PADDING.left
                : PADDING.left + gi * categorySize;
              const zoneY = isHorizontal
                ? PADDING.top + gi * categorySize
                : PADDING.top;
              const zoneW = isHorizontal ? chartWidth : categorySize;
              const zoneH = isHorizontal ? categorySize : chartHeight;

              return (
                <rect
                  key={`hover-${gi}`}
                  x={zoneX}
                  y={zoneY}
                  width={zoneW}
                  height={zoneH}
                  fill="transparent"
                  onMouseEnter={() => setHoveredGroupIdx(gi)}
                  onMouseMove={(e) => {
                    const svgEl = (e.target as SVGRectElement).ownerSVGElement;
                    if (svgEl) {
                      const pt = svgEl.createSVGPoint();
                      pt.x = e.clientX;
                      pt.y = e.clientY;
                      const ctm = svgEl.getScreenCTM()?.inverse();
                      if (ctm) {
                        const svgPt = pt.matrixTransform(ctm);
                        setTooltipPos({ x: svgPt.x, y: svgPt.y });
                      }
                    }
                    setHoveredGroupIdx(gi);
                  }}
                  onMouseLeave={() => setHoveredGroupIdx(null)}
                  style={{ pointerEvents: "all" }}
                />
              );
            })}

          {/* ---- Tooltip ---- */}
          {showTooltip && hoveredGroupIdx != null && (
            <ChartTooltip
              active
              payload={getTooltipPayload(hoveredGroupIdx)}
              label={groupValues[hoveredGroupIdx].label}
              x={tooltipPos.x}
              y={tooltipPos.y}
              viewBoxWidth={VIEW_BOX_W}
              valueFormatter={
                type === "percent"
                  ? (v) => {
                      const total = visibleCategories.reduce(
                        (s, c) =>
                          s +
                          Math.max(
                            0,
                            groupValues[hoveredGroupIdx].values[c] ?? 0
                          ),
                        0
                      );
                      return total > 0
                        ? `${Math.round((v / total) * 100)}%`
                        : "0%";
                    }
                  : valueFormatter
              }
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

BarChart.displayName = "BarChart";

export { BarChart };
export type { BarChartProps, BarChartType, BarChartLayout };
