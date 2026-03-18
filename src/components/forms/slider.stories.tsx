import type { Meta, StoryObj } from "@storybook/react-vite";
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
    range: { control: "boolean" },
    ticks: { control: "boolean" },
    thumbLabel: { control: "select", options: ["always", "hover", false] },
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

export const RangeMode: Story = {
  args: {
    range: true,
    defaultValue: [20, 80] as [number, number],
    "aria-label": "Price range",
    showLabels: true,
  },
};

export const RangeWithTooltip: Story = {
  args: {
    range: true,
    defaultValue: [30, 70] as [number, number],
    showTooltip: true,
    "aria-label": "Range with tooltip",
  },
};

export const WithTicks: Story = {
  args: {
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 25,
    ticks: true,
    "aria-label": "Rating",
  },
};

export const WithTickLabels: Story = {
  args: {
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 25,
    ticks: true,
    tickLabels: ["0%", "25%", "50%", "75%", "100%"],
    "aria-label": "Percentage",
  },
};

export const ThumbLabelAlways: Story = {
  args: {
    defaultValue: 50,
    thumbLabel: "always",
    "aria-label": "Always label",
  },
};

export const ThumbLabelHover: Story = {
  args: {
    defaultValue: 50,
    thumbLabel: "hover",
    "aria-label": "Hover label",
  },
};

export const RangeWithTicks: Story = {
  render: (args) => (
    <div className="max-w-md">
      <Slider
        {...args}
        range
        defaultValue={[20, 80] as [number, number]}
        min={0}
        max={100}
        step={10}
        ticks
        tickLabels={["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"]}
        thumbLabel="always"
        showLabels
        aria-label="Range with ticks"
      />
    </div>
  ),
};
