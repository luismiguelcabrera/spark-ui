import type { Meta, StoryObj } from "@storybook/react-vite";
import { PasswordStrength } from "./password-strength";
import type { PasswordRule } from "./password-strength";

const meta = {
  title: "Forms/PasswordStrength",
  component: PasswordStrength,
  tags: ["autodocs"],
  argTypes: {
    error: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    hideRules: { control: "boolean" },
    hideStrengthBar: { control: "boolean" },
  },
} satisfies Meta<typeof PasswordStrength>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter password",
  },
};

export const WithError: Story = {
  args: {
    error: "Password is required",
    placeholder: "Enter password",
  },
};

export const HiddenRules: Story = {
  args: {
    hideRules: true,
    placeholder: "Enter password",
  },
};

export const HiddenStrengthBar: Story = {
  args: {
    hideStrengthBar: true,
    placeholder: "Enter password",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "secret123",
  },
};

export const PrefilledStrong: Story = {
  args: {
    defaultValue: "MyStr0ng!Pass",
  },
};

export const PrefilledWeak: Story = {
  args: {
    defaultValue: "abc",
  },
};

export const CustomRules: Story = {
  render: (args) => {
    const customRules: PasswordRule[] = [
      {
        label: "At least 10 characters",
        test: (pw) => pw.length >= 10,
      },
      {
        label: "Contains a number",
        test: (pw) => /\d/.test(pw),
      },
      {
        label: 'Includes the word "spark"',
        test: (pw) => pw.toLowerCase().includes("spark"),
      },
    ];

    return (
      <div className="max-w-sm">
        <PasswordStrength
          {...args}
          rules={customRules}
          placeholder="Enter password with custom rules"
        />
      </div>
    );
  },
};
