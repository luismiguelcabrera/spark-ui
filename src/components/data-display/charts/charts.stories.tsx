import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart } from "./bar-chart";
import { LineChart } from "./line-chart";
import { AreaChart } from "./area-chart";
import { PieChart } from "./pie-chart";

// ─── Sample Data ─────────────────────────────────────────────────────────────

const monthlySalesData = [
  { month: "Jan", Sales: 4200 },
  { month: "Feb", Sales: 3800 },
  { month: "Mar", Sales: 5100 },
  { month: "Apr", Sales: 4600 },
  { month: "May", Sales: 5800 },
  { month: "Jun", Sales: 6200 },
  { month: "Jul", Sales: 5400 },
  { month: "Aug", Sales: 4900 },
];

const multiSeriesData = [
  { month: "Jan", Revenue: 4200, Expenses: 3200 },
  { month: "Feb", Revenue: 3800, Expenses: 2900 },
  { month: "Mar", Revenue: 5100, Expenses: 3500 },
  { month: "Apr", Revenue: 4600, Expenses: 3100 },
  { month: "May", Revenue: 5800, Expenses: 3800 },
  { month: "Jun", Revenue: 6200, Expenses: 4000 },
];

const browserShare = [
  { name: "Chrome", value: 65, color: "#4285F4" },
  { name: "Safari", value: 19, color: "#5AC8FA" },
  { name: "Firefox", value: 8, color: "#FF7139" },
  { name: "Edge", value: 5, color: "#0078D7" },
  { name: "Other", value: 3, color: "#9ca3af" },
];

const trafficData = [
  { day: "Mon", Organic: 120, Direct: 80, Referral: 30 },
  { day: "Tue", Organic: 180, Direct: 90, Referral: 50 },
  { day: "Wed", Organic: 150, Direct: 110, Referral: 40 },
  { day: "Thu", Organic: 210, Direct: 100, Referral: 60 },
  { day: "Fri", Organic: 190, Direct: 120, Referral: 45 },
  { day: "Sat", Organic: 80, Direct: 50, Referral: 20 },
  { day: "Sun", Organic: 60, Direct: 40, Referral: 15 },
];

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta = {
  title: "Data Display/Charts",
  component: BarChart,
  tags: ["autodocs"],
  argTypes: {
    showGrid: { control: "boolean" },
    showLegend: { control: "boolean" },
    animate: { control: "boolean" },
    height: { control: { type: "range", min: 200, max: 600, step: 50 } },
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── BarChart Stories ────────────────────────────────────────────────────────

export const BarDefault: Story = {
  name: "Bar - Default",
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    showGrid: true,
    animate: true,
  },
};

export const BarMultiSeries: Story = {
  name: "Bar - Multi-Series",
  args: {
    data: multiSeriesData,
    index: "month",
    categories: ["Revenue", "Expenses"],
    colors: ["indigo", "emerald"],
    showLegend: true,
  },
};

export const BarStacked: Story = {
  name: "Bar - Stacked",
  args: {
    data: multiSeriesData,
    index: "month",
    categories: ["Revenue", "Expenses"],
    colors: ["indigo", "emerald"],
    type: "stacked",
    showLegend: true,
  },
};

export const BarHorizontal: Story = {
  name: "Bar - Horizontal",
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    layout: "horizontal",
    showDataLabels: true,
  },
};

// ─── LineChart Stories ───────────────────────────────────────────────────────

export const LineDefault: Story = {
  name: "Line - Default",
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
  },
  render: (args) => (
    <LineChart
      data={monthlySalesData}
      index="month"
      categories={["Sales"]}
      showGrid={args.showGrid}
      height={args.height}
    />
  ),
};

export const LineMultiSeries: Story = {
  name: "Line - Multi-Series",
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
  },
  render: (args) => (
    <LineChart
      data={multiSeriesData}
      index="month"
      categories={["Revenue", "Expenses"]}
      colors={["indigo", "emerald"]}
      curveType="monotone"
      showLegend
      showGrid={args.showGrid}
      height={args.height}
    />
  ),
};

export const LineSmooth: Story = {
  name: "Line - Smooth",
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
  },
  render: (args) => (
    <LineChart
      data={monthlySalesData}
      index="month"
      categories={["Sales"]}
      curveType="monotone"
      colors={["emerald"]}
      strokeWidth={3}
      showGrid={args.showGrid}
      height={args.height}
    />
  ),
};

export const LineNoDots: Story = {
  name: "Line - No Dots",
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
  },
  render: (args) => (
    <LineChart
      data={monthlySalesData}
      index="month"
      categories={["Sales"]}
      showDots={false}
      curveType="monotone"
      colors={["red"]}
      strokeWidth={3}
      showGrid={args.showGrid}
      height={args.height}
    />
  ),
};

// ─── AreaChart Stories ───────────────────────────────────────────────────────

export const AreaDefault: Story = {
  name: "Area - Default",
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
  },
  render: (args) => (
    <AreaChart
      data={monthlySalesData}
      index="month"
      categories={["Sales"]}
      fill="gradient"
      showGrid={args.showGrid}
      height={args.height}
    />
  ),
};

export const AreaMultiSeries: Story = {
  name: "Area - Multi-Series",
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
  },
  render: (args) => (
    <AreaChart
      data={trafficData}
      index="day"
      categories={["Organic", "Direct", "Referral"]}
      colors={["indigo", "emerald", "amber"]}
      fill="gradient"
      showLegend
      showGrid={args.showGrid}
      height={args.height}
    />
  ),
};

export const AreaStacked: Story = {
  name: "Area - Stacked",
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
  },
  render: (args) => (
    <AreaChart
      data={trafficData}
      index="day"
      categories={["Organic", "Direct", "Referral"]}
      colors={["indigo", "emerald", "amber"]}
      type="stacked"
      fill="gradient"
      showLegend
      showGrid={args.showGrid}
      height={args.height}
    />
  ),
};

export const AreaSolid: Story = {
  name: "Area - Solid Fill",
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
  },
  render: (args) => (
    <AreaChart
      data={monthlySalesData}
      index="month"
      categories={["Sales"]}
      fill="solid"
      colors={["amber"]}
      showGrid={args.showGrid}
      height={args.height}
    />
  ),
};

// ─── PieChart Stories ─────────────────────────────────────────────────────────

export const DonutDefault: Story = {
  name: "Donut - Default",
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
  },
  render: () => <PieChart data={browserShare} variant="donut" />,
};

export const DonutWithCenter: Story = {
  name: "Donut - Center Label",
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
  },
  render: () => (
    <PieChart
      data={browserShare}
      variant="donut"
      label={
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
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
  },
  render: () => (
    <PieChart data={browserShare} variant="donut" showLegend showLabel />
  ),
};

export const PieDefault: Story = {
  name: "Pie - Default",
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
  },
  render: () => (
    <PieChart
      data={browserShare}
      variant="pie"
      showLegend
      showLabel
    />
  ),
};

// ─── Gallery Story ──────────────────────────────────────────────────────────

export const Gallery: Story = {
  name: "Gallery - All Charts",
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
  },
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-4">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">
          Bar Chart (Multi-Series)
        </h3>
        <BarChart
          data={multiSeriesData}
          index="month"
          categories={["Revenue", "Expenses"]}
          colors={["indigo", "emerald"]}
          showLegend
          showDataLabels
          height={250}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">
          Line Chart (Smooth)
        </h3>
        <LineChart
          data={multiSeriesData}
          index="month"
          categories={["Revenue", "Expenses"]}
          colors={["indigo", "emerald"]}
          curveType="monotone"
          showLegend
          height={250}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">
          Area Chart (Stacked)
        </h3>
        <AreaChart
          data={trafficData}
          index="day"
          categories={["Organic", "Direct", "Referral"]}
          colors={["indigo", "emerald", "amber"]}
          type="stacked"
          fill="gradient"
          showLegend
          height={250}
        />
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">
          Pie Chart (Donut)
        </h3>
        <PieChart
          data={browserShare}
          variant="donut"
          showLegend
          label={
            <span className="text-lg font-bold text-gray-800">100%</span>
          }
        />
      </div>
    </div>
  ),
};
