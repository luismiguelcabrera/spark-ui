import type { Meta, StoryObj } from "@storybook/react-vite";
import { TabFilter } from "./tab-filter";

const items = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Closed", value: "closed" },
];

const meta = {
  title: "Forms/TabFilter",
  component: TabFilter,
  tags: ["autodocs"],
  args: { items },
} satisfies Meta<typeof TabFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: { defaultValue: "active" },
};

export const TwoTabs: Story = {
  args: {
    items: [
      { label: "Published", value: "published" },
      { label: "Drafts", value: "drafts" },
    ],
  },
};

export const ManyTabs: Story = {
  args: {
    items: [
      { label: "Overview", value: "overview" },
      { label: "Analytics", value: "analytics" },
      { label: "Reports", value: "reports" },
      { label: "Notifications", value: "notifications" },
      { label: "Settings", value: "settings" },
    ],
  },
};

export const OrderStatuses: Story = {
  args: {
    items: [
      { label: "All Orders", value: "all" },
      { label: "Processing", value: "processing" },
      { label: "Shipped", value: "shipped" },
      { label: "Delivered", value: "delivered" },
      { label: "Returned", value: "returned" },
    ],
    defaultValue: "processing",
  },
};
