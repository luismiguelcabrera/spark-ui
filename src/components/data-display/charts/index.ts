// ── Chart Components ──────────────────────────────────────────────────────────

export { BarChart } from "./bar-chart";
export type { BarChartProps, BarChartType, BarChartLayout } from "./bar-chart";

export { LineChart } from "./line-chart";
export type { LineChartProps } from "./line-chart";

export { AreaChart } from "./area-chart";
export type { AreaChartProps, AreaChartType, AreaFill } from "./area-chart";

export { PieChart } from "./pie-chart";
export type { PieChartProps, PieChartDataPoint } from "./pie-chart";

export { RadarChart } from "./radar-chart";
export type { RadarChartProps } from "./radar-chart";

export { ScatterChart } from "./scatter-chart";
export type { ScatterChartProps, ScatterSeries, ScatterDataPoint } from "./scatter-chart";

export { FunnelChart } from "./funnel-chart";
export type { FunnelChartProps, FunnelChartDataPoint } from "./funnel-chart";

export { HeatmapChart } from "./heatmap-chart";
export type { HeatmapChartProps, HeatmapDataPoint } from "./heatmap-chart";

export { ComboChart } from "./combo-chart";
export type { ComboChartProps, ComboBarSeries, ComboLineSeries } from "./combo-chart";

// ── Sparkline Charts ─────────────────────────────────────────────────────────

export { SparkLineChart } from "./spark-line-chart";
export type { SparkLineChartProps } from "./spark-line-chart";

export { SparkBarChart } from "./spark-bar-chart";
export type { SparkBarChartProps } from "./spark-bar-chart";

export { SparkAreaChart } from "./spark-area-chart";
export type { SparkAreaChartProps } from "./spark-area-chart";

// ── Shared Types ─────────────────────────────────────────────────────────────

export type {
  ChartColor,
  TooltipProps,
  TooltipPayloadEntry,
  ChartEventProps,
  ReferenceLine,
  CurveType,
} from "./chart-types";

// ── Shared Utilities ─────────────────────────────────────────────────────────

export { resolveColor, resolveColors, DEFAULT_CHART_COLOR_NAMES } from "./chart-colors";

export {
  DEFAULT_CHART_COLORS,
  CHART_PADDING,
  getNiceMax,
  getGridLines,
  formatValue,
  getStraightPath,
  getSmoothPath,
  getStraightAreaPath,
  getSmoothAreaPath,
  getStepPath,
  getStepAreaPath,
  getPathForCurve,
  getAreaPathForCurve,
  prefersReducedMotion,
} from "./chart-utils";

export { ChartTooltip } from "./chart-tooltip";
export { ChartLegend } from "./chart-legend";

// ── Backward Compatibility ───────────────────────────────────────────────────

/** @deprecated Use PieChart with variant="donut" instead */
export { PieChart as DonutChart } from "./pie-chart";
/** @deprecated Use PieChartProps instead */
export type { PieChartProps as DonutChartProps } from "./pie-chart";
/** @deprecated Use PieChartDataPoint instead */
export type { PieChartDataPoint as DonutChartDataPoint } from "./pie-chart";
