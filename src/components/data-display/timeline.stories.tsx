import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timeline } from "./timeline";

const meta = {
  title: "Data Display/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["left", "right", "alternating"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    lineStyle: { control: "select", options: ["solid", "dashed", "dotted"] },
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    title: "Order placed",
    description: "Your order #12345 has been confirmed",
    date: "Mar 15, 2025",
    icon: "shopping-cart",
    color: "success" as const,
  },
  {
    title: "Processing",
    description: "Your items are being prepared",
    date: "Mar 16, 2025",
    icon: "archive",
    color: "primary" as const,
    active: true,
  },
  {
    title: "Shipped",
    description: "Package has left our warehouse",
    date: "Pending",
    color: "default" as const,
  },
  {
    title: "Delivered",
    description: "Package will arrive at your doorstep",
    date: "Pending",
    color: "default" as const,
  },
];

export const Default: Story = {
  args: { items, variant: "left", size: "md" },
};

export const Alternating: Story = {
  args: { items, variant: "alternating", size: "md" },
};

export const RightAligned: Story = {
  args: { items, variant: "right", size: "md" },
};

export const Dashed: Story = {
  args: { items, variant: "left", lineStyle: "dashed" },
};

export const Dotted: Story = {
  args: { items, variant: "left", lineStyle: "dotted" },
};

export const Small: Story = {
  args: { items, variant: "left", size: "sm" },
};

export const Large: Story = {
  args: { items, variant: "left", size: "lg" },
};

export const ProjectMilestones: Story = {
  args: {
    items: [
      {
        title: "Project kickoff",
        description: "Initial planning and team assembly",
        date: "Jan 2025",
        icon: "star",
        color: "success" as const,
      },
      {
        title: "Design phase",
        description: "Wireframes, prototypes, and design system",
        date: "Feb 2025",
        icon: "edit",
        color: "success" as const,
      },
      {
        title: "Development sprint 1",
        description: "Core components and infrastructure",
        date: "Mar 2025",
        icon: "code",
        color: "primary" as const,
        active: true,
      },
      {
        title: "Testing & QA",
        description: "Automated and manual testing",
        date: "Apr 2025",
        color: "warning" as const,
      },
      {
        title: "Launch",
        description: "Public release v1.0",
        date: "May 2025",
        color: "default" as const,
      },
    ],
    variant: "left",
    size: "md",
    lineStyle: "solid",
  },
};
