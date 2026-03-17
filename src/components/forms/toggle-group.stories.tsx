import type { Meta, StoryObj } from "@storybook/react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { Icon } from "../data-display/icon";

const meta = {
  title: "Forms/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["single", "multiple"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof ToggleGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: { type: "single", defaultValue: "center" },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left"><Icon name="align-left" size="sm" /></ToggleGroupItem>
      <ToggleGroupItem value="center"><Icon name="align-center" size="sm" /></ToggleGroupItem>
      <ToggleGroupItem value="right"><Icon name="align-right" size="sm" /></ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  args: { type: "multiple" },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold">B</ToggleGroupItem>
      <ToggleGroupItem value="italic">I</ToggleGroupItem>
      <ToggleGroupItem value="underline">U</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const TextOptions: Story = {
  args: { type: "single", defaultValue: "month" },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
      <ToggleGroupItem value="year">Year</ToggleGroupItem>
    </ToggleGroup>
  ),
};
