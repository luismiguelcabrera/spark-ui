import type { Meta, StoryObj } from "@storybook/react-vite";
import { SemiCircleProgress } from "./semi-circle-progress";

const meta = {
  title: "Data Display/SemiCircleProgress",
  component: SemiCircleProgress,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    size: { control: { type: "range", min: 100, max: 400, step: 10 } },
    thickness: { control: { type: "range", min: 4, max: 30, step: 2 } },
    color: { control: "text" },
    showValue: { control: "boolean" },
  },
} satisfies Meta<typeof SemiCircleProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 65,
  },
};

export const WithLabel: Story = {
  args: {
    value: 78,
    label: "Storage Used",
  },
};

export const CustomColor: Story = {
  args: {
    value: 42,
    color: "text-emerald-500",
    label: "Efficiency",
  },
};

export const HighValue: Story = {
  args: {
    value: 95,
    color: "text-red-500",
    label: "CPU Usage",
  },
};

export const LowValue: Story = {
  args: {
    value: 15,
    color: "text-blue-500",
    label: "Memory",
  },
};

export const LargeSize: Story = {
  args: {
    value: 72,
    size: 300,
    thickness: 20,
    label: "Downloads",
  },
};

export const SmallSize: Story = {
  args: {
    value: 50,
    size: 120,
    thickness: 8,
  },
};

export const HiddenValue: Story = {
  args: {
    value: 60,
    showValue: false,
    label: "Progress",
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-end gap-8">
      <SemiCircleProgress {...args} value={20} size={140} color="text-blue-500" label="Low" />
      <SemiCircleProgress {...args} value={50} size={160} color="text-amber-500" label="Medium" />
      <SemiCircleProgress {...args} value={80} size={180} color="text-emerald-500" label="High" />
      <SemiCircleProgress {...args} value={95} size={200} color="text-red-500" label="Critical" />
    </div>
  ),
};
