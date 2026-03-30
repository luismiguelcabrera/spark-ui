import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressSteps } from "./progress-steps";
import { Button } from "../forms/button";

const meta = {
  title: "Data Display/ProgressSteps",
  component: ProgressSteps,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    color: {
      control: "select",
      options: ["primary", "secondary", "success", "warning", "destructive", "accent"],
    },
    variant: { control: "select", options: ["solid", "outline", "soft"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
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
        <p className="text-xs text-muted-foreground">Progress: {value}%</p>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-12 max-w-lg">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((sz) => (
        <div key={sz}>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-4">
            {sz}
          </p>
          <div className="pt-2 pb-8">
            <ProgressSteps {...args} steps={orderSteps} value={66} size={sz} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div className="flex flex-col gap-12 max-w-lg">
      {(
        ["primary", "secondary", "success", "warning", "destructive", "accent"] as const
      ).map((clr) => (
        <div key={clr}>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-4">
            {clr}
          </p>
          <div className="pt-2 pb-8">
            <ProgressSteps {...args} steps={orderSteps} value={66} color={clr} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-12 max-w-lg">
      {(["solid", "outline", "soft"] as const).map((v) => (
        <div key={v}>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-4">
            {v}
          </p>
          <div className="pt-2 pb-8">
            <ProgressSteps {...args} steps={orderSteps} value={66} variant={v} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    steps: orderSteps,
    value: 66,
    orientation: "vertical",
  },
  render: (args) => (
    <div className="max-w-xs">
      <ProgressSteps {...args} />
    </div>
  ),
};

export const VerticalWithDescriptions: Story = {
  args: {
    steps: [
      { label: "Account", description: "Create your account" },
      { label: "Profile", description: "Fill in your details" },
      { label: "Preferences", description: "Configure your settings" },
      { label: "Done", description: "You're all set!" },
    ],
    value: 50,
    orientation: "vertical",
  },
  render: (args) => (
    <div className="max-w-xs">
      <ProgressSteps {...args} />
    </div>
  ),
};

export const VerticalVariants: Story = {
  render: (args) => (
    <div className="flex gap-12">
      {(["solid", "outline", "soft"] as const).map((v) => (
        <div key={v}>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-4">
            {v}
          </p>
          <ProgressSteps
            {...args}
            steps={orderSteps}
            value={66}
            orientation="vertical"
            variant={v}
          />
        </div>
      ))}
    </div>
  ),
};

export const ColorVariantMatrix: Story = {
  render: (args) => (
    <div className="flex flex-col gap-10">
      {(["solid", "outline", "soft"] as const).map((v) => (
        <div key={v}>
          <p className="text-sm font-bold text-foreground mb-4 capitalize">
            {v}
          </p>
          <div className="flex flex-col gap-8">
            {(
              ["primary", "success", "destructive"] as const
            ).map((clr) => (
              <div key={clr} className="max-w-lg">
                <p className="text-xs text-muted-foreground mb-2 capitalize">
                  {clr}
                </p>
                <div className="pt-2 pb-6">
                  <ProgressSteps
                    {...args}
                    steps={orderSteps}
                    value={66}
                    variant={v}
                    color={clr}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
