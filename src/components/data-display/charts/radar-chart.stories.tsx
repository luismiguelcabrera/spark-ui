import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadarChart } from "./radar-chart";

const skillData = [
  { label: "Design", value: 80, max: 100 },
  { label: "Frontend", value: 90, max: 100 },
  { label: "Backend", value: 70, max: 100 },
  { label: "DevOps", value: 60, max: 100 },
  { label: "Testing", value: 85, max: 100 },
];

const multiSeries = [
  {
    name: "Alice",
    color: "#6366f1",
    data: [
      { label: "Design", value: 80 },
      { label: "Frontend", value: 90 },
      { label: "Backend", value: 70 },
      { label: "DevOps", value: 60 },
      { label: "Testing", value: 85 },
    ],
  },
  {
    name: "Bob",
    color: "#f59e0b",
    data: [
      { label: "Design", value: 65 },
      { label: "Frontend", value: 75 },
      { label: "Backend", value: 90 },
      { label: "DevOps", value: 85 },
      { label: "Testing", value: 70 },
    ],
  },
];

const sixAxisData = [
  { label: "Speed", value: 85, max: 100 },
  { label: "Power", value: 70, max: 100 },
  { label: "Technique", value: 90, max: 100 },
  { label: "Stamina", value: 75, max: 100 },
  { label: "Defense", value: 60, max: 100 },
  { label: "Agility", value: 80, max: 100 },
];

const meta = {
  title: "Data Display/Charts/RadarChart",
  component: RadarChart,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "range", min: 200, max: 500, step: 20 } },
    showGrid: { control: "boolean" },
    showLabels: { control: "boolean" },
    showDots: { control: "boolean" },
    fillOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    color: { control: "color" },
  },
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: skillData,
  },
};

export const MultiSeries: Story = {
  args: {
    series: multiSeries,
    size: 350,
    fillOpacity: 0.15,
  },
};

export const CustomColor: Story = {
  args: {
    data: skillData,
    color: "#10b981",
    fillOpacity: 0.3,
  },
};

export const SixAxes: Story = {
  args: {
    data: sixAxisData,
    color: "#ef4444",
    fillOpacity: 0.25,
    size: 350,
  },
};

export const NoDots: Story = {
  args: {
    data: skillData,
    showDots: false,
    fillOpacity: 0.3,
    color: "#8b5cf6",
  },
};

export const NoGrid: Story = {
  args: {
    data: skillData,
    showGrid: false,
    fillOpacity: 0.2,
  },
};

export const NoLabels: Story = {
  args: {
    data: skillData,
    showLabels: false,
    size: 250,
  },
};

export const HighFillOpacity: Story = {
  args: {
    data: skillData,
    fillOpacity: 0.5,
    color: "#ec4899",
  },
};

export const LargeChart: Story = {
  args: {
    data: sixAxisData,
    size: 450,
    fillOpacity: 0.2,
    color: "#14b8a6",
  },
};
