import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta = {
  title: "Forms/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "icon", "link"],
    },
    size: { control: "select", options: ["sm", "md", "lg", "icon"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { children: "Button", variant: "primary" } };
export const Secondary: Story = { args: { children: "Button", variant: "secondary" } };
export const Outline: Story = { args: { children: "Button", variant: "outline" } };
export const Ghost: Story = { args: { children: "Button", variant: "ghost" } };
export const Link: Story = { args: { children: "Learn more", variant: "link" } };
export const Small: Story = { args: { children: "Small", size: "sm" } };
export const Large: Story = { args: { children: "Large", size: "lg" } };
export const Loading: Story = { args: { children: "Saving...", loading: true } };
export const Disabled: Story = { args: { children: "Disabled", disabled: true } };
export const WithIcon: Story = { args: { children: "Add", icon: "add" } };
