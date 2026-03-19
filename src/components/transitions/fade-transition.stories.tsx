import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FadeTransition } from "./fade-transition";

const meta = {
  title: "Transitions/FadeTransition",
  component: FadeTransition,
  tags: ["autodocs"],
  argTypes: {
    show: { control: "boolean" },
    duration: { control: { type: "number", min: 50, max: 2000, step: 50 } },
    unmountOnExit: { control: "boolean" },
  },
} satisfies Meta<typeof FadeTransition>;

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
        <FadeTransition show={show} duration={args.duration} unmountOnExit={args.unmountOnExit}>
          <DemoBox label="FadeTransition" />
        </FadeTransition>
      </div>
    );
  },
};

export const SlowFade: Story = {
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
        <FadeTransition show={show} duration={600}>
          <DemoBox label="Slow fade (600ms)" />
        </FadeTransition>
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
        <FadeTransition show={show} unmountOnExit={false}>
          <DemoBox label="Stays in DOM when hidden (unmountOnExit=false)" />
        </FadeTransition>
      </div>
    );
  },
};

export const MultipleElements: Story = {
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
        <div className="grid grid-cols-3 gap-4">
          <FadeTransition show={show} duration={200}>
            <DemoBox label="Fast (200ms)" />
          </FadeTransition>
          <FadeTransition show={show} duration={400}>
            <DemoBox label="Medium (400ms)" />
          </FadeTransition>
          <FadeTransition show={show} duration={800}>
            <DemoBox label="Slow (800ms)" />
          </FadeTransition>
        </div>
      </div>
    );
  },
};

export const CardFade: Story = {
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
        <FadeTransition show={show} duration={300}>
          <div className="max-w-sm bg-white border border-slate-200 rounded-2xl shadow-lg p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-2">Notification</h3>
            <p className="text-sm text-slate-500">
              Your report has been generated successfully.
            </p>
          </div>
        </FadeTransition>
      </div>
    );
  },
};
