import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";

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
    loadingPlacement: { control: "select", options: ["start", "end"] },
    fullWidth: { control: "boolean" },
    loading: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Variants ──
export const Solid: Story = { args: { children: "Solid" } };
export const Outline: Story = { args: { children: "Outline", variant: "outline" } };
export const Ghost: Story = { args: { children: "Ghost", variant: "ghost" } };
export const Soft: Story = { args: { children: "Soft", variant: "soft" } };
export const Link: Story = { args: { children: "Learn more", variant: "link" } };

// ── Colors ──
export const Primary: Story = { args: { children: "Primary", color: "primary" } };
export const Secondary: Story = { args: { children: "Secondary", color: "secondary" } };
export const Destructive: Story = { args: { children: "Delete", color: "destructive" } };
export const Success: Story = { args: { children: "Confirm", color: "success" } };
export const Warning: Story = { args: { children: "Caution", color: "warning" } };
export const Accent: Story = { args: { children: "Accent", color: "accent" } };

// ── Color × Variant ──
export const DestructiveOutline: Story = {
  args: { children: "Delete", color: "destructive", variant: "outline" },
};
export const SuccessSoft: Story = {
  args: { children: "Approved", color: "success", variant: "soft" },
};
export const WarningGhost: Story = {
  args: { children: "Caution", color: "warning", variant: "ghost" },
};

// ── Sizes ──
export const ExtraSmall: Story = { args: { children: "XS", size: "xs" } };
export const Small: Story = { args: { children: "Small", size: "sm" } };
export const Large: Story = { args: { children: "Large", size: "lg" } };
export const ExtraLarge: Story = { args: { children: "Extra Large", size: "xl" } };

// ── Shapes ──
export const Pill: Story = { args: { children: "Pill", rounded: "full" } };
export const Square: Story = { args: { children: "Sharp", rounded: "none" } };

// ── Loading ──
export const Loading: Story = { args: { children: "Save", loading: true } };
export const LoadingWithText: Story = {
  args: { children: "Save", loading: true, loadingText: "Saving..." },
};
export const LoadingEnd: Story = {
  args: { children: "Save", loading: true, loadingPlacement: "end" },
};
export const LoadingDestructive: Story = {
  args: { children: "Delete", color: "destructive", loading: true, loadingText: "Deleting..." },
};

// ── Icons ──
export const WithIcon: Story = { args: { children: "Add", icon: "add" } };
export const IconRight: Story = { args: { children: "Next", icon: "arrow_forward", iconPosition: "right" } };
export const IconLarge: Story = { args: { children: "Download", icon: "download", size: "lg" } };

// ── Other ──
export const FullWidth: Story = { args: { children: "Full Width", fullWidth: true } };
export const Disabled: Story = { args: { children: "Disabled", disabled: true } };
export const AsLink: Story = {
  render: (args) => (
    <a
      href="https://example.com"
      className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:outline-none bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 active:translate-y-0 h-11 px-6 text-sm"
    >
      Visit Site
    </a>
  ),
};

// ── ButtonGroup ──
export const GroupDefault: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Left</Button>
      <Button variant="outline">Center</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  ),
};

export const GroupAttached: Story = {
  render: () => (
    <ButtonGroup attached>
      <Button variant="outline">Left</Button>
      <Button variant="outline">Center</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  ),
};

export const GroupVertical: Story = {
  render: () => (
    <ButtonGroup direction="vertical" attached>
      <Button variant="outline">Top</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Bottom</Button>
    </ButtonGroup>
  ),
};

export const GroupMixed: Story = {
  render: () => (
    <ButtonGroup attached>
      <Button color="success" icon="check">Approve</Button>
      <Button color="destructive" variant="outline" icon="close">Reject</Button>
    </ButtonGroup>
  ),
};
