import type { Meta, StoryObj } from "@storybook/react-vite";
import { AreaChart } from "./area-chart";

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
  title: "Data Display/Charts/AreaChart",
  component: AreaChart,
  tags: ["autodocs"],
  argTypes: {
    height: { control: { type: "range", min: 200, max: 600, step: 50 } },
    type: { control: "select", options: ["default", "stacked", "percent"] },
    fill: { control: "select", options: ["gradient", "solid", "none"] },
    curveType: {
      control: "select",
      options: ["linear", "monotone", "step", "natural", "bump"],
    },
    showGrid: { control: "boolean" },
    showLegend: { control: "boolean" },
    connectNulls: { control: "boolean" },
    animate: { control: "boolean" },
  },
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    fill: "gradient",
  },
};

export const SolidFill: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    fill: "solid",
    colors: ["amber"],
  },
};

export const NoFill: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    fill: "none",
    colors: ["indigo"],
  },
};

export const MultiSeries: Story = {
  args: {
    data: trafficData,
    index: "day",
    categories: ["Organic", "Direct", "Referral"],
    colors: ["indigo", "emerald", "amber"],
    fill: "gradient",
    showLegend: true,
  },
};

export const Stacked: Story = {
  args: {
    data: trafficData,
    index: "day",
    categories: ["Organic", "Direct", "Referral"],
    colors: ["indigo", "emerald", "amber"],
    type: "stacked",
    fill: "gradient",
    showLegend: true,
  },
};

export const StackedPercent: Story = {
  name: "100% Stacked",
  args: {
    data: trafficData,
    index: "day",
    categories: ["Organic", "Direct", "Referral"],
    colors: ["indigo", "emerald", "amber"],
    type: "percent",
    fill: "solid",
    showLegend: true,
  },
};

export const MonotoneCurve: Story = {
  name: "Smooth (Monotone)",
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    curveType: "monotone",
    fill: "gradient",
    colors: ["violet"],
  },
};

export const WithReferenceLines: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    fill: "gradient",
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
    fill: "gradient",
    xAxisLabel: "Month",
    yAxisLabel: "Revenue ($)",
  },
};

export const WithValueFormatter: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    fill: "gradient",
    valueFormatter: (v: number) => `$${(v / 1000).toFixed(1)}K`,
    showLegend: true,
  },
};

export const NoGrid: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    showGrid: false,
    fill: "gradient",
  },
};

export const TallChart: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    height: 500,
    fill: "gradient",
  },
};

export const CompactChart: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    height: 200,
    fill: "gradient",
  },
};
