import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover } from "./popover";

const meta = {
  title: "Feedback/Popover",
  component: Popover,
  tags: ["autodocs"],
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    align: { control: "select", options: ["start", "center", "end"] },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    trigger: (
      <button
        type="button"
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
      >
        Open Popover
      </button>
    ),
    children: (
      <div>
        <p className="text-sm font-semibold text-secondary">Popover Content</p>
        <p className="text-xs text-slate-500 mt-1">
          This is some informational content inside the popover.
        </p>
      </div>
    ),
    side: "bottom",
    align: "center",
  },
  render: (args) => (
    <div className="flex items-center justify-center h-48">
      <Popover {...args} />
    </div>
  ),
};

export const TopSide: Story = {
  args: {
    trigger: (
      <button
        type="button"
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
      >
        Top Popover
      </button>
    ),
    children: <p className="text-sm text-slate-600">Content appears above the trigger.</p>,
    side: "top",
  },
  render: (args) => (
    <div className="flex items-end justify-center h-48">
      <Popover {...args} />
    </div>
  ),
};

export const LeftSide: Story = {
  args: {
    trigger: (
      <button
        type="button"
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
      >
        Left
      </button>
    ),
    children: <p className="text-sm text-slate-600">Content appears to the left.</p>,
    side: "left",
  },
  render: (args) => (
    <div className="flex items-center justify-end pr-64 h-32">
      <Popover {...args} />
    </div>
  ),
};

export const RightSide: Story = {
  args: {
    trigger: (
      <button
        type="button"
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
      >
        Right
      </button>
    ),
    children: <p className="text-sm text-slate-600">Content appears to the right.</p>,
    side: "right",
  },
  render: (args) => (
    <div className="flex items-center justify-start pl-8 h-32">
      <Popover {...args} />
    </div>
  ),
};

export const AlignStart: Story = {
  args: {
    trigger: (
      <button
        type="button"
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
      >
        Align Start
      </button>
    ),
    children: <p className="text-sm text-slate-600">Aligned to the start.</p>,
    side: "bottom",
    align: "start",
  },
  render: (args) => (
    <div className="flex items-center justify-center h-40">
      <Popover {...args} />
    </div>
  ),
};

export const AlignEnd: Story = {
  args: {
    trigger: (
      <button
        type="button"
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
      >
        Align End
      </button>
    ),
    children: <p className="text-sm text-slate-600">Aligned to the end.</p>,
    side: "bottom",
    align: "end",
  },
  render: (args) => (
    <div className="flex items-center justify-center h-40">
      <Popover {...args} />
    </div>
  ),
};

export const WithRichContent: Story = {
  args: {
    trigger: (
      <button
        type="button"
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
      >
        User Info
      </button>
    ),
    children: (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">JD</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-secondary">John Doe</p>
            <p className="text-xs text-slate-500">john@example.com</p>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-2 space-y-1">
          <p className="text-xs text-slate-500">Role: Admin</p>
          <p className="text-xs text-slate-500">Joined: Jan 2024</p>
        </div>
      </div>
    ),
    side: "bottom",
  },
  render: (args) => (
    <div className="flex items-center justify-center h-56">
      <Popover {...args} />
    </div>
  ),
};

export const WithActions: Story = {
  args: {
    trigger: (
      <button
        type="button"
        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200"
      >
        Settings
      </button>
    ),
    children: (
      <div className="space-y-2 min-w-[180px]">
        <p className="text-xs font-semibold text-slate-500 uppercase">Quick Settings</p>
        <button
          type="button"
          className="w-full text-left px-2 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
        >
          Theme: Light
        </button>
        <button
          type="button"
          className="w-full text-left px-2 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
        >
          Language: English
        </button>
        <button
          type="button"
          className="w-full text-left px-2 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
        >
          Notifications: On
        </button>
      </div>
    ),
    side: "bottom",
    align: "end",
  },
  render: (args) => (
    <div className="flex items-center justify-center h-56">
      <Popover {...args} />
    </div>
  ),
};
