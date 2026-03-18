"use client";

import {
  forwardRef,
  useState,
  useEffect,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../../lib/utils";

const DEFAULT_COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

type DonutChartDataPoint = {
  label: string;
  value: number;
  color?: string;
};

type DonutChartProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Array of data segments */
  data: DonutChartDataPoint[];
  /** Overall SVG size in pixels */
  size?: number;
  /** Ring thickness in pixels */
  thickness?: number;
  /** Show percentage labels on segments */
  showLabels?: boolean;
  /** Show a legend below the chart */
  showLegend?: boolean;
  /** Content to display in the center of the donut */
  centerLabel?: ReactNode;
  /** Animate segments on mount */
  animate?: boolean;
  /** Additional CSS classes */
  className?: string;
};

const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>(
  (
    {
      data,
      size = 200,
      thickness = 40,
      showLabels = false,
      showLegend = false,
      centerLabel,
      animate = true,
      className,
      ...props
    },
    ref
  ) => {
    const [mounted, setMounted] = useState(!animate);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
      if (animate) {
        const timer = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(timer);
      }
    }, [animate]);

    if (!data || data.length === 0) {
      return (
        <div
          ref={ref}
          className={cn("inline-flex flex-col items-center", className)}
          {...props}
        >
          <svg
            role="img"
            aria-label="Empty donut chart"
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
              No data
            </text>
          </svg>
        </div>
      );
    }

    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) {
      return (
        <div
          ref={ref}
          className={cn("inline-flex flex-col items-center", className)}
          {...props}
        >
          <svg
            role="img"
            aria-label="Empty donut chart"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={(size - thickness) / 2}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={thickness}
            />
          </svg>
        </div>
      );
    }

    const center = size / 2;
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;

    // Calculate segment positions
    let cumulativePercent = 0;
    const segments = data.map((d, i) => {
      const percent = d.value / total;
      const dashLength = percent * circumference;
      const dashGap = circumference - dashLength;
      const offset = -cumulativePercent * circumference + circumference * 0.25;
      // Midpoint angle for label positioning (in radians)
      const midAngle =
        (cumulativePercent + percent / 2) * 2 * Math.PI - Math.PI / 2;
      cumulativePercent += percent; // eslint-disable-line react-hooks/immutability -- intentional: accumulator for segment positioning in render

      return {
        ...d,
        index: i,
        percent,
        dashArray: `${dashLength} ${dashGap}`,
        dashOffset: offset,
        midAngle,
        color: d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      };
    });

    return (
      <div
        ref={ref}
        className={cn("inline-flex flex-col items-center gap-3", className)}
        {...props}
      >
        <svg
          role="img"
          aria-label="Donut chart"
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
          {segments.map((seg) => {
            const isHovered = hoveredIndex === seg.index;
            return (
              <circle
                key={seg.index}
                data-testid={`segment-${seg.index}`}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={isHovered ? thickness + 4 : thickness}
                strokeDasharray={mounted ? seg.dashArray : `0 ${circumference}`}
                strokeDashoffset={seg.dashOffset}
                opacity={
                  hoveredIndex === null || isHovered ? 1 : 0.5
                }
                style={{
                  transition:
                    "stroke-dasharray 0.8s ease-out, stroke-width 0.2s ease, opacity 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredIndex(seg.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}

          {/* Labels on segments */}
          {showLabels &&
            mounted &&
            segments
              .filter((seg) => seg.percent >= 0.05)
              .map((seg) => {
                const labelRadius = radius;
                const lx = center + labelRadius * Math.cos(seg.midAngle);
                const ly = center + labelRadius * Math.sin(seg.midAngle);
                return (
                  <text
                    key={`label-${seg.index}`}
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
          {centerLabel && (
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
                {centerLabel}
              </div>
            </foreignObject>
          )}

          {/* Tooltip on hover */}
          {hoveredIndex !== null && segments[hoveredIndex] && (
            <g>
              <rect
                x={center - 45}
                y={center - 14}
                width={90}
                height={28}
                rx={6}
                fill="#1f2937"
                opacity="0.95"
              />
              <text
                x={center}
                y={center + 4}
                textAnchor="middle"
                fill="#fff"
                fontSize="12"
                fontWeight="500"
              >
                {segments[hoveredIndex].label}:{" "}
                {Math.round(segments[hoveredIndex].percent * 100)}%
              </text>
            </g>
          )}
        </svg>

        {/* Legend */}
        {showLegend && (
          <div
            className="flex flex-wrap justify-center gap-x-4 gap-y-1"
            data-testid="donut-legend"
          >
            {segments.map((seg) => (
              <div
                key={seg.index}
                className="flex items-center gap-1.5 text-sm text-gray-600"
              >
                <span
                  className="inline-block w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span>{seg.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
DonutChart.displayName = "DonutChart";

export { DonutChart };
export type { DonutChartProps, DonutChartDataPoint };
