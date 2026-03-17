import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyButton } from "./copy-button";

const meta = {
  title: "Forms/CopyButton",
  component: CopyButton,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "ghost", "outline"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    label: { control: "text" },
    timeout: { control: { type: "number", min: 500, max: 5000 } },
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: "Hello, World!" },
};

export const Ghost: Story = {
  args: { value: "npm install spark-ui", variant: "ghost" },
};

export const Outline: Story = {
  args: { value: "npm install spark-ui", variant: "outline" },
};

export const DefaultVariant: Story = {
  args: { value: "npm install spark-ui", variant: "default" },
};

export const WithLabel: Story = {
  args: { value: "npm install spark-ui", label: "Copy" },
};

export const Small: Story = {
  args: { value: "text", size: "sm" },
};

export const Large: Story = {
  args: { value: "text", size: "lg" },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Ghost:</span>
        <CopyButton {...args} value="ghost" variant="ghost" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Default:</span>
        <CopyButton {...args} value="default" variant="default" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Outline:</span>
        <CopyButton {...args} value="outline" variant="outline" />
      </div>
    </div>
  ),
};

export const InlineWithCode: Story = {
  render: (args) => (
    <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
      <code className="text-sm font-mono text-slate-700 flex-1">npm install spark-ui</code>
      <CopyButton {...args} value="npm install spark-ui" variant="ghost" size="sm" />
    </div>
  ),
};
