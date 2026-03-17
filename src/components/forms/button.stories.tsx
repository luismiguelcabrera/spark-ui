import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta = {
  title: "Forms/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "outline", "ghost", "soft", "link"],
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "destructive", "success", "warning", "accent"],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl", "icon"] },
    rounded: { control: "select", options: ["default", "full", "lg", "md", "none"] },
    fullWidth: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Variants (style) ──
export const Solid: Story = { args: { children: "Solid" } };
export const Outline: Story = { args: { children: "Outline", variant: "outline" } };
export const Ghost: Story = { args: { children: "Ghost", variant: "ghost" } };
export const Soft: Story = { args: { children: "Soft", variant: "soft" } };
export const Link: Story = { args: { children: "Learn more", variant: "link" } };

// ── Colors (solid) ──
export const Primary: Story = { args: { children: "Primary", color: "primary" } };
export const Secondary: Story = { args: { children: "Secondary", color: "secondary" } };
export const Destructive: Story = { args: { children: "Delete", color: "destructive" } };
export const Success: Story = { args: { children: "Confirm", color: "success" } };
export const Warning: Story = { args: { children: "Caution", color: "warning" } };
export const Accent: Story = { args: { children: "Accent", color: "accent" } };

// ── Color × Variant combos ──
export const DestructiveOutline: Story = {
  args: { children: "Delete", color: "destructive", variant: "outline" },
};
export const SuccessGhost: Story = {
  args: { children: "Approve", color: "success", variant: "ghost" },
};
export const WarningSoft: Story = {
  args: { children: "Caution", color: "warning", variant: "soft" },
};
export const DestructiveLink: Story = {
  args: { children: "Remove", color: "destructive", variant: "link" },
};
export const AccentOutline: Story = {
  args: { children: "Highlight", color: "accent", variant: "outline" },
};

// ── Sizes ──
export const ExtraSmall: Story = { args: { children: "XS", size: "xs" } };
export const Small: Story = { args: { children: "Small", size: "sm" } };
export const Large: Story = { args: { children: "Large", size: "lg" } };
export const ExtraLarge: Story = { args: { children: "Extra Large", size: "xl" } };

// ── Shapes ──
export const Pill: Story = { args: { children: "Pill Button", rounded: "full" } };
export const Square: Story = { args: { children: "Sharp", rounded: "none" } };

// ── States ──
export const FullWidth: Story = { args: { children: "Full Width", fullWidth: true } };
export const Loading: Story = { args: { children: "Saving...", loading: true } };
export const LoadingDestructive: Story = {
  args: { children: "Deleting...", color: "destructive", loading: true },
};
export const LoadingOutline: Story = {
  args: { children: "Loading...", variant: "outline", loading: true },
};
export const Disabled: Story = { args: { children: "Disabled", disabled: true } };

// ── Icons ──
export const WithIcon: Story = { args: { children: "Add", icon: "add" } };
export const IconRight: Story = { args: { children: "Next", icon: "arrow_forward", iconPosition: "right" } };

// ── Polymorphic ──
export const AsLink: Story = {
  render: (args) => (
    <Button {...args} asChild>
      <a href="https://example.com">Visit Site</a>
    </Button>
  ),
};
