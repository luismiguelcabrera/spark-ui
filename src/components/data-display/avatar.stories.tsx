import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./avatar";

const meta = {
  title: "Data Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    ring: { control: "select", options: ["none", "white", "primary"] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInitials: Story = { args: { initials: "JD", size: "lg" } };
export const WithImage: Story = {
  args: { src: "https://i.pravatar.cc/150?u=1", alt: "User", size: "lg" },
};
export const Fallback: Story = { args: { alt: "Alice", size: "lg" } };
export const WithRing: Story = {
  args: { initials: "AB", size: "lg", ring: "primary" },
};
