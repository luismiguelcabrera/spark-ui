import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton, SkeletonText, SkeletonCircle } from "./skeleton";

const meta = {
  title: "Data Display/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: [
        undefined,
        "text",
        "circle",
        "card",
        "list-item",
        "article",
        "table",
        "form",
        "profile",
        "comment",
      ],
    },
    animation: {
      control: "select",
      options: ["pulse", "wave", "none"],
    },
    boilerplate: { control: "boolean" },
    count: { control: { type: "number", min: 1, max: 10 } },
    width: { control: "text" },
    height: { control: "text" },
    borderRadius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"],
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-md space-y-4">
      <Skeleton {...args} />
      <Skeleton {...args} className="w-3/4" />
      <Skeleton {...args} className="w-1/2" />
    </div>
  ),
};

export const TextType: Story = {
  args: { type: "text" },
  render: (args) => (
    <div className="max-w-md">
      <Skeleton {...args} />
    </div>
  ),
};

export const CircleType: Story = {
  args: { type: "circle" },
  render: (args) => (
    <div className="max-w-md">
      <Skeleton {...args} />
    </div>
  ),
};

export const CardType: Story = {
  args: { type: "card" },
  render: (args) => (
    <div className="max-w-sm">
      <Skeleton {...args} />
    </div>
  ),
};

export const ListItemType: Story = {
  args: { type: "list-item" },
  render: (args) => (
    <div className="max-w-md">
      <Skeleton {...args} />
    </div>
  ),
};

export const ArticleType: Story = {
  args: { type: "article" },
  render: (args) => (
    <div className="max-w-lg">
      <Skeleton {...args} />
    </div>
  ),
};

export const TableType: Story = {
  args: { type: "table" },
  render: (args) => (
    <div className="max-w-lg">
      <Skeleton {...args} />
    </div>
  ),
};

export const FormType: Story = {
  args: { type: "form" },
  render: (args) => (
    <div className="max-w-md">
      <Skeleton {...args} />
    </div>
  ),
};

export const ProfileType: Story = {
  args: { type: "profile" },
  render: (args) => (
    <div className="max-w-xs">
      <Skeleton {...args} />
    </div>
  ),
};

export const CommentType: Story = {
  args: { type: "comment" },
  render: (args) => (
    <div className="max-w-md">
      <Skeleton {...args} />
    </div>
  ),
};

// ── Animation variants ──

export const WaveAnimation: Story = {
  args: { animation: "wave" },
  render: (args) => (
    <div className="max-w-md space-y-4">
      <Skeleton {...args} />
      <Skeleton {...args} className="w-3/4" />
      <Skeleton {...args} className="w-1/2" />
    </div>
  ),
};

export const WaveAnimationCard: Story = {
  args: { type: "card", animation: "wave" },
  render: (args) => (
    <div className="max-w-sm">
      <Skeleton {...args} />
    </div>
  ),
};

export const NoAnimation: Story = {
  args: { animation: "none" },
  render: (args) => (
    <div className="max-w-md space-y-4">
      <Skeleton {...args} />
      <Skeleton {...args} className="w-3/4" />
      <Skeleton {...args} className="w-1/2" />
    </div>
  ),
};

export const AnimationComparison: Story = {
  render: (args) => (
    <div className="max-w-lg space-y-8">
      <div>
        <p className="text-sm font-medium text-navy-text mb-2">Pulse (default)</p>
        <Skeleton {...args} animation="pulse" />
      </div>
      <div>
        <p className="text-sm font-medium text-navy-text mb-2">Wave (shimmer)</p>
        <Skeleton {...args} animation="wave" />
      </div>
      <div>
        <p className="text-sm font-medium text-navy-text mb-2">None</p>
        <Skeleton {...args} animation="none" />
      </div>
    </div>
  ),
};

// ── Count prop ──

export const CountListItems: Story = {
  args: { type: "list-item", count: 5 },
  render: (args) => (
    <div className="max-w-md">
      <Skeleton {...args} />
    </div>
  ),
};

export const CountComments: Story = {
  args: { type: "comment", count: 4 },
  render: (args) => (
    <div className="max-w-md">
      <Skeleton {...args} />
    </div>
  ),
};

export const CountCards: Story = {
  args: { type: "card", count: 3 },
  render: (args) => (
    <div className="max-w-sm">
      <Skeleton {...args} />
    </div>
  ),
};

// ── Custom dimensions ──

export const CustomDimensions: Story = {
  render: (args) => (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-navy-text mb-2">200px x 40px</p>
        <Skeleton {...args} width="200px" height="40px" />
      </div>
      <div>
        <p className="text-sm font-medium text-navy-text mb-2">100% x 3rem</p>
        <Skeleton {...args} width="100%" height="3rem" />
      </div>
      <div>
        <p className="text-sm font-medium text-navy-text mb-2">50% x 80px</p>
        <Skeleton {...args} width="50%" height="80px" />
      </div>
    </div>
  ),
};

// ── Border radius ──

export const BorderRadiusVariants: Story = {
  render: (args) => (
    <div className="space-y-4">
      {(["none", "sm", "md", "lg", "full"] as const).map((radius) => (
        <div key={radius}>
          <p className="text-sm font-medium text-navy-text mb-2">
            borderRadius=&quot;{radius}&quot;
          </p>
          <Skeleton {...args} borderRadius={radius} height="40px" width="200px" />
        </div>
      ))}
    </div>
  ),
};

// ── Boilerplate (legacy) ──

export const Boilerplate: Story = {
  args: { boilerplate: true },
  render: (args) => (
    <div className="max-w-md space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default (no animation):</p>
        <Skeleton {...args} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Card (no animation):</p>
        <Skeleton {...args} type="card" />
      </div>
    </div>
  ),
};

// ── All types gallery ──

export const AllTypes: Story = {
  render: (args) => (
    <div className="max-w-2xl space-y-8">
      {(
        [
          "text",
          "circle",
          "card",
          "list-item",
          "article",
          "table",
          "form",
          "profile",
          "comment",
        ] as const
      ).map((type) => (
        <div key={type}>
          <p className="text-sm font-medium text-navy-text mb-2 capitalize">
            {type}
          </p>
          <div className="max-w-sm">
            <Skeleton {...args} type={type} />
          </div>
        </div>
      ))}
    </div>
  ),
};

// ── Sub-components ──

export const TextLines: Story = {
  render: (_args) => (
    <div className="max-w-md space-y-4">
      <SkeletonText lines={2} />
      <SkeletonText lines={4} />
    </div>
  ),
};

export const Circles: Story = {
  render: (_args) => (
    <div className="flex gap-4">
      <SkeletonCircle size="sm" />
      <SkeletonCircle size="md" />
      <SkeletonCircle size="lg" />
    </div>
  ),
};
