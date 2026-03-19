import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldError } from "./field-error";

const meta = {
  title: "Forms/FieldError",
  component: FieldError,
  tags: ["autodocs"],
} satisfies Meta<typeof FieldError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "This field is required." },
};

export const LongMessage: Story = {
  args: {
    children: "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
  },
};

export const Empty: Story = {
  args: { children: undefined },
};

export const WithCustomClass: Story = {
  args: {
    children: "Invalid email address",
    className: "text-sm font-bold",
  },
};
