import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label";

const meta = {
  title: "Forms/Label",
  component: Label,
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Email address" },
};

export const WithHtmlFor: Story = {
  args: { children: "Username", htmlFor: "username" },
};

export const WithCustomClass: Story = {
  args: { children: "Custom styled label", className: "text-lg text-primary" },
};

export const WithInput: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <Label {...args} htmlFor="demo-input">Full name</Label>
      <input
        id="demo-input"
        type="text"
        placeholder="John Doe"
        className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
      />
    </div>
  ),
};
