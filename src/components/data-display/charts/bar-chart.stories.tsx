import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart } from "./bar-chart";

// ─── Sample Data ─────────────────────────────────────────────────────────────

const monthlySalesData = [
  { month: "Jan", Sales: 4200 },
  { month: "Feb", Sales: 3800 },
  { month: "Mar", Sales: 5100 },
  { month: "Apr", Sales: 4600 },
  { month: "May", Sales: 5800 },
  { month: "Jun", Sales: 6200 },
];

const multiSeriesData = [
  { month: "Jan", Revenue: 4200, Expenses: 3200, Profit: 1000 },
  { month: "Feb", Revenue: 3800, Expenses: 2900, Profit: 900 },
  { month: "Mar", Revenue: 5100, Expenses: 3500, Profit: 1600 },
  { month: "Apr", Revenue: 4600, Expenses: 3100, Profit: 1500 },
  { month: "May", Revenue: 5800, Expenses: 3800, Profit: 2000 },
  { month: "Jun", Revenue: 6200, Expenses: 4000, Profit: 2200 },
];

const quarterlyData = [
  { quarter: "Q1", North: 120, South: 90, East: 70, West: 80 },
  { quarter: "Q2", North: 180, South: 110, East: 95, West: 100 },
  { quarter: "Q3", North: 150, South: 130, East: 110, West: 120 },
  { quarter: "Q4", North: 210, South: 150, East: 125, West: 140 },
];

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta = {
  title: "Data Display/Charts/BarChart",
  component: BarChart,
  tags: ["autodocs"],
  argTypes: {
    height: { control: { type: "range", min: 200, max: 600, step: 50 } },
    type: { control: "select", options: ["default", "stacked", "percent"] },
    layout: { control: "select", options: ["vertical", "horizontal"] },
    showGrid: { control: "boolean" },
    showLegend: { control: "boolean" },
    showDataLabels: { control: "boolean" },
    showXAxis: { control: "boolean" },
    showYAxis: { control: "boolean" },
    animate: { control: "boolean" },
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
  },
};

export const MultiSeries: Story = {
  args: {
    data: multiSeriesData,
    index: "month",
    categories: ["Revenue", "Expenses", "Profit"],
    colors: ["indigo", "emerald", "amber"],
    showLegend: true,
  },
};

export const Stacked: Story = {
  args: {
    data: quarterlyData,
    index: "quarter",
    categories: ["North", "South", "East", "West"],
    type: "stacked",
    showLegend: true,
    colors: ["indigo", "emerald", "amber", "rose"],
  },
};

export const Percent: Story = {
  args: {
    data: quarterlyData,
    index: "quarter",
    categories: ["North", "South", "East", "West"],
    type: "percent",
    showLegend: true,
    colors: ["indigo", "emerald", "amber", "rose"],
  },
};

export const Horizontal: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    layout: "horizontal",
  },
};

export const WithDataLabels: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    showDataLabels: true,
    animate: false,
  },
};

export const WithValueFormatter: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    valueFormatter: (v: number) => `$${(v / 1000).toFixed(1)}K`,
    showLegend: true,
  },
};

export const WithReferenceLines: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    referenceLines: [
      { y: 5000, label: "Target", color: "#ef4444" },
    ],
  },
};

export const WithAxisLabels: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    xAxisLabel: "Month",
    yAxisLabel: "Revenue ($)",
  },
};

export const CustomColors: Story = {
  args: {
    data: multiSeriesData,
    index: "month",
    categories: ["Revenue", "Expenses", "Profit"],
    colors: ["#4285F4", "#FF7139", "#10b981"],
    showLegend: true,
  },
};

export const NoGrid: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    showGrid: false,
  },
};

export const NoAnimation: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    animate: false,
    showDataLabels: true,
  },
};

export const ManyBars: Story = {
  args: {
    data: [
      { month: "Jan", Sales: 30 },
      { month: "Feb", Sales: 45 },
      { month: "Mar", Sales: 60 },
      { month: "Apr", Sales: 38 },
      { month: "May", Sales: 72 },
      { month: "Jun", Sales: 55 },
      { month: "Jul", Sales: 88 },
      { month: "Aug", Sales: 64 },
      { month: "Sep", Sales: 42 },
      { month: "Oct", Sales: 76 },
      { month: "Nov", Sales: 50 },
      { month: "Dec", Sales: 90 },
    ],
    index: "month",
    categories: ["Sales"],
    height: 350,
  },
};

export const StackedHorizontal: Story = {
  name: "Stacked + Horizontal",
  args: {
    data: quarterlyData,
    index: "quarter",
    categories: ["North", "South", "East", "West"],
    type: "stacked",
    layout: "horizontal",
    showLegend: true,
    colors: ["indigo", "emerald", "amber", "rose"],
    height: 300,
  },
};
