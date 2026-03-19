import type { Meta, StoryObj } from "@storybook/react-vite";
import { LineChart } from "./line-chart";

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

const temperatureData = [
  { time: "6am", Indoor: 20, Outdoor: 12 },
  { time: "8am", Indoor: 21, Outdoor: 15 },
  { time: "10am", Indoor: 22, Outdoor: 20 },
  { time: "12pm", Indoor: 23, Outdoor: 25 },
  { time: "2pm", Indoor: 23, Outdoor: 28 },
  { time: "4pm", Indoor: 22, Outdoor: 26 },
  { time: "6pm", Indoor: 21, Outdoor: 22 },
  { time: "8pm", Indoor: 20, Outdoor: 18 },
  { time: "10pm", Indoor: 19, Outdoor: 14 },
];

const dataWithNulls = [
  { month: "Jan", Revenue: 4200 },
  { month: "Feb", Revenue: 3800 },
  { month: "Mar", Revenue: null },
  { month: "Apr", Revenue: null },
  { month: "May", Revenue: 5800 },
  { month: "Jun", Revenue: 6200 },
  { month: "Jul", Revenue: 5400 },
  { month: "Aug", Revenue: 4900 },
];

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta = {
  title: "Data Display/Charts/LineChart",
  component: LineChart,
  tags: ["autodocs"],
  argTypes: {
    height: { control: { type: "range", min: 200, max: 600, step: 50 } },
    curveType: {
      control: "select",
      options: ["linear", "monotone", "step", "natural", "bump"],
    },
    showGrid: { control: "boolean" },
    showDots: { control: "boolean" },
    showLegend: { control: "boolean" },
    connectNulls: { control: "boolean" },
    strokeWidth: { control: { type: "range", min: 1, max: 5, step: 0.5 } },
    animate: { control: "boolean" },
  },
} satisfies Meta<typeof LineChart>;

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
    data: temperatureData,
    index: "time",
    categories: ["Indoor", "Outdoor"],
    colors: ["indigo", "emerald"],
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
    colors: ["emerald"],
    strokeWidth: 3,
  },
};

export const NaturalCurve: Story = {
  name: "Natural Curve",
  args: {
    data: temperatureData,
    index: "time",
    categories: ["Indoor", "Outdoor"],
    curveType: "natural",
    colors: ["violet", "amber"],
    showLegend: true,
  },
};

export const StepCurve: Story = {
  name: "Step Curve",
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    curveType: "step",
    colors: ["indigo"],
  },
};

export const NoDots: Story = {
  args: {
    data: temperatureData,
    index: "time",
    categories: ["Outdoor"],
    showDots: false,
    curveType: "monotone",
    colors: ["red"],
    strokeWidth: 3,
  },
};

export const WithReferenceLines: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    referenceLines: [
      { y: 5000, label: "Target", color: "#ef4444" },
      { x: "Mar", label: "Q1 End", color: "#3b82f6" },
    ],
  },
};

export const WithAxisLabels: Story = {
  args: {
    data: temperatureData,
    index: "time",
    categories: ["Indoor", "Outdoor"],
    colors: ["indigo", "rose"],
    showLegend: true,
    xAxisLabel: "Time of Day",
    yAxisLabel: "Temperature (C)",
  },
};

export const WithValueFormatter: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    valueFormatter: (v: number) => `$${(v / 1000).toFixed(1)}K`,
  },
};

export const ConnectNulls: Story = {
  name: "Connect Through Nulls",
  args: {
    data: dataWithNulls as Record<string, unknown>[],
    index: "month",
    categories: ["Revenue"],
    connectNulls: true,
    curveType: "monotone",
    colors: ["indigo"],
  },
};

export const DisconnectedNulls: Story = {
  name: "Disconnected at Nulls",
  args: {
    data: dataWithNulls as Record<string, unknown>[],
    index: "month",
    categories: ["Revenue"],
    connectNulls: false,
    curveType: "monotone",
    colors: ["indigo"],
  },
};

export const NoGrid: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    showGrid: false,
    curveType: "monotone",
  },
};

export const ThickLine: Story = {
  args: {
    data: temperatureData,
    index: "time",
    categories: ["Outdoor"],
    strokeWidth: 4,
    curveType: "monotone",
    colors: ["amber"],
  },
};

export const CompactChart: Story = {
  args: {
    data: monthlySalesData,
    index: "month",
    categories: ["Sales"],
    height: 200,
    curveType: "monotone",
  },
};
