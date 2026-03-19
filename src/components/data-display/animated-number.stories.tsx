import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnimatedNumber } from "./animated-number";

const meta = {
  title: "Data Display/AnimatedNumber",
  component: AnimatedNumber,
  tags: ["autodocs"],
  argTypes: {
    value: { control: "number" },
    duration: { control: "number" },
    decimals: { control: "number" },
    prefix: { control: "text" },
    suffix: { control: "text" },
  },
} satisfies Meta<typeof AnimatedNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 1234 },
};

export const WithDecimals: Story = {
  args: { value: 99.95, decimals: 2 },
};

export const WithPrefix: Story = {
  args: { value: 4999, prefix: "$" },
};

export const WithSuffix: Story = {
  args: { value: 73, suffix: "%" },
};

export const CurrencyFormat: Story = {
  args: {
    value: 12500,
    prefix: "$",
    formatValue: (v: number) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  },
};

export const SlowDuration: Story = {
  args: { value: 500, duration: 3000 },
};

export const FastDuration: Story = {
  args: { value: 500, duration: 300 },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    return (
      <div className="flex flex-col items-center gap-4">
        <AnimatedNumber value={value} prefix="$" decimals={2} className="text-3xl font-bold text-slate-800" />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setValue((v) => v + 100)}
            className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium"
          >
            +100
          </button>
          <button
            type="button"
            onClick={() => setValue((v) => Math.max(0, v - 100))}
            className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-sm font-medium"
          >
            -100
          </button>
          <button
            type="button"
            onClick={() => setValue(0)}
            className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </div>
    );
  },
};
