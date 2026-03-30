import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ItemGroup, ItemGroupItem } from "./item-group";

const meta = {
  title: "Navigation/ItemGroup",
  component: ItemGroup,
  tags: ["autodocs"],
  argTypes: {
    multiple: { control: "boolean" },
    mandatory: { control: "boolean" },
  },
} satisfies Meta<typeof ItemGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <ItemGroup {...args}>
      <ItemGroupItem value="a">Option A</ItemGroupItem>
      <ItemGroupItem value="b">Option B</ItemGroupItem>
      <ItemGroupItem value="c">Option C</ItemGroupItem>
    </ItemGroup>
  ),
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: "b",
  },
  render: (args) => (
    <ItemGroup {...args}>
      <ItemGroupItem value="a">Option A</ItemGroupItem>
      <ItemGroupItem value="b">Option B</ItemGroupItem>
      <ItemGroupItem value="c">Option C</ItemGroupItem>
    </ItemGroup>
  ),
};

export const Multiple: Story = {
  args: {
    multiple: true,
    defaultValue: ["a", "c"],
  },
  render: (args) => (
    <ItemGroup {...args}>
      <ItemGroupItem value="a">Option A</ItemGroupItem>
      <ItemGroupItem value="b">Option B</ItemGroupItem>
      <ItemGroupItem value="c">Option C</ItemGroupItem>
    </ItemGroup>
  ),
};

export const Mandatory: Story = {
  args: {
    mandatory: true,
    defaultValue: "a",
  },
  render: (args) => (
    <ItemGroup {...args}>
      <ItemGroupItem value="a">Option A</ItemGroupItem>
      <ItemGroupItem value="b">Option B</ItemGroupItem>
      <ItemGroupItem value="c">Option C</ItemGroupItem>
    </ItemGroup>
  ),
};

export const RenderProp: Story = {
  args: {},
  render: (args) => (
    <ItemGroup {...args}>
      {["small", "medium", "large"].map((size) => (
        <ItemGroupItem key={size} value={size}>
          {({ isSelected, onSelect }) => (
            <button
              type="button"
              onClick={onSelect}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </button>
          )}
        </ItemGroupItem>
      ))}
    </ItemGroup>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("a");
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-500">Selected: <strong>{value}</strong></p>
        <ItemGroup value={value} onChange={(v) => setValue(v as string)}>
          <ItemGroupItem value="a">Option A</ItemGroupItem>
          <ItemGroupItem value="b">Option B</ItemGroupItem>
          <ItemGroupItem value="c">Option C</ItemGroupItem>
        </ItemGroup>
      </div>
    );
  },
};
