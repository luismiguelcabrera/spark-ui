import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScatterChart } from "./scatter-chart";

// ─── Sample Data ─────────────────────────────────────────────────────────────

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

const testScores = [
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

const bubbleSeries = [
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
];

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta = {
  title: "Data Display/Charts/ScatterChart",
  component: ScatterChart,
  tags: ["autodocs"],
  argTypes: {
    height: { control: { type: "range", min: 200, max: 500, step: 50 } },
    showGrid: { control: "boolean" },
    showLegend: { control: "boolean" },
    legendPosition: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    dotSize: { control: { type: "range", min: 3, max: 15, step: 1 } },
    xLabel: { control: "text" },
    yLabel: { control: "text" },
    animate: { control: "boolean" },
  },
} satisfies Meta<typeof ScatterChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    series: heightWeightSeries,
    xLabel: "Height (cm)",
    yLabel: "Weight (kg)",
    dotSize: 8,
  },
};

export const MultiSeries: Story = {
  args: {
    series: testScores,
    xLabel: "Study Hours",
    yLabel: "Score",
    dotSize: 7,
    height: 350,
    showLegend: true,
  },
};

export const BubbleChart: Story = {
  args: {
    series: bubbleSeries,
    height: 350,
  },
};

export const LargeDots: Story = {
  args: {
    series: heightWeightSeries,
    dotSize: 14,
    xLabel: "Height (cm)",
    yLabel: "Weight (kg)",
  },
};

export const SmallDots: Story = {
  args: {
    series: heightWeightSeries,
    dotSize: 4,
    xLabel: "Height (cm)",
    yLabel: "Weight (kg)",
  },
};

export const NoGrid: Story = {
  args: {
    series: heightWeightSeries,
    showGrid: false,
    xLabel: "Height (cm)",
    yLabel: "Weight (kg)",
  },
};

export const WithLegend: Story = {
  args: {
    series: testScores,
    showLegend: true,
    legendPosition: "bottom",
    xLabel: "Study Hours",
    yLabel: "Score",
  },
};

export const WithValueFormatter: Story = {
  args: {
    series: heightWeightSeries,
    xLabel: "Height",
    yLabel: "Weight",
    valueFormatter: (v: number) => `${v}`,
    dotSize: 8,
  },
};

export const TallChart: Story = {
  args: {
    series: heightWeightSeries,
    height: 450,
    xLabel: "Height (cm)",
    yLabel: "Weight (kg)",
    dotSize: 8,
  },
};

export const PerSeriesColors: Story = {
  name: "Per-Series Custom Colors",
  args: {
    series: [
      {
        name: "Group A",
        color: "#ef4444",
        data: [
          { x: 10, y: 30 },
          { x: 20, y: 50 },
          { x: 30, y: 40 },
          { x: 40, y: 60 },
        ],
      },
      {
        name: "Group B",
        color: "#3b82f6",
        data: [
          { x: 15, y: 20 },
          { x: 25, y: 45 },
          { x: 35, y: 35 },
          { x: 45, y: 55 },
        ],
      },
    ],
    showLegend: true,
    dotSize: 8,
  },
};
