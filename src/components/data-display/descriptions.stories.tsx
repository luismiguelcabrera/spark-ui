import type { Meta, StoryObj } from "@storybook/react-vite";
import { Descriptions, type DescriptionsItem } from "./descriptions";

const meta = {
  title: "Data Display/Descriptions",
  component: Descriptions,
  tags: ["autodocs"],
  argTypes: {
    columns: { control: { type: "number", min: 1, max: 6 } },
    bordered: { control: "boolean" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    layout: { control: "select", options: ["horizontal", "vertical"] },
    colon: { control: "boolean" },
  },
} satisfies Meta<typeof Descriptions>;

export default meta;
type Story = StoryObj<typeof meta>;

const userItems: DescriptionsItem[] = [
  { label: "Name", children: "John Doe" },
  { label: "Email", children: "john.doe@example.com" },
  { label: "Phone", children: "+1 (555) 123-4567" },
  { label: "Address", children: "123 Main Street, Springfield, IL 62701", span: 2 },
  { label: "Status", children: "Active" },
  { label: "Role", children: "Senior Developer" },
  { label: "Department", children: "Engineering" },
  { label: "Join Date", children: "January 15, 2022" },
];

const productItems: DescriptionsItem[] = [
  { label: "Product", children: "MacBook Pro 16-inch" },
  { label: "Price", children: "$2,499.00" },
  { label: "Color", children: "Space Gray" },
  { label: "Processor", children: "Apple M3 Pro" },
  { label: "Memory", children: "18GB Unified Memory" },
  { label: "Storage", children: "512GB SSD" },
  {
    label: "Description",
    children:
      "The most advanced Mac laptop ever. With the blazing-fast M3 Pro chip, the MacBook Pro delivers exceptional performance for demanding workflows.",
    span: 3,
  },
];

export const Default: Story = {
  args: {
    items: userItems,
    title: "User Profile",
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};

export const Bordered: Story = {
  args: {
    items: userItems,
    title: "User Profile",
    bordered: true,
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};

export const VerticalLayout: Story = {
  args: {
    items: userItems,
    title: "User Profile",
    layout: "vertical",
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};

export const VerticalBordered: Story = {
  args: {
    items: userItems,
    title: "User Profile",
    bordered: true,
    layout: "vertical",
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};

export const TwoColumns: Story = {
  args: {
    items: userItems,
    title: "User Profile",
    columns: 2,
    bordered: true,
  },
  render: (args) => (
    <div className="max-w-2xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};

export const ProductDetails: Story = {
  args: {
    items: productItems,
    title: "Product Specifications",
    bordered: true,
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};

export const SmallSize: Story = {
  args: {
    items: userItems,
    title: "Compact View",
    size: "sm",
    bordered: true,
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};

export const LargeSize: Story = {
  args: {
    items: userItems,
    title: "Large View",
    size: "lg",
    bordered: true,
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};

export const NoColon: Story = {
  args: {
    items: userItems,
    title: "User Profile",
    colon: false,
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};

export const SingleColumn: Story = {
  args: {
    items: userItems,
    title: "User Profile",
    columns: 1,
    bordered: true,
  },
  render: (args) => (
    <div className="max-w-lg mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};
