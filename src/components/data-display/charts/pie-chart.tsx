"use client";

import {
  forwardRef,
  useState,
  useEffect,
  useId,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../../lib/utils";
import type { ChartColor, ChartEventProps, TooltipProps } from "./chart-types";
import { resolveColors } from "./chart-colors";
import { ChartTooltip } from "./chart-tooltip";
import { ChartLegend } from "./chart-legend";
import { formatValue, prefersReducedMotion } from "./chart-utils";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type PieChartDataPoint = {
  name: string;
  value: number;
  color?: string;
};

type PieChartProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Array of data segments */
  data: PieChartDataPoint[];
  /** Render as a full pie or a donut ring */
  variant?: "pie" | "donut";
  /** Overall SVG size in pixels */
  size?: number;
  /** Ring thickness for donut variant */
  thickness?: number;
  /** Content displayed in the center (donut only) */
  label?: ReactNode;
  /** Show percentage labels on segments */
  showLabel?: boolean;
  /** Show a legend */
  showLegend?: boolean;
  /** Legend placement */
  legendPosition?: "top" | "bottom" | "left" | "right";
  /** Show tooltip on hover */
  showTooltip?: boolean;
  /** Named or hex colors for segments */
  colors?: ChartColor[];
  /** Format values in tooltip */
  valueFormatter?: (value: number) => string;
  /** Custom tooltip component */
  customTooltip?: React.ComponentType<TooltipProps>;
  /** Callback when a segment is clicked / unselected */
  onValueChange?: (value: ChartEventProps | null) => void;
  /** Animate on mount */
  animate?: boolean;
  /** Accessible label for the SVG */
  ariaLabel?: string;
  /** Additional CSS classes */
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*                              Helper: arc path                              */
/* -------------------------------------------------------------------------- */

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  // Clamp very-near-full arcs so the browser doesn't collapse them
  const sweep = Math.min(endAngle - startAngle, Math.PI * 2 - 0.001);
  const end = startAngle + sweep;

  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);

  const largeArc = sweep > Math.PI ? 1 : 0;

  return [
    `M ${cx} ${cy}`,
    `L ${x1} ${y1}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
    "Z",
  ].join(" ");
}

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

const PieChart = forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      data,
      variant = "donut",
      size = 200,
      thickness = 40,
      label,
      showLabel = false,
      showLegend = false,
      legendPosition = "bottom",
      showTooltip = true,
      colors,
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
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

    useEffect(() => {
      if (shouldAnimate) {
        const timer = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(timer);
      }
    }, [shouldAnimate]);

    /* ----------------------------- empty state ----------------------------- */

    if (!data || data.length === 0) {
      return (
        <div
          ref={ref}
          className={cn("inline-flex flex-col items-center", className)}
          {...props}
        >
          <svg
            role="img"
            aria-label={ariaLabel || "Empty pie chart"}
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            <text
              x={size / 2}
              y={size / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#9ca3af"
              fontSize="14"
            >
              No data available
            </text>
          </svg>
        </div>
      );
    }

    /* ----------------------- filter hidden & compute ----------------------- */

    const visibleData = data.filter((d) => !hiddenSeries.has(d.name));
    const total = visibleData.reduce((sum, d) => sum + d.value, 0);
    const resolvedColors = resolveColors(colors, data.length);

    // Build color map keyed by name so hidden toggle keeps colors stable
    const colorMap = new Map<string, string>();
    data.forEach((d, i) => {
      colorMap.set(d.name, d.color || resolvedColors[i]);
    });

    /* ---- zero-total state (all values 0, or everything hidden) ---- */

    if (total === 0) {
      const center = size / 2;
      const radius = (size - thickness) / 2;
      return (
        <div
          ref={ref}
          className={cn("inline-flex flex-col items-center", className)}
          {...props}
        >
          <svg
            role="img"
            aria-label={ariaLabel || "Empty pie chart"}
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            <circle
              cx={center}
              cy={center}
              r={variant === "donut" ? radius : radius + thickness / 2}
              fill={variant === "donut" ? "none" : "#f3f4f6"}
              stroke={variant === "donut" ? "#e5e7eb" : "none"}
              strokeWidth={variant === "donut" ? thickness : 0}
            />
          </svg>
          {showLegend && (
            <ChartLegend
              entries={data.map((d) => ({
                name: d.name,
                color: colorMap.get(d.name)!,
              }))}
              position={legendPosition}
              onToggle={handleLegendToggle}
              hiddenSeries={hiddenSeries}
            />
          )}
        </div>
      );
    }

    const center = size / 2;
    const radius = (size - thickness) / 2;

    /* -------------------- compute segments -------------------- */

    let cumulativeAngle = -Math.PI / 2; // start at 12 o'clock
    const segments = visibleData.map((d) => {
      const percent = d.value / total;
      const startAngle = cumulativeAngle;
      const sweepAngle = percent * Math.PI * 2;
      const midAngle = startAngle + sweepAngle / 2;
      cumulativeAngle += sweepAngle;

      return {
        ...d,
        percent,
        startAngle,
        sweepAngle,
        midAngle,
        color: colorMap.get(d.name)!,
      };
    });

    /* -------------------- interaction handlers -------------------- */

    function handleSegmentClick(name: string) {
      onValueChange?.({
        eventType: "sector",
        categoryClicked: name,
      });
    }

    function handleLegendToggle(name: string) {
      setHiddenSeries((prev) => {
        const next = new Set(prev);
        if (next.has(name)) {
          next.delete(name);
        } else {
          // Don't allow hiding all
          if (next.size < data.length - 1) {
            next.add(name);
          }
        }
        return next;
      });
    }

    /* -------------------- tooltip state -------------------- */

    const hoveredSeg = hoveredIndex !== null ? segments[hoveredIndex] : null;
    const tooltipPayload = hoveredSeg
      ? [
          {
            name: hoveredSeg.name,
            value: hoveredSeg.value,
            color: hoveredSeg.color,
          },
        ]
      : [];
    const tooltipLabel = hoveredSeg
      ? `${Math.round(hoveredSeg.percent * 100)}%`
      : "";
    const tooltipX = hoveredSeg
      ? center + (radius * 0.6) * Math.cos(hoveredSeg.midAngle)
      : 0;
    const tooltipY = hoveredSeg
      ? center + (radius * 0.6) * Math.sin(hoveredSeg.midAngle)
      : 0;

    /* -------------------- layout -------------------- */

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

    /* -------------------- render: donut variant -------------------- */

    if (variant === "donut") {
      const circumference = 2 * Math.PI * radius;

      let cumulativePercent = 0;
      const donutSegments = segments.map((seg, i) => {
        const dashLength = seg.percent * circumference;
        const dashGap = circumference - dashLength;
        const offset =
          -cumulativePercent * circumference + circumference * 0.25;
        cumulativePercent += seg.percent;

        return { ...seg, dashArray: `${dashLength} ${dashGap}`, dashOffset: offset, idx: i };
      });

      return (
        <div ref={ref} className={wrapperClass} {...props}>
          <svg
            role="img"
            aria-label={ariaLabel || "Donut chart"}
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Background ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth={thickness}
            />

            {/* Segments */}
            {donutSegments.map((seg) => {
              const isHovered = hoveredIndex === seg.idx;
              return (
                <circle
                  key={seg.name}
                  data-testid={`segment-${seg.idx}`}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={isHovered ? thickness + 4 : thickness}
                  strokeDasharray={
                    mounted ? seg.dashArray : `0 ${circumference}`
                  }
                  strokeDashoffset={seg.dashOffset}
                  opacity={
                    hoveredIndex === null || isHovered ? 1 : 0.5
                  }
                  style={{
                    transition: shouldAnimate
                      ? "stroke-dasharray 0.8s ease-out, stroke-width 0.2s ease, opacity 0.2s ease"
                      : "stroke-width 0.2s ease, opacity 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoveredIndex(seg.idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleSegmentClick(seg.name)}
                />
              );
            })}

            {/* Percentage labels on segments */}
            {showLabel &&
              mounted &&
              donutSegments
                .filter((seg) => seg.percent >= 0.05)
                .map((seg) => {
                  const lx = center + radius * Math.cos(seg.midAngle);
                  const ly = center + radius * Math.sin(seg.midAngle);
                  return (
                    <text
                      key={`label-${seg.name}`}
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#fff"
                      fontSize="11"
                      fontWeight="600"
                      pointerEvents="none"
                    >
                      {Math.round(seg.percent * 100)}%
                    </text>
                  );
                })}

            {/* Center label */}
            {label && (
              <foreignObject
                x={center - radius + thickness / 2}
                y={center - radius + thickness / 2}
                width={(radius - thickness / 2) * 2}
                height={(radius - thickness / 2) * 2}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {label}
                </div>
              </foreignObject>
            )}

            {/* Tooltip */}
            {showTooltip && (
              <ChartTooltip
                active={hoveredIndex !== null}
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
              entries={data.map((d) => ({
                name: d.name,
                color: colorMap.get(d.name)!,
              }))}
              position={legendPosition}
              onToggle={handleLegendToggle}
              hiddenSeries={hiddenSeries}
            />
          )}
        </div>
      );
    }

    /* -------------------- render: pie variant -------------------- */

    return (
      <div ref={ref} className={wrapperClass} {...props}>
        <svg
          role="img"
          aria-label={ariaLabel || "Pie chart"}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <defs>
            {/* Per-segment fade-in animation keyframes (opacity) */}
            {shouldAnimate &&
              segments.map((_, i) => (
                <style key={`anim-${i}`}>
                  {`
                    @keyframes pie-fade-${instanceId.replace(/:/g, "")}-${i} {
                      from { opacity: 0; transform: scale(0.92); transform-origin: ${center}px ${center}px; }
                      to   { opacity: 1; transform: scale(1);    transform-origin: ${center}px ${center}px; }
                    }
                  `}
                </style>
              ))}
          </defs>

          {/* Background circle */}
          <circle cx={center} cy={center} r={radius} fill="#f3f4f6" />

          {/* Pie slices */}
          {segments.map((seg, i) => {
            const isHovered = hoveredIndex === i;
            const path = describeArc(
              center,
              center,
              radius,
              seg.startAngle,
              seg.startAngle + seg.sweepAngle
            );

            // Pull hovered segment outward slightly
            const dx = isHovered ? 4 * Math.cos(seg.midAngle) : 0;
            const dy = isHovered ? 4 * Math.sin(seg.midAngle) : 0;

            return (
              <path
                key={seg.name}
                data-testid={`segment-${i}`}
                d={path}
                fill={seg.color}
                opacity={
                  mounted
                    ? hoveredIndex === null || isHovered
                      ? 1
                      : 0.55
                    : 0
                }
                transform={`translate(${dx}, ${dy})`}
                stroke="#fff"
                strokeWidth={1.5}
                style={{
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                  cursor: "pointer",
                  ...(shouldAnimate && !mounted
                    ? {}
                    : {}),
                  ...(shouldAnimate
                    ? {
                        animation: `pie-fade-${instanceId.replace(/:/g, "")}-${i} 0.5s ease-out ${i * 0.08}s both`,
                      }
                    : {}),
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleSegmentClick(seg.name)}
              />
            );
          })}

          {/* Percentage labels on segments */}
          {showLabel &&
            mounted &&
            segments
              .filter((seg) => seg.percent >= 0.05)
              .map((seg, i) => {
                const labelR = radius * 0.65;
                const lx = center + labelR * Math.cos(seg.midAngle);
                const ly = center + labelR * Math.sin(seg.midAngle);
                return (
                  <text
                    key={`label-${i}`}
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fff"
                    fontSize="11"
                    fontWeight="600"
                    pointerEvents="none"
                  >
                    {Math.round(seg.percent * 100)}%
                  </text>
                );
              })}

          {/* Tooltip */}
          {showTooltip && (
            <ChartTooltip
              active={hoveredIndex !== null}
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
            entries={data.map((d) => ({
              name: d.name,
              color: colorMap.get(d.name)!,
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
PieChart.displayName = "PieChart";

export { PieChart };
export type { PieChartProps, PieChartDataPoint };
