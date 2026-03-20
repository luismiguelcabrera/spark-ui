import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActionBar } from "./action-bar";

const meta = {
  title: "Feedback/ActionBar",
  component: ActionBar,
  tags: ["autodocs"],
  argTypes: {
    position: { control: "select", options: ["bottom", "top"] },
    count: { control: "number" },
    open: { control: "boolean" },
  },
} satisfies Meta<typeof ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const ActionBarDemo = ({
  position = "bottom",
  count,
}: {
  position?: "bottom" | "top";
  count?: number;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative h-60">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
      >
        Show Action Bar
      </button>
      <ActionBar open={open} onClose={() => setOpen(false)} position={position} count={count}>
        <button
          type="button"
          className="px-3 py-1.5 text-sm font-medium bg-primary text-white rounded-lg"
        >
          Archive
        </button>
        <button
          type="button"
          className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-lg"
        >
          Delete
        </button>
      </ActionBar>
    </div>
  );
};

export const Default: Story = {
  args: { open: true, children: null },
  render: (args) => <ActionBarDemo position={args.position} count={args.count} />,
};

export const WithCount: Story = {
  args: { open: true, count: 3, children: null },
  render: (args) => <ActionBarDemo position={args.position} count={args.count ?? 3} />,
};

export const TopPosition: Story = {
  args: { open: true, children: null },
  render: (args) => <ActionBarDemo position="top" count={args.count} />,
};

export const BottomPosition: Story = {
  args: { open: true, children: null },
  render: (args) => <ActionBarDemo position="bottom" count={args.count} />,
};

export const WithManyItems: Story = {
  args: { open: true, children: null },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="relative h-60">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
        >
          Show Action Bar
        </button>
        <ActionBar open={open} onClose={() => setOpen(false)} position={args.position} count={5}>
          <button type="button" className="px-3 py-1.5 text-sm font-medium bg-primary text-white rounded-lg">
            Move
          </button>
          <button type="button" className="px-3 py-1.5 text-sm font-medium bg-secondary text-white rounded-lg">
            Archive
          </button>
          <button type="button" className="px-3 py-1.5 text-sm font-medium bg-warning text-black rounded-lg">
            Star
          </button>
          <button type="button" className="px-3 py-1.5 text-sm font-medium bg-destructive text-white rounded-lg">
            Delete
          </button>
        </ActionBar>
      </div>
    );
  },
};

export const WithoutCloseButton: Story = {
  args: { open: true, children: null },
  render: () => (
    <div className="relative h-60">
      <ActionBar open count={2}>
        <button type="button" className="px-3 py-1.5 text-sm font-medium bg-primary text-white rounded-lg">
          Export
        </button>
        <button type="button" className="px-3 py-1.5 text-sm font-medium bg-slate-600 text-white rounded-lg">
          Print
        </button>
      </ActionBar>
    </div>
  ),
};

export const NoCount: Story = {
  args: { open: true, children: null },
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div className="relative h-60">
        <ActionBar open={open} onClose={() => setOpen(false)}>
          <button type="button" className="px-3 py-1.5 text-sm font-medium bg-primary text-white rounded-lg">
            Undo
          </button>
        </ActionBar>
      </div>
    );
  },
};
