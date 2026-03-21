import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, type BadgeColor, type BadgeVariant } from "./badge";
import { Icon } from "./icon";

const colors: BadgeColor[] = [
  "default",
  "primary",
  "secondary",
  "accent",
  "success",
  "warning",
  "danger",
  "info",
];

const variants: BadgeVariant[] = [
  "elevated",
  "flat",
  "tonal",
  "outlined",
  "text",
  "plain",
];

const meta = {
  title: "Data Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: colors,
    },
    variant: {
      control: "select",
      options: variants,
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    dot: { control: "boolean" },
    bordered: { control: "boolean" },
    floating: { control: "boolean" },
    max: { control: "number" },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Badge" } };

export const Success: Story = {
  args: { children: "Active", color: "success" },
};

export const Danger: Story = {
  args: { children: "Error", color: "danger" },
};

// ---------------------------------------------------------------------------
// Gallery: all colors for each variant
// ---------------------------------------------------------------------------

export const AllColors: Story = {
  args: { variant: "tonal" },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {colors.map((c) => (
        <Badge key={c} {...args} color={c}>
          {c}
        </Badge>
      ))}
    </div>
  ),
};

export const Elevated: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {colors.map((c) => (
        <Badge key={c} {...args} variant="elevated" color={c}>
          {c}
        </Badge>
      ))}
    </div>
  ),
};

export const Flat: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {colors.map((c) => (
        <Badge key={c} {...args} variant="flat" color={c}>
          {c}
        </Badge>
      ))}
    </div>
  ),
};

export const Tonal: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {colors.map((c) => (
        <Badge key={c} {...args} variant="tonal" color={c}>
          {c}
        </Badge>
      ))}
    </div>
  ),
};

export const Outlined: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {colors.map((c) => (
        <Badge key={c} {...args} variant="outlined" color={c}>
          {c}
        </Badge>
      ))}
    </div>
  ),
};

export const Text: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {colors.map((c) => (
        <Badge key={c} {...args} variant="text" color={c}>
          {c}
        </Badge>
      ))}
    </div>
  ),
};

export const Plain: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {colors.map((c) => (
        <Badge key={c} {...args} variant="plain" color={c}>
          {c}
        </Badge>
      ))}
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Full matrix: color × variant
// ---------------------------------------------------------------------------

export const FullMatrix: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {variants.map((v) => (
        <div key={v} className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-mono mb-1">
            {v}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {colors.map((c) => (
              <Badge key={c} {...args} variant={v} color={c}>
                {c}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------

export const Dot: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Badge {...args} dot color="success" />
      <Badge {...args} dot color="danger" />
      <Badge {...args} dot color="primary" />
      <Badge {...args} dot color="warning" />
      <Badge {...args} dot color="info" />
    </div>
  ),
};

export const WithMax: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Badge {...args} max={99} color="danger">
        50
      </Badge>
      <Badge {...args} max={99} color="danger">
        99
      </Badge>
      <Badge {...args} max={99} color="danger">
        150
      </Badge>
      <Badge {...args} max={9} color="primary">
        25
      </Badge>
    </div>
  ),
};

export const Bordered: Story = {
  render: ({ floating: _floating, ...args }) => (
    <div className="flex items-center gap-4 bg-muted p-4 rounded-lg">
      <Badge {...args} bordered color="danger">
        3
      </Badge>
      <Badge {...args} bordered color="success">
        Active
      </Badge>
      <Badge {...args} bordered dot color="primary" />
    </div>
  ),
};

export const Floating: Story = {
  render: (args) => (
    <div className="flex items-center gap-8">
      <Badge {...args} floating content="5" color="danger" bordered>
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-navy-text">
          AB
        </div>
      </Badge>
      <Badge {...args} floating content="99+" color="primary" bordered>
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <Icon name="mail" size="md" className="text-muted-foreground" />
        </div>
      </Badge>
      <Badge {...args} floating dot color="success" bordered>
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-navy-text">
          JD
        </div>
      </Badge>
    </div>
  ),
};

export const FloatingWithMax: Story = {
  render: (args) => (
    <div className="flex items-center gap-8">
      <Badge
        {...args}
        floating
        max={99}
        content="150"
        color="danger"
        bordered
      >
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <Icon name="bell" size="md" className="text-muted-foreground" />
        </div>
      </Badge>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Dark mode variants
// ---------------------------------------------------------------------------

export const DarkFullMatrix: Story = {
  ...FullMatrix,
  globals: { theme: "dark" },
};

export const DarkBordered: Story = {
  ...Bordered,
  globals: { theme: "dark" },
};
