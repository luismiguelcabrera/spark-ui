import type { Meta, StoryObj } from "@storybook/react-vite";
import { FunnelChart } from "./funnel-chart";

const salesPipeline = [
  { label: "Leads", value: 5000 },
  { label: "Qualified", value: 3200 },
  { label: "Proposal", value: 1800 },
  { label: "Negotiation", value: 900 },
  { label: "Closed", value: 450 },
];

const signupFunnel = [
  { label: "Visitors", value: 10000, color: "#3b82f6" },
  { label: "Sign ups", value: 5000, color: "#6366f1" },
  { label: "Trials", value: 2500, color: "#8b5cf6" },
  { label: "Paid", value: 1200, color: "#a855f7" },
  { label: "Enterprise", value: 400, color: "#c084fc" },
];

const meta = {
  title: "Data Display/Charts/FunnelChart",
  component: FunnelChart,
  tags: ["autodocs"],
  argTypes: {
    height: { control: { type: "range", min: 200, max: 500, step: 50 } },
    showLabels: { control: "boolean" },
    showValues: { control: "boolean" },
    showPercentage: { control: "boolean" },
    orientation: { control: "select", options: ["vertical", "horizontal"] },
  },
} satisfies Meta<typeof FunnelChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: salesPipeline,
    showValues: true,
  },
};

export const WithPercentage: Story = {
  args: {
    data: salesPipeline,
    showValues: true,
    showPercentage: true,
    height: 350,
  },
};

export const Horizontal: Story = {
  args: {
    data: salesPipeline,
    orientation: "horizontal",
    showValues: true,
  },
};

export const CustomColors: Story = {
  args: {
    data: signupFunnel,
    showValues: true,
    showPercentage: true,
    height: 350,
  },
};

export const NoLabels: Story = {
  args: {
    data: salesPipeline,
    showLabels: false,
    showValues: true,
  },
};

export const ValuesOnly: Story = {
  args: {
    data: salesPipeline,
    showValues: true,
    showPercentage: false,
  },
};

export const PercentageOnly: Story = {
  args: {
    data: salesPipeline,
    showValues: false,
    showPercentage: true,
  },
};

export const ThreeStages: Story = {
  args: {
    data: [
      { label: "Awareness", value: 8000 },
      { label: "Interest", value: 3500 },
      { label: "Purchase", value: 1200 },
    ],
    showValues: true,
    showPercentage: true,
    height: 250,
  },
};
