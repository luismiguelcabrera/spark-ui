import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";

const meta = {
  title: "Data Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default", "primary", "success", "warning", "danger",
        "info", "accent", "mint", "purple", "indigo", "live",
      ],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Badge" } };
export const Success: Story = { args: { children: "Active", variant: "success" } };
export const Danger: Story = { args: { children: "Error", variant: "danger" } };
export const Live: Story = { args: { children: "Live", variant: "live" } };
