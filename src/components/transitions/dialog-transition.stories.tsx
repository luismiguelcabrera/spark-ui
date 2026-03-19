import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DialogTransition } from "./dialog-transition";

const meta = {
  title: "Transitions/DialogTransition",
  component: DialogTransition,
  tags: ["autodocs"],
  argTypes: {
    show: { control: "boolean" },
    duration: { control: { type: "number", min: 50, max: 2000, step: 50 } },
    unmountOnExit: { control: "boolean" },
  },
} satisfies Meta<typeof DialogTransition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    show: true,
    duration: 200,
    unmountOnExit: true,
  },
  render: (args) => {
    const [show, setShow] = useState(args.show);
    return (
      <div>
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="mb-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          {show ? "Close" : "Open"}
        </button>
        <DialogTransition show={show} duration={args.duration} unmountOnExit={args.unmountOnExit}>
          <div className="rounded-2xl bg-white border border-slate-200 shadow-lg p-6 max-w-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-2">Dialog Transition</h3>
            <p className="text-sm text-slate-500">
              Combines scale, opacity, and translateY for a natural dialog entrance.
            </p>
          </div>
        </DialogTransition>
      </div>
    );
  },
};

export const ConfirmDialog: Story = {
  render: () => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="mb-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          {show ? "Close" : "Open dialog"}
        </button>
        <DialogTransition show={show} duration={250}>
          <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-6 max-w-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-2">Delete item?</h3>
            <p className="text-sm text-slate-500 mb-4">
              This action cannot be undone. The item will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShow(false)}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </DialogTransition>
      </div>
    );
  },
};

export const SlowDialog: Story = {
  render: () => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="mb-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          {show ? "Close" : "Open"}
        </button>
        <DialogTransition show={show} duration={500}>
          <div className="rounded-2xl bg-white border border-slate-200 shadow-lg p-6 max-w-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-2">Slow Entrance</h3>
            <p className="text-sm text-slate-500">
              A 500ms duration creates a more dramatic entrance effect.
            </p>
          </div>
        </DialogTransition>
      </div>
    );
  },
};

export const FormDialog: Story = {
  render: () => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="mb-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          {show ? "Close" : "Open form"}
        </button>
        <DialogTransition show={show} duration={200}>
          <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-6 max-w-sm space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Add New Item</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Item name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Brief description" />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
              >
                Save
              </button>
            </div>
          </div>
        </DialogTransition>
      </div>
    );
  },
};

export const PersistOnExit: Story = {
  render: () => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="mb-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          {show ? "Close" : "Open"}
        </button>
        <DialogTransition show={show} unmountOnExit={false}>
          <div className="rounded-2xl bg-white border border-slate-200 shadow-lg p-6 max-w-sm">
            <p className="text-sm text-slate-500">
              Stays in DOM when hidden (unmountOnExit=false).
            </p>
          </div>
        </DialogTransition>
      </div>
    );
  },
};
