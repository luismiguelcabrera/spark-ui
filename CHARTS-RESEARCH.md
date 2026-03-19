# Spark UI Charts — Competitive Research & API Design

## Table of Contents
1. [Current State](#current-state)
2. [Library Landscape](#library-landscape)
3. [Feature Matrix](#feature-matrix)
4. [Chart Types Comparison](#chart-types-comparison)
5. [API Design Patterns](#api-design-patterns)
6. [Recommended Chart Types](#recommended-chart-types)
7. [Recommended Features](#recommended-features)
8. [Proposed API](#proposed-api)
9. [Migration & Breaking Changes](#migration--breaking-changes)
10. [Implementation Priority](#implementation-priority)

---

## Current State

Spark UI ships **9 chart types**, all implemented as **pure SVG** with zero external charting dependencies:

| Chart | Multi-Series | Stacking | Animation | Tooltip | Legend |
|-------|-------------|----------|-----------|---------|--------|
| AreaChart | Yes | Yes | No | Yes | No |
| BarChart | No | No | Yes | Yes | No |
| LineChart | No | No | No | Yes | No |
| DonutChart | N/A | N/A | Yes | Yes | Yes |
| RadarChart | Yes | No | No | Yes | No |
| ScatterChart | Yes | No | No | Yes | No |
| FunnelChart | N/A | N/A | No | Yes | No |
| HeatmapChart | N/A | N/A | No | Yes | Yes |
| ComboChart | Yes (layers) | No | Yes | Yes | Yes |

**Current strengths:**
- Zero dependencies (pure SVG)
- Lightweight bundle
- Consistent with spark-ui component patterns (forwardRef, className, displayName)
- Basic hover tooltips on all charts

**Current gaps vs. competition:**
- No responsive container (uses `width="100%"` with viewBox)
- No custom tooltips (hardcoded dark rect)
- No legend on most charts
- No click handlers / `onValueChange`
- No reference lines / annotations
- No grid customization
- No axis label formatting
- No brush/zoom
- No accessibility beyond `role="img"`
- No animation on most charts
- No `connectNulls` for line/area
- No curve type options (only straight or Catmull-Rom)
- BarChart doesn't support multi-series / grouped bars
- LineChart doesn't support multi-series
- No sparkline variants
- No `valueFormatter` for axes/tooltips
- No color scales or theme-aware colors

---

## Library Landscape

### React-Specific Libraries

| Library | Downloads | Chart Types | Rendering | Bundle | API Style | Key Differentiator |
|---------|-----------|-------------|-----------|--------|-----------|-------------------|
| **Recharts** | ~3.6M/wk | 12 | SVG | ~200KB | Composable JSX children | Most popular React chart lib; declarative composition |
| **Nivo** | ~500K/wk | 29 | SVG/Canvas/HTML | Modular | Config props + layers | Most chart types; SSR; patterns/gradients; 3 renderers |
| **Victory** | ~272K/wk | 11 | SVG | ~300KB | Composable + containers | 5 interaction containers; React Native; powerful events |
| **Tremor** | ~100K/wk | 6+3 spark | SVG (Recharts) | Copy-paste | Flat props (data/index/categories) | Simplest API; Tailwind-native; dashboard-first |
| **MUI X Charts** | Growing | 10 | SVG/WebGL | Requires MUI | Dual (simple + composition) | Best a11y (WCAG 2.1 AA); dual API pattern |
| **Visx** | ~200K/wk | 39 packages | SVG | Ultra-modular | Low-level primitives | Maximum flexibility; D3 power + React rendering |

### Framework-Agnostic Libraries

| Library | Stars | Chart Types | Rendering | Bundle | Key Differentiator |
|---------|-------|-------------|-----------|--------|-------------------|
| **Apache ECharts** | 66K | 23+ | Canvas/SVG | ~1MB (tree-shakeable to ~250KB) | Most feature-complete; 10M+ data points; dataset transforms; 3D |
| **ApexCharts** | 15K | 19 | SVG | ~475KB | Best out-of-box polish; built-in toolbar/export; keyboard a11y |
| **Chart.js** | 65K | 8 | Canvas | ~200KB | Most popular overall; simple API |
| **Highcharts** | 12K | 30+ | SVG | ~300KB | Enterprise-grade; commercial license |

---

## Feature Matrix

### Core Features — Who Has What

| Feature | Spark UI | Recharts | Nivo | Victory | Tremor | MUI X | ApexCharts | ECharts |
|---------|----------|----------|------|---------|--------|-------|------------|---------|
| **Custom tooltip** | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Legend** | Partial | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Click handlers** | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Value formatter** | No | Yes | Yes | No | Yes | Yes | Yes | Yes |
| **Reference lines** | No | Yes | No* | No | No | Yes | Yes | Yes |
| **Annotations** | No | Yes | Yes | No | No | No | Yes | Yes |
| **Brush/Zoom** | No | Yes | No | Yes | No | No | Yes | Yes |
| **Responsive container** | ViewBox | Yes | Yes | No | Yes | Yes | Yes | Yes |
| **Stacking** | Partial | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Multi-axis** | No | Yes | No | Yes | No | Yes | Yes | Yes |
| **Keyboard a11y** | No | Partial | No | Partial | No | Yes | Yes | No |
| **ARIA labels** | Basic | Partial | Basic | Partial | No | Yes | Yes | Yes |
| **prefers-reduced-motion** | No | No | No | No | No | Yes | No | No |
| **connectNulls** | No | Yes | Yes | No | Yes | Yes | Yes | Yes |
| **Curve types** | 2 | 16 | Via D3 | 11 | No | 8 | 3 | Via D3 |
| **Gradients/patterns** | Partial | Yes | Yes | No | Yes | Yes | Yes | Yes |
| **Dark mode** | No | No | Yes | Via theme | Yes | Yes | Yes | Yes |
| **SSR safe** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Animation** | Partial | Yes | Yes | Yes | Minimal | Yes | Yes | Yes |
| **Export (PNG/SVG/CSV)** | No | No | No | No | No | No | Yes | Partial |
| **Sparklines** | No | No | No | No | Yes | Yes | Yes | No |
| **Localization** | No | No | No | No | No | No | Yes | No |
| **Data labels** | Partial | Yes | Yes | Yes | No | No | Yes | Yes |
| **Loading state** | No | No | No | No | No | Yes | Yes | Yes |

\* Nivo uses custom layers for reference lines

### Interaction Features

| Feature | Spark UI | Recharts | Victory | MUI X | ApexCharts | ECharts |
|---------|----------|----------|---------|-------|------------|---------|
| **Hover highlight** | Basic | Yes | Yes | Yes | Yes | Yes |
| **Click select** | No | Yes | Yes | Yes | Yes | Yes |
| **Drag zoom** | No | Yes (Brush) | Yes (ZoomContainer) | No | Yes | Yes (dataZoom) |
| **Pan** | No | No | Yes (ZoomContainer) | No | Yes | Yes |
| **Crosshair** | No | Partial | Yes (CursorContainer) | Yes | Yes | Yes |
| **Brush selection** | No | Yes | Yes (BrushContainer) | No | Yes | Yes |
| **Synchronized charts** | No | Yes (syncId) | No | Yes (highlightedItem) | Yes (group) | Yes (connect) |
| **Series toggle** | No | Yes (Legend click) | No | Yes | Yes | Yes |

---

## Chart Types Comparison

### What Every Major Library Supports

| Chart Type | Spark UI | Recharts | Nivo | Victory | Tremor | MUI X | ApexCharts | ECharts |
|------------|----------|----------|------|---------|--------|-------|------------|---------|
| **Bar** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Line** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Area** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Pie/Donut** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Radar/Spider** | Yes | Yes | Yes | Yes* | No | Yes | Yes | Yes |
| **Scatter** | Yes | Yes | Yes | Yes | No | Yes | Yes | Yes |
| **Funnel** | Yes | Yes | Yes | No | No | Yes* | Yes | Yes |
| **Heatmap** | Yes | No | Yes | No | No | Yes* | Yes | Yes |
| **Combo/Composed** | Yes | Yes | No | Yes | Yes | Yes | Yes | Yes |
| **Radial Bar** | No | Yes | Yes | No | No | No | Yes | No |
| **Treemap** | No | Yes | Yes | No | No | No | Yes | Yes |
| **Sankey** | No | Yes | Yes | No | No | No | No | Yes |
| **Sunburst** | No | Yes | Yes | No | No | No | No | Yes |
| **Box Plot** | No | No | Yes | Yes | No | No | Yes | Yes |
| **Candlestick** | No | No | No | Yes | No | No | Yes | Yes |
| **Gauge** | No | No | No | No | No | Yes | Yes | Yes |
| **Bubble** | No | Yes** | No | Yes** | No | No | Yes | Yes |
| **Sparkline** | No | No | No | No | Yes | Yes | Yes*** | No |
| **Histogram** | No | No | No | Yes | No | No | No | No |
| **Waffle** | No | No | Yes | No | No | No | No | No |
| **Calendar** | No | No | Yes | No | No | No | No | Yes |
| **Network/Graph** | No | No | Yes | No | No | No | No | Yes |
| **Geo/Map** | No | No | Yes | No | No | No | No | Yes |
| **Polar Area** | No | No | Yes | No | No | No | Yes | No |
| **Bump** | No | No | Yes | No | No | No | No | No |
| **Stream** | No | No | Yes | No | No | No | No | Yes |
| **Slope** | No | No | No | No | No | No | Yes | No |
| **Parallel Coords** | No | No | Yes | No | No | No | No | Yes |

\* Pro/paid plan only
\*\* Via ZAxis/size on scatter
\*\*\* Via sparkline mode flag

### Chart Types Ranked by Demand (across all libraries)

1. **Bar, Line, Area, Pie/Donut** — Universal (every library has these)
2. **Scatter, Radar, Combo** — Very common (7-8/8 libraries)
3. **Funnel, Heatmap** — Common (5-6/8)
4. **Radial Bar, Treemap, Gauge** — Moderate (3-4/8)
5. **Box Plot, Candlestick, Sankey, Sparkline** — Niche but valuable (2-4/8)
6. **Sunburst, Bubble, Histogram, Waffle, Calendar** — Specialized (1-3/8)
7. **Network, Geo, Polar Area, Bump, Stream, Slope** — Advanced/niche (1-2/8)

---

## API Design Patterns

### Pattern Comparison: How Libraries Structure Their API

#### 1. Composable JSX (Recharts, Victory, Visx)
```tsx
// Recharts style
<BarChart data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="value" fill="#8884d8" />
  <Bar dataKey="value2" fill="#82ca9d" />
</BarChart>
```
**Pros:** Maximum flexibility, composable, familiar React pattern
**Cons:** Verbose, steep learning curve, more boilerplate

#### 2. Flat Props (Tremor, Spark UI current)
```tsx
// Tremor style
<BarChart
  data={data}
  index="name"
  categories={["value", "value2"]}
  colors={["indigo", "emerald"]}
  valueFormatter={(v) => `$${v}`}
  showLegend={true}
/>
```
**Pros:** Minimal boilerplate, easy to learn, great for dashboards
**Cons:** Less flexible, harder to customize deeply

#### 3. Options Object (ApexCharts, ECharts)
```tsx
// ApexCharts style
<Chart
  type="bar"
  series={[{ name: "Sales", data: [30, 40, 45] }]}
  options={{
    chart: { toolbar: { show: true } },
    xaxis: { categories: ["A", "B", "C"] },
    tooltip: { theme: "dark" }
  }}
/>
```
**Pros:** All config in one place, easy to serialize/store
**Cons:** Deeply nested objects, less idiomatic React

#### 4. Dual API (MUI X Charts)
```tsx
// Simple mode
<BarChart series={[{ data: [1, 2, 3] }]} xAxis={[{ data: ["A", "B", "C"] }]} />

// Composition mode (same library)
<ChartContainer series={series} xAxis={xAxis}>
  <BarPlot />
  <ChartsXAxis />
  <ChartsTooltip />
</ChartContainer>
```
**Pros:** Easy start + power when needed
**Cons:** Two mental models, larger API surface

### Recommended Pattern for Spark UI: **Flat Props + Slots**

The Tremor-style flat props API is the best fit for Spark UI because:
1. **Consistency** — Matches spark-ui's component philosophy (simple props, `className` override)
2. **Simplicity** — Dashboard developers (primary audience) want minimal boilerplate
3. **Tailwind-native** — Colors as Tailwind-aware values, not hex strings
4. **Zero learning curve** — `data`, `index`, `categories` is immediately understandable
5. **Customizable via slots** — Custom tooltip, legend, etc. via render props (not composition)

Add escape hatches via:
- `customTooltip` — render prop for tooltip content
- `customLegend` — render prop for legend content
- `children` — SVG children injected into the chart area (for annotations/overlays)

---

## Recommended Chart Types

### Tier 1 — Must Have (Already exist, need API improvements)
1. **BarChart** — Add multi-series, grouped, stacked, horizontal
2. **LineChart** — Add multi-series, curve types, connectNulls
3. **AreaChart** — Already good, add connectNulls
4. **DonutChart** — Rename to `PieChart` with `variant="donut"|"pie"` (industry standard)
5. **RadarChart** — Already good
6. **ScatterChart** — Add bubble support via `size` accessor
7. **FunnelChart** — Already good
8. **HeatmapChart** — Already good, add color scale config
9. **ComboChart** — Already good

### Tier 2 — Should Add (High demand, 5+ libraries have them)
10. **SparkLineChart** — Compact inline chart (no axes/legend/tooltip)
11. **SparkBarChart** — Compact inline bar
12. **SparkAreaChart** — Compact inline area
13. **RadialBarChart** — Circular progress/comparison bars
14. **TreemapChart** — Hierarchical part-of-whole
15. **GaugeChart** — Single-value radial indicator

### Tier 3 — Nice to Have (Moderate demand)
16. **BoxPlotChart** — Statistical distribution
17. **CandlestickChart** — Financial OHLC
18. **SankeyChart** — Flow diagrams
19. **WaffleChart** — Grid-based part-of-whole
20. **CalendarChart** — GitHub-style contribution heatmap

### Not Recommended (too niche for a general component library)
- Network/Graph — Use a dedicated library (react-force-graph, vis-network)
- Geo/Map — Use a dedicated library (react-simple-maps, mapbox-gl)
- 3D Charts — Use ECharts GL
- Parallel Coordinates — Very niche
- Sunburst — Treemap covers the same use case more accessibly
- Bump — Very niche

---

## Recommended Features

### Priority 1 — Must Have (Every competitor has these)

#### 1. Unified Data API
```tsx
// All Cartesian charts use: data + index + categories
<BarChart
  data={[
    { month: "Jan", revenue: 4000, profit: 2400 },
    { month: "Feb", revenue: 3000, profit: 1398 },
  ]}
  index="month"                           // x-axis field
  categories={["revenue", "profit"]}      // series to plot
/>
```

#### 2. Value Formatter
```tsx
<BarChart
  valueFormatter={(value) => `$${value.toLocaleString()}`}
  // Applied to: y-axis ticks, tooltip values, data labels
/>
```

#### 3. Custom Tooltip
```tsx
<BarChart
  customTooltip={({ active, payload, label }) => (
    <div className="bg-white shadow-lg rounded-lg p-3">
      <p className="font-bold">{label}</p>
      {payload.map(entry => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )}
/>
```

#### 4. Legend
```tsx
<BarChart
  showLegend={true}
  legendPosition="bottom"     // "top" | "bottom" | "left" | "right"
  enableLegendSlider={false}  // scrollable when many series
  onLegendClick={(series) => {}} // toggle series visibility
/>
```

#### 5. Click Handlers
```tsx
<BarChart
  onValueChange={(value) => {
    // value = { eventType: "bar", categoryClicked: "revenue", ...datum }
    // value = null when clicking away
  }}
/>
```

#### 6. Color System (Theme-Aware)
```tsx
// Named colors that resolve from CSS variables / Tailwind
<BarChart
  colors={["primary", "secondary", "success", "warning", "destructive"]}
  // OR custom hex/tailwind colors
  colors={["#6366f1", "#f59e0b", "#10b981"]}
/>
```

#### 7. Reference Lines
```tsx
<BarChart
  referenceLines={[
    { y: 5000, label: "Target", color: "destructive", strokeDasharray: "4 4" },
    { x: "Mar", label: "Launch", color: "success" },
  ]}
/>
```

#### 8. Stacking
```tsx
<BarChart
  type="stacked"       // "default" | "stacked" | "percent"
  // "percent" normalizes to 100%
/>
// Also applies to AreaChart
```

#### 9. Axis Configuration
```tsx
<BarChart
  showXAxis={true}
  showYAxis={true}
  showGridLines={true}
  xAxisLabel="Month"
  yAxisLabel="Revenue ($)"
  startEndOnly={false}           // only show first/last x-axis labels
  autoMinValue={false}           // auto-adjust y-axis min from data
  minValue={0}
  maxValue={10000}
  allowDecimals={true}
  tickGap={5}                    // min gap between x-axis labels
  yAxisWidth={56}                // y-axis width in px
/>
```

#### 10. Animation with Reduced Motion
```tsx
<BarChart
  animate={true}                          // default: true
  animationDuration={600}                 // default: 600ms
  // Automatically respects prefers-reduced-motion
/>
```

### Priority 2 — Should Have (Differentiators)

#### 11. Responsive Container
```tsx
// Charts auto-size to parent container width
// Height is explicit or via aspect ratio
<BarChart height={300} />           // fixed height
<BarChart aspectRatio={16/9} />     // height = width / aspectRatio
```

#### 12. Connect Nulls (Line/Area)
```tsx
<LineChart connectNulls={true} />
// When data has gaps (null/undefined values), draw a line through them
```

#### 13. Curve Types (Line/Area)
```tsx
<LineChart
  curveType="monotone"
  // "linear" | "monotone" | "step" | "stepBefore" | "stepAfter" | "natural" | "bump"
/>
```

#### 14. Data Labels
```tsx
<BarChart
  showDataLabels={true}
  dataLabelPosition="top"         // "top" | "inside" | "outside"
  dataLabelFormatter={(v) => `$${v}`}
/>
```

#### 15. Gradient Fill (Area)
```tsx
<AreaChart
  fill="gradient"                  // "gradient" | "solid" | "none"
/>
```

#### 16. Loading State
```tsx
<BarChart
  loading={true}
  loadingText="Fetching data..."
  // Shows skeleton/shimmer while loading
/>
```

#### 17. Empty State
```tsx
<BarChart
  data={[]}
  emptyText="No data available"
  emptyIcon={<Icon name="chart-bar" />}
/>
```

#### 18. Accessibility (WCAG AA)
```tsx
<BarChart
  ariaLabel="Monthly revenue chart for 2024"
  ariaDescription="Bar chart showing revenue and profit by month"
  // Keyboard navigation: arrow keys move between data points
  // Focus ring on bars/dots
  // Screen reader announces values
  // Respects prefers-reduced-motion
/>
```

### Priority 3 — Nice to Have (Power Features)

#### 19. Brush / Data Zoom
```tsx
<LineChart
  enableBrush={true}              // shows a mini chart below for range selection
  brushHeight={40}
/>
```

#### 20. Synchronized Charts
```tsx
<ChartGroup syncId="dashboard">
  <LineChart data={data} index="month" categories={["revenue"]} />
  <BarChart data={data} index="month" categories={["orders"]} />
</ChartGroup>
// Hovering one chart highlights the same x-position in the other
```

#### 21. Multi-Axis
```tsx
<ComboChart
  barSeries={{ categories: ["revenue"], yAxisLabel: "Revenue ($)" }}
  lineSeries={{ categories: ["growth"], yAxisLabel: "Growth (%)" }}
  enableBiaxial={true}           // separate Y axes for bar and line
/>
```

#### 22. Export
```tsx
const chartRef = useRef();
chartRef.current.exportAs("png");   // or "svg" or "csv"

<BarChart ref={chartRef} />
```

#### 23. Sparklines
```tsx
// Compact chart variants with no axes, legend, or tooltip
<SparkLineChart data={[4, 2, 6, 8, 3, 7]} color="primary" />
<SparkBarChart data={[4, 2, 6, 8, 3, 7]} color="success" />
<SparkAreaChart data={[4, 2, 6, 8, 3, 7]} color="warning" fill="gradient" />
```

---

## Proposed API

### Unified Data Format

All Cartesian charts (Bar, Line, Area, Combo) share the same data API:

```tsx
// Data: array of objects
const data = [
  { month: "Jan", revenue: 4000, profit: 2400, orders: 240 },
  { month: "Feb", revenue: 3000, profit: 1398, orders: 198 },
  { month: "Mar", revenue: 5000, profit: 3200, orders: 305 },
];

// index: string key for x-axis (categorical dimension)
// categories: string[] keys for y-axis (numeric series to plot)
```

### Shared Chart Props (All Cartesian Charts)

```tsx
type SharedChartProps = {
  // Data
  data: Record<string, any>[];
  index: string;
  categories: string[];

  // Colors
  colors?: ChartColor[];           // Named or custom colors

  // Layout
  height?: number;                 // Default: 300
  aspectRatio?: number;            // Alternative to height
  className?: string;

  // Axes
  showXAxis?: boolean;             // Default: true
  showYAxis?: boolean;             // Default: true
  showGridLines?: boolean;         // Default: true
  xAxisLabel?: string;
  yAxisLabel?: string;
  yAxisWidth?: number;             // Default: 56
  startEndOnly?: boolean;          // Default: false
  allowDecimals?: boolean;         // Default: true
  autoMinValue?: boolean;          // Default: false
  minValue?: number;
  maxValue?: number;
  tickGap?: number;                // Default: 5

  // Formatting
  valueFormatter?: (value: number) => string;

  // Features
  showLegend?: boolean;            // Default: true
  legendPosition?: "top" | "bottom" | "left" | "right";
  showTooltip?: boolean;           // Default: true
  showDataLabels?: boolean;        // Default: false

  // Interaction
  onValueChange?: (value: ChartEventProps | null) => void;

  // Animation
  animate?: boolean;               // Default: true
  animationDuration?: number;      // Default: 600

  // Reference lines
  referenceLines?: ReferenceLine[];

  // Customization
  customTooltip?: React.ComponentType<TooltipProps>;

  // Accessibility
  ariaLabel?: string;
  ariaDescription?: string;

  // States
  loading?: boolean;

  // HTML
  ...HTMLAttributes<HTMLDivElement>
};

type ChartColor =
  | "primary" | "secondary" | "success" | "warning" | "destructive" | "accent"
  | "indigo" | "amber" | "emerald" | "red" | "violet" | "pink" | "teal" | "orange" | "cyan" | "lime"
  | (string & {});  // Allow any hex/rgb color

type ChartEventProps = {
  eventType: string;
  categoryClicked: string;
  [key: string]: any;
};

type ReferenceLine = {
  x?: string | number;
  y?: number;
  label?: string;
  color?: string;
  strokeDasharray?: string;
};

type TooltipProps = {
  active: boolean;
  payload: { name: string; value: number; color: string }[];
  label: string;
};
```

### Per-Chart Specific Props

```tsx
// BarChart
type BarChartProps = SharedChartProps & {
  type?: "default" | "stacked" | "percent";     // Default: "default"
  layout?: "vertical" | "horizontal";            // Default: "vertical"
  barCategoryGap?: number | string;              // Default: "10%"
};

// LineChart
type LineChartProps = SharedChartProps & {
  curveType?: "linear" | "monotone" | "step" | "stepBefore" | "stepAfter" | "natural" | "bump";
  connectNulls?: boolean;
  showDots?: boolean;                            // Default: true
  strokeWidth?: number;                          // Default: 2
};

// AreaChart
type AreaChartProps = SharedChartProps & {
  type?: "default" | "stacked" | "percent";
  fill?: "gradient" | "solid" | "none";          // Default: "gradient"
  curveType?: "linear" | "monotone" | "step" | "natural" | "bump";
  connectNulls?: boolean;
};

// PieChart (replaces DonutChart)
type PieChartProps = {
  data: { name: string; value: number; color?: string }[];
  variant?: "pie" | "donut";                     // Default: "donut"
  label?: React.ReactNode;                       // Center content (donut)
  showLabel?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  legendPosition?: "top" | "bottom" | "left" | "right";
  colors?: ChartColor[];
  valueFormatter?: (value: number) => string;
  onValueChange?: (value: ChartEventProps | null) => void;
  customTooltip?: React.ComponentType<TooltipProps>;
  height?: number;
  animate?: boolean;
  className?: string;
  ariaLabel?: string;
  ...HTMLAttributes<HTMLDivElement>
};

// RadarChart
type RadarChartProps = {
  data: Record<string, any>[];
  index: string;                                  // Category field (axis labels)
  categories: string[];                           // Series to plot
  colors?: ChartColor[];
  showGrid?: boolean;
  showLabels?: boolean;
  showDots?: boolean;
  fillOpacity?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  height?: number;
  animate?: boolean;
  onValueChange?: (value: ChartEventProps | null) => void;
  customTooltip?: React.ComponentType<TooltipProps>;
  className?: string;
  ariaLabel?: string;
  ...HTMLAttributes<HTMLDivElement>
};

// ScatterChart
type ScatterChartProps = {
  data: { name: string; data: { x: number; y: number; size?: number; label?: string }[] }[];
  xLabel?: string;
  yLabel?: string;
  colors?: ChartColor[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  dotSize?: number;
  height?: number;
  animate?: boolean;
  onValueChange?: (value: ChartEventProps | null) => void;
  customTooltip?: React.ComponentType<TooltipProps>;
  className?: string;
  ariaLabel?: string;
  ...HTMLAttributes<HTMLDivElement>
};

// FunnelChart
type FunnelChartProps = {
  data: { name: string; value: number; color?: string }[];
  showLabels?: boolean;
  showValues?: boolean;
  showPercentage?: boolean;
  orientation?: "vertical" | "horizontal";
  colors?: ChartColor[];
  valueFormatter?: (value: number) => string;
  showTooltip?: boolean;
  height?: number;
  animate?: boolean;
  onValueChange?: (value: ChartEventProps | null) => void;
  customTooltip?: React.ComponentType<TooltipProps>;
  className?: string;
  ariaLabel?: string;
  ...HTMLAttributes<HTMLDivElement>
};

// HeatmapChart
type HeatmapChartProps = {
  data: { x: string; y: string; value: number }[];
  xLabels?: string[];
  yLabels?: string[];
  colorScale?: [string, string] | [string, string, string];  // min-max or min-mid-max
  showValues?: boolean;
  showLegend?: boolean;
  valueFormatter?: (value: number) => string;
  showTooltip?: boolean;
  height?: number;
  onValueChange?: (value: ChartEventProps | null) => void;
  customTooltip?: React.ComponentType<TooltipProps>;
  className?: string;
  ariaLabel?: string;
  ...HTMLAttributes<HTMLDivElement>
};

// ComboChart
type ComboChartProps = SharedChartProps & {
  barSeries: {
    categories: string[];
    colors?: ChartColor[];
    type?: "default" | "stacked" | "percent";
    valueFormatter?: (value: number) => string;
    yAxisLabel?: string;
  };
  lineSeries: {
    categories: string[];
    colors?: ChartColor[];
    curveType?: "linear" | "monotone" | "step" | "natural";
    connectNulls?: boolean;
    showDots?: boolean;
    valueFormatter?: (value: number) => string;
    yAxisLabel?: string;
  };
  enableBiaxial?: boolean;         // Separate Y axes, default: false
};
```

### Sparkline Props

```tsx
type SparkChartProps = {
  data: number[];                  // Simple number array
  color?: ChartColor;             // Default: "primary"
  height?: number;                // Default: 32
  width?: number;                 // Default: "100%"
  animate?: boolean;
  className?: string;
  ariaLabel?: string;
  ...HTMLAttributes<HTMLDivElement>
};

type SparkAreaChartProps = SparkChartProps & {
  fill?: "gradient" | "solid" | "none";
  curveType?: "linear" | "monotone" | "natural";
};

type SparkLineChartProps = SparkChartProps & {
  curveType?: "linear" | "monotone" | "natural";
  strokeWidth?: number;
};

type SparkBarChartProps = SparkChartProps & {
  barGap?: number;
};
```

### New Chart Props (Tier 2)

```tsx
// RadialBarChart
type RadialBarChartProps = {
  data: { name: string; value: number; color?: string }[];
  maxValue?: number;               // Default: auto from data
  startAngle?: number;             // Default: 0
  endAngle?: number;               // Default: 360
  innerRadius?: number;            // Default: 30 (%)
  showLabels?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  colors?: ChartColor[];
  valueFormatter?: (value: number) => string;
  height?: number;
  animate?: boolean;
  className?: string;
  ariaLabel?: string;
};

// TreemapChart
type TreemapChartProps = {
  data: TreeNode[];
  colors?: ChartColor[];
  showLabels?: boolean;
  valueFormatter?: (value: number) => string;
  showTooltip?: boolean;
  height?: number;
  onValueChange?: (value: ChartEventProps | null) => void;
  className?: string;
  ariaLabel?: string;
};

type TreeNode = {
  name: string;
  value?: number;
  children?: TreeNode[];
  color?: string;
};

// GaugeChart
type GaugeChartProps = {
  value: number;
  min?: number;                    // Default: 0
  max?: number;                    // Default: 100
  label?: React.ReactNode;
  valueFormatter?: (value: number) => string;
  color?: ChartColor;
  size?: number;                   // Default: 200
  startAngle?: number;             // Default: -120
  endAngle?: number;               // Default: 120
  showValue?: boolean;             // Default: true
  animate?: boolean;
  className?: string;
  ariaLabel?: string;
};
```

---

## Migration & Breaking Changes

### Changes from Current API

| Current | Proposed | Reason |
|---------|----------|--------|
| `DonutChart` | `PieChart` with `variant="donut"` | Industry standard name; supports both pie and donut |
| `data: {label, value}[]` | `data: Record<string, any>[]` + `index` + `categories` | Unified API across all Cartesian charts; multi-series by design |
| `BarChart.data: {label, value, color?}[]` | `data` + `index` + `categories` + `colors` | Consistent with new data API |
| `LineChart.data: {label, value}[]` | `data` + `index` + `categories` | Multi-series support |
| `AreaChart.series` | `data` + `index` + `categories` | Unified API (no separate single vs multi-series modes) |
| `RadarChart.data: {label, value, max?}[]` | `data` + `index` + `categories` | Unified API |
| `ComboChart.layers` | `barSeries` + `lineSeries` | More explicit; supports biaxial |
| `ScatterChart.data: {x, y}[]` | `data: { name, data: {x, y}[] }[]` | Named series for legend/tooltip |
| `color?: string` (hex) | `colors?: ChartColor[]` (named or hex) | Theme-aware colors; multi-series |
| `height?: number` | `height?: number` | No change |
| No `onValueChange` | `onValueChange` on all charts | Click interaction |
| No `customTooltip` | `customTooltip` on all charts | Custom tooltip rendering |
| No `valueFormatter` | `valueFormatter` on all charts | Consistent formatting |
| No `showLegend` | `showLegend` on all charts | Legend visibility |
| `HeatmapChart.colorRange: [string, string]` | `colorScale: [string, string] \| [string, string, string]` | Support 3-stop scales (diverging) |

### Backward Compatibility Strategy

Export `DonutChart` as a re-export of `PieChart` with `variant="donut"` default for one major version, then deprecate.

For data format changes, consider a migration period where the old `{label, value}[]` format is auto-detected and converted internally with a console.warn in dev mode.

---

## Implementation Priority

### Phase 1 — Core API Upgrade (Breaking)
1. Implement unified `data`/`index`/`categories` API on BarChart, LineChart, AreaChart
2. Add multi-series support to BarChart (grouped + stacked) and LineChart
3. Add `colors` system with named color support
4. Add `valueFormatter` to all charts
5. Add `customTooltip` to all charts
6. Add `showLegend` + legend component to all charts
7. Add `onValueChange` click handler to all charts
8. Add `referenceLines` to Cartesian charts
9. Rename DonutChart → PieChart with variant
10. Add `animate` + `prefers-reduced-motion` support to all charts
11. Add `ariaLabel` + keyboard navigation to all charts

### Phase 2 — Enhanced Features
12. Add `type: "stacked" | "percent"` to BarChart and AreaChart
13. Add `curveType` to LineChart and AreaChart
14. Add `connectNulls` to LineChart and AreaChart
15. Add `layout: "horizontal"` to BarChart
16. Add `showDataLabels` to BarChart and LineChart
17. Add `loading` state to all charts
18. Add `fill: "gradient" | "solid" | "none"` to AreaChart
19. Improve responsive behavior (ResizeObserver-based)

### Phase 3 — New Chart Types
20. SparkLineChart, SparkBarChart, SparkAreaChart
21. RadialBarChart
22. GaugeChart
23. TreemapChart

### Phase 4 — Power Features
24. Brush/DataZoom on LineChart and AreaChart
25. ChartGroup synchronized charts
26. Multi-axis (biaxial) ComboChart
27. Export (PNG/SVG/CSV)

### Phase 5 — Specialized Charts
28. BoxPlotChart
29. CandlestickChart
30. SankeyChart
31. WaffleChart
32. CalendarChart

---

## Usage Examples

### Basic Bar Chart
```tsx
import { BarChart } from "spark-ui";

const data = [
  { month: "Jan", revenue: 4000, profit: 2400 },
  { month: "Feb", revenue: 3000, profit: 1398 },
  { month: "Mar", revenue: 5000, profit: 3200 },
];

<BarChart
  data={data}
  index="month"
  categories={["revenue", "profit"]}
  colors={["primary", "success"]}
  valueFormatter={(v) => `$${v.toLocaleString()}`}
  showLegend
/>
```

### Line Chart with Reference Line
```tsx
<LineChart
  data={data}
  index="month"
  categories={["revenue"]}
  curveType="monotone"
  referenceLines={[{ y: 4000, label: "Target", color: "destructive" }]}
/>
```

### Stacked Area Chart
```tsx
<AreaChart
  data={data}
  index="month"
  categories={["desktop", "mobile", "tablet"]}
  type="stacked"
  fill="gradient"
/>
```

### Interactive Donut with Custom Tooltip
```tsx
<PieChart
  data={[
    { name: "Chrome", value: 63 },
    { name: "Safari", value: 19 },
    { name: "Firefox", value: 11 },
    { name: "Other", value: 7 },
  ]}
  variant="donut"
  label={<span className="text-2xl font-bold">63%</span>}
  onValueChange={(v) => setSelected(v)}
  customTooltip={({ active, payload }) =>
    active ? <div className="bg-white p-2 rounded shadow">{payload[0].name}: {payload[0].value}%</div> : null
  }
/>
```

### Sparkline in a Table Cell
```tsx
<td>
  <SparkLineChart data={[4, 2, 6, 8, 3, 7]} color="success" height={24} />
</td>
```

### Dashboard with Synchronized Charts
```tsx
<ChartGroup syncId="sales-dashboard">
  <AreaChart data={data} index="month" categories={["revenue"]} height={200} />
  <BarChart data={data} index="month" categories={["orders"]} height={150} />
</ChartGroup>
```
