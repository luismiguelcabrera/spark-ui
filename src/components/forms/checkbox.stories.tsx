import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";

const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "select", options: ["primary", "secondary", "success", "warning", "destructive"] },
    indeterminate: { control: "boolean" },
    error: { control: "text" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithLabel: Story = { args: { label: "I agree to the terms", id: "terms" } };
export const WithError: Story = { args: { label: "Accept", id: "accept", error: "Required" } };

export const Indeterminate: Story = {
  args: { indeterminate: true, label: "Select all", id: "selectall" },
};

export const Colors: Story = {
  render: (args) => (
    <div className="space-y-3">
      {(["primary", "secondary", "success", "warning", "destructive"] as const).map((color) => (
        <Checkbox
          key={color}
          {...args}
          color={color}
          label={color.charAt(0).toUpperCase() + color.slice(1)}
          id={`color-${color}`}
          defaultChecked
        />
      ))}
    </div>
  ),
};

export const IndeterminateWithColors: Story = {
  render: (args) => (
    <div className="space-y-3">
      {(["primary", "secondary", "success", "warning", "destructive"] as const).map((color) => (
        <Checkbox
          key={color}
          {...args}
          color={color}
          indeterminate
          label={`${color} indeterminate`}
          id={`indet-${color}`}
        />
      ))}
    </div>
  ),
};
