import type { Meta, StoryObj } from "@storybook/react";
import { RangeSlider } from "./range-slider";

const meta = {
  title: "Forms/RangeSlider",
  component: RangeSlider,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    color: { control: "select", options: ["primary", "secondary", "accent", "success"] },
    showTooltip: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof RangeSlider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: [25, 75], label: "Price range" },
};

export const WithTooltip: Story = {
  args: { defaultValue: [20, 60], showTooltip: true, label: "Budget" },
};

export const CustomRange: Story = {
  args: { defaultValue: [10, 90], min: 0, max: 100, step: 10, label: "Custom" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-8 max-w-md">
      <div>
        <p className="text-xs text-slate-500 mb-2">Small</p>
        <RangeSlider {...args} size="sm" defaultValue={[20, 60]} label="Small" />
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-2">Medium</p>
        <RangeSlider {...args} size="md" defaultValue={[30, 70]} label="Medium" />
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-2">Large</p>
        <RangeSlider {...args} size="lg" defaultValue={[10, 90]} label="Large" />
      </div>
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div className="space-y-6 max-w-md">
      {(["primary", "secondary", "accent", "success"] as const).map((color) => (
        <div key={color}>
          <p className="text-xs text-slate-500 mb-2 capitalize">{color}</p>
          <RangeSlider {...args} color={color} defaultValue={[20, 80]} label={color} />
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { defaultValue: [30, 70], disabled: true, label: "Disabled" },
};
