import type { Meta, StoryObj } from "@storybook/react-vite";
import { RingProgress } from "./ring-progress";

const meta = {
  title: "Data Display/RingProgress",
  component: RingProgress,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "range", min: 60, max: 300, step: 10 } },
    thickness: { control: { type: "range", min: 4, max: 30, step: 2 } },
    roundCaps: { control: "boolean" },
  },
} satisfies Meta<typeof RingProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sections: [{ value: 60 }],
  },
};

export const WithLabel: Story = {
  args: {
    sections: [{ value: 75 }],
    label: <span className="text-lg font-bold text-gray-900">75%</span>,
  },
};

export const MultiSection: Story = {
  args: {
    sections: [
      { value: 30, tooltip: "Primary" },
      { value: 25, tooltip: "Success" },
      { value: 20, tooltip: "Warning" },
    ],
    label: <span className="text-sm font-semibold text-gray-700">75%</span>,
  },
};

export const RoundCaps: Story = {
  args: {
    sections: [{ value: 65 }],
    roundCaps: true,
    label: <span className="text-lg font-bold text-gray-900">65%</span>,
  },
};

export const CustomColors: Story = {
  args: {
    sections: [
      { value: 40, color: "text-blue-500" },
      { value: 25, color: "text-pink-500" },
      { value: 15, color: "text-yellow-500" },
    ],
    roundCaps: true,
  },
};

export const LargeSize: Story = {
  args: {
    sections: [{ value: 80 }],
    size: 200,
    thickness: 20,
    roundCaps: true,
    label: (
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">80%</div>
        <div className="text-xs text-gray-500">Complete</div>
      </div>
    ),
  },
};

export const SmallSize: Story = {
  args: {
    sections: [{ value: 50 }],
    size: 60,
    thickness: 6,
  },
};

export const FullProgress: Story = {
  args: {
    sections: [{ value: 100 }],
    roundCaps: true,
    label: <span className="text-lg font-bold text-green-600">100%</span>,
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-end gap-8">
      <RingProgress
        {...args}
        sections={[{ value: 25 }]}
        size={80}
        label={<span className="text-xs font-bold">25%</span>}
      />
      <RingProgress
        {...args}
        sections={[{ value: 50 }]}
        size={100}
        label={<span className="text-sm font-bold">50%</span>}
      />
      <RingProgress
        {...args}
        sections={[{ value: 75 }]}
        size={120}
        roundCaps
        label={<span className="text-base font-bold">75%</span>}
      />
      <RingProgress
        {...args}
        sections={[
          { value: 30, color: "text-blue-500" },
          { value: 20, color: "text-emerald-500" },
          { value: 15, color: "text-amber-500" },
        ]}
        size={140}
        thickness={16}
        roundCaps
        label={<span className="text-lg font-bold">65%</span>}
      />
    </div>
  ),
};
