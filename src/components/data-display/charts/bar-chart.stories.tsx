import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart } from "./bar-chart";

const monthlySales = [
  { label: "Jan", value: 4200 },
  { label: "Feb", value: 3800 },
  { label: "Mar", value: 5100 },
  { label: "Apr", value: 4600 },
  { label: "May", value: 5800 },
  { label: "Jun", value: 6200 },
];

const browserShare = [
  { label: "Chrome", value: 65, color: "#4285F4" },
  { label: "Safari", value: 19, color: "#5AC8FA" },
  { label: "Firefox", value: 8, color: "#FF7139" },
  { label: "Edge", value: 5, color: "#0078D7" },
  { label: "Other", value: 3, color: "#9ca3af" },
];

const meta = {
  title: "Data Display/Charts/BarChart",
  component: BarChart,
  tags: ["autodocs"],
  argTypes: {
    height: { control: { type: "range", min: 200, max: 600, step: 50 } },
    showGrid: { control: "boolean" },
    showValues: { control: "boolean" },
    animate: { control: "boolean" },
    orientation: { control: "select", options: ["vertical", "horizontal"] },
    color: { control: "color" },
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: monthlySales,
  },
};

export const WithValues: Story = {
  args: {
    data: monthlySales,
    showValues: true,
    animate: false,
  },
};

export const Horizontal: Story = {
  args: {
    data: monthlySales,
    orientation: "horizontal",
    showValues: true,
  },
};

export const CustomColors: Story = {
  args: {
    data: browserShare,
    showValues: true,
    animate: false,
  },
};

export const NoGrid: Story = {
  args: {
    data: monthlySales,
    showGrid: false,
  },
};

export const NoAnimation: Story = {
  args: {
    data: monthlySales,
    animate: false,
    showValues: true,
  },
};

export const CustomDefaultColor: Story = {
  args: {
    data: [
      { label: "Q1", value: 120 },
      { label: "Q2", value: 180 },
      { label: "Q3", value: 150 },
      { label: "Q4", value: 210 },
    ],
    color: "#10b981",
    showValues: true,
  },
};

export const ManyBars: Story = {
  args: {
    data: [
      { label: "Jan", value: 30 },
      { label: "Feb", value: 45 },
      { label: "Mar", value: 60 },
      { label: "Apr", value: 38 },
      { label: "May", value: 72 },
      { label: "Jun", value: 55 },
      { label: "Jul", value: 88 },
      { label: "Aug", value: 64 },
      { label: "Sep", value: 42 },
      { label: "Oct", value: 76 },
      { label: "Nov", value: 50 },
      { label: "Dec", value: 90 },
    ],
    height: 350,
  },
};
