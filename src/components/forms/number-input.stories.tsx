import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberInput } from "./number-input";

const meta = {
  title: "Forms/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    showStepper: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof NumberInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: 5, label: "Quantity" },
};

export const WithMinMax: Story = {
  args: { defaultValue: 1, min: 1, max: 10, label: "Rating (1-10)" },
};

export const WithPrecision: Story = {
  args: { defaultValue: 9.99, step: 0.01, precision: 2, label: "Price" },
};

export const WithError: Story = {
  args: { defaultValue: 0, min: 1, label: "Amount", error: "Value must be at least 1" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-4 max-w-xs">
      <NumberInput {...args} size="sm" defaultValue={1} label="Small" />
      <NumberInput {...args} size="md" defaultValue={5} label="Medium" />
      <NumberInput {...args} size="lg" defaultValue={10} label="Large" />
    </div>
  ),
};

export const NoStepper: Story = {
  args: { defaultValue: 42, showStepper: false, label: "Custom value" },
};
