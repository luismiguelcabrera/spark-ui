import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkline } from "./sparkline";

const upTrend = [10, 15, 12, 25, 22, 30, 28, 35, 40, 38, 45, 50];
const downTrend = [50, 48, 42, 38, 35, 30, 28, 22, 20, 15, 12, 10];
const volatile = [20, 45, 15, 50, 10, 40, 25, 55, 30, 60, 20, 50];
const steady = [30, 32, 31, 30, 33, 32, 31, 30, 32, 31, 33, 30];

const meta = {
  title: "Data Display/Sparkline",
  component: Sparkline,
  tags: ["autodocs"],
  argTypes: {
    width: { control: { type: "range", min: 60, max: 300, step: 10 } },
    height: { control: { type: "range", min: 16, max: 80, step: 4 } },
    strokeWidth: { control: { type: "range", min: 1, max: 5, step: 0.5 } },
    fill: { control: "boolean" },
    showDots: { control: "boolean" },
    animate: { control: "boolean" },
    color: { control: "color" },
  },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: upTrend,
  },
};

export const WithFill: Story = {
  args: {
    data: upTrend,
    fill: true,
    color: "#10b981",
  },
};

export const WithDots: Story = {
  args: {
    data: upTrend,
    showDots: true,
    color: "#6366f1",
  },
};

export const Animated: Story = {
  args: {
    data: volatile,
    animate: true,
    color: "#f59e0b",
  },
};

export const DownTrend: Story = {
  args: {
    data: downTrend,
    color: "#ef4444",
    fill: true,
  },
};

export const LargeSize: Story = {
  args: {
    data: volatile,
    width: 240,
    height: 60,
    strokeWidth: 3,
    fill: true,
    color: "#8b5cf6",
  },
};

export const SmallInline: Story = {
  render: (args) => (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      Revenue
      <Sparkline {...args} data={upTrend} width={80} height={20} color="#10b981" />
      <span className="text-green-600 font-medium">+12%</span>
    </div>
  ),
};

export const Gallery: Story = {
  render: (args) => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm text-gray-500">Up trend</span>
        <Sparkline {...args} data={upTrend} color="#10b981" fill />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm text-gray-500">Down trend</span>
        <Sparkline {...args} data={downTrend} color="#ef4444" fill />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm text-gray-500">Volatile</span>
        <Sparkline {...args} data={volatile} color="#f59e0b" fill />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm text-gray-500">Steady</span>
        <Sparkline {...args} data={steady} color="#6366f1" fill />
      </div>
    </div>
  ),
};
