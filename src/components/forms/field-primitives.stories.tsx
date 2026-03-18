import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldLabel } from "./field-label";
import { FieldDescription } from "./field-description";
import { FieldError } from "./field-error";

// ── FieldLabel Stories ──

const labelMeta = {
  title: "Forms/FieldLabel",
  component: FieldLabel,
  tags: ["autodocs"],
  argTypes: {
    required: { control: "boolean" },
    htmlFor: { control: "text" },
  },
} satisfies Meta<typeof FieldLabel>;

export default labelMeta;
type Story = StoryObj<typeof labelMeta>;

export const Default: Story = {
  args: { children: "Email address" },
};

export const Required: Story = {
  args: { children: "Password", required: true },
};

export const WithHtmlFor: Story = {
  args: { children: "Username", htmlFor: "username-input" },
};

export const CustomClassName: Story = {
  args: { children: "Custom Style", className: "text-lg text-blue-600 font-bold" },
};

// ── Combined: All field primitives together ──

export const Combined: Story = {
  render: () => (
    <div className="flex flex-col gap-1 max-w-sm">
      <FieldLabel htmlFor="demo-input" required>
        Email
      </FieldLabel>
      <input
        id="demo-input"
        type="email"
        placeholder="you@example.com"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      <FieldDescription>We will never share your email.</FieldDescription>
      <FieldError>Please enter a valid email address.</FieldError>
    </div>
  ),
};

export const WithoutError: Story = {
  render: () => (
    <div className="flex flex-col gap-1 max-w-sm">
      <FieldLabel htmlFor="demo-ok">Username</FieldLabel>
      <input
        id="demo-ok"
        placeholder="johndoe"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      <FieldDescription>Choose a unique username.</FieldDescription>
      <FieldError>{null}</FieldError>
    </div>
  ),
};
