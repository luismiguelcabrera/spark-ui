import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadarChart } from "./radar-chart";
import { ScatterChart } from "./scatter-chart";
import { FunnelChart } from "./funnel-chart";
import { HeatmapChart } from "./heatmap-chart";
import { ComboChart } from "./combo-chart";

// ─── Sample Data ─────────────────────────────────────────────────────────────

const comparisonData = [
  { skill: "Design", Alice: 80, Bob: 65 },
  { skill: "Frontend", Alice: 90, Bob: 75 },
  { skill: "Backend", Alice: 70, Bob: 90 },
  { skill: "DevOps", Alice: 60, Bob: 85 },
  { skill: "Testing", Alice: 85, Bob: 70 },
];

const heightWeightSeries = [
  {
    name: "Participants",
    data: [
      { x: 160, y: 55, label: "Person 1" },
      { x: 165, y: 62, label: "Person 2" },
      { x: 170, y: 68, label: "Person 3" },
      { x: 172, y: 72, label: "Person 4" },
      { x: 175, y: 70, label: "Person 5" },
      { x: 178, y: 78, label: "Person 6" },
      { x: 180, y: 85, label: "Person 7" },
      { x: 182, y: 80, label: "Person 8" },
      { x: 185, y: 88, label: "Person 9" },
      { x: 190, y: 92, label: "Person 10" },
    ],
  },
];

const scatterMultiSeries = [
  {
    name: "Math Scores",
    color: "indigo" as const,
    data: [
      { x: 65, y: 70 },
      { x: 72, y: 78 },
      { x: 80, y: 85 },
      { x: 88, y: 90 },
      { x: 95, y: 92 },
    ],
  },
  {
    name: "Science Scores",
    color: "emerald" as const,
    data: [
      { x: 60, y: 65 },
      { x: 70, y: 72 },
      { x: 75, y: 80 },
      { x: 85, y: 88 },
      { x: 92, y: 95 },
    ],
  },
];

const funnelData = [
  { name: "Leads", value: 5000 },
  { name: "Qualified", value: 3200 },
  { name: "Proposal", value: 1800 },
  { name: "Negotiation", value: 900 },
  { name: "Closed", value: 450 },
];

// Deterministic heatmap data
const weeklyActivity = (() => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = [
    "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm",
  ];
  return days.flatMap((day, di) =>
    hours.map((hour, hi) => ({
      x: day,
      y: hour,
      value: ((di * 7 + hi * 13 + 5) % 50) + 1,
    }))
  );
})();

const monthlyData = (() => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const cats = ["Sales", "Marketing", "Support", "Engineering"];
  return months.flatMap((month, mi) =>
    cats.map((cat, ci) => ({
      x: month,
      y: cat,
      value: ((mi * 11 + ci * 17 + 3) % 90) + 10,
    }))
  );
})();

const comboData = [
  { month: "Jan", Revenue: 42, Target: 50 },
  { month: "Feb", Revenue: 38, Target: 50 },
  { month: "Mar", Revenue: 51, Target: 50 },
  { month: "Apr", Revenue: 46, Target: 50 },
  { month: "May", Revenue: 58, Target: 50 },
  { month: "Jun", Revenue: 62, Target: 50 },
];

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta = {
  title: "Data Display/Charts Advanced",
  component: RadarChart,
  tags: ["autodocs"],
  argTypes: {
    showGrid: { control: "boolean" },
    showLabels: { control: "boolean" },
    showDots: { control: "boolean" },
  },
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── RadarChart Stories ──────────────────────────────────────────────────────

export const RadarDefault: Story = {
  name: "Radar - Skill Assessment",
  args: {
    data: comparisonData,
    index: "skill",
    categories: ["Alice"],
    showGrid: true,
    showLabels: true,
    showDots: true,
  },
};

export const RadarMultiSeries: Story = {
  name: "Radar - Multi-Series Comparison",
  args: {
    data: comparisonData,
    index: "skill",
    categories: ["Alice", "Bob"],
    showGrid: true,
    showLabels: true,
    showDots: true,
  },
  render: (args) => (
    <RadarChart
      data={comparisonData}
      index="skill"
      categories={["Alice", "Bob"]}
      colors={["indigo", "amber"]}
      size={350}
      showGrid={args.showGrid}
      showLabels={args.showLabels}
      showDots={args.showDots}
      fillOpacity={0.15}
      showLegend
    />
  ),
};

export const RadarCustomColor: Story = {
  name: "Radar - Custom Color",
  args: {
    data: comparisonData,
    index: "skill",
    categories: ["Alice"],
    showGrid: true,
    showLabels: true,
    showDots: true,
  },
  render: (args) => (
    <RadarChart
      data={comparisonData}
      index="skill"
      categories={["Alice"]}
      colors={["emerald"]}
      fillOpacity={0.3}
      size={300}
      showGrid={args.showGrid}
      showLabels={args.showLabels}
      showDots={args.showDots}
    />
  ),
};

// ─── ScatterChart Stories ────────────────────────────────────────────────────

export const ScatterDefault: Story = {
  name: "Scatter - Height vs Weight",
  args: {
    data: comparisonData,
    index: "skill",
    categories: ["Alice"],
  },
  render: () => (
    <ScatterChart
      series={heightWeightSeries}
      xLabel="Height (cm)"
      yLabel="Weight (kg)"
      dotSize={8}
    />
  ),
};

export const ScatterMultiSeries: Story = {
  name: "Scatter - Test Scores Comparison",
  args: {
    data: comparisonData,
    index: "skill",
    categories: ["Alice"],
  },
  render: () => (
    <ScatterChart
      series={scatterMultiSeries}
      xLabel="Study Hours"
      yLabel="Score"
      dotSize={7}
      height={350}
      showLegend
    />
  ),
};

export const ScatterBubble: Story = {
  name: "Scatter - Bubble Chart",
  args: {
    data: comparisonData,
    index: "skill",
    categories: ["Alice"],
  },
  render: () => (
    <ScatterChart
      series={[
        {
          name: "Products",
          data: [
            { x: 10, y: 20, size: 20, label: "Small" },
            { x: 30, y: 50, size: 30, label: "Medium" },
            { x: 60, y: 40, size: 45, label: "Large" },
            { x: 80, y: 70, size: 25, label: "Mid" },
            { x: 50, y: 80, size: 35, label: "Big" },
          ],
        },
      ]}
      height={350}
    />
  ),
};

// ─── FunnelChart Stories ─────────────────────────────────────────────────────

export const FunnelDefault: Story = {
  name: "Funnel - Sales Pipeline",
  args: {
    data: comparisonData,
    index: "skill",
    categories: ["Alice"],
  },
  render: () => (
    <FunnelChart data={funnelData} showValues showPercentage height={350} />
  ),
};

export const FunnelHorizontal: Story = {
  name: "Funnel - Horizontal",
  args: {
    data: comparisonData,
    index: "skill",
    categories: ["Alice"],
  },
  render: () => (
    <FunnelChart
      data={funnelData}
      orientation="horizontal"
      showValues
      height={300}
    />
  ),
};

export const FunnelCustomColors: Story = {
  name: "Funnel - Custom Colors",
  args: {
    data: comparisonData,
    index: "skill",
    categories: ["Alice"],
  },
  render: () => (
    <FunnelChart
      data={[
        { name: "Visitors", value: 10000, color: "#3b82f6" },
        { name: "Sign ups", value: 5000, color: "#6366f1" },
        { name: "Trials", value: 2500, color: "#8b5cf6" },
        { name: "Paid", value: 1200, color: "#a855f7" },
        { name: "Enterprise", value: 400, color: "#c084fc" },
      ]}
      showValues
      showPercentage
      height={350}
    />
  ),
};

// ─── HeatmapChart Stories ────────────────────────────────────────────────────

export const HeatmapDefault: Story = {
  name: "Heatmap - Weekly Activity",
  args: {
    data: comparisonData,
    index: "skill",
    categories: ["Alice"],
  },
  render: () => (
    <HeatmapChart data={weeklyActivity} showValues showLegend height={350} />
  ),
};

export const HeatmapMonthly: Story = {
  name: "Heatmap - Department Performance",
  args: {
    data: comparisonData,
    index: "skill",
    categories: ["Alice"],
  },
  render: () => (
    <HeatmapChart
      data={monthlyData}
      showValues
      showLegend
      colorScale={["#fef3c7", "#d97706"]}
      height={250}
    />
  ),
};

export const HeatmapCompact: Story = {
  name: "Heatmap - Compact (No Values)",
  args: {
    data: comparisonData,
    index: "skill",
    categories: ["Alice"],
  },
  render: () => (
    <HeatmapChart
      data={weeklyActivity}
      showValues={false}
      showLegend
      colorScale={["#ecfdf5", "#059669"]}
      height={300}
    />
  ),
};

// ─── ComboChart Stories ──────────────────────────────────────────────────────

export const ComboDefault: Story = {
  name: "Combo - Bar + Line",
  args: {
    data: comparisonData,
    index: "skill",
    categories: ["Alice"],
  },
  render: () => (
    <ComboChart
      data={comboData}
      index="month"
      barSeries={{ categories: ["Revenue"], colors: ["indigo"] }}
      lineSeries={{
        categories: ["Target"],
        colors: ["red"],
        curveType: "monotone",
      }}
      showLegend
      height={300}
    />
  ),
};

// ─── Gallery Story ───────────────────────────────────────────────────────────

export const Gallery: Story = {
  name: "Gallery - All Advanced Charts",
  args: {
    data: comparisonData,
    index: "skill",
    categories: ["Alice"],
  },
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-4">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">
          Radar Chart
        </h3>
        <RadarChart
          data={comparisonData}
          index="skill"
          categories={["Alice", "Bob"]}
          colors={["indigo", "amber"]}
          size={280}
          fillOpacity={0.15}
          showLegend
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">
          Scatter Chart
        </h3>
        <ScatterChart
          series={heightWeightSeries}
          xLabel="Height (cm)"
          yLabel="Weight (kg)"
          height={280}
          dotSize={7}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">
          Funnel Chart
        </h3>
        <FunnelChart
          data={funnelData}
          showValues
          showPercentage
          height={280}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">
          Heatmap Chart
        </h3>
        <HeatmapChart
          data={monthlyData}
          showValues
          showLegend
          colorScale={["#eff6ff", "#1d4ed8"]}
          height={250}
        />
      </div>
      <div className="col-span-2">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">
          Combo Chart (Bar + Line)
        </h3>
        <ComboChart
          data={comboData}
          index="month"
          barSeries={{ categories: ["Revenue"], colors: ["indigo"] }}
          lineSeries={{
            categories: ["Target"],
            colors: ["red"],
            curveType: "monotone",
          }}
          showLegend
          height={280}
        />
      </div>
    </div>
  ),
};
