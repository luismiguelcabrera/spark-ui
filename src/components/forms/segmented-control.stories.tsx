import type { Meta, StoryObj } from "@storybook/react-vite";
import { SegmentedControl } from "./segmented-control";

const items = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const meta = {
  title: "Forms/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
  },
  args: { items },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: { defaultValue: "weekly" },
};

export const MediumSize: Story = {
  args: { size: "md" },
};

export const TwoItems: Story = {
  args: {
    items: [
      { label: "Grid", value: "grid" },
      { label: "List", value: "list" },
    ],
  },
};

export const ManyItems: Story = {
  args: {
    items: [
      { label: "All", value: "all" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Archived", value: "archived" },
      { label: "Deleted", value: "deleted" },
    ],
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-4">
      {(["sm", "md"] as const).map((size) => (
        <div key={size} className="space-y-1">
          <p className="text-xs text-slate-500">Size: {size}</p>
          <SegmentedControl {...args} size={size} />
        </div>
      ))}
    </div>
  ),
};
