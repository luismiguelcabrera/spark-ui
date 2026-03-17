import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle } from "./toggle";

const meta = {
  title: "Forms/Toggle",
  component: Toggle,
  tags: ["autodocs"],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithLabel: Story = { args: { label: "Enable notifications" } };
export const Checked: Story = { args: { defaultChecked: true, label: "Active" } };
export const Disabled: Story = { args: { disabled: true, label: "Locked" } };
