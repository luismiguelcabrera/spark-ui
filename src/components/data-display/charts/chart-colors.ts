/** Chart color resolution system — maps named colors to hex values */

import type { ChartColor } from "./chart-types";

const NAMED_COLORS: Record<string, string> = {
  primary: "#6366f1",
  secondary: "#64748b",
  success: "#10b981",
  warning: "#f59e0b",
  destructive: "#ef4444",
  accent: "#8b5cf6",
  indigo: "#6366f1",
  amber: "#f59e0b",
  emerald: "#10b981",
  red: "#ef4444",
  violet: "#8b5cf6",
  pink: "#ec4899",
  teal: "#14b8a6",
  orange: "#f97316",
  cyan: "#06b6d4",
  lime: "#84cc16",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  purple: "#a855f7",
  rose: "#f43f5e",
  sky: "#0ea5e9",
};

/** Default palette used when no colors prop is provided */
export const DEFAULT_CHART_COLOR_NAMES: ChartColor[] = [
  "indigo",
  "amber",
  "emerald",
  "red",
  "violet",
  "pink",
  "teal",
  "orange",
];

/** Resolve a single named color to hex. Pass-through for hex/rgb strings. */
export function resolveColor(color: ChartColor): string {
  return NAMED_COLORS[color] || color;
}

/** Resolve an array of colors for N series, cycling through the palette. */
export function resolveColors(
  colors: ChartColor[] | undefined,
  count: number
): string[] {
  const palette = colors || DEFAULT_CHART_COLOR_NAMES;
  return Array.from({ length: count }, (_, i) =>
    resolveColor(palette[i % palette.length])
  );
}
