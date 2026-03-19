import { useState, useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Portal } from "./portal";

const meta = {
  title: "Layout/Portal",
  component: Portal,
  tags: ["autodocs"],
} satisfies Meta<typeof Portal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-sm text-slate-600 mb-3">
            Portal renders its children into <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">document.body</code>,
            outside the parent DOM hierarchy.
          </p>
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            {visible ? "Close Portal" : "Open Portal"}
          </button>
        </div>

        {visible && (
          <Portal>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                className="fixed inset-0 bg-black/30"
                onClick={() => setVisible(false)}
              />
              <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm z-10">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Portaled Content</h3>
                <p className="text-sm text-slate-500 mb-4">
                  This dialog is rendered via Portal into document.body, even though
                  the component lives inside a nested parent.
                </p>
                <button
                  type="button"
                  onClick={() => setVisible(false)}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </Portal>
        )}
      </div>
    );
  },
};

export const CustomContainer: Story = {
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          {visible ? "Remove from container" : "Render into container"}
        </button>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-xs font-medium text-slate-600 mb-2">Source (parent component)</p>
            <p className="text-sm text-slate-600">The Portal component lives here in the code.</p>
          </div>

          <div
            ref={containerRef}
            className="p-4 bg-primary/5 border border-primary/20 rounded-xl min-h-[100px]"
          >
            <p className="text-xs font-medium text-primary mb-2">Target container</p>
            {/* Portal will render content here */}
          </div>
        </div>

        {visible && (
          <Portal container={containerRef.current}>
            <div className="p-3 bg-white border border-primary/30 rounded-lg mt-2">
              <p className="text-sm text-primary font-medium">
                I was portaled into the target container!
              </p>
            </div>
          </Portal>
        )}
      </div>
    );
  },
};

export const NestedOverflow: Story = {
  render: () => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Portal escapes parent overflow constraints. The button is inside an
          <code className="text-xs bg-slate-100 px-1 py-0.5 rounded mx-1">overflow-hidden</code> container,
          but the portaled tooltip appears above it.
        </p>

        <div className="overflow-hidden border border-slate-200 rounded-xl p-4 bg-slate-50 max-w-xs">
          <p className="text-xs text-slate-600 mb-2">overflow-hidden container</p>
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Toggle tooltip
          </button>

          {visible && (
            <Portal>
              <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm rounded-lg px-4 py-2 shadow-lg">
                This tooltip escapes the overflow-hidden parent via Portal
              </div>
            </Portal>
          )}
        </div>
      </div>
    );
  },
};
