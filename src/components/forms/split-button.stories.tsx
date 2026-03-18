import type { Meta, StoryObj } from "@storybook/react-vite";
import { SplitButton, type SplitButtonAction } from "./split-button";

const saveActions: SplitButtonAction[] = [
  { label: "Save as Draft", value: "draft", icon: "drafts" },
  { label: "Save and Publish", value: "publish", icon: "publish" },
  { label: "Schedule for Later", value: "schedule", icon: "schedule" },
];

const deleteActions: SplitButtonAction[] = [
  { label: "Move to Trash", value: "trash", icon: "delete" },
  { label: "Delete Permanently", value: "delete-permanent", icon: "delete_forever" },
  { label: "Archive", value: "archive", icon: "archive" },
];

const exportActions: SplitButtonAction[] = [
  { label: "Export as PDF", value: "pdf", icon: "picture_as_pdf" },
  { label: "Export as CSV", value: "csv", icon: "table_chart" },
  { label: "Export as JSON", value: "json", icon: "code" },
  { label: "Print", value: "print", icon: "print", disabled: true },
];

const meta = {
  title: "Forms/SplitButton",
  component: SplitButton,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["solid", "outline", "ghost"] },
    color: {
      control: "select",
      options: ["primary", "secondary", "destructive", "success", "warning"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    children: "Save",
    actions: saveActions,
  },
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Variants ──
export const Solid: Story = {};
export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = { args: { variant: "ghost" } };

// ── Colors ──
export const Primary: Story = { args: { color: "primary" } };
export const Secondary: Story = { args: { color: "secondary" } };
export const Destructive: Story = {
  args: {
    children: "Delete",
    color: "destructive",
    actions: deleteActions,
  },
};
export const Success: Story = {
  args: {
    children: "Approve",
    color: "success",
  },
};
export const Warning: Story = {
  args: {
    children: "Caution",
    color: "warning",
  },
};

// ── Sizes ──
export const Small: Story = { args: { size: "sm" } };
export const Medium: Story = { args: { size: "md" } };
export const Large: Story = { args: { size: "lg" } };

// ── States ──
export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true } };

// ── With disabled actions ──
export const WithDisabledActions: Story = {
  args: {
    children: "Export",
    actions: exportActions,
  },
};

// ── Color + Variant combos ──
export const DestructiveOutline: Story = {
  args: {
    children: "Delete",
    color: "destructive",
    variant: "outline",
    actions: deleteActions,
  },
};

export const SuccessGhost: Story = {
  args: {
    children: "Confirm",
    color: "success",
    variant: "ghost",
  },
};

// ── Gallery ──
export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold text-slate-400 mb-3">VARIANTS</p>
        <div className="flex flex-wrap gap-4 items-center">
          <SplitButton {...args} variant="solid">Solid</SplitButton>
          <SplitButton {...args} variant="outline">Outline</SplitButton>
          <SplitButton {...args} variant="ghost">Ghost</SplitButton>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 mb-3">COLORS (SOLID)</p>
        <div className="flex flex-wrap gap-4 items-center">
          <SplitButton {...args} color="primary">Primary</SplitButton>
          <SplitButton {...args} color="secondary">Secondary</SplitButton>
          <SplitButton {...args} color="destructive" actions={deleteActions}>Delete</SplitButton>
          <SplitButton {...args} color="success">Approve</SplitButton>
          <SplitButton {...args} color="warning">Caution</SplitButton>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 mb-3">SIZES</p>
        <div className="flex flex-wrap gap-4 items-center">
          <SplitButton {...args} size="sm">Small</SplitButton>
          <SplitButton {...args} size="md">Medium</SplitButton>
          <SplitButton {...args} size="lg">Large</SplitButton>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 mb-3">STATES</p>
        <div className="flex flex-wrap gap-4 items-center">
          <SplitButton {...args} loading>Loading</SplitButton>
          <SplitButton {...args} disabled>Disabled</SplitButton>
        </div>
      </div>
    </div>
  ),
};
