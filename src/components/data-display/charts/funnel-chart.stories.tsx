import type { Meta, StoryObj } from "@storybook/react-vite";
import { FunnelChart } from "./funnel-chart";

// ─── Sample Data ─────────────────────────────────────────────────────────────

const salesPipeline = [
  { name: "Leads", value: 5000 },
  { name: "Qualified", value: 3200 },
  { name: "Proposal", value: 1800 },
  { name: "Negotiation", value: 900 },
  { name: "Closed", value: 450 },
];

const signupFunnel = [
  { name: "Visitors", value: 10000, color: "#3b82f6" },
  { name: "Sign ups", value: 5000, color: "#6366f1" },
  { name: "Trials", value: 2500, color: "#8b5cf6" },
  { name: "Paid", value: 1200, color: "#a855f7" },
  { name: "Enterprise", value: 400, color: "#c084fc" },
];

// ─── Meta ────────────────────────────────────────────────────────────────────

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
    animate: { control: "boolean" },
  },
} satisfies Meta<typeof FunnelChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ─────────────────────────────────────────────────────────────────

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

export const WithNamedColors: Story = {
  name: "Named Color Palette",
  args: {
    data: salesPipeline,
    colors: ["indigo", "violet", "purple", "pink", "rose"],
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

export const WithValueFormatter: Story = {
  args: {
    data: salesPipeline,
    showValues: true,
    valueFormatter: (v: number) => `${(v / 1000).toFixed(1)}K`,
  },
};

export const ThreeStages: Story = {
  args: {
    data: [
      { name: "Awareness", value: 8000 },
      { name: "Interest", value: 3500 },
      { name: "Purchase", value: 1200 },
    ],
    showValues: true,
    showPercentage: true,
    height: 250,
  },
};

export const NoAnimation: Story = {
  args: {
    data: salesPipeline,
    animate: false,
    showValues: true,
    showPercentage: true,
  },
};
