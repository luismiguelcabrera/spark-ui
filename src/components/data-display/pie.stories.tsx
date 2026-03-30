import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pie } from "./pie";

const meta = {
  title: "Data Display/Pie",
  component: Pie,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "number", min: 100, max: 500 } },
    donut: { control: "boolean" },
    strokeWidth: { control: { type: "number", min: 10, max: 80 } },
  },
} satisfies Meta<typeof Pie>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
  { value: 40, color: "#3b82f6", label: "Engineering" },
  { value: 25, color: "#ef4444", label: "Marketing" },
  { value: 20, color: "#22c55e", label: "Sales" },
  { value: 15, color: "#f59e0b", label: "Design" },
];

export const Default: Story = {
  args: {
    data: sampleData,
    size: 200,
  },
};

export const Donut: Story = {
  args: {
    data: sampleData,
    size: 200,
    donut: true,
    strokeWidth: 40,
  },
};

export const DonutWithCenter: Story = {
  args: {
    data: sampleData,
    size: 220,
    donut: true,
    strokeWidth: 36,
  },
  render: (args) => (
    <Pie {...args}>
      <div className="text-center">
        <p className="text-2xl font-bold text-slate-800">100</p>
        <p className="text-xs text-slate-500">Total</p>
      </div>
    </Pie>
  ),
};

export const TwoSegments: Story = {
  args: {
    data: [
      { value: 70, color: "#3b82f6", label: "Complete" },
      { value: 30, color: "#e2e8f0", label: "Remaining" },
    ],
    size: 160,
    donut: true,
    strokeWidth: 24,
  },
  render: (args) => (
    <Pie {...args}>
      <span className="text-xl font-bold text-blue-600">70%</span>
    </Pie>
  ),
};

export const Large: Story = {
  args: {
    data: sampleData,
    size: 350,
  },
};

export const Small: Story = {
  args: {
    data: sampleData,
    size: 100,
  },
};

export const SingleSegment: Story = {
  args: {
    data: [{ value: 100, color: "#22c55e", label: "All" }],
    size: 180,
  },
};

export const EmptyData: Story = {
  args: {
    data: [],
    size: 180,
    donut: true,
    strokeWidth: 30,
  },
  render: (args) => (
    <Pie {...args}>
      <span className="text-sm text-slate-400">No data</span>
    </Pie>
  ),
};

export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-8">
      <div className="text-center">
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Pie</p>
        <Pie {...args} data={sampleData} size={160} />
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Donut</p>
        <Pie {...args} data={sampleData} size={160} donut strokeWidth={32} />
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">With Center</p>
        <Pie {...args} data={sampleData} size={160} donut strokeWidth={28}>
          <span className="text-lg font-bold">100</span>
        </Pie>
      </div>
    </div>
  ),
};
