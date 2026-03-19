import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormField } from "./form-field";

const meta = {
  title: "Forms/FormField",
  component: FormField,
  tags: ["autodocs"],
  argTypes: {
    iconPosition: { control: "select", options: ["left", "right"] },
    error: { control: "text" },
    hint: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Email", placeholder: "you@example.com" },
};

export const WithIcon: Story = {
  args: { label: "Email", placeholder: "you@example.com", icon: "mail" },
};

export const WithIconLeft: Story = {
  args: { label: "Search", placeholder: "Search...", icon: "search", iconPosition: "left" },
};

export const WithError: Story = {
  args: { label: "Email", placeholder: "you@example.com", error: "Please enter a valid email" },
};

export const WithHint: Story = {
  args: { label: "Username", placeholder: "johndoe", hint: "Must be 3-20 characters" },
};

export const Disabled: Story = {
  args: { label: "Locked field", placeholder: "Cannot edit", disabled: true },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="space-y-4 max-w-sm">
      <FormField {...args} label="Name" placeholder="John Doe" />
      <FormField {...args} label="Email" placeholder="you@example.com" icon="mail" />
      <FormField {...args} label="Password" type="password" error="Too short" />
      <FormField {...args} label="Bio" hint="Optional" placeholder="Tell us about yourself" />
    </div>
  ),
};
