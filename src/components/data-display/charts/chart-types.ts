/** Shared types for all chart components */

export type ChartColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "accent"
  | "indigo"
  | "amber"
  | "emerald"
  | "red"
  | "violet"
  | "pink"
  | "teal"
  | "orange"
  | "cyan"
  | "lime"
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "rose"
  | "sky"
  | (string & {});

export type TooltipPayloadEntry = {
  name: string;
  value: number;
  color: string;
};

export type TooltipProps = {
  active: boolean;
  payload: TooltipPayloadEntry[];
  label: string;
};

export type ChartEventProps = {
  eventType: string;
  categoryClicked: string;
  [key: string]: unknown;
};

export type ReferenceLine = {
  /** X-axis value for vertical reference line */
  x?: string | number;
  /** Y-axis value for horizontal reference line */
  y?: number;
  /** Label text */
  label?: string;
  /** Line color */
  color?: string;
  /** Dash pattern (e.g., "4 4") */
  strokeDasharray?: string;
};

export type CurveType =
  | "linear"
  | "monotone"
  | "step"
  | "stepBefore"
  | "stepAfter"
  | "natural"
  | "bump";
