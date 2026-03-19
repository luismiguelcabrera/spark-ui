import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineEdit } from "./inline-edit";

const meta = {
  title: "Forms/InlineEdit",
  component: InlineEdit,
  tags: ["autodocs"],
  argTypes: {
    mode: { control: "select", options: ["input", "textarea"] },
    disabled: { control: "boolean" },
    submitOnBlur: { control: "boolean" },
    selectAllOnFocus: { control: "boolean" },
    placeholder: { control: "text" },
  },
} satisfies Meta<typeof InlineEdit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value || "Click me to edit");
    return <InlineEdit {...args} value={value} onSave={setValue} />;
  },
  args: {
    value: "Click me to edit",
  },
};

export const TextareaMode: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value || "Multi-line...\nSecond line");
    return <InlineEdit {...args} value={value} onSave={setValue} />;
  },
  args: {
    value: "Multi-line...\nSecond line",
    mode: "textarea",
  },
};

export const Disabled: Story = {
  args: {
    value: "Cannot edit this",
    disabled: true,
    onSave: () => {},
  },
};

export const CustomDisplay: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value || "Bold display text");
    return (
      <InlineEdit
        {...args}
        value={value}
        onSave={setValue}
        renderDisplay={(val) => (
          <span className="text-base font-bold text-slate-900">{val}</span>
        )}
      />
    );
  },
  args: {
    value: "Bold display text",
  },
};

export const Placeholder: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return <InlineEdit {...args} value={value} onSave={setValue} />;
  },
  args: {
    value: "",
    placeholder: "Click to add a value...",
  },
};
