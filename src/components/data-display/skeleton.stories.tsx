import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton, SkeletonText, SkeletonCircle } from "./skeleton";

const meta = {
  title: "Data Display/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: [undefined, "text", "circle", "card", "list-item", "article", "table"],
    },
    boilerplate: { control: "boolean" },
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
    <div className="max-w-md space-y-2">
      <Skeleton {...args} />
      <Skeleton {...args} />
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

export const Boilerplate: Story = {
  args: { boilerplate: true },
  render: (args) => (
    <div className="max-w-md space-y-6">
      <div>
        <p className="text-sm text-slate-500 mb-2">Default (no animation):</p>
        <Skeleton {...args} />
      </div>
      <div>
        <p className="text-sm text-slate-500 mb-2">Card (no animation):</p>
        <Skeleton {...args} type="card" />
      </div>
    </div>
  ),
};

export const AllTypes: Story = {
  render: (args) => (
    <div className="max-w-2xl space-y-8">
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Text</p>
        <Skeleton {...args} type="text" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Circle</p>
        <Skeleton {...args} type="circle" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Card</p>
        <div className="max-w-sm">
          <Skeleton {...args} type="card" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">List Item</p>
        <Skeleton {...args} type="list-item" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Article</p>
        <Skeleton {...args} type="article" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Table</p>
        <Skeleton {...args} type="table" />
      </div>
    </div>
  ),
};

export const TextLines: Story = {
  render: (args) => (
    <div className="max-w-md space-y-4">
      <SkeletonText lines={2} />
      <SkeletonText lines={4} />
    </div>
  ),
};

export const Circles: Story = {
  render: (args) => (
    <div className="flex gap-4">
      <SkeletonCircle size="sm" />
      <SkeletonCircle size="md" />
      <SkeletonCircle size="lg" />
    </div>
  ),
};
