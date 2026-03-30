import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Transition } from "./transition";
import { FadeTransition } from "./fade-transition";
import { ScaleTransition } from "./scale-transition";
import { SlideTransition } from "./slide-transition";
import { ExpandTransition } from "./expand-transition";
import { DialogTransition } from "./dialog-transition";

/* -------------------------------------------------------------------------- */
/*  Meta — using Transition as the primary component                           */
/* -------------------------------------------------------------------------- */

const meta = {
  title: "Transitions/Transitions",
  component: Transition,
  tags: ["autodocs"],
  argTypes: {
    show: { control: "boolean" },
    duration: { control: { type: "number", min: 50, max: 2000, step: 50 } },
    unmountOnExit: { control: "boolean" },
  },
} satisfies Meta<typeof Transition>;

export default meta;
type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/*  Shared demo box                                                            */
/* -------------------------------------------------------------------------- */

function DemoBox({ label }: { label: string }) {
  return (
    <div className="rounded-xl bg-primary/10 border border-primary/20 p-6 text-center">
      <p className="text-sm font-medium text-primary">{label}</p>
    </div>
  );
}

function ToggleButton({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mb-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
    >
      {show ? "Hide" : "Show"}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  FadeTransition                                                             */
/* -------------------------------------------------------------------------- */

export const Fade: Story = {
  render: (args) => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <ToggleButton show={show} onToggle={() => setShow(!show)} />
        <FadeTransition
          show={show}
          duration={args.duration}
          unmountOnExit={args.unmountOnExit}
        >
          <DemoBox label="FadeTransition" />
        </FadeTransition>
      </div>
    );
  },
  args: {
    show: true,
    duration: 200,
    unmountOnExit: true,
  },
};

/* -------------------------------------------------------------------------- */
/*  ScaleTransition                                                            */
/* -------------------------------------------------------------------------- */

export const Scale: Story = {
  render: (args) => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <ToggleButton show={show} onToggle={() => setShow(!show)} />
        <ScaleTransition
          show={show}
          duration={args.duration}
          unmountOnExit={args.unmountOnExit}
        >
          <DemoBox label="ScaleTransition" />
        </ScaleTransition>
      </div>
    );
  },
  args: {
    show: true,
    duration: 200,
    unmountOnExit: true,
  },
};

/* -------------------------------------------------------------------------- */
/*  SlideTransition — each direction                                           */
/* -------------------------------------------------------------------------- */

export const SlideUp: Story = {
  render: (args) => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <ToggleButton show={show} onToggle={() => setShow(!show)} />
        <SlideTransition
          show={show}
          direction="up"
          duration={args.duration}
          unmountOnExit={args.unmountOnExit}
        >
          <DemoBox label="SlideTransition (up)" />
        </SlideTransition>
      </div>
    );
  },
  args: {
    show: true,
    duration: 200,
    unmountOnExit: true,
  },
};

export const SlideDown: Story = {
  render: (args) => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <ToggleButton show={show} onToggle={() => setShow(!show)} />
        <SlideTransition
          show={show}
          direction="down"
          duration={args.duration}
          unmountOnExit={args.unmountOnExit}
        >
          <DemoBox label="SlideTransition (down)" />
        </SlideTransition>
      </div>
    );
  },
  args: {
    show: true,
    duration: 200,
    unmountOnExit: true,
  },
};

export const SlideLeft: Story = {
  render: (args) => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <ToggleButton show={show} onToggle={() => setShow(!show)} />
        <SlideTransition
          show={show}
          direction="left"
          duration={args.duration}
          unmountOnExit={args.unmountOnExit}
        >
          <DemoBox label="SlideTransition (left)" />
        </SlideTransition>
      </div>
    );
  },
  args: {
    show: true,
    duration: 200,
    unmountOnExit: true,
  },
};

export const SlideRight: Story = {
  render: (args) => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <ToggleButton show={show} onToggle={() => setShow(!show)} />
        <SlideTransition
          show={show}
          direction="right"
          duration={args.duration}
          unmountOnExit={args.unmountOnExit}
        >
          <DemoBox label="SlideTransition (right)" />
        </SlideTransition>
      </div>
    );
  },
  args: {
    show: true,
    duration: 200,
    unmountOnExit: true,
  },
};

/* -------------------------------------------------------------------------- */
/*  ExpandTransition                                                           */
/* -------------------------------------------------------------------------- */

export const Expand: Story = {
  render: (args) => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <ToggleButton show={show} onToggle={() => setShow(!show)} />
        <ExpandTransition
          show={show}
          duration={args.duration}
          unmountOnExit={args.unmountOnExit}
        >
          <div className="rounded-xl bg-primary/10 border border-primary/20 p-6 space-y-2">
            <p className="text-sm font-medium text-primary">ExpandTransition</p>
            <p className="text-xs text-slate-500">
              This content expands and collapses vertically. The height is
              measured from scrollHeight and animated to/from zero.
            </p>
            <p className="text-xs text-slate-500">
              Multiple lines of content to demonstrate the full expand effect.
            </p>
          </div>
        </ExpandTransition>
      </div>
    );
  },
  args: {
    show: true,
    duration: 300,
    unmountOnExit: true,
  },
};

/* -------------------------------------------------------------------------- */
/*  DialogTransition                                                           */
/* -------------------------------------------------------------------------- */

export const Dialog: Story = {
  render: (args) => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <ToggleButton show={show} onToggle={() => setShow(!show)} />
        <DialogTransition
          show={show}
          duration={args.duration}
          unmountOnExit={args.unmountOnExit}
        >
          <div className="rounded-2xl bg-white border border-slate-200 shadow-lg p-6 max-w-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-2">
              DialogTransition
            </h3>
            <p className="text-sm text-slate-500">
              Combines scale, opacity, and translateY for a natural dialog
              entrance.
            </p>
          </div>
        </DialogTransition>
      </div>
    );
  },
  args: {
    show: true,
    duration: 200,
    unmountOnExit: true,
  },
};

/* -------------------------------------------------------------------------- */
/*  Gallery — all transitions side by side                                     */
/* -------------------------------------------------------------------------- */

export const Gallery: Story = {
  render: (args) => {
    const [show, setShow] = useState(true);
    return (
      <div className="space-y-6">
        <ToggleButton show={show} onToggle={() => setShow(!show)} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Fade</p>
            <FadeTransition show={show} duration={args.duration} unmountOnExit={false}>
              <DemoBox label="FadeTransition" />
            </FadeTransition>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Scale</p>
            <ScaleTransition show={show} duration={args.duration} unmountOnExit={false}>
              <DemoBox label="ScaleTransition" />
            </ScaleTransition>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">
              Slide Up
            </p>
            <SlideTransition
              show={show}
              direction="up"
              duration={args.duration}
              unmountOnExit={false}
            >
              <DemoBox label="SlideTransition (up)" />
            </SlideTransition>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">
              Slide Down
            </p>
            <SlideTransition
              show={show}
              direction="down"
              duration={args.duration}
              unmountOnExit={false}
            >
              <DemoBox label="SlideTransition (down)" />
            </SlideTransition>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Expand</p>
            <ExpandTransition show={show} duration={args.duration} unmountOnExit={false}>
              <DemoBox label="ExpandTransition" />
            </ExpandTransition>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Dialog</p>
            <DialogTransition show={show} duration={args.duration} unmountOnExit={false}>
              <DemoBox label="DialogTransition" />
            </DialogTransition>
          </div>
        </div>
      </div>
    );
  },
  args: {
    show: true,
    duration: 300,
    unmountOnExit: false,
  },
};

/* -------------------------------------------------------------------------- */
/*  Custom Transition (base component demo)                                    */
/* -------------------------------------------------------------------------- */

export const CustomTransition: Story = {
  render: (args) => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <ToggleButton show={show} onToggle={() => setShow(!show)} />
        <Transition
          show={show}
          enter="transition-all ease-out duration-300"
          enterFrom="opacity-0 -rotate-12 scale-75"
          enterTo="opacity-100 rotate-0 scale-100"
          leave="transition-all ease-in duration-200"
          leaveFrom="opacity-100 rotate-0 scale-100"
          leaveTo="opacity-0 rotate-12 scale-75"
          duration={args.duration}
          unmountOnExit={args.unmountOnExit}
        >
          <DemoBox label="Custom rotation + scale" />
        </Transition>
      </div>
    );
  },
  args: {
    show: true,
    duration: 300,
    unmountOnExit: true,
  },
};
