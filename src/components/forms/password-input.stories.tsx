import type { Meta, StoryObj } from "@storybook/react-vite";
import { PasswordInput } from "./password-input";

const meta = {
  title: "Forms/PasswordInput",
  component: PasswordInput,
  tags: ["autodocs"],
  argTypes: {
    error: { control: "text" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "Enter password" },
};

export const WithError: Story = {
  args: { placeholder: "Enter password", error: "Password must be at least 8 characters", id: "pw", "aria-label": "Password" },
};

export const Disabled: Story = {
  args: { placeholder: "Enter password", disabled: true },
};

export const WithValue: Story = {
  args: { defaultValue: "supersecret123", id: "pw-val", "aria-label": "Password" },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="max-w-sm space-y-1.5">
      <label htmlFor="pw-label" className="text-sm font-medium text-gray-700">Password</label>
      <PasswordInput {...args} id="pw-label" placeholder="Enter your password" />
    </div>
  ),
};
