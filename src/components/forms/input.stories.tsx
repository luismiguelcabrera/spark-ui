import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";

const meta = {
  title: "Forms/Input",
  component: Input,
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { placeholder: "Enter your name" } };
export const WithLabel: Story = { args: { label: "Email", placeholder: "you@example.com" } };
export const WithError: Story = {
  args: { label: "Email", placeholder: "you@example.com", error: "This field is required" },
};
export const WithHint: Story = {
  args: { label: "Password", type: "password", hint: "Must be at least 8 characters" },
};
export const WithIcon: Story = {
  args: { label: "Search", placeholder: "Search...", icon: "search", iconPosition: "left" },
};
