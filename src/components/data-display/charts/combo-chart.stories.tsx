import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComboChart } from "./combo-chart";

// ─── Sample Data ─────────────────────────────────────────────────────────────

const revenueData = [
  { month: "Jan", Revenue: 42, Target: 50 },
  { month: "Feb", Revenue: 38, Target: 50 },
  { month: "Mar", Revenue: 51, Target: 50 },
  { month: "Apr", Revenue: 46, Target: 50 },
  { month: "May", Revenue: 58, Target: 50 },
  { month: "Jun", Revenue: 62, Target: 50 },
  { month: "Jul", Revenue: 54, Target: 50 },
  { month: "Aug", Revenue: 49, Target: 50 },
];

const salesDashboardData = [
  { month: "Jan", "Sales ($K)": 32, "Conversion %": 26 },
  { month: "Feb", "Sales ($K)": 28, "Conversion %": 18 },
  { month: "Mar", "Sales ($K)": 41, "Conversion %": 22 },
  { month: "Apr", "Sales ($K)": 36, "Conversion %": 22 },
  { month: "May", "Sales ($K)": 48, "Conversion %": 22 },
  { month: "Jun", "Sales ($K)": 52, "Conversion %": 21 },
  { month: "Jul", "Sales ($K)": 44, "Conversion %": 22 },
  { month: "Aug", "Sales ($K)": 39, "Conversion %": 22 },
];

const yearOverYearData = [
  { month: "Jan", "2024": 30, "2025": 38, "Growth %": 26 },
  { month: "Feb", "2024": 35, "2025": 42, "Growth %": 20 },
  { month: "Mar", "2024": 42, "2025": 48, "Growth %": 14 },
  { month: "Apr", "2024": 38, "2025": 45, "Growth %": 18 },
  { month: "May", "2024": 50, "2025": 58, "Growth %": 16 },
  { month: "Jun", "2024": 55, "2025": 62, "Growth %": 12 },
];

const biaxialData = [
  { month: "Jan", Units: 120, "Avg Price": 42 },
  { month: "Feb", Units: 150, "Avg Price": 38 },
  { month: "Mar", Units: 180, "Avg Price": 45 },
  { month: "Apr", Units: 160, "Avg Price": 41 },
  { month: "May", Units: 210, "Avg Price": 48 },
  { month: "Jun", Units: 240, "Avg Price": 52 },
];

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta = {
  title: "Data Display/Charts/ComboChart",
  component: ComboChart,
  tags: ["autodocs"],
  argTypes: {
    showGrid: { control: "boolean" },
    showLegend: { control: "boolean" },
    showXAxis: { control: "boolean" },
    enableBiaxial: { control: "boolean" },
    animate: { control: "boolean" },
    height: { control: { type: "range", min: 200, max: 600, step: 50 } },
  },
} satisfies Meta<typeof ComboChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ─────────────────────────────────────────────────────────────────

export const BarAndLine: Story = {
  name: "Bar + Line (Revenue vs Target)",
  args: {
    data: revenueData,
    index: "month",
    barSeries: {
      categories: ["Revenue"],
      colors: ["indigo"],
    },
    lineSeries: {
      categories: ["Target"],
      colors: ["red"],
      curveType: "monotone",
      strokeWidth: 2,
    },
    showGrid: true,
    showLegend: true,
    height: 300,
  },
};

export const SalesDashboard: Story = {
  name: "Bar + Line (Sales Dashboard)",
  args: {
    data: salesDashboardData,
    index: "month",
    barSeries: {
      categories: ["Sales ($K)"],
      colors: ["indigo"],
    },
    lineSeries: {
      categories: ["Conversion %"],
      colors: ["amber"],
      curveType: "monotone",
      showDots: true,
      strokeWidth: 2,
    },
    showGrid: true,
    showLegend: true,
    height: 350,
  },
};

export const DualBarWithLine: Story = {
  name: "Dual Bar + Line (Year-over-Year)",
  args: {
    data: yearOverYearData,
    index: "month",
    barSeries: {
      categories: ["2024", "2025"],
      colors: ["indigo", "emerald"],
    },
    lineSeries: {
      categories: ["Growth %"],
      colors: ["red"],
      curveType: "monotone",
      strokeWidth: 2,
      showDots: true,
    },
    showGrid: true,
    showLegend: true,
    height: 300,
  },
};

export const Biaxial: Story = {
  name: "Biaxial (Independent Y-Axes)",
  args: {
    data: biaxialData,
    index: "month",
    barSeries: {
      categories: ["Units"],
      colors: ["indigo"],
      yAxisLabel: "Units Sold",
    },
    lineSeries: {
      categories: ["Avg Price"],
      colors: ["amber"],
      curveType: "monotone",
      strokeWidth: 2,
      showDots: true,
      yAxisLabel: "Price ($)",
    },
    enableBiaxial: true,
    showGrid: true,
    showLegend: true,
    height: 300,
  },
};

export const StackedBarsWithLine: Story = {
  name: "Stacked Bars + Line",
  args: {
    data: yearOverYearData,
    index: "month",
    barSeries: {
      categories: ["2024", "2025"],
      colors: ["indigo", "emerald"],
      type: "stacked",
    },
    lineSeries: {
      categories: ["Growth %"],
      colors: ["red"],
      curveType: "monotone",
      strokeWidth: 2,
      showDots: true,
    },
    showGrid: true,
    showLegend: true,
    height: 300,
  },
};

export const WithReferenceLines: Story = {
  name: "With Reference Lines",
  args: {
    data: revenueData,
    index: "month",
    barSeries: {
      categories: ["Revenue"],
      colors: ["indigo"],
    },
    lineSeries: {
      categories: ["Target"],
      colors: ["amber"],
      curveType: "monotone",
    },
    referenceLines: [
      { y: 55, label: "Goal", color: "#ef4444" },
    ],
    showGrid: true,
    showLegend: true,
    height: 300,
  },
};

export const WithAxisLabels: Story = {
  name: "With Axis Labels",
  args: {
    data: revenueData,
    index: "month",
    barSeries: {
      categories: ["Revenue"],
      colors: ["indigo"],
      yAxisLabel: "Revenue ($K)",
    },
    lineSeries: {
      categories: ["Target"],
      colors: ["red"],
      curveType: "monotone",
    },
    xAxisLabel: "Month",
    showGrid: true,
    showLegend: true,
    height: 300,
  },
};

export const NoLegend: Story = {
  args: {
    data: revenueData,
    index: "month",
    barSeries: {
      categories: ["Revenue"],
      colors: ["indigo"],
    },
    lineSeries: {
      categories: ["Target"],
      colors: ["red"],
      curveType: "monotone",
    },
    showLegend: false,
    height: 300,
  },
};

export const NoGrid: Story = {
  args: {
    data: revenueData,
    index: "month",
    barSeries: {
      categories: ["Revenue"],
      colors: ["indigo"],
    },
    lineSeries: {
      categories: ["Target"],
      colors: ["red"],
      curveType: "monotone",
    },
    showGrid: false,
    showLegend: true,
    height: 300,
  },
};

export const Gallery: Story = {
  name: "Gallery - All Combos",
  args: {
    data: revenueData,
    index: "month",
    barSeries: { categories: ["Revenue"], colors: ["indigo"] },
    lineSeries: { categories: ["Target"], colors: ["red"], curveType: "monotone" },
    showGrid: true,
    showLegend: true,
    height: 300,
  },
  render: (args) => (
    <div className="grid grid-cols-2 gap-8 p-4">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">
          Bar + Line
        </h3>
        <ComboChart
          data={revenueData}
          index="month"
          barSeries={{ categories: ["Revenue"], colors: ["indigo"] }}
          lineSeries={{
            categories: ["Target"],
            colors: ["red"],
            curveType: "monotone",
          }}
          showGrid={args.showGrid}
          showLegend={args.showLegend}
          height={250}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">
          Sales Dashboard
        </h3>
        <ComboChart
          data={salesDashboardData}
          index="month"
          barSeries={{ categories: ["Sales ($K)"], colors: ["indigo"] }}
          lineSeries={{
            categories: ["Conversion %"],
            colors: ["amber"],
            curveType: "monotone",
            showDots: true,
          }}
          showGrid={args.showGrid}
          showLegend={args.showLegend}
          height={250}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">
          Year-over-Year
        </h3>
        <ComboChart
          data={yearOverYearData}
          index="month"
          barSeries={{
            categories: ["2024", "2025"],
            colors: ["indigo", "emerald"],
          }}
          lineSeries={{
            categories: ["Growth %"],
            colors: ["red"],
            curveType: "monotone",
            showDots: true,
          }}
          showGrid={args.showGrid}
          showLegend={args.showLegend}
          height={250}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">
          Biaxial
        </h3>
        <ComboChart
          data={biaxialData}
          index="month"
          barSeries={{
            categories: ["Units"],
            colors: ["indigo"],
            yAxisLabel: "Units",
          }}
          lineSeries={{
            categories: ["Avg Price"],
            colors: ["amber"],
            curveType: "monotone",
            yAxisLabel: "Price ($)",
          }}
          enableBiaxial
          showGrid={args.showGrid}
          showLegend={args.showLegend}
          height={250}
        />
      </div>
    </div>
  ),
};
