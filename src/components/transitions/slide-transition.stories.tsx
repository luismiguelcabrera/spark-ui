import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SlideTransition } from "./slide-transition";

const meta = {
  title: "Transitions/SlideTransition",
  component: SlideTransition,
  tags: ["autodocs"],
  argTypes: {
    show: { control: "boolean" },
    direction: {
      control: "select",
      options: ["up", "down", "left", "right"],
    },
    duration: { control: { type: "number", min: 50, max: 2000, step: 50 } },
    unmountOnExit: { control: "boolean" },
  },
} satisfies Meta<typeof SlideTransition>;

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
    direction: "up",
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
        <SlideTransition
          show={show}
          direction={args.direction}
          duration={args.duration}
          unmountOnExit={args.unmountOnExit}
        >
          <DemoBox label={`Slide ${args.direction}`} />
        </SlideTransition>
      </div>
    );
  },
};

export const AllDirections: Story = {
  render: () => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="mb-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          {show ? "Hide all" : "Show all"}
        </button>
        <div className="grid grid-cols-2 gap-4">
          {(["up", "down", "left", "right"] as const).map((dir) => (
            <SlideTransition key={dir} show={show} direction={dir} duration={300} unmountOnExit={false}>
              <DemoBox label={`Slide ${dir}`} />
            </SlideTransition>
          ))}
        </div>
      </div>
    );
  },
};

export const SlideUp: Story = {
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
        <SlideTransition show={show} direction="up" duration={250}>
          <DemoBox label="Slides up from below" />
        </SlideTransition>
      </div>
    );
  },
};

export const SlideFromRight: Story = {
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
        <SlideTransition show={show} direction="right" duration={300}>
          <div className="max-w-sm bg-white border border-slate-200 rounded-2xl shadow-lg p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-1">Sidebar Panel</h3>
            <p className="text-sm text-slate-500">
              Slides in from the right, useful for side panels and drawers.
            </p>
          </div>
        </SlideTransition>
      </div>
    );
  },
};

export const NotificationSlide: Story = {
  render: () => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="mb-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          {show ? "Dismiss" : "Show notification"}
        </button>
        <SlideTransition show={show} direction="down" duration={300}>
          <div className="max-w-md bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-green-600 text-[20px]">check_circle</span>
            <p className="text-sm text-green-800">Changes saved successfully!</p>
          </div>
        </SlideTransition>
      </div>
    );
  },
};

export const SlowDuration: Story = {
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
        <SlideTransition show={show} direction="left" duration={800}>
          <DemoBox label="Slow slide left (800ms)" />
        </SlideTransition>
      </div>
    );
  },
};
