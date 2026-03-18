import type { Meta, StoryObj } from "@storybook/react-vite";
import { Descriptions, type DescriptionsItem } from "./descriptions";

const meta = {
  title: "Data Display/Descriptions",
  component: Descriptions,
  tags: ["autodocs"],
  argTypes: {
    columns: { control: { type: "number", min: 1, max: 6 } },
    bordered: { control: "boolean" },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    layout: { control: "select", options: ["horizontal", "vertical"] },
    variant: { control: "select", options: ["plain", "striped"] },
    colon: { control: "boolean" },
    responsive: { control: "boolean" },
    headingLevel: { control: { type: "number", min: 2, max: 6 } },
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

const itemsWithEmpty: DescriptionsItem[] = [
  { label: "Name", children: "Jane Smith" },
  { label: "Email", children: "jane@example.com" },
  { label: "Phone", children: null },
  { label: "Address", children: "" },
  { label: "Status", children: undefined },
  { label: "Role", children: "Designer" },
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

export const ExtraSmallSize: Story = {
  args: {
    items: userItems,
    title: "Extra Small View",
    size: "xs",
    bordered: true,
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};

export const ExtraLargeSize: Story = {
  args: {
    items: userItems,
    title: "Extra Large View",
    size: "xl",
    bordered: true,
  },
  render: (args) => (
    <div className="max-w-4xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};

export const Striped: Story = {
  args: {
    items: userItems,
    title: "User Profile (Striped)",
    bordered: true,
    variant: "striped",
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};

export const StripedBorderless: Story = {
  args: {
    items: userItems,
    title: "User Profile (Striped, Borderless)",
    variant: "striped",
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};

export const Responsive: Story = {
  args: {
    items: userItems,
    title: "Responsive (resize browser to see effect)",
    columns: 4,
    responsive: true,
  },
  render: (args) => (
    <div className="max-w-4xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};

export const NonResponsive: Story = {
  args: {
    items: userItems,
    title: "Non-Responsive (fixed columns)",
    columns: 4,
    responsive: false,
  },
  render: (args) => (
    <div className="max-w-4xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};

export const EmptyValues: Story = {
  args: {
    items: itemsWithEmpty,
    title: "Data with Empty Fields",
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

export const AllSizes: Story = {
  args: {
    items: userItems.slice(0, 4),
    bordered: true,
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((sz) => (
        <Descriptions key={sz} {...args} size={sz} title={`Size: ${sz}`} />
      ))}
    </div>
  ),
};

export const WithExtra: Story = {
  args: {
    items: userItems,
    title: "User Profile",
    bordered: true,
    extra: (
      <div className="flex gap-2">
        <button className="text-sm text-indigo-600 hover:underline">Edit</button>
        <button className="text-sm text-indigo-600 hover:underline">Export</button>
      </div>
    ),
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};

export const WithLabelWidth: Story = {
  args: {
    items: userItems,
    title: "Fixed Label Width",
    labelWidth: 140,
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};

export const WithLabelWidthBordered: Story = {
  args: {
    items: userItems,
    title: "Fixed Label Width (Bordered)",
    bordered: true,
    labelWidth: "10rem",
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};

export const CustomClassNames: Story = {
  args: {
    items: [
      { label: "Name", children: "John Doe" },
      { label: "Status", children: "Active", contentClassName: "text-green-600 font-semibold" },
      { label: "Email", children: "john@example.com", labelClassName: "text-indigo-600" },
    ],
    title: "Per-Item Class Overrides",
    bordered: true,
    labelClassName: "uppercase tracking-wide",
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto p-4">
      <Descriptions {...args} />
    </div>
  ),
};
