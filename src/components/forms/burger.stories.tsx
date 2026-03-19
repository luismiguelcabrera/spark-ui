import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Burger } from "./burger";

const meta = {
  title: "Forms/Burger",
  component: Burger,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    color: { control: "color" },
    transitionDuration: { control: { type: "range", min: 0, max: 1000, step: 50 } },
    opened: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Burger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { opened: false },
};

export const Opened: Story = {
  args: { opened: true },
};

export const Disabled: Story = {
  args: { opened: false, disabled: true },
};

export const CustomColor: Story = {
  args: { opened: false, color: "#6366f1" },
};

export const Sizes: Story = {
  args: { opened: false },
  render: (args) => (
    <div className="flex items-center gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-1">
          <Burger {...args} size={size} />
          <span className="text-xs text-slate-500">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const Interactive: Story = {
  render: (args) => {
    const [opened, setOpened] = useState(false);
    return (
      <Burger {...args} opened={opened} onToggle={() => setOpened((o) => !o)} />
    );
  },
  args: { opened: false },
};
