import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Stepper } from "./stepper";

const meta = {
  title: "Navigation/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    editable: { control: "boolean" },
    altLabels: { control: "boolean" },
    activeStep: { control: { type: "number", min: 0, max: 4 } },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

const steps = [
  { label: "Account", description: "Create your account" },
  { label: "Profile", description: "Set up your profile" },
  { label: "Review", description: "Review and submit" },
];

export const Default: Story = {
  args: {
    steps,
    activeStep: 1,
  },
};

export const AllComplete: Story = {
  args: {
    steps,
    activeStep: 3,
  },
};

export const Vertical: Story = {
  args: {
    steps,
    activeStep: 1,
    orientation: "vertical",
  },
};

export const Editable: Story = {
  render: (args) => {
    const [active, setActive] = useState(2);
    return (
      <div className="flex flex-col gap-4">
        <Stepper
          {...args}
          steps={steps}
          activeStep={active}
          editable
          onStepClick={(i) => setActive(i)}
        />
        <p className="text-sm text-slate-500">
          Active step: {active} — Click completed steps to go back.
        </p>
      </div>
    );
  },
};

export const WithErrors: Story = {
  args: {
    steps: [
      { label: "Account" },
      { label: "Payment", description: "Card declined", error: true },
      { label: "Confirm" },
    ],
    activeStep: 1,
  },
};

export const AltLabels: Story = {
  args: {
    steps,
    activeStep: 1,
    altLabels: true,
  },
};

export const AltLabelsEditable: Story = {
  render: (args) => {
    const [active, setActive] = useState(2);
    return (
      <Stepper
        {...args}
        steps={steps}
        activeStep={active}
        altLabels
        editable
        onStepClick={(i) => setActive(i)}
      />
    );
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Horizontal (default)</p>
        <Stepper steps={steps} activeStep={1} {...args} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Alt Labels</p>
        <Stepper steps={steps} activeStep={1} altLabels />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-3">With Error</p>
        <Stepper
          steps={[
            { label: "Account" },
            { label: "Payment", error: true },
            { label: "Confirm" },
          ]}
          activeStep={1}
        />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Vertical</p>
        <Stepper steps={steps} activeStep={1} orientation="vertical" />
      </div>
    </div>
  ),
};
