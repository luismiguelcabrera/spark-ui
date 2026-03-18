import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircularProgress } from "./circular-progress";

const meta = {
  title: "Feedback/CircularProgress",
  component: CircularProgress,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "select", options: ["primary", "secondary", "success", "warning", "destructive", "accent"] },
    showValue: { control: "boolean" },
    indeterminate: { control: "boolean" },
  },
} satisfies Meta<typeof CircularProgress>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 65, showValue: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true },
};

export const Colors: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      {(["primary", "secondary", "success", "warning", "destructive", "accent"] as const).map((color) => (
        <CircularProgress {...args} key={color} value={75} color={color} showValue size={48} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <CircularProgress {...args} value={60} size={32} strokeWidth={3} />
      <CircularProgress {...args} value={60} size={48} strokeWidth={4} showValue />
      <CircularProgress {...args} value={60} size={64} strokeWidth={5} showValue />
      <CircularProgress {...args} value={60} size={96} strokeWidth={6} showValue />
    </div>
  ),
};
