import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart } from "./bar-chart";
import { LineChart } from "./line-chart";
import { AreaChart } from "./area-chart";
import { DonutChart } from "./donut-chart";

// ─── Sample Data ─────────────────────────────────────────────────────────────

const monthlySales = [
  { label: "Jan", value: 4200 },
  { label: "Feb", value: 3800 },
  { label: "Mar", value: 5100 },
  { label: "Apr", value: 4600 },
  { label: "May", value: 5800 },
  { label: "Jun", value: 6200 },
  { label: "Jul", value: 5400 },
  { label: "Aug", value: 4900 },
];

const browserShare = [
  { label: "Chrome", value: 65, color: "#4285F4" },
  { label: "Safari", value: 19, color: "#5AC8FA" },
  { label: "Firefox", value: 8, color: "#FF7139" },
  { label: "Edge", value: 5, color: "#0078D7" },
  { label: "Other", value: 3, color: "#9ca3af" },
];

const trafficSeries = [
  {
    name: "Organic",
    color: "#6366f1",
    data: [
      { label: "Mon", value: 120 },
      { label: "Tue", value: 180 },
      { label: "Wed", value: 150 },
      { label: "Thu", value: 210 },
      { label: "Fri", value: 190 },
      { label: "Sat", value: 80 },
      { label: "Sun", value: 60 },
    ],
  },
  {
    name: "Direct",
    color: "#10b981",
    data: [
      { label: "Mon", value: 80 },
      { label: "Tue", value: 90 },
      { label: "Wed", value: 110 },
      { label: "Thu", value: 100 },
      { label: "Fri", value: 120 },
      { label: "Sat", value: 50 },
      { label: "Sun", value: 40 },
    ],
  },
  {
    name: "Referral",
    color: "#f59e0b",
    data: [
      { label: "Mon", value: 30 },
      { label: "Tue", value: 50 },
      { label: "Wed", value: 40 },
      { label: "Thu", value: 60 },
      { label: "Fri", value: 45 },
      { label: "Sat", value: 20 },
      { label: "Sun", value: 15 },
    ],
  },
];

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta = {
  title: "Data Display/Charts",
  component: BarChart,
  tags: ["autodocs"],
  argTypes: {
    showGrid: { control: "boolean" },
    showValues: { control: "boolean" },
    animate: { control: "boolean" },
    orientation: { control: "select", options: ["vertical", "horizontal"] },
    height: { control: { type: "range", min: 200, max: 600, step: 50 } },
    color: { control: "color" },
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── BarChart Stories ────────────────────────────────────────────────────────

export const BarDefault: Story = {
  name: "Bar - Default",
  args: {
    data: monthlySales,
    showGrid: true,
    showValues: false,
    animate: true,
  },
};

export const BarWithValues: Story = {
  name: "Bar - With Values",
  args: {
    data: monthlySales,
    showValues: true,
    animate: false,
  },
};

export const BarHorizontal: Story = {
  name: "Bar - Horizontal",
  args: {
    data: monthlySales.slice(0, 5),
    orientation: "horizontal",
    showValues: true,
  },
};

export const BarCustomColors: Story = {
  name: "Bar - Custom Colors",
  args: {
    data: browserShare,
    showValues: true,
    animate: false,
  },
};

// ─── LineChart Stories ───────────────────────────────────────────────────────

export const LineDefault: Story = {
  name: "Line - Default",
  args: { data: monthlySales },
  render: (args) => (
    <LineChart
      data={args.data}
      showGrid={args.showGrid}
      showDots
      height={args.height}
      color={args.color}
    />
  ),
};

export const LineSmooth: Story = {
  name: "Line - Smooth",
  args: { data: monthlySales },
  render: (args) => (
    <LineChart
      data={args.data}
      smooth
      showDots
      color="#10b981"
      strokeWidth={3}
      height={args.height}
    />
  ),
};

export const LineWithArea: Story = {
  name: "Line - With Area Fill",
  args: { data: monthlySales },
  render: (args) => (
    <LineChart
      data={args.data}
      showArea
      smooth
      showDots
      color="#8b5cf6"
      height={args.height}
    />
  ),
};

export const LineNoDots: Story = {
  name: "Line - No Dots",
  args: { data: monthlySales },
  render: (args) => (
    <LineChart
      data={args.data}
      showDots={false}
      smooth
      color="#ef4444"
      strokeWidth={3}
      height={args.height}
    />
  ),
};

// ─── AreaChart Stories ───────────────────────────────────────────────────────

export const AreaDefault: Story = {
  name: "Area - Default",
  args: { data: monthlySales },
  render: (args) => (
    <AreaChart
      data={args.data}
      gradient
      height={args.height}
    />
  ),
};

export const AreaMultiSeries: Story = {
  name: "Area - Multi Series",
  args: { data: monthlySales },
  render: (args) => (
    <AreaChart
      series={trafficSeries}
      gradient
      height={args.height}
    />
  ),
};

export const AreaStacked: Story = {
  name: "Area - Stacked",
  args: { data: monthlySales },
  render: (args) => (
    <AreaChart
      series={trafficSeries}
      stacked
      gradient
      height={args.height}
    />
  ),
};

export const AreaSolid: Story = {
  name: "Area - Solid Fill",
  args: { data: monthlySales },
  render: (args) => (
    <AreaChart
      data={args.data}
      gradient={false}
      color="#f59e0b"
      height={args.height}
    />
  ),
};

// ─── DonutChart Stories ─────────────────────────────────────────────────────

export const DonutDefault: Story = {
  name: "Donut - Default",
  args: { data: browserShare },
  render: () => (
    <DonutChart data={browserShare} />
  ),
};

export const DonutWithCenter: Story = {
  name: "Donut - Center Label",
  args: { data: browserShare },
  render: () => (
    <DonutChart
      data={browserShare}
      centerLabel={
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">65%</div>
          <div className="text-xs text-gray-500">Chrome</div>
        </div>
      }
    />
  ),
};

export const DonutWithLegend: Story = {
  name: "Donut - With Legend",
  args: { data: browserShare },
  render: () => (
    <DonutChart
      data={browserShare}
      showLegend
      showLabels
    />
  ),
};

export const DonutLarge: Story = {
  name: "Donut - Large",
  args: { data: browserShare },
  render: () => (
    <DonutChart
      data={browserShare}
      size={300}
      thickness={50}
      showLegend
      centerLabel={
        <span className="text-lg font-semibold text-gray-700">Browsers</span>
      }
    />
  ),
};

// ─── Gallery Story ──────────────────────────────────────────────────────────

export const Gallery: Story = {
  name: "Gallery - All Charts",
  args: { data: monthlySales },
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-4">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Bar Chart</h3>
        <BarChart data={monthlySales} showValues height={250} />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Line Chart</h3>
        <LineChart data={monthlySales} smooth showDots showArea color="#10b981" height={250} />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Area Chart (Stacked)</h3>
        <AreaChart series={trafficSeries} stacked gradient height={250} />
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Donut Chart</h3>
        <DonutChart
          data={browserShare}
          showLegend
          centerLabel={
            <span className="text-lg font-bold text-gray-800">100%</span>
          }
        />
      </div>
    </div>
  ),
};
