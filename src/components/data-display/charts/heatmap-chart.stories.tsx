import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeatmapChart } from "./heatmap-chart";

// ─── Sample Data ─────────────────────────────────────────────────────────────

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = [
  "9am",
  "10am",
  "11am",
  "12pm",
  "1pm",
  "2pm",
  "3pm",
  "4pm",
  "5pm",
];

// Use deterministic data instead of Math.random() so Storybook snapshots are stable
const weeklyActivity = days.flatMap((day, di) =>
  hours.map((hour, hi) => ({
    x: day,
    y: hour,
    value: ((di * 7 + hi * 13 + 5) % 50) + 1,
  }))
);

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const categories = ["Sales", "Marketing", "Support", "Engineering"];

const departmentData = months.flatMap((month, mi) =>
  categories.map((cat, ci) => ({
    x: month,
    y: cat,
    value: ((mi * 11 + ci * 17 + 3) % 90) + 10,
  }))
);

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta = {
  title: "Data Display/Charts/HeatmapChart",
  component: HeatmapChart,
  tags: ["autodocs"],
  argTypes: {
    height: { control: { type: "range", min: 200, max: 500, step: 50 } },
    showValues: { control: "boolean" },
    showLegend: { control: "boolean" },
  },
} satisfies Meta<typeof HeatmapChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    data: weeklyActivity,
    showValues: true,
    showLegend: true,
    height: 350,
  },
};

export const DepartmentPerformance: Story = {
  args: {
    data: departmentData,
    showValues: true,
    showLegend: true,
    colorScale: ["#fef3c7", "#d97706"] as [string, string],
    height: 250,
  },
};

export const NoValues: Story = {
  args: {
    data: weeklyActivity,
    showValues: false,
    showLegend: true,
  },
};

export const GreenColorScale: Story = {
  name: "Green Color Scale",
  args: {
    data: weeklyActivity,
    showValues: false,
    showLegend: true,
    colorScale: ["#ecfdf5", "#059669"] as [string, string],
    height: 350,
  },
};

export const RedColorScale: Story = {
  name: "Red Color Scale",
  args: {
    data: departmentData,
    showValues: true,
    showLegend: true,
    colorScale: ["#fef2f2", "#dc2626"] as [string, string],
    height: 250,
  },
};

export const PurpleColorScale: Story = {
  name: "Purple Color Scale",
  args: {
    data: weeklyActivity,
    showValues: false,
    showLegend: true,
    colorScale: ["#faf5ff", "#7c3aed"] as [string, string],
    height: 350,
  },
};

export const DivergingColorScale: Story = {
  name: "Diverging (3-stop) Color Scale",
  args: {
    data: weeklyActivity,
    showValues: false,
    showLegend: true,
    colorScale: ["#3b82f6", "#f5f5f4", "#ef4444"] as [
      string,
      string,
      string,
    ],
    height: 350,
  },
};

export const NoLegend: Story = {
  args: {
    data: departmentData,
    showValues: true,
    showLegend: false,
    height: 250,
  },
};

export const CompactGrid: Story = {
  args: {
    data: days.flatMap((day, di) =>
      ["Morning", "Afternoon", "Evening"].map((period, pi) => ({
        x: day,
        y: period,
        value: ((di * 5 + pi * 11 + 7) % 100),
      }))
    ),
    showValues: true,
    showLegend: true,
    height: 200,
  },
};

export const WithValueFormatter: Story = {
  args: {
    data: departmentData,
    showValues: true,
    showLegend: true,
    valueFormatter: (v: number) => `${v}%`,
    height: 250,
  },
};
