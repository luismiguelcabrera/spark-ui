import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./card";

const meta = {
  title: "Data Display/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "glass", "elevated", "outline"] },
    padding: { control: "select", options: ["none", "sm", "md", "lg"] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Card content goes here." } };
export const WithTitle: Story = {
  args: { title: "Card Title", subtitle: "A subtitle", children: "Body content" },
};
export const WithFooter: Story = {
  args: { children: "Card body", footer: "Footer content" },
};
export const Outline: Story = {
  args: { variant: "outline", children: "Outline card" },
};
