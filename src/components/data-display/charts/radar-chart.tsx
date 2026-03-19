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
import { resolveColors } from "./chart-colors";
import { ChartTooltip } from "./chart-tooltip";
import { ChartLegend } from "./chart-legend";
import { prefersReducedMotion } from "./chart-utils";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type RadarChartProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Array of data records — each record is one axis */
  data: Record<string, unknown>[];
  /** Key within each data record for the axis label */
  index: string;
  /** Numeric keys to plot as series */
  categories: string[];
  /** Named or hex colors for each category */
  colors?: ChartColor[];
  /** Overall SVG size in pixels */
  size?: number;
  /** Show concentric grid polygons */
  showGrid?: boolean;
  /** Show axis labels */
  showLabels?: boolean;
  /** Show data-point dots */
  showDots?: boolean;
  /** Fill opacity for polygons (0–1) */
  fillOpacity?: number;
  /** Show a legend */
  showLegend?: boolean;
  /** Legend placement */
  legendPosition?: "top" | "bottom" | "left" | "right";
  /** Show tooltip on hover */
  showTooltip?: boolean;
  /** Format values in tooltip */
  valueFormatter?: (value: number) => string;
  /** Custom tooltip component */
  customTooltip?: React.ComponentType<TooltipProps>;
  /** Callback when a series is clicked */
  onValueChange?: (value: ChartEventProps | null) => void;
  /** Animate on mount */
  animate?: boolean;
  /** Accessible label for the SVG */
  ariaLabel?: string;
  /** Additional CSS classes */
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

const RadarChart = forwardRef<HTMLDivElement, RadarChartProps>(
  (
    {
      data,
      index,
      categories,
      colors,
      size = 300,
      showGrid = true,
      showLabels = true,
      showDots = true,
      fillOpacity = 0.2,
      showLegend = false,
      legendPosition = "bottom",
      showTooltip = true,
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
    const [hoveredSeries, setHoveredSeries] = useState<number | null>(null);
    const [hoveredAxis, setHoveredAxis] = useState<number | null>(null);
    const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

    useEffect(() => {
      if (shouldAnimate) {
        const timer = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(timer);
      }
    }, [shouldAnimate]);

    const resolvedColors = resolveColors(colors, categories.length);

    /* ----------------------------- empty state ----------------------------- */

    if (
      !data ||
      data.length === 0 ||
      !categories ||
      categories.length === 0
    ) {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center justify-center text-gray-500",
            className
          )}
          style={{ width: size, height: size }}
          {...props}
        >
          <svg
            role="img"
            aria-label={ariaLabel || "Empty radar chart"}
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            <text
              x={size / 2}
              y={size / 2}
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

    /* ------------------------------ geometry ------------------------------- */

    const axisCount = data.length;
    const cx = size / 2;
    const cy = size / 2;
    const radius = (size - 80) / 2; // room for labels
    const gridLevels = 5;

    const axisLabels = data.map((d) => String(d[index] ?? ""));

    // Determine the global max across all visible categories and all axes
    const visibleCategories = categories.filter(
      (cat) => !hiddenSeries.has(cat)
    );
    let globalMax = 0;
    for (const record of data) {
      for (const cat of visibleCategories) {
        const val = Number(record[cat]) || 0;
        if (val > globalMax) globalMax = val;
      }
    }
    if (globalMax === 0) globalMax = 1;

    /** Get SVG point for axis index at a given 0–1 normalised value */
    function getPoint(
      axisIndex: number,
      normalized: number
    ): { x: number; y: number } {
      const angle =
        (Math.PI * 2 * axisIndex) / axisCount - Math.PI / 2;
      return {
        x: cx + Math.cos(angle) * radius * normalized,
        y: cy + Math.sin(angle) * radius * normalized,
      };
    }

    /** Polygon string for a concentric grid ring */
    function getGridPolygon(level: number): string {
      const n = level / gridLevels;
      return Array.from({ length: axisCount }, (_, i) => {
        const p = getPoint(i, n);
        return `${p.x},${p.y}`;
      }).join(" ");
    }

    /** Polygon string for a category series */
    function getCategoryPolygon(category: string): string {
      return data
        .map((record, i) => {
          const val = Number(record[category]) || 0;
          const normalized = Math.min(1, Math.max(0, val / globalMax));
          const p = getPoint(i, normalized);
          return `${p.x},${p.y}`;
        })
        .join(" ");
    }

    /* -------------------- interaction handlers -------------------- */

    function handleSeriesClick(category: string) {
      onValueChange?.({
        eventType: "series",
        categoryClicked: category,
      });
    }

    function handleLegendToggle(name: string) {
      setHiddenSeries((prev) => {
        const next = new Set(prev);
        if (next.has(name)) {
          next.delete(name);
        } else {
          if (next.size < categories.length - 1) {
            next.add(name);
          }
        }
        return next;
      });
    }

    /* ----------------------- tooltip state ----------------------- */

    const tooltipActive = hoveredSeries !== null && hoveredAxis !== null;
    const tooltipPayload: { name: string; value: number; color: string }[] = [];
    let tooltipLabel = "";
    let tooltipX = 0;
    let tooltipY = 0;

    if (tooltipActive) {
      const axisIdx = hoveredAxis!;
      tooltipLabel = axisLabels[axisIdx];

      // Show all visible categories for the hovered axis
      for (let ci = 0; ci < categories.length; ci++) {
        const cat = categories[ci];
        if (hiddenSeries.has(cat)) continue;
        const val = Number(data[axisIdx][cat]) || 0;
        tooltipPayload.push({
          name: cat,
          value: val,
          color: resolvedColors[ci],
        });
      }

      // Position tooltip near the hovered dot
      const hoveredCat = categories[hoveredSeries!];
      const hoveredVal = Number(data[axisIdx][hoveredCat]) || 0;
      const norm = Math.min(1, Math.max(0, hoveredVal / globalMax));
      const pt = getPoint(axisIdx, norm);
      tooltipX = pt.x;
      tooltipY = pt.y;
    }

    /* ----------------------------- layout ------------------------------ */

    const isVerticalLegend =
      legendPosition === "left" || legendPosition === "right";
    const wrapperClass = cn(
      "inline-flex items-center gap-3",
      isVerticalLegend
        ? legendPosition === "left"
          ? "flex-row-reverse"
          : "flex-row"
        : legendPosition === "top"
          ? "flex-col-reverse"
          : "flex-col",
      className
    );

    const animId = instanceId.replace(/:/g, "");

    /* ----------------------------- render ------------------------------ */

    return (
      <div ref={ref} className={wrapperClass} {...props}>
        <svg
          role="img"
          aria-label={ariaLabel || "Radar chart"}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Animation keyframes */}
          {shouldAnimate && (
            <defs>
              <style>
                {`
                  @keyframes radar-grow-${animId} {
                    from { opacity: 0; transform: scale(0); transform-origin: ${cx}px ${cy}px; }
                    to   { opacity: 1; transform: scale(1); transform-origin: ${cx}px ${cy}px; }
                  }
                `}
              </style>
            </defs>
          )}

          {/* Concentric grid polygons */}
          {showGrid &&
            Array.from({ length: gridLevels }, (_, level) => (
              <polygon
                key={`grid-${level}`}
                data-testid={`radar-grid-${level}`}
                points={getGridPolygon(level + 1)}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={1}
              />
            ))}

          {/* Axis lines from center to each vertex */}
          {Array.from({ length: axisCount }, (_, i) => {
            const p = getPoint(i, 1);
            return (
              <line
                key={`axis-${i}`}
                data-testid={`radar-axis-${i}`}
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke="#d1d5db"
                strokeWidth={1}
              />
            );
          })}

          {/* Category polygons */}
          {categories.map((cat, ci) => {
            if (hiddenSeries.has(cat)) return null;
            const color = resolvedColors[ci];
            const isHovered = hoveredSeries === ci;
            const dimmed =
              hoveredSeries !== null && !isHovered;
            const opacity = dimmed
              ? fillOpacity * 0.3
              : fillOpacity;

            return (
              <g key={`series-${ci}`}>
                <polygon
                  data-testid={`radar-polygon-${ci}`}
                  points={getCategoryPolygon(cat)}
                  fill={color}
                  fillOpacity={mounted ? opacity : 0}
                  stroke={color}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  strokeOpacity={mounted ? 1 : 0}
                  style={{
                    transition: shouldAnimate
                      ? "fill-opacity 0.2s, stroke-width 0.2s, stroke-opacity 0.6s ease-out"
                      : "fill-opacity 0.2s, stroke-width 0.2s",
                    cursor: "pointer",
                    ...(shouldAnimate
                      ? {
                          animation: `radar-grow-${animId} 0.6s ease-out ${ci * 0.1}s both`,
                        }
                      : {}),
                  }}
                  onMouseEnter={() => setHoveredSeries(ci)}
                  onMouseLeave={() => {
                    setHoveredSeries(null);
                    setHoveredAxis(null);
                  }}
                  onClick={() => handleSeriesClick(cat)}
                />

                {/* Data-point dots */}
                {showDots &&
                  data.map((record, ai) => {
                    const val = Number(record[cat]) || 0;
                    const norm = Math.min(
                      1,
                      Math.max(0, val / globalMax)
                    );
                    const p = getPoint(ai, norm);
                    const isDotHovered =
                      hoveredSeries === ci && hoveredAxis === ai;
                    return (
                      <circle
                        key={`dot-${ci}-${ai}`}
                        data-testid={`radar-dot-${ci}-${ai}`}
                        cx={p.x}
                        cy={p.y}
                        r={isDotHovered ? 4.5 : 3}
                        fill={color}
                        stroke="#fff"
                        strokeWidth={1.5}
                        opacity={mounted ? 1 : 0}
                        style={{
                          transition: shouldAnimate
                            ? "r 0.15s ease, opacity 0.6s ease-out"
                            : "r 0.15s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={() => {
                          setHoveredSeries(ci);
                          setHoveredAxis(ai);
                        }}
                        onMouseLeave={() => {
                          setHoveredSeries(null);
                          setHoveredAxis(null);
                        }}
                        onClick={() => handleSeriesClick(cat)}
                      />
                    );
                  })}
              </g>
            );
          })}

          {/* Axis labels */}
          {showLabels &&
            axisLabels.map((lbl, i) => {
              const p = getPoint(i, 1.15);
              const angle =
                (Math.PI * 2 * i) / axisCount - Math.PI / 2;
              const anchor =
                Math.abs(Math.cos(angle)) < 0.1
                  ? "middle"
                  : Math.cos(angle) > 0
                    ? "start"
                    : "end";
              return (
                <text
                  key={`label-${i}`}
                  data-testid={`radar-label-${i}`}
                  x={p.x}
                  y={p.y}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fill="#6b7280"
                  fontSize="11"
                >
                  {lbl}
                </text>
              );
            })}

          {/* Tooltip */}
          {showTooltip && (
            <ChartTooltip
              active={tooltipActive}
              payload={tooltipPayload}
              label={tooltipLabel}
              x={tooltipX}
              y={tooltipY}
              viewBoxWidth={size}
              valueFormatter={valueFormatter}
              customTooltip={customTooltip}
            />
          )}
        </svg>

        {/* Legend */}
        {showLegend && (
          <ChartLegend
            entries={categories.map((cat, ci) => ({
              name: cat,
              color: resolvedColors[ci],
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
RadarChart.displayName = "RadarChart";

export { RadarChart };
export type { RadarChartProps };
