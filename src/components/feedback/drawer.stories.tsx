import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Drawer } from "./drawer";

const meta = {
  title: "Feedback/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  argTypes: {
    side: { control: "select", options: ["left", "right"] },
    title: { control: "text" },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const DrawerDemo = ({
  side = "right",
  title = "Drawer",
  footer,
  children,
  ...rest
}: Partial<React.ComponentProps<typeof Drawer>>) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
      >
        Open {side} drawer
      </button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        side={side}
        title={title}
        footer={footer}
        {...rest}
      >
        {children ?? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              This is the drawer content. It slides in from the {side} side.
            </p>
            <p className="text-sm text-slate-600">
              Press Escape or click the overlay to close.
            </p>
          </div>
        )}
      </Drawer>
    </>
  );
};

export const Default: Story = {
  render: (args) => <DrawerDemo {...args} side="right" title="Settings" />,
};

export const LeftSide: Story = {
  render: (args) => <DrawerDemo {...args} side="left" title="Navigation" />,
};

export const RightSide: Story = {
  render: (args) => <DrawerDemo {...args} side="right" title="Details" />,
};

export const WithFooter: Story = {
  render: (args) => (
    <DrawerDemo
      {...args}
      title="Edit Profile"
      footer={
        <>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg"
          >
            Save
          </button>
        </>
      }
    />
  ),
};

export const WithForm: Story = {
  render: (args) => (
    <DrawerDemo
      {...args}
      title="New Task"
      footer={
        <>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg"
          >
            Create
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            type="text"
            placeholder="Task title"
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            placeholder="Add a description..."
            rows={3}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Priority</label>
          <select className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>
    </DrawerDemo>
  ),
};

export const LongContent: Story = {
  render: (args) => (
    <DrawerDemo {...args} title="Terms of Service">
      <div className="space-y-4">
        {Array.from({ length: 15 }).map((_, i) => (
          <p key={i} className="text-sm text-slate-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris.
          </p>
        ))}
      </div>
    </DrawerDemo>
  ),
};

export const NoTitle: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
        >
          Open Drawer (no title)
        </button>
        <Drawer {...args} open={open} onOpenChange={setOpen}>
          <div className="p-4">
            <p className="text-sm text-slate-600">
              This drawer has no title header, giving you full control over the content area.
            </p>
          </div>
        </Drawer>
      </>
    );
  },
};

export const BothSides: Story = {
  render: (args) => (
    <div className="flex gap-3">
      <DrawerDemo {...args} side="left" title="Left Drawer" />
      <DrawerDemo {...args} side="right" title="Right Drawer" />
    </div>
  ),
};
