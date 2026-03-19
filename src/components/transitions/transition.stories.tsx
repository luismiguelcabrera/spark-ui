import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Transition } from "./transition";

const meta = {
  title: "Transitions/Transition",
  component: Transition,
  tags: ["autodocs"],
  argTypes: {
    show: { control: "boolean" },
    duration: { control: { type: "number", min: 50, max: 2000, step: 50 } },
    unmountOnExit: { control: "boolean" },
    enter: { control: "text" },
    enterFrom: { control: "text" },
    enterTo: { control: "text" },
    leave: { control: "text" },
    leaveFrom: { control: "text" },
    leaveTo: { control: "text" },
  },
} satisfies Meta<typeof Transition>;

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
    duration: 300,
    unmountOnExit: true,
    enter: "transition-all ease-out duration-300",
    enterFrom: "opacity-0 scale-95",
    enterTo: "opacity-100 scale-100",
    leave: "transition-all ease-in duration-200",
    leaveFrom: "opacity-100 scale-100",
    leaveTo: "opacity-0 scale-95",
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
        <Transition
          show={show}
          enter={args.enter}
          enterFrom={args.enterFrom}
          enterTo={args.enterTo}
          leave={args.leave}
          leaveFrom={args.leaveFrom}
          leaveTo={args.leaveTo}
          duration={args.duration}
          unmountOnExit={args.unmountOnExit}
        >
          <DemoBox label="Base Transition" />
        </Transition>
      </div>
    );
  },
};

export const FadeOnly: Story = {
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
        <Transition
          show={show}
          enter="transition-opacity ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          duration={200}
        >
          <DemoBox label="Fade only" />
        </Transition>
      </div>
    );
  },
};

export const RotateAndScale: Story = {
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
        <Transition
          show={show}
          enter="transition-all ease-out duration-300"
          enterFrom="opacity-0 -rotate-12 scale-75"
          enterTo="opacity-100 rotate-0 scale-100"
          leave="transition-all ease-in duration-200"
          leaveFrom="opacity-100 rotate-0 scale-100"
          leaveTo="opacity-0 rotate-12 scale-75"
          duration={300}
        >
          <DemoBox label="Rotate + Scale" />
        </Transition>
      </div>
    );
  },
};

export const SlideAndFade: Story = {
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
        <Transition
          show={show}
          enter="transition-all ease-out"
          enterFrom="opacity-0 translate-y-8"
          enterTo="opacity-100 translate-y-0"
          leave="transition-all ease-in"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-8"
          duration={300}
        >
          <DemoBox label="Slide up + Fade (asymmetric exit)" />
        </Transition>
      </div>
    );
  },
};

export const BlurTransition: Story = {
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
        <Transition
          show={show}
          enter="transition-all ease-out"
          enterFrom="opacity-0 blur-sm scale-105"
          enterTo="opacity-100 blur-0 scale-100"
          leave="transition-all ease-in"
          leaveFrom="opacity-100 blur-0 scale-100"
          leaveTo="opacity-0 blur-sm scale-95"
          duration={300}
        >
          <DemoBox label="Blur + Scale" />
        </Transition>
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
        <Transition
          show={show}
          enter="transition-opacity ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          duration={200}
          unmountOnExit={false}
        >
          <DemoBox label="Stays in DOM (unmountOnExit=false)" />
        </Transition>
      </div>
    );
  },
};
