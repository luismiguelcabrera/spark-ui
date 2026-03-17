import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataList, DataListItem } from "./data-list";

const meta = {
  title: "Data Display/DataList",
  component: DataList,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    cols: { control: "select", options: [1, 2, 3, 4] },
  },
} satisfies Meta<typeof DataList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: (args) => (
    <DataList {...args}>
      <DataListItem label="Name" value="John Doe" />
      <DataListItem label="Email" value="john@example.com" />
      <DataListItem label="Role" value="Administrator" />
      <DataListItem label="Status" value="Active" />
    </DataList>
  ),
};

export const Horizontal: Story = {
  args: { orientation: "horizontal", cols: 2 },
  render: (args) => (
    <DataList {...args}>
      <DataListItem label="Name" value="John Doe" />
      <DataListItem label="Email" value="john@example.com" />
      <DataListItem label="Role" value="Administrator" />
      <DataListItem label="Status" value="Active" />
    </DataList>
  ),
};

export const ThreeColumns: Story = {
  args: { orientation: "horizontal", cols: 3 },
  render: (args) => (
    <DataList {...args}>
      <DataListItem label="Revenue" value="$45,231" />
      <DataListItem label="Users" value="2,345" />
      <DataListItem label="Growth" value="+12.5%" />
      <DataListItem label="Orders" value="1,234" />
      <DataListItem label="Conversion" value="3.2%" />
      <DataListItem label="Avg. Order" value="$36.70" />
    </DataList>
  ),
};

export const RowDirection: Story = {
  render: (args) => (
    <DataList {...args}>
      <DataListItem label="Name" value="John Doe" direction="row" />
      <DataListItem label="Email" value="john@example.com" direction="row" />
      <DataListItem label="Role" value="Administrator" direction="row" />
      <DataListItem label="Status" value="Active" direction="row" />
    </DataList>
  ),
};

export const FourColumns: Story = {
  args: { orientation: "horizontal", cols: 4 },
  render: (args) => (
    <DataList {...args}>
      <DataListItem label="Q1" value="$12,300" />
      <DataListItem label="Q2" value="$15,800" />
      <DataListItem label="Q3" value="$18,200" />
      <DataListItem label="Q4" value="$21,500" />
    </DataList>
  ),
};
