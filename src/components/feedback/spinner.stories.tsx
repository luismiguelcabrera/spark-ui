import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./spinner";
import type { SpinnerType } from "./spinner";

const meta = {
  title: "Feedback/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: [
        "spin", "ring", "dual-ring", "dots", "bounce", "typing",
        "pulse", "ping", "ripple", "bars", "wave", "grid",
        "circle-fade", "chase", "orbit", "square",
      ],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    color: {
      control: "select",
      options: ["primary", "secondary", "destructive", "success", "warning", "accent", "white", "muted", "current"],
    },
    thickness: { control: "select", options: ["thin", "default", "thick"] },
    speed: { control: "select", options: ["slowest", "slow", "normal", "fast", "fastest"] },
    overlay: { control: "boolean" },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Individual types ──
export const Spin: Story = { args: { type: "spin", size: "lg" } };
export const Ring: Story = { args: { type: "ring", size: "lg" } };
export const DualRing: Story = { args: { type: "dual-ring", size: "lg" } };
export const Dots: Story = { args: { type: "dots", size: "lg" } };
export const Bounce: Story = { args: { type: "bounce", size: "lg" } };
export const Typing: Story = { args: { type: "typing", size: "lg" } };
export const Pulse: Story = { args: { type: "pulse", size: "lg" } };
export const Ping: Story = { args: { type: "ping", size: "lg" } };
export const Ripple: Story = { args: { type: "ripple", size: "lg" } };
export const Bars: Story = { args: { type: "bars", size: "lg" } };
export const Wave: Story = { args: { type: "wave", size: "lg" } };
export const Grid: Story = { args: { type: "grid", size: "lg" } };
export const CircleFade: Story = { args: { type: "circle-fade", size: "lg" } };
export const Chase: Story = { args: { type: "chase", size: "lg" } };
export const Orbit: Story = { args: { type: "orbit", size: "lg" } };
export const Square: Story = { args: { type: "square", size: "lg" } };

// ── Gallery (all types) ──

const allTypes: SpinnerType[] = [
  "spin", "ring", "dual-ring", "dots", "bounce", "typing",
  "pulse", "ping", "ripple", "bars", "wave", "grid",
  "circle-fade", "chase", "orbit", "square",
];

export const AllTypes: Story = {
  args: { size: "lg" },
  render: (args) => (
    <div className="grid grid-cols-4 gap-8">
      {allTypes.map((t) => (
        <div key={t} className="flex flex-col items-center gap-3">
          <div className="h-12 flex items-center justify-center">
            <Spinner {...args} type={t} />
          </div>
          <span className="text-xs text-slate-500 font-mono">{t}</span>
        </div>
      ))}
    </div>
  ),
};

export const AllTypesXL: Story = {
  args: { size: "xl" },
  render: (args) => (
    <div className="grid grid-cols-4 gap-10">
      {allTypes.map((t) => (
        <div key={t} className="flex flex-col items-center gap-3">
          <div className="h-16 flex items-center justify-center">
            <Spinner {...args} type={t} />
          </div>
          <span className="text-xs text-slate-500 font-mono">{t}</span>
        </div>
      ))}
    </div>
  ),
};

// ── Sizes ──
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

// ── Colors ──
export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner color="primary" />
      <Spinner color="secondary" />
      <Spinner color="destructive" />
      <Spinner color="success" />
      <Spinner color="warning" />
      <Spinner color="accent" />
      <Spinner color="muted" />
    </div>
  ),
};

// ── Speed comparison ──
export const SpeedComparison: Story = {
  render: () => (
    <div className="flex items-center gap-10">
      {(["slowest", "slow", "normal", "fast", "fastest"] as const).map((s) => (
        <div key={s} className="flex flex-col items-center gap-2">
          <Spinner size="lg" speed={s} />
          <span className="text-xs text-slate-500">{s}</span>
        </div>
      ))}
    </div>
  ),
};

export const SpeedComparisonDots: Story = {
  render: () => (
    <div className="flex items-center gap-10">
      {(["slowest", "slow", "normal", "fast", "fastest"] as const).map((s) => (
        <div key={s} className="flex flex-col items-center gap-2">
          <Spinner type="dots" size="lg" speed={s} />
          <span className="text-xs text-slate-500">{s}</span>
        </div>
      ))}
    </div>
  ),
};

// ── Thickness ──
export const ThicknessComparison: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      {(["thin", "default", "thick"] as const).map((t) => (
        <div key={t} className="flex flex-col items-center gap-2">
          <Spinner size="xl" thickness={t} />
          <span className="text-xs text-slate-500">{t}</span>
        </div>
      ))}
    </div>
  ),
};

// ── White on dark ──
export const WhiteOnDark: Story = {
  render: () => (
    <div className="bg-slate-900 p-8 rounded-xl flex items-center gap-6">
      <Spinner type="spin" color="white" size="lg" />
      <Spinner type="dots" color="white" size="lg" />
      <Spinner type="ripple" color="white" size="lg" />
      <Spinner type="chase" color="white" size="lg" />
    </div>
  ),
};

// ── Overlay ──
export const Overlay: Story = {
  render: () => (
    <div className="relative w-72 h-44 bg-white border border-slate-200 rounded-2xl p-4">
      <p className="text-sm text-slate-600 font-medium">Card content</p>
      <p className="text-sm text-slate-400 mt-2">Loading data...</p>
      <Spinner overlay size="lg" />
    </div>
  ),
};

export const OverlayDots: Story = {
  render: () => (
    <div className="relative w-72 h-44 bg-white border border-slate-200 rounded-2xl p-4">
      <p className="text-sm text-slate-600 font-medium">Card content</p>
      <Spinner type="dots" overlay size="lg" color="muted" />
    </div>
  ),
};
