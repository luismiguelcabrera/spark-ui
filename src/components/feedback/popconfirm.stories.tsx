import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popconfirm } from "./popconfirm";

const meta = {
  title: "Feedback/Popconfirm",
  component: Popconfirm,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["info", "warning", "danger"] },
    placement: { control: "select", options: ["top", "bottom", "left", "right"] },
    title: { control: "text" },
    description: { control: "text" },
    confirmText: { control: "text" },
    cancelText: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Popconfirm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Are you sure?",
    description: "This action cannot be undone.",
    type: "warning",
    placement: "top",
  },
  render: (args) => (
    <div className="flex items-center justify-center h-60">
      <Popconfirm {...args}>
        <button
          type="button"
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
        >
          Click me
        </button>
      </Popconfirm>
    </div>
  ),
};

export const InfoType: Story = {
  args: {
    title: "Save changes?",
    description: "Your changes will be saved to the server.",
    type: "info",
    confirmText: "Save",
    cancelText: "Cancel",
  },
  render: (args) => (
    <div className="flex items-center justify-center h-60">
      <Popconfirm {...args}>
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
        >
          Save
        </button>
      </Popconfirm>
    </div>
  ),
};

export const WarningType: Story = {
  args: {
    title: "Discard changes?",
    description: "Any unsaved changes will be lost.",
    type: "warning",
    confirmText: "Discard",
    cancelText: "Keep editing",
  },
  render: (args) => (
    <div className="flex items-center justify-center h-60">
      <Popconfirm {...args}>
        <button
          type="button"
          className="px-4 py-2 bg-amber-700 text-white rounded-lg text-sm font-medium"
        >
          Discard
        </button>
      </Popconfirm>
    </div>
  ),
};

export const DangerType: Story = {
  args: {
    title: "Delete this item?",
    description: "This will permanently remove the item and all associated data.",
    type: "danger",
    confirmText: "Delete",
    cancelText: "Cancel",
  },
  render: (args) => (
    <div className="flex items-center justify-center h-60">
      <Popconfirm {...args}>
        <button
          type="button"
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium"
        >
          Delete
        </button>
      </Popconfirm>
    </div>
  ),
};

export const PlacementBottom: Story = {
  args: {
    title: "Confirm action?",
    type: "info",
    placement: "bottom",
  },
  render: (args) => (
    <div className="flex items-start justify-center pt-8 h-60">
      <Popconfirm {...args}>
        <button
          type="button"
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
        >
          Bottom Placement
        </button>
      </Popconfirm>
    </div>
  ),
};

export const PlacementLeft: Story = {
  args: {
    title: "Move to archive?",
    type: "warning",
    placement: "left",
  },
  render: (args) => (
    <div className="flex items-center justify-end pr-72 h-40">
      <Popconfirm {...args}>
        <button
          type="button"
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
        >
          Left Placement
        </button>
      </Popconfirm>
    </div>
  ),
};

export const PlacementRight: Story = {
  args: {
    title: "Share with team?",
    type: "info",
    placement: "right",
  },
  render: (args) => (
    <div className="flex items-center justify-start pl-8 h-40">
      <Popconfirm {...args}>
        <button
          type="button"
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
        >
          Right Placement
        </button>
      </Popconfirm>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    title: "This won't open",
    type: "warning",
    disabled: true,
  },
  render: (args) => (
    <div className="flex items-center justify-center h-40">
      <Popconfirm {...args}>
        <button
          type="button"
          className="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg text-sm font-medium cursor-not-allowed"
        >
          Disabled Trigger
        </button>
      </Popconfirm>
    </div>
  ),
};

export const AllTypes: Story = {
  args: {
    title: "",
  },
  render: (args) => (
    <div className="flex items-center justify-center gap-6 h-60">
      {(["info", "warning", "danger"] as const).map((type) => (
        <Popconfirm
          {...args}
          key={type}
          type={type}
          title={`${type.charAt(0).toUpperCase() + type.slice(1)} confirmation`}
          description="Click Yes to confirm or No to cancel."
          placement="top"
        >
          <button
            type="button"
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium capitalize"
          >
            {type}
          </button>
        </Popconfirm>
      ))}
    </div>
  ),
};
