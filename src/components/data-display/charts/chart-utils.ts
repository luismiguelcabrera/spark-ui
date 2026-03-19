/** Shared constants and utilities for chart components */

import type { CurveType } from "./chart-types";

export const DEFAULT_CHART_COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export const CHART_PADDING = { top: 20, right: 20, bottom: 40, left: 50 };

/** Round a max value up to a "nice" number for axis display */
export function getNiceMax(max: number): number {
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
  const normalized = max / magnitude;
  if (normalized <= 1) return magnitude;
  if (normalized <= 2) return 2 * magnitude;
  if (normalized <= 5) return 5 * magnitude;
  return 10 * magnitude;
}

/** Generate evenly-spaced grid line values from 0 to max */
export function getGridLines(max: number, count = 5): number[] {
  const step = max / count;
  return Array.from({ length: count + 1 }, (_, i) => i * step);
}

/** Format a number for display (1234 → "1.2K", 1500000 → "1.5M") */
export function formatValue(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1);
}

type Point = { x: number; y: number };

/** Generate a straight-line SVG path through points */
export function getStraightPath(points: Point[]): string {
  if (points.length === 0) return "";
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

/** Generate a smooth Catmull-Rom spline SVG path through points */
export function getSmoothPath(points: Point[]): string {
  if (points.length < 2) return points.length === 1 ? `M ${points[0].x} ${points[0].y}` : "";

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}

/** Generate a straight-line area path (closed to baseline) */
export function getStraightAreaPath(points: Point[], baseline: number): string {
  if (points.length === 0) return "";
  const linePath = getStraightPath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${linePath} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
}

/** Generate a smooth area path (closed to baseline) */
export function getSmoothAreaPath(points: Point[], baseline: number): string {
  if (points.length === 0) return "";
  const linePath = getSmoothPath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${linePath} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
}

/** Generate a step path through points */
export function getStepPath(points: Point[], mode: "step" | "stepBefore" | "stepAfter" = "step"): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    if (mode === "stepAfter") {
      path += ` L ${curr.x} ${prev.y} L ${curr.x} ${curr.y}`;
    } else if (mode === "stepBefore") {
      path += ` L ${prev.x} ${curr.y} L ${curr.x} ${curr.y}`;
    } else {
      // step (midpoint)
      const midX = (prev.x + curr.x) / 2;
      path += ` L ${midX} ${prev.y} L ${midX} ${curr.y} L ${curr.x} ${curr.y}`;
    }
  }
  return path;
}

/** Generate a step area path (closed to baseline) */
export function getStepAreaPath(points: Point[], baseline: number, mode: "step" | "stepBefore" | "stepAfter" = "step"): string {
  if (points.length === 0) return "";
  const linePath = getStepPath(points, mode);
  const last = points[points.length - 1];
  const first = points[0];
  return `${linePath} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
}

/** Get the SVG path generator for a given curve type */
export function getPathForCurve(curveType: CurveType, points: Point[]): string {
  switch (curveType) {
    case "monotone":
    case "natural":
    case "bump":
      return getSmoothPath(points);
    case "step":
      return getStepPath(points, "step");
    case "stepBefore":
      return getStepPath(points, "stepBefore");
    case "stepAfter":
      return getStepPath(points, "stepAfter");
    case "linear":
    default:
      return getStraightPath(points);
  }
}

/** Get the SVG area path generator for a given curve type */
export function getAreaPathForCurve(curveType: CurveType, points: Point[], baseline: number): string {
  switch (curveType) {
    case "monotone":
    case "natural":
    case "bump":
      return getSmoothAreaPath(points, baseline);
    case "step":
      return getStepAreaPath(points, baseline, "step");
    case "stepBefore":
      return getStepAreaPath(points, baseline, "stepBefore");
    case "stepAfter":
      return getStepAreaPath(points, baseline, "stepAfter");
    case "linear":
    default:
      return getStraightAreaPath(points, baseline);
  }
}

/** Check if user prefers reduced motion */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
