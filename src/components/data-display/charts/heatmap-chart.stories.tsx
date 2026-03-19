import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeatmapChart } from "./heatmap-chart";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];

const weeklyActivity = days.flatMap((day) =>
  hours.map((hour) => ({
    x: day,
    y: hour,
    value: Math.floor(Math.random() * 50) + 1,
  }))
);

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const categories = ["Sales", "Marketing", "Support", "Engineering"];

const departmentData = months.flatMap((month) =>
  categories.map((cat) => ({
    x: month,
    y: cat,
    value: Math.floor(Math.random() * 100) + 10,
  }))
);

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
    colorRange: ["#fef3c7", "#d97706"] as [string, string],
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

export const GreenColorRange: Story = {
  args: {
    data: weeklyActivity,
    showValues: false,
    showLegend: true,
    colorRange: ["#ecfdf5", "#059669"] as [string, string],
    height: 350,
  },
};

export const RedColorRange: Story = {
  args: {
    data: departmentData,
    showValues: true,
    showLegend: true,
    colorRange: ["#fef2f2", "#dc2626"] as [string, string],
    height: 250,
  },
};

export const PurpleColorRange: Story = {
  args: {
    data: weeklyActivity,
    showValues: false,
    showLegend: true,
    colorRange: ["#faf5ff", "#7c3aed"] as [string, string],
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
    data: days.flatMap((day) =>
      ["Morning", "Afternoon", "Evening"].map((period) => ({
        x: day,
        y: period,
        value: Math.floor(Math.random() * 100),
      }))
    ),
    showValues: true,
    showLegend: true,
    height: 200,
  },
};
