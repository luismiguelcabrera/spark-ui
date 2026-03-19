import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScatterChart } from "./scatter-chart";

const heightWeight = [
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

const testScores = [
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

const bubbleData = [
  { x: 10, y: 20, size: 20, label: "Small" },
  { x: 30, y: 50, size: 30, label: "Medium" },
  { x: 60, y: 40, size: 45, label: "Large" },
  { x: 80, y: 70, size: 25, label: "Mid" },
  { x: 50, y: 80, size: 35, label: "Big" },
];

const meta = {
  title: "Data Display/Charts/ScatterChart",
  component: ScatterChart,
  tags: ["autodocs"],
  argTypes: {
    height: { control: { type: "range", min: 200, max: 500, step: 50 } },
    showGrid: { control: "boolean" },
    showLabels: { control: "boolean" },
    dotSize: { control: { type: "range", min: 3, max: 15, step: 1 } },
    xLabel: { control: "text" },
    yLabel: { control: "text" },
  },
} satisfies Meta<typeof ScatterChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: heightWeight,
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
  },
};

export const BubbleChart: Story = {
  args: {
    data: bubbleData,
    height: 350,
  },
};

export const LargeDots: Story = {
  args: {
    data: heightWeight,
    dotSize: 14,
    xLabel: "Height (cm)",
    yLabel: "Weight (kg)",
  },
};

export const SmallDots: Story = {
  args: {
    data: heightWeight,
    dotSize: 4,
    xLabel: "Height (cm)",
    yLabel: "Weight (kg)",
  },
};

export const NoGrid: Story = {
  args: {
    data: heightWeight,
    showGrid: false,
    xLabel: "Height (cm)",
    yLabel: "Weight (kg)",
  },
};

export const NoLabels: Story = {
  args: {
    data: heightWeight,
    showLabels: false,
  },
};

export const TallChart: Story = {
  args: {
    data: heightWeight,
    height: 450,
    xLabel: "Height (cm)",
    yLabel: "Weight (kg)",
    dotSize: 8,
  },
};
