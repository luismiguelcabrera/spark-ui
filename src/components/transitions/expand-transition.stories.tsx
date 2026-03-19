import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExpandTransition } from "./expand-transition";

const meta = {
  title: "Transitions/ExpandTransition",
  component: ExpandTransition,
  tags: ["autodocs"],
  argTypes: {
    show: { control: "boolean" },
    duration: { control: { type: "number", min: 50, max: 2000, step: 50 } },
    unmountOnExit: { control: "boolean" },
  },
} satisfies Meta<typeof ExpandTransition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    show: true,
    duration: 300,
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
          {show ? "Collapse" : "Expand"}
        </button>
        <ExpandTransition show={show} duration={args.duration} unmountOnExit={args.unmountOnExit}>
          <div className="rounded-xl bg-primary/10 border border-primary/20 p-6 space-y-2">
            <p className="text-sm font-medium text-primary">ExpandTransition</p>
            <p className="text-xs text-slate-500">
              This content expands and collapses vertically. The height is measured
              from scrollHeight and animated to/from zero.
            </p>
          </div>
        </ExpandTransition>
      </div>
    );
  },
};

export const AccordionStyle: Story = {
  render: () => {
    const [open, setOpen] = useState<number | null>(0);
    const items = [
      { title: "What is Spark UI?", body: "Spark UI is a modern React component library built with TypeScript, Tailwind CSS, and CVA." },
      { title: "How do I install it?", body: "Run pnpm add spark-ui to install the library, then import components as needed." },
      { title: "Is it accessible?", body: "Yes! All components follow WCAG AA guidelines and include proper ARIA attributes." },
    ];

    return (
      <div className="max-w-md space-y-2">
        {items.map((item, i) => (
          <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full px-4 py-3 text-left text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-between"
            >
              {item.title}
              <span className="material-symbols-outlined text-[18px] text-slate-400">
                {open === i ? "expand_less" : "expand_more"}
              </span>
            </button>
            <ExpandTransition show={open === i} duration={250}>
              <div className="px-4 pb-3 text-sm text-slate-500">
                {item.body}
              </div>
            </ExpandTransition>
          </div>
        ))}
      </div>
    );
  },
};

export const LongContent: Story = {
  render: () => {
    const [show, setShow] = useState(true);
    return (
      <div className="max-w-md">
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="mb-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          {show ? "Collapse" : "Expand"}
        </button>
        <ExpandTransition show={show} duration={400}>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-3">
            {Array.from({ length: 6 }, (_, i) => (
              <p key={i} className="text-sm text-slate-600">
                Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            ))}
          </div>
        </ExpandTransition>
      </div>
    );
  },
};

export const SlowExpand: Story = {
  render: () => {
    const [show, setShow] = useState(true);
    return (
      <div>
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="mb-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          {show ? "Collapse" : "Expand"}
        </button>
        <ExpandTransition show={show} duration={800}>
          <div className="rounded-xl bg-primary/10 border border-primary/20 p-6">
            <p className="text-sm font-medium text-primary">Slow expand (800ms)</p>
            <p className="text-xs text-slate-500 mt-1">
              A longer duration makes the expand/collapse feel more deliberate.
            </p>
          </div>
        </ExpandTransition>
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
          {show ? "Collapse" : "Expand"}
        </button>
        <ExpandTransition show={show} unmountOnExit={false} duration={300}>
          <div className="rounded-xl bg-primary/10 border border-primary/20 p-6">
            <p className="text-sm font-medium text-primary">
              Stays in DOM when collapsed (unmountOnExit=false)
            </p>
          </div>
        </ExpandTransition>
      </div>
    );
  },
};
