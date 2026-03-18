import type { Meta, StoryObj } from "@storybook/react-vite";
import { MaskInput } from "./mask-input";

const meta = {
  title: "Forms/MaskInput",
  component: MaskInput,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof MaskInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const PhoneNumber: Story = {
  args: {
    mask: "(999) 999-9999",
    label: "Phone number",
    hint: "(999) 999-9999",
  },
};

export const Date: Story = {
  args: {
    mask: "99/99/9999",
    label: "Date",
    hint: "MM/DD/YYYY",
  },
};

export const CreditCard: Story = {
  args: {
    mask: "9999 9999 9999 9999",
    label: "Card number",
    hint: "1234 5678 9012 3456",
  },
};

export const MixedMask: Story = {
  args: {
    mask: "aa-9999",
    label: "License plate",
    hint: "AB-1234",
  },
};

export const CustomPlaceholder: Story = {
  args: {
    mask: "999-999",
    maskChar: "#",
    label: "Code",
    hint: "Custom # placeholder",
  },
};

export const WithError: Story = {
  args: {
    mask: "(999) 999-9999",
    label: "Phone",
    error: "Please enter a valid phone number",
  },
};

export const Disabled: Story = {
  args: {
    mask: "(999) 999-9999",
    label: "Phone",
    disabled: true,
  },
};
