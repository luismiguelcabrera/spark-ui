import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScaleTransition } from "./scale-transition";

const meta = {
  title: "Transitions/ScaleTransition",
  component: ScaleTransition,
  tags: ["autodocs"],
  argTypes: {
    show: { control: "boolean" },
    duration: { control: { type: "number", min: 50, max: 2000, step: 50 } },
    unmountOnExit: { control: "boolean" },
  },
} satisfies Meta<typeof ScaleTransition>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoBox({ label }: { label: string }) {
  return (
    <div className="rounded-xl bg-primary/10 border border-primary/20 p-6 text-center">
      <p className="text-sm font-medium text-primary">{label}</p>
    </div>
  );
}

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
          {show ? "Hide" : "Show"}
        </button>
        <ScaleTransition show={show} duration={args.duration} unmountOnExit={args.unmountOnExit}>
          <DemoBox label="ScaleTransition" />
        </ScaleTransition>
      </div>
    );
  },
};

export const SlowScale: Story = {
  render: () => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="mb-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          {show ? "Hide" : "Show"}
        </button>
        <ScaleTransition show={show} duration={500}>
          <DemoBox label="Slow scale (500ms)" />
        </ScaleTransition>
      </div>
    );
  },
};

export const PopupCard: Story = {
  render: () => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="mb-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          {show ? "Close popup" : "Open popup"}
        </button>
        <ScaleTransition show={show} duration={200}>
          <div className="max-w-xs bg-white border border-slate-200 rounded-2xl shadow-lg p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-1">Quick Action</h3>
            <p className="text-sm text-slate-500">
              The scale transition creates a subtle pop-in effect for menus and popups.
            </p>
          </div>
        </ScaleTransition>
      </div>
    );
  },
};

export const StaggeredGrid: Story = {
  render: () => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="mb-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          {show ? "Hide" : "Show"}
        </button>
        <div className="grid grid-cols-3 gap-4">
          {[150, 250, 350].map((duration, i) => (
            <ScaleTransition key={i} show={show} duration={duration}>
              <DemoBox label={`${duration}ms`} />
            </ScaleTransition>
          ))}
        </div>
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
          {show ? "Hide" : "Show"}
        </button>
        <ScaleTransition show={show} unmountOnExit={false}>
          <DemoBox label="Stays in DOM (unmountOnExit=false)" />
        </ScaleTransition>
      </div>
    );
  },
};
