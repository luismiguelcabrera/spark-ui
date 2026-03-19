import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldLabel } from "./field-label";

const meta = {
  title: "Forms/FieldLabel",
  component: FieldLabel,
  tags: ["autodocs"],
  argTypes: {
    required: { control: "boolean" },
  },
} satisfies Meta<typeof FieldLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Email address" },
};

export const Required: Story = {
  args: { children: "Full name", required: true },
};

export const WithHtmlFor: Story = {
  args: { children: "Username", htmlFor: "username-input" },
};

export const WithCustomClass: Story = {
  args: {
    children: "Custom label",
    className: "text-lg text-blue-600",
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="space-y-3">
      <FieldLabel {...args}>Regular label</FieldLabel>
      <FieldLabel {...args} required>Required label</FieldLabel>
      <FieldLabel {...args} className="text-xs text-slate-400">Small muted label</FieldLabel>
    </div>
  ),
};
