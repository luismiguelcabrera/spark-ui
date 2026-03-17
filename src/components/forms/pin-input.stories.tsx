import type { Meta, StoryObj } from "@storybook/react-vite";
import { PinInput } from "./pin-input";

const meta = {
  title: "Forms/PinInput",
  component: PinInput,
  tags: ["autodocs"],
  argTypes: {
    length: { control: { type: "number", min: 3, max: 8 } },
    type: { control: "select", options: ["number", "text", "password"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    mask: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    autoFocus: { control: "boolean" },
    placeholder: { control: "text" },
    label: { control: "text" },
    errorMessage: { control: "text" },
  },
} satisfies Meta<typeof PinInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Verification Code" },
};

export const FourDigits: Story = {
  args: { length: 4, label: "PIN" },
};

export const Masked: Story = {
  args: { mask: true, label: "Enter PIN", length: 4 },
};

export const Numeric: Story = {
  args: { type: "number", label: "OTP Code" },
};

export const Alphanumeric: Story = {
  args: { type: "text", label: "License Key", length: 5 },
};

export const Small: Story = {
  args: { size: "sm", label: "Code" },
};

export const Large: Story = {
  args: { size: "lg", label: "Code" },
};

export const WithError: Story = {
  args: { error: true, errorMessage: "Invalid code. Please try again.", label: "Verification Code" },
};

export const Disabled: Story = {
  args: { disabled: true, label: "Code", value: "123456" },
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="space-y-6">
      <PinInput {...args} size="sm" label="Small" length={4} />
      <PinInput {...args} size="md" label="Medium" length={4} />
      <PinInput {...args} size="lg" label="Large" length={4} />
    </div>
  ),
};
