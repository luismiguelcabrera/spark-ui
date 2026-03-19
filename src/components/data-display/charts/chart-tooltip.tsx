"use client";

import { type ReactNode } from "react";
import type { TooltipProps, TooltipPayloadEntry } from "./chart-types";
import { formatValue } from "./chart-utils";

type ChartTooltipProps = {
  /** Whether the tooltip is visible */
  active: boolean;
  /** Tooltip payload entries */
  payload: TooltipPayloadEntry[];
  /** X-axis label for the hovered point */
  label: string;
  /** Pixel position (relative to SVG viewBox) */
  x: number;
  /** Pixel position (relative to SVG viewBox) */
  y: number;
  /** Total SVG viewBox width */
  viewBoxWidth: number;
  /** Optional value formatter */
  valueFormatter?: (value: number) => string;
  /** Custom tooltip renderer (replaces default) */
  customTooltip?: React.ComponentType<TooltipProps>;
};

/**
 * Default SVG-based tooltip rendered inside chart SVG.
 * If `customTooltip` is provided, renders it via foreignObject.
 */
export function ChartTooltip({
  active,
  payload,
  label,
  x,
  y,
  viewBoxWidth,
  valueFormatter,
  customTooltip: CustomTooltip,
}: ChartTooltipProps): ReactNode {
  if (!active || payload.length === 0) return null;

  const fmt = valueFormatter || formatValue;

  // Custom tooltip via foreignObject
  if (CustomTooltip) {
    const formattedPayload = payload.map((e) => ({
      ...e,
      value: e.value,
    }));
    // Position: flip left if near right edge
    const tooltipWidth = 160;
    const flipX = x + tooltipWidth + 12 > viewBoxWidth;
    const tx = flipX ? x - tooltipWidth - 12 : x + 12;
    const ty = Math.max(4, y - 30);

    return (
      <foreignObject x={tx} y={ty} width={tooltipWidth} height={200} overflow="visible">
        <div style={{ pointerEvents: "none" }}>
          <CustomTooltip active={active} payload={formattedPayload} label={label} />
        </div>
      </foreignObject>
    );
  }

  // Default SVG tooltip
  const lineH = 16;
  const boxWidth = 120;
  const boxHeight = 8 + (label ? lineH : 0) + payload.length * lineH + 4;
  const flipX = x + boxWidth + 12 > viewBoxWidth;
  const bx = flipX ? x - boxWidth - 12 : x + 12;
  const by = Math.max(4, y - boxHeight / 2);

  let textY = by + (label ? 16 : 8);

  return (
    <g data-testid="chart-tooltip" style={{ pointerEvents: "none" }}>
      <rect
        x={bx}
        y={by}
        width={boxWidth}
        height={boxHeight}
        rx={6}
        fill="#1f2937"
        opacity={0.95}
      />
      {label && (
        <text
          x={bx + boxWidth / 2}
          y={textY}
          textAnchor="middle"
          fill="#d1d5db"
          fontSize="10"
          fontWeight="500"
        >
          {label}
        </text>
      )}
      {payload.map((entry, i) => {
        const ey = textY + (label ? lineH : 0) + i * lineH;
        return (
          <g key={i}>
            <circle cx={bx + 10} cy={ey - 1} r={3.5} fill={entry.color} />
            <text x={bx + 20} y={ey + 3} fill="#e5e7eb" fontSize="10" fontWeight="400">
              {entry.name}
            </text>
            <text
              x={bx + boxWidth - 8}
              y={ey + 3}
              fill="#fff"
              fontSize="10"
              fontWeight="600"
              textAnchor="end"
            >
              {fmt(entry.value)}
            </text>
          </g>
        );
      })}
    </g>
  );
}
