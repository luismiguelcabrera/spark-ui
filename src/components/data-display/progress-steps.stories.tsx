import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressSteps } from "./progress-steps";
import { Button } from "../forms/button";

const meta = {
  title: "Data Display/ProgressSteps",
  component: ProgressSteps,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    color: { control: "select", options: ["primary", "success", "warning", "accent"] },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    showCheck: { control: "boolean" },
  },
} satisfies Meta<typeof ProgressSteps>;

export default meta;
type Story = StoryObj<typeof meta>;

const orderSteps = [
  { label: "Order Placed" },
  { label: "Processing" },
  { label: "Shipped" },
  { label: "Delivered" },
];

export const Default: Story = {
  args: {
    steps: orderSteps,
    value: 66,
  },
  render: (args) => (
    <div className="max-w-lg pt-2 pb-8">
      <ProgressSteps {...args} />
    </div>
  ),
};

export const AllComplete: Story = {
  args: {
    steps: orderSteps,
    value: 100,
    color: "success",
  },
  render: (args) => (
    <div className="max-w-lg pt-2 pb-8">
      <ProgressSteps {...args} />
    </div>
  ),
};

export const JustStarted: Story = {
  args: {
    steps: orderSteps,
    value: 0,
  },
  render: (args) => (
    <div className="max-w-lg pt-2 pb-8">
      <ProgressSteps {...args} />
    </div>
  ),
};

export const WithDescriptions: Story = {
  args: {
    steps: [
      { label: "Account", description: "Create account" },
      { label: "Profile", description: "Fill in details" },
      { label: "Preferences", description: "Set options" },
      { label: "Done", description: "All set!" },
    ],
    value: 50,
  },
  render: (args) => (
    <div className="max-w-lg pt-2 pb-12">
      <ProgressSteps {...args} />
    </div>
  ),
};

export const CustomPositions: Story = {
  args: {
    steps: [
      { label: "Start", value: 0 },
      { label: "25%", value: 25 },
      { label: "Halfway", value: 50 },
      { label: "Done", value: 100 },
    ],
    value: 40,
    color: "warning",
  },
  render: (args) => (
    <div className="max-w-lg pt-2 pb-8">
      <ProgressSteps {...args} />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    return (
      <div className="max-w-lg flex flex-col gap-6">
        <div className="pt-2 pb-10">
          <ProgressSteps steps={orderSteps} value={value} color="success" />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setValue((v) => Math.max(0, v - 33))}
          >
            Previous
          </Button>
          <Button
            size="sm"
            onClick={() => setValue((v) => Math.min(100, v + 33))}
          >
            Next
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setValue(0)}>
            Reset
          </Button>
        </div>
        <p className="text-xs text-slate-400">Progress: {value}%</p>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-12 max-w-lg">
      {(["sm", "md", "lg"] as const).map((sz) => (
        <div key={sz}>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-4">{sz}</p>
          <div className="pt-2 pb-8">
            <ProgressSteps steps={orderSteps} value={66} size={sz} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-12 max-w-lg">
      {(["primary", "success", "warning", "accent"] as const).map((clr) => (
        <div key={clr}>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-4">{clr}</p>
          <div className="pt-2 pb-8">
            <ProgressSteps steps={orderSteps} value={66} color={clr} />
          </div>
        </div>
      ))}
    </div>
  ),
};
