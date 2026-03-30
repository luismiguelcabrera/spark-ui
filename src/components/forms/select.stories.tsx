import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./select";

const meta = {
  title: "Forms/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["outlined", "filled", "underlined"] },
    clearable: { control: "boolean" },
    loading: { control: "boolean" },
    error: { control: "text" },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <option value="">Select an option</option>
      <option value="react">React</option>
      <option value="vue">Vue</option>
      <option value="svelte">Svelte</option>
    </Select>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <Select {...args} error="Please select a framework">
      <option value="">Select an option</option>
      <option value="react">React</option>
    </Select>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="space-y-4 max-w-sm">
      {(["outlined", "filled", "underlined"] as const).map((variant) => (
        <div key={variant}>
          <p className="text-xs text-slate-500 mb-1 capitalize">{variant}</p>
          <Select {...args} variant={variant}>
            <option value="">Select an option</option>
            <option value="react">React</option>
            <option value="vue">Vue</option>
          </Select>
        </div>
      ))}
    </div>
  ),
};

export const Clearable: Story = {
  render: (args) => (
    <Select {...args} clearable value="react" onChange={() => {}}>
      <option value="">Select an option</option>
      <option value="react">React</option>
      <option value="vue">Vue</option>
    </Select>
  ),
};

export const Loading: Story = {
  render: (args) => (
    <Select {...args} loading>
      <option value="">Loading options...</option>
    </Select>
  ),
};
