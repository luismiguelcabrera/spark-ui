import type { Meta, StoryObj } from "@storybook/react-vite";
import { LineChart } from "./line-chart";

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

const temperatureData = [
  { label: "6am", value: 12 },
  { label: "8am", value: 15 },
  { label: "10am", value: 20 },
  { label: "12pm", value: 25 },
  { label: "2pm", value: 28 },
  { label: "4pm", value: 26 },
  { label: "6pm", value: 22 },
  { label: "8pm", value: 18 },
  { label: "10pm", value: 14 },
];

const meta = {
  title: "Data Display/Charts/LineChart",
  component: LineChart,
  tags: ["autodocs"],
  argTypes: {
    height: { control: { type: "range", min: 200, max: 600, step: 50 } },
    showGrid: { control: "boolean" },
    showDots: { control: "boolean" },
    showArea: { control: "boolean" },
    smooth: { control: "boolean" },
    strokeWidth: { control: { type: "range", min: 1, max: 5, step: 0.5 } },
    color: { control: "color" },
  },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: monthlySales,
  },
};

export const Smooth: Story = {
  args: {
    data: monthlySales,
    smooth: true,
    color: "#10b981",
    strokeWidth: 3,
  },
};

export const WithAreaFill: Story = {
  args: {
    data: monthlySales,
    showArea: true,
    smooth: true,
    color: "#8b5cf6",
  },
};

export const NoDots: Story = {
  args: {
    data: temperatureData,
    showDots: false,
    smooth: true,
    color: "#ef4444",
    strokeWidth: 3,
  },
};

export const NoGrid: Story = {
  args: {
    data: monthlySales,
    showGrid: false,
    smooth: true,
  },
};

export const ThickLine: Story = {
  args: {
    data: temperatureData,
    strokeWidth: 4,
    smooth: true,
    color: "#f59e0b",
    showArea: true,
  },
};

export const StraightLines: Story = {
  args: {
    data: monthlySales,
    smooth: false,
    showDots: true,
    showArea: false,
    color: "#6366f1",
  },
};

export const CompactChart: Story = {
  args: {
    data: monthlySales,
    height: 200,
    smooth: true,
    showArea: true,
  },
};
