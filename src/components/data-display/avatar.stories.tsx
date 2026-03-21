import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./avatar";

const meta = {
  title: "Data Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    color: {
      control: "select",
      options: [
        "default",
        "primary",
        "secondary",
        "accent",
        "success",
        "warning",
        "danger",
        "info",
      ],
    },
    variant: {
      control: "select",
      options: ["elevated", "flat", "tonal", "outlined"],
    },
    shape: { control: "select", options: ["circle", "square", "rounded"] },
    ring: { control: "select", options: ["none", "white", "primary"] },
    status: {
      control: "select",
      options: [undefined, "online", "offline", "busy", "away"],
    },
    icon: { control: "text" },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInitials: Story = {
  args: { initials: "JD", size: "lg" },
};

export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/150?u=1",
    alt: "User",
    size: "lg",
  },
};

export const Fallback: Story = {
  args: { alt: "Alice", size: "lg" },
};

export const WithRing: Story = {
  args: { initials: "AB", size: "lg", ring: "primary" },
};

export const WithIcon: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args} icon="user" size="sm" alt="User avatar" />
      <Avatar {...args} icon="user" size="md" alt="User avatar" />
      <Avatar {...args} icon="user" size="lg" alt="User avatar" />
      <Avatar {...args} icon="user" size="xl" alt="User avatar" />
    </div>
  ),
};

// ------------------------------------------------------------------
// Variants
// ------------------------------------------------------------------
export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Avatar {...args} variant="elevated" initials="EL" />
      <Avatar {...args} variant="flat" initials="FL" />
      <Avatar {...args} variant="tonal" initials="TO" />
      <Avatar {...args} variant="outlined" initials="OL" />
    </div>
  ),
  args: { size: "lg", color: "primary" },
};

// ------------------------------------------------------------------
// Color
// ------------------------------------------------------------------
export const Colors: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Avatar {...args} color="default" initials="DE" />
      <Avatar {...args} color="primary" initials="PR" />
      <Avatar {...args} color="secondary" initials="SE" />
      <Avatar {...args} color="accent" initials="AC" />
      <Avatar {...args} color="success" initials="SU" />
      <Avatar {...args} color="warning" initials="WA" />
      <Avatar {...args} color="danger" initials="DA" />
      <Avatar {...args} color="info" initials="IN" />
    </div>
  ),
  args: { size: "lg" },
};

// ------------------------------------------------------------------
// Color × Variant matrix
// ------------------------------------------------------------------
const colors = [
  "default",
  "primary",
  "secondary",
  "accent",
  "success",
  "warning",
  "danger",
  "info",
] as const;
const variants = ["elevated", "flat", "tonal", "outlined"] as const;

export const ColorVariantMatrix: Story = {
  render: (args) => (
    <div className="space-y-4">
      {variants.map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <span className="w-20 text-xs text-muted-foreground font-mono">
            {variant}
          </span>
          {colors.map((color) => (
            <Avatar
              {...args}
              key={`${color}-${variant}`}
              color={color}
              variant={variant}
              initials={color.slice(0, 2).toUpperCase()}
            />
          ))}
        </div>
      ))}
    </div>
  ),
  args: { size: "lg" },
};

// ------------------------------------------------------------------
// Shape
// ------------------------------------------------------------------
export const Shapes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args} shape="circle" initials="CI" />
      <Avatar {...args} shape="square" initials="SQ" />
      <Avatar {...args} shape="rounded" initials="RD" />
    </div>
  ),
  args: { size: "lg", color: "primary" },
};

export const ShapesWithImage: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar
        {...args}
        shape="circle"
        src="https://i.pravatar.cc/150?u=10"
        alt="Circle"
      />
      <Avatar
        {...args}
        shape="square"
        src="https://i.pravatar.cc/150?u=11"
        alt="Square"
      />
      <Avatar
        {...args}
        shape="rounded"
        src="https://i.pravatar.cc/150?u=12"
        alt="Rounded"
      />
    </div>
  ),
  args: { size: "lg" },
};

// ------------------------------------------------------------------
// Status
// ------------------------------------------------------------------
export const StatusIndicator: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args} status="online" initials="ON" />
      <Avatar {...args} status="offline" initials="OF" />
      <Avatar {...args} status="busy" initials="BU" />
      <Avatar {...args} status="away" initials="AW" />
    </div>
  ),
  args: { size: "lg", color: "primary" },
};

export const StatusWithImage: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar
        {...args}
        status="online"
        src="https://i.pravatar.cc/150?u=20"
        alt="Online"
        size="sm"
      />
      <Avatar
        {...args}
        status="busy"
        src="https://i.pravatar.cc/150?u=21"
        alt="Busy"
        size="md"
      />
      <Avatar
        {...args}
        status="away"
        src="https://i.pravatar.cc/150?u=22"
        alt="Away"
        size="lg"
      />
      <Avatar
        {...args}
        status="offline"
        src="https://i.pravatar.cc/150?u=23"
        alt="Offline"
        size="xl"
      />
    </div>
  ),
};

export const StatusOnShapes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args} shape="circle" status="online" initials="CI" />
      <Avatar {...args} shape="square" status="busy" initials="SQ" />
      <Avatar {...args} shape="rounded" status="away" initials="RD" />
    </div>
  ),
  args: { size: "lg", color: "accent" },
};

// ------------------------------------------------------------------
// Custom fallback
// ------------------------------------------------------------------
export const CustomFallback: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar
        {...args}
        size="lg"
        color="primary"
        fallback={
          <span className="text-xs font-medium">N/A</span>
        }
      />
      <Avatar
        {...args}
        size="lg"
        fallback={
          <div className="w-full h-full bg-gradient-to-br from-violet-400 to-pink-400" />
        }
      />
    </div>
  ),
};

// ------------------------------------------------------------------
// Sizes gallery
// ------------------------------------------------------------------
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-3">
      <Avatar {...args} size="xs" initials="XS" />
      <Avatar {...args} size="sm" initials="SM" />
      <Avatar {...args} size="md" initials="MD" />
      <Avatar {...args} size="lg" initials="LG" />
      <Avatar {...args} size="xl" initials="XL" />
    </div>
  ),
  args: { color: "primary" },
};
