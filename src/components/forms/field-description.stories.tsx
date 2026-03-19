import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldDescription } from "./field-description";

const meta = {
  title: "Forms/FieldDescription",
  component: FieldDescription,
  tags: ["autodocs"],
} satisfies Meta<typeof FieldDescription>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "This field is optional." },
};

export const LongText: Story = {
  args: {
    children:
      "Your password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and special characters.",
  },
};

export const WithCustomClass: Story = {
  args: {
    children: "Custom styled description",
    className: "text-blue-500 font-medium",
  },
};
