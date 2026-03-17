import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta = {
  title: "Forms/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary", "secondary", "destructive", "success", "warning",
        "soft", "outline", "ghost", "icon", "link",
      ],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl", "icon"] },
    rounded: { control: "select", options: ["default", "full", "lg", "md", "none"] },
    fullWidth: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Variants ──
export const Primary: Story = { args: { children: "Primary" } };
export const Secondary: Story = { args: { children: "Secondary", variant: "secondary" } };
export const Destructive: Story = { args: { children: "Delete", variant: "destructive" } };
export const Success: Story = { args: { children: "Confirm", variant: "success" } };
export const Warning: Story = { args: { children: "Caution", variant: "warning" } };
export const Soft: Story = { args: { children: "Soft", variant: "soft" } };
export const Outline: Story = { args: { children: "Outline", variant: "outline" } };
export const Ghost: Story = { args: { children: "Ghost", variant: "ghost" } };
export const Link: Story = { args: { children: "Learn more", variant: "link" } };

// ── Sizes ──
export const ExtraSmall: Story = { args: { children: "XS", size: "xs" } };
export const Small: Story = { args: { children: "Small", size: "sm" } };
export const Medium: Story = { args: { children: "Medium", size: "md" } };
export const Large: Story = { args: { children: "Large", size: "lg" } };
export const ExtraLarge: Story = { args: { children: "Extra Large", size: "xl" } };

// ── Shapes ──
export const Pill: Story = { args: { children: "Pill Button", rounded: "full" } };
export const Square: Story = { args: { children: "Sharp", rounded: "none" } };

// ── States ──
export const FullWidth: Story = { args: { children: "Full Width", fullWidth: true } };
export const Loading: Story = { args: { children: "Saving...", loading: true } };
export const LoadingDestructive: Story = { args: { children: "Deleting...", variant: "destructive", loading: true } };
export const Disabled: Story = { args: { children: "Disabled", disabled: true } };

// ── Icons ──
export const WithIcon: Story = { args: { children: "Add", icon: "add" } };
export const IconRight: Story = { args: { children: "Next", icon: "arrow_forward", iconPosition: "right" } };

// ── Polymorphic ──
export const AsLink: Story = {
  render: (args) => (
    <Button {...args} asChild variant="primary">
      <a href="https://example.com">Visit Site</a>
    </Button>
  ),
};

// ── Combinations ──
export const DestructivePill: Story = {
  args: { children: "Remove", variant: "destructive", rounded: "full", icon: "delete" },
};
export const SuccessLarge: Story = {
  args: { children: "Confirm Order", variant: "success", size: "lg", icon: "check" },
};
export const WarningSmall: Story = {
  args: { children: "Proceed", variant: "warning", size: "sm" },
};
export const SoftWithIcon: Story = {
  args: { children: "Edit", variant: "soft", icon: "edit" },
};
