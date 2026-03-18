import type { Meta, StoryObj } from "@storybook/react-vite";
import { TagInput } from "./tag-input";

const meta = {
  title: "Forms/TagInput",
  component: TagInput,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    color: { control: "select", options: ["primary", "secondary", "default"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof TagInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: ["React", "TypeScript"], label: "Skills" },
};

export const WithMaxTags: Story = {
  args: { defaultValue: ["JavaScript"], maxTags: 5, label: "Technologies (max 5)" },
};

export const WithError: Story = {
  args: { defaultValue: [], label: "Tags", error: "At least one tag is required" },
};

export const Colors: Story = {
  render: (args) => (
    <div className="space-y-4 max-w-md">
      <TagInput {...args} color="primary" defaultValue={["Primary"]} label="Primary" />
      <TagInput {...args} color="secondary" defaultValue={["Secondary"]} label="Secondary" />
      <TagInput {...args} color="default" defaultValue={["Default"]} label="Default" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { defaultValue: ["React", "TypeScript"], disabled: true, label: "Disabled" },
};
