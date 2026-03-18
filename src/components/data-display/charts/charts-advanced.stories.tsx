import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadarChart } from "./radar-chart";
import { ScatterChart } from "./scatter-chart";
import { FunnelChart } from "./funnel-chart";
import { HeatmapChart } from "./heatmap-chart";

// ─── Sample Data ─────────────────────────────────────────────────────────────

const skillData = [
  { label: "Design", value: 80, max: 100 },
  { label: "Frontend", value: 90, max: 100 },
  { label: "Backend", value: 70, max: 100 },
  { label: "DevOps", value: 60, max: 100 },
  { label: "Testing", value: 85, max: 100 },
];

const radarMultiSeries = [
  {
    name: "Alice",
    color: "#6366f1",
    data: [
      { label: "Design", value: 80 },
      { label: "Frontend", value: 90 },
      { label: "Backend", value: 70 },
      { label: "DevOps", value: 60 },
      { label: "Testing", value: 85 },
    ],
  },
  {
    name: "Bob",
    color: "#f59e0b",
    data: [
      { label: "Design", value: 65 },
      { label: "Frontend", value: 75 },
      { label: "Backend", value: 90 },
      { label: "DevOps", value: 85 },
      { label: "Testing", value: 70 },
    ],
  },
];

const heightWeightData = [
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
];

const scatterMultiSeries = [
  {
    name: "Math Scores",
    color: "#6366f1",
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
    color: "#10b981",
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
  { label: "Leads", value: 5000 },
  { label: "Qualified", value: 3200 },
  { label: "Proposal", value: 1800 },
  { label: "Negotiation", value: 900 },
  { label: "Closed", value: 450 },
];

const weeklyActivity = (() => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];
  const data: { x: string; y: string; value: number }[] = [];
  days.forEach((day) => {
    hours.forEach((hour) => {
      data.push({
        x: day,
        y: hour,
        value: Math.floor(Math.random() * 50) + 1,
      });
    });
  });
  return data;
})();

const monthlyData = (() => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const categories = ["Sales", "Marketing", "Support", "Engineering"];
  const data: { x: string; y: string; value: number }[] = [];
  months.forEach((month) => {
    categories.forEach((cat) => {
      data.push({
        x: month,
        y: cat,
        value: Math.floor(Math.random() * 100) + 10,
      });
    });
  });
  return data;
})();

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
    data: skillData,
    showGrid: true,
    showLabels: true,
    showDots: true,
  },
};

export const RadarMultiSeries: Story = {
  name: "Radar - Multi-Series Comparison",
  args: {
    data: skillData,
    showGrid: true,
    showLabels: true,
    showDots: true,
  },
  render: (args) => (
    <RadarChart
      series={radarMultiSeries}
      size={350}
      showGrid={args.showGrid}
      showLabels={args.showLabels}
      showDots={args.showDots}
      fillOpacity={0.15}
    />
  ),
};

export const RadarCustomColor: Story = {
  name: "Radar - Custom Color",
  args: {
    data: skillData,
    showGrid: true,
    showLabels: true,
    showDots: true,
  },
  render: (args) => (
    <RadarChart
      data={args.data}
      color="#10b981"
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
  args: { data: skillData },
  render: () => (
    <ScatterChart
      data={heightWeightData}
      xLabel="Height (cm)"
      yLabel="Weight (kg)"
      dotSize={8}
    />
  ),
};

export const ScatterMultiSeries: Story = {
  name: "Scatter - Test Scores Comparison",
  args: { data: skillData },
  render: () => (
    <ScatterChart
      series={scatterMultiSeries}
      xLabel="Study Hours"
      yLabel="Score"
      dotSize={7}
      height={350}
    />
  ),
};

export const ScatterBubble: Story = {
  name: "Scatter - Bubble Chart",
  args: { data: skillData },
  render: () => (
    <ScatterChart
      data={[
        { x: 10, y: 20, size: 20, label: "Small" },
        { x: 30, y: 50, size: 30, label: "Medium" },
        { x: 60, y: 40, size: 45, label: "Large" },
        { x: 80, y: 70, size: 25, label: "Mid" },
        { x: 50, y: 80, size: 35, label: "Big" },
      ]}
      height={350}
    />
  ),
};

// ─── FunnelChart Stories ─────────────────────────────────────────────────────

export const FunnelDefault: Story = {
  name: "Funnel - Sales Pipeline",
  args: { data: skillData },
  render: () => (
    <FunnelChart data={funnelData} showValues showPercentage height={350} />
  ),
};

export const FunnelHorizontal: Story = {
  name: "Funnel - Horizontal",
  args: { data: skillData },
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
  args: { data: skillData },
  render: () => (
    <FunnelChart
      data={[
        { label: "Visitors", value: 10000, color: "#3b82f6" },
        { label: "Sign ups", value: 5000, color: "#6366f1" },
        { label: "Trials", value: 2500, color: "#8b5cf6" },
        { label: "Paid", value: 1200, color: "#a855f7" },
        { label: "Enterprise", value: 400, color: "#c084fc" },
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
  args: { data: skillData },
  render: () => (
    <HeatmapChart
      data={weeklyActivity}
      showValues
      showLegend
      height={350}
    />
  ),
};

export const HeatmapMonthly: Story = {
  name: "Heatmap - Department Performance",
  args: { data: skillData },
  render: () => (
    <HeatmapChart
      data={monthlyData}
      showValues
      showLegend
      colorRange={["#fef3c7", "#d97706"]}
      height={250}
    />
  ),
};

export const HeatmapCompact: Story = {
  name: "Heatmap - Compact (No Values)",
  args: { data: skillData },
  render: () => (
    <HeatmapChart
      data={weeklyActivity}
      showValues={false}
      showLegend
      colorRange={["#ecfdf5", "#059669"]}
      height={300}
    />
  ),
};

// ─── Gallery Story ───────────────────────────────────────────────────────────

export const Gallery: Story = {
  name: "Gallery - All Advanced Charts",
  args: { data: skillData },
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-4">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Radar Chart</h3>
        <RadarChart series={radarMultiSeries} size={280} fillOpacity={0.15} />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Scatter Chart</h3>
        <ScatterChart
          data={heightWeightData}
          xLabel="Height (cm)"
          yLabel="Weight (kg)"
          height={280}
          dotSize={7}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Funnel Chart</h3>
        <FunnelChart data={funnelData} showValues showPercentage height={280} />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Heatmap Chart</h3>
        <HeatmapChart
          data={monthlyData}
          showValues
          showLegend
          colorRange={["#eff6ff", "#1d4ed8"]}
          height={250}
        />
      </div>
    </div>
  ),
};
