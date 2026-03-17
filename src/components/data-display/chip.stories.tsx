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
