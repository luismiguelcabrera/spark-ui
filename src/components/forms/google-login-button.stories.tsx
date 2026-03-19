import type { Meta, StoryObj } from "@storybook/react-vite";
import { GoogleLoginButton } from "./google-login-button";

const meta = {
  title: "Forms/GoogleLoginButton",
  component: GoogleLoginButton,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof GoogleLoginButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: { label: "Sign in with Google" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const SignUpLabel: Story = {
  args: { label: "Sign up with Google" },
};
