import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./slider";

const meta = {
  title: "Forms/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    color: { control: "select", options: ["primary", "secondary", "success", "warning", "destructive", "accent"] },
    showTooltip: { control: "boolean" },
    showLabels: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: 50, "aria-label": "Volume" },
};

export const WithLabels: Story = {
  args: { defaultValue: 30, showLabels: true, "aria-label": "Brightness" },
};

export const WithTooltip: Story = {
  args: { defaultValue: 60, showTooltip: true, "aria-label": "Opacity" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-8 max-w-md">
      <div><p className="text-xs text-slate-500 mb-2">Small</p><Slider {...args} size="sm" defaultValue={30} aria-label="Small" /></div>
      <div><p className="text-xs text-slate-500 mb-2">Medium</p><Slider {...args} size="md" defaultValue={50} aria-label="Medium" /></div>
      <div><p className="text-xs text-slate-500 mb-2">Large</p><Slider {...args} size="lg" defaultValue={70} aria-label="Large" /></div>
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div className="space-y-6 max-w-md">
      {(["primary", "secondary", "success", "warning", "destructive", "accent"] as const).map((color) => (
        <div key={color}>
          <p className="text-xs text-slate-500 mb-2 capitalize">{color}</p>
          <Slider {...args} color={color} defaultValue={60} aria-label={color} />
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { defaultValue: 40, disabled: true, "aria-label": "Disabled" },
};

export const CustomFormat: Story = {
  args: {
    defaultValue: 50,
    min: 0,
    max: 100,
    showLabels: true,
    showTooltip: true,
    formatValue: (v: number) => `${v}%`,
    "aria-label": "Percentage",
  },
};
