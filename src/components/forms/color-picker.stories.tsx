import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorPicker } from "./color-picker";

const meta = {
  title: "Forms/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    showInput: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof ColorPicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Brand Color" },
};

export const WithCustomPresets: Story = {
  args: {
    label: "Theme Color",
    presets: ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#1e293b"],
  },
};

export const NoInput: Story = {
  args: { label: "Pick a color", showInput: false },
};

export const Disabled: Story = {
  args: { label: "Disabled", disabled: true },
};
