import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "./chip";

const meta = {
  title: "Data Display/Chip",
  component: Chip,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["solid", "outline", "soft"] },
    color: { control: "select", options: ["default", "primary", "secondary", "success", "warning", "destructive"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    dismissible: { control: "boolean" },
    clickable: { control: "boolean" },
    disabled: { control: "boolean" },
    dot: { control: "boolean" },
    filter: { control: "boolean" },
    selected: { control: "boolean" },
    label: { control: "boolean" },
    closable: { control: "boolean" },
    icon: { control: "text" },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Chip" },
};

export const Solid: Story = {
  args: { children: "Solid", variant: "solid", color: "primary" },
};

export const Outline: Story = {
  args: { children: "Outline", variant: "outline", color: "primary" },
};

export const Soft: Story = {
  args: { children: "Soft", variant: "soft", color: "primary" },
};

export const WithIcon: Story = {
  args: { children: "Settings", icon: "settings" },
};

export const Dismissible: Story = {
  args: { children: "Remove me", dismissible: true, color: "primary" },
};

export const WithDot: Story = {
  args: { children: "Online", dot: true, color: "success" },
};

export const Clickable: Story = {
  args: { children: "Click me", clickable: true, color: "primary" },
};

export const Disabled: Story = {
  args: { children: "Disabled", disabled: true, color: "primary" },
};

export const FilterChip: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Chip {...args} filter selected color="primary">
        Selected
      </Chip>
      <Chip {...args} filter selected={false} color="primary" clickable>
        Not Selected
      </Chip>
      <Chip {...args} filter selected color="success">
        Active
      </Chip>
    </div>
  ),
};

export const LabelChip: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Chip {...args} label color="primary">Label</Chip>
      <Chip {...args} label color="success" variant="solid">Success</Chip>
      <Chip {...args} label color="destructive" variant="outline">Error</Chip>
    </div>
  ),
};

export const Closable: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Chip {...args} closable color="primary">Closable</Chip>
      <Chip {...args} closable color="success" icon="check">With Icon</Chip>
      <Chip {...args} closable disabled color="destructive">Disabled</Chip>
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      {(["default", "primary", "secondary", "success", "warning", "destructive"] as const).map((color) => (
        <Chip key={color} {...args} color={color}>
          {color}
        </Chip>
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      {(["solid", "outline", "soft"] as const).map((variant) => (
        <Chip key={variant} {...args} variant={variant} color="primary">
          {variant}
        </Chip>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Chip {...args} size="sm">Small</Chip>
      <Chip {...args} size="md">Medium</Chip>
      <Chip {...args} size="lg">Large</Chip>
    </div>
  ),
};

export const TagList: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Chip {...args} color="primary" icon="code" dismissible>React</Chip>
      <Chip {...args} color="success" icon="code" dismissible>TypeScript</Chip>
      <Chip {...args} color="warning" icon="code" dismissible>Tailwind</Chip>
      <Chip {...args} color="secondary" icon="code" dismissible>Storybook</Chip>
    </div>
  ),
};

export const FilterGroup: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Chip {...args} filter selected clickable color="primary">React</Chip>
      <Chip {...args} filter selected clickable color="success">TypeScript</Chip>
      <Chip {...args} filter clickable color="default">JavaScript</Chip>
      <Chip {...args} filter clickable color="default">Vue</Chip>
      <Chip {...args} filter selected clickable closable color="warning">Tailwind</Chip>
    </div>
  ),
};
