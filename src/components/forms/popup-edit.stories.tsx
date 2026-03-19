import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PopupEdit } from "./popup-edit";

const meta = {
  title: "Forms/PopupEdit",
  component: PopupEdit,
  tags: ["autodocs"],
  argTypes: {
    mode: { control: "select", options: ["input", "textarea"] },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
} satisfies Meta<typeof PopupEdit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "Click me to edit",
    onSave: (v: string) => alert(`Saved: ${v}`),
    children: <span className="text-sm text-slate-700 px-2 py-1">Click me to edit</span>,
  },
};

export const TextareaMode: Story = {
  args: {
    value: "This is a longer text that can be edited in a textarea.",
    mode: "textarea",
    onSave: (v: string) => alert(`Saved: ${v}`),
    children: (
      <p className="text-sm text-slate-700 px-2 py-1 max-w-xs">
        This is a longer text that can be edited in a textarea.
      </p>
    ),
  },
};

export const Disabled: Story = {
  args: {
    value: "Cannot edit this",
    disabled: true,
    onSave: () => {},
    children: <span className="text-sm text-slate-700 px-2 py-1">Cannot edit this</span>,
  },
};

export const WithPlaceholder: Story = {
  args: {
    value: "",
    placeholder: "Enter a value...",
    onSave: (v: string) => alert(`Saved: ${v}`),
    children: <span className="text-sm text-slate-400 px-2 py-1 italic">Empty - click to add</span>,
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("Editable text");
    return (
      <div className="space-y-2">
        <PopupEdit {...args} value={value} onSave={setValue}>
          <span className="text-sm text-slate-700 px-2 py-1 border border-dashed border-slate-300 rounded">
            {value || "Click to edit"}
          </span>
        </PopupEdit>
        <p className="text-xs text-slate-500">Current value: {value}</p>
      </div>
    );
  },
};
