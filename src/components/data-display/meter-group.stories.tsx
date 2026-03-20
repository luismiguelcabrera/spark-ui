import type { Meta, StoryObj } from "@storybook/react-vite";
import { MeterGroup } from "./meter-group";

const meta = {
  title: "Data Display/MeterGroup",
  component: MeterGroup,
  tags: ["autodocs"],
  argTypes: {
    max: { control: "number" },
    showLabels: { control: "boolean" },
    showValues: { control: "boolean" },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof MeterGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: "Used", value: 60, color: "bg-primary" },
      { label: "Shared", value: 20, color: "bg-primary/70" },
      { label: "Free", value: 20, color: "bg-muted" },
    ],
  },
};

export const DiskUsage: Story = {
  args: {
    items: [
      { label: "Documents", value: 35, color: "bg-primary" },
      { label: "Photos", value: 25, color: "bg-accent" },
      { label: "Apps", value: 15, color: "bg-warning" },
      { label: "System", value: 10, color: "bg-destructive" },
    ],
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    items: [
      { label: "Completed", value: 70, color: "bg-success" },
      { label: "In Progress", value: 20, color: "bg-warning" },
      { label: "Failed", value: 10, color: "bg-destructive" },
    ],
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    items: [
      { label: "Completed", value: 70, color: "bg-success" },
      { label: "In Progress", value: 20, color: "bg-warning" },
      { label: "Failed", value: 10, color: "bg-destructive" },
    ],
  },
};

export const NoLabels: Story = {
  args: {
    showLabels: false,
    items: [
      { label: "A", value: 40, color: "bg-primary" },
      { label: "B", value: 30, color: "bg-primary/70" },
      { label: "C", value: 30, color: "bg-muted" },
    ],
  },
};

export const NoValues: Story = {
  args: {
    showValues: false,
    items: [
      { label: "React", value: 45, color: "bg-cyan-500" },
      { label: "Vue", value: 30, color: "bg-emerald-500" },
      { label: "Angular", value: 25, color: "bg-destructive" },
    ],
  },
};

export const CustomMax: Story = {
  args: {
    max: 200,
    items: [
      { label: "Budget Used", value: 120, color: "bg-primary" },
      { label: "Reserved", value: 30, color: "bg-amber-400" },
    ],
  },
};

export const BudgetBreakdown: Story = {
  args: {
    items: [
      { label: "Engineering", value: 40, color: "bg-primary" },
      { label: "Marketing", value: 25, color: "bg-pink-500" },
      { label: "Design", value: 15, color: "bg-violet-500" },
      { label: "Sales", value: 12, color: "bg-emerald-500" },
      { label: "Other", value: 8, color: "bg-muted-foreground/50" },
    ],
    size: "lg",
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: "Progress", value: 65, color: "bg-primary" }],
  },
};
