import type { Meta, StoryObj } from "@storybook/react-vite";
import { AreaChart } from "./area-chart";

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

const meta = {
  title: "Data Display/Charts/AreaChart",
  component: AreaChart,
  tags: ["autodocs"],
  argTypes: {
    height: { control: { type: "range", min: 200, max: 600, step: 50 } },
    showGrid: { control: "boolean" },
    stacked: { control: "boolean" },
    gradient: { control: "boolean" },
    color: { control: "color" },
  },
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: monthlySales,
    gradient: true,
  },
};

export const SolidFill: Story = {
  args: {
    data: monthlySales,
    gradient: false,
    color: "#f59e0b",
  },
};

export const MultiSeries: Story = {
  args: {
    series: trafficSeries,
    gradient: true,
  },
};

export const Stacked: Story = {
  args: {
    series: trafficSeries,
    stacked: true,
    gradient: true,
  },
};

export const NoGrid: Story = {
  args: {
    data: monthlySales,
    showGrid: false,
    gradient: true,
  },
};

export const CustomColor: Story = {
  args: {
    data: monthlySales,
    color: "#ec4899",
    gradient: true,
  },
};

export const TallChart: Story = {
  args: {
    data: monthlySales,
    height: 500,
    gradient: true,
  },
};

export const CompactChart: Story = {
  args: {
    data: monthlySales,
    height: 200,
    gradient: true,
  },
};
