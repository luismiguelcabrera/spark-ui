import type { Meta, StoryObj } from "@storybook/react-vite";
import { HoverCard } from "./hover-card";
import { Avatar } from "../data-display/avatar";

const meta = {
  title: "Feedback/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    align: { control: "select", options: ["start", "center", "end"] },
    openDelay: { control: { type: "number", min: 0, max: 1000 } },
    closeDelay: { control: { type: "number", min: 0, max: 1000 } },
    width: { control: { type: "number", min: 100, max: 600 } },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const UserProfileCard = () => (
  <div className="flex gap-3">
    <Avatar src="https://i.pravatar.cc/150?u=profile" alt="Jane Cooper" size="lg" />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-900">Jane Cooper</p>
      <p className="text-xs text-slate-500">@janecooper</p>
      <p className="text-xs text-slate-600 mt-2">
        Product Designer at Acme Inc. Passionate about creating delightful user experiences.
      </p>
      <div className="flex gap-4 mt-2">
        <span className="text-xs text-slate-500">
          <span className="font-semibold text-slate-700">1,234</span> followers
        </span>
        <span className="text-xs text-slate-500">
          <span className="font-semibold text-slate-700">567</span> following
        </span>
      </div>
    </div>
  </div>
);

export const Default: Story = {
  args: {
    content: <UserProfileCard />,
  },
  render: (args) => (
    <div className="flex items-center justify-center p-16">
      <HoverCard {...args}>
        <span className="text-primary font-medium underline underline-offset-4 cursor-pointer">
          @janecooper
        </span>
      </HoverCard>
    </div>
  ),
};

export const TopPlacement: Story = {
  args: {
    content: <UserProfileCard />,
    side: "top",
  },
  render: (args) => (
    <div className="flex items-end justify-center p-16 pt-64">
      <HoverCard {...args}>
        <span className="text-primary font-medium underline underline-offset-4 cursor-pointer">
          Hover me (top)
        </span>
      </HoverCard>
    </div>
  ),
};

export const LeftPlacement: Story = {
  args: {
    content: <UserProfileCard />,
    side: "left",
  },
  render: (args) => (
    <div className="flex items-center justify-end p-16">
      <HoverCard {...args}>
        <span className="text-primary font-medium underline underline-offset-4 cursor-pointer">
          Hover me (left)
        </span>
      </HoverCard>
    </div>
  ),
};

export const CustomWidth: Story = {
  args: {
    content: (
      <div>
        <p className="text-sm font-semibold text-slate-900">Quick Info</p>
        <p className="text-xs text-slate-500 mt-1">A compact hover card with custom width.</p>
      </div>
    ),
    width: 200,
  },
  render: (args) => (
    <div className="flex items-center justify-center p-16">
      <HoverCard {...args}>
        <span className="text-primary font-medium underline underline-offset-4 cursor-pointer">
          Compact card
        </span>
      </HoverCard>
    </div>
  ),
};

export const WithAvatar: Story = {
  args: {
    content: <UserProfileCard />,
  },
  render: (args) => (
    <div className="flex items-center justify-center p-16">
      <HoverCard {...args}>
        <Avatar src="https://i.pravatar.cc/150?u=profile" alt="Jane Cooper" size="md" />
      </HoverCard>
    </div>
  ),
};
