import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Rating } from "./rating";

const meta = {
  title: "Feedback/Rating",
  component: Rating,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    value: { control: { type: "range", min: 0, max: 5, step: 0.5 } },
    max: { control: { type: "range", min: 1, max: 10, step: 1 } },
    readOnly: { control: "boolean" },
    allowHalf: { control: "boolean" },
    allowClear: { control: "boolean" },
    disabled: { control: "boolean" },
    color: { control: "select", options: ["amber", "red", "pink", "purple", "blue", "green"] },
  },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 3,
    max: 5,
    size: "md",
  },
};

export const FullRating: Story = {
  args: {
    value: 5,
    max: 5,
    size: "md",
  },
};

export const EmptyRating: Story = {
  args: {
    value: 0,
    max: 5,
    size: "md",
  },
};

export const HalfStar: Story = {
  args: {
    value: 3.5,
    max: 5,
    size: "md",
  },
};

export const SmallSize: Story = {
  args: {
    value: 4,
    max: 5,
    size: "sm",
  },
};

export const LargeSize: Story = {
  args: {
    value: 4,
    max: 5,
    size: "lg",
  },
};

export const CustomMax: Story = {
  args: {
    value: 7,
    max: 10,
    size: "md",
  },
};

export const AllSizes: Story = {
  args: {
    value: 4,
  },
  render: (args) => (
    <div className="space-y-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 w-8">{size}</span>
          <Rating {...args} size={size} />
        </div>
      ))}
    </div>
  ),
};

export const ValueRange: Story = {
  args: {
    size: "md",
  },
  render: (args) => (
    <div className="space-y-3">
      {[0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((value) => (
        <div key={value} className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 w-8 text-right">{value}</span>
          <Rating {...args} value={value} />
        </div>
      ))}
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    value: 0,
    size: "lg",
  },
  render: (args) => {
    const Controller = () => {
      const [value, setValue] = useState(0);
      return (
        <div className="space-y-4">
          <Rating {...args} value={value} />
          <div className="flex items-center gap-2">
            <label htmlFor="rating-range" className="text-sm text-slate-600">Select rating:</label>
            <input
              id="rating-range"
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium text-slate-700 w-8">{value}</span>
          </div>
        </div>
      );
    };
    return <Controller />;
  },
};

export const InteractiveInput: Story = {
  args: {
    readOnly: false,
    defaultValue: 0,
    size: "lg",
  },
};

export const InteractiveWithDefault: Story = {
  args: {
    readOnly: false,
    defaultValue: 3,
    size: "lg",
  },
};

export const InteractiveHalfStar: Story = {
  args: {
    readOnly: false,
    allowHalf: true,
    defaultValue: 0,
    size: "lg",
  },
};

export const InteractiveClearable: Story = {
  args: {
    readOnly: false,
    allowClear: true,
    defaultValue: 3,
    size: "lg",
  },
};

export const InteractiveDisabled: Story = {
  args: {
    readOnly: false,
    disabled: true,
    defaultValue: 3,
    size: "lg",
  },
};

export const Colors: Story = {
  args: { readOnly: false, defaultValue: 3 },
  render: (args) => (
    <div className="space-y-4">
      {(["amber", "red", "pink", "purple", "blue", "green"] as const).map((color) => (
        <div key={color} className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 w-12 capitalize">{color}</span>
          <Rating {...args} color={color} />
        </div>
      ))}
    </div>
  ),
};
