import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnimatedNumber } from "./animated-number";

const meta = {
  title: "Data Display/AnimatedNumber",
  component: AnimatedNumber,
  tags: ["autodocs"],
  argTypes: {
    value: { control: "number" },
    from: { control: "number" },
    duration: { control: "number" },
    delay: { control: "number" },
    decimals: { control: "number" },
    prefix: { control: "text" },
    suffix: { control: "text" },
    locale: { control: "text" },
    notation: {
      control: "select",
      options: ["standard", "compact"],
    },
    easing: {
      control: "select",
      options: ["linear", "easeIn", "easeOut", "easeInOut"],
    },
    announce: {
      control: "select",
      options: ["polite", "assertive", "off"],
    },
    trend: {
      control: "select",
      options: [undefined, "up", "down", "neutral", "auto"],
    },
    showTrendIcon: { control: "boolean" },
    asChild: { control: "boolean" },
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
    formatValue: (v: number) =>
      v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  },
};

export const LocaleFormatting: Story = {
  args: {
    value: 1234567.89,
    locale: "en-US",
    decimals: 2,
  },
};

export const CompactNotation: Story = {
  args: {
    value: 1_500_000,
    locale: "en-US",
    notation: "compact",
    from: 0,
  },
};

export const FromZero: Story = {
  args: { value: 500, from: 0 },
};

export const WithDelay: Story = {
  args: { value: 1000, from: 0, delay: 1000 },
};

export const SlowDuration: Story = {
  args: { value: 500, duration: 3000 },
};

export const FastDuration: Story = {
  args: { value: 500, duration: 300 },
};

export const LinearEasing: Story = {
  args: { value: 100, from: 0, easing: "linear", duration: 2000 },
};

export const EaseInEasing: Story = {
  args: { value: 100, from: 0, easing: "easeIn", duration: 2000 },
};

export const TrendUp: Story = {
  args: { value: 1234, trend: "up", showTrendIcon: true, prefix: "$" },
};

export const TrendDown: Story = {
  args: { value: 567, trend: "down", showTrendIcon: true, suffix: "%" },
};

export const TrendAuto: Story = {
  args: { value: 200, from: 100, trend: "auto", showTrendIcon: true },
};

export const AsChildHeading: Story = {
  args: { value: 42000, locale: "en-US", asChild: true },
  render: (args) => (
    <AnimatedNumber {...args}>
      <h2 className="text-3xl font-bold" />
    </AnimatedNumber>
  ),
};

export const EasingComparison: Story = {
  args: { duration: 2000 },
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(["linear", "easeIn", "easeOut", "easeInOut"] as const).map((easing) => (
        <div key={easing} className="flex items-center gap-3">
          <span className="w-24 text-sm text-slate-500 font-mono">{easing}</span>
          <AnimatedNumber
            {...args}
            value={args.value ?? 1000}
            from={args.from ?? 0}
            easing={easing}
            className="text-xl font-bold text-slate-800"
          />
        </div>
      ))}
    </div>
  ),
};

export const StaggeredCounters: Story = {
  args: { duration: 1000 },
  render: (args) => (
    <div className="flex gap-8">
      {[0, 300, 600, 900].map((d, i) => (
        <div key={d} className="flex flex-col items-center gap-1">
          <AnimatedNumber
            {...args}
            value={args.value ?? (i + 1) * 250}
            from={args.from ?? 0}
            delay={d}
            prefix={args.prefix ?? "$"}
            className="text-2xl font-bold text-slate-800"
          />
          <span className="text-xs text-slate-400">delay: {d}ms</span>
        </div>
      ))}
    </div>
  ),
};

export const OnComplete: Story = {
  render: (args) => {
    const [done, setDone] = useState(false);
    const [value, setValue] = useState(0);
    return (
      <div className="flex flex-col items-center gap-4">
        <AnimatedNumber
          {...args}
          value={value}
          from={0}
          duration={args.duration ?? 1500}
          onComplete={() => setDone(true)}
          prefix={args.prefix ?? "$"}
          className="text-3xl font-bold text-slate-800"
        />
        {done && (
          <span className="text-sm text-green-600 font-medium">Animation complete!</span>
        )}
        <button
          type="button"
          onClick={() => { setDone(false); setValue((v) => v + 1000); }}
          className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium"
        >
          +1000
        </button>
      </div>
    );
  },
};

export const DashboardExample: Story = {
  render: (args) => {
    const [multiplier, setMultiplier] = useState(1);
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border p-4">
            <p className="text-xs text-slate-500 mb-1">Revenue</p>
            <AnimatedNumber
              {...args}
              value={12_500 * multiplier}
              from={0}
              prefix="$"
              locale="en-US"
              decimals={0}
              trend="auto"
              showTrendIcon
              className="text-2xl font-bold"
            />
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-xs text-slate-500 mb-1">Users</p>
            <AnimatedNumber
              {...args}
              value={1_430_000 * multiplier}
              from={0}
              locale="en-US"
              notation="compact"
              trend="up"
              showTrendIcon
              className="text-2xl font-bold"
            />
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-xs text-slate-500 mb-1">Bounce Rate</p>
            <AnimatedNumber
              {...args}
              value={Math.max(5, 32 - multiplier * 3)}
              from={0}
              suffix="%"
              decimals={1}
              trend="down"
              showTrendIcon
              className="text-2xl font-bold"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMultiplier((m) => m + 1)}
          className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium self-start"
        >
          Update metrics
        </button>
      </div>
    );
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(0);
    return (
      <div className="flex flex-col items-center gap-4">
        <AnimatedNumber
          {...args}
          value={value}
          prefix={args.prefix ?? "$"}
          decimals={args.decimals ?? 2}
          locale={args.locale ?? "en-US"}
          className="text-3xl font-bold text-slate-800"
        />
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
