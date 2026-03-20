import type { Meta, StoryObj } from "@storybook/react-vite";
import { Marquee } from "./marquee";

const meta = {
  title: "Data Display/Marquee",
  component: Marquee,
  tags: ["autodocs"],
  argTypes: {
    direction: { control: "select", options: ["left", "right", "up", "down"] },
    speed: { control: "select", options: ["slow", "normal", "fast"] },
    pauseOnHover: { control: "boolean" },
    gap: { control: "number" },
    repeat: { control: "number" },
  },
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj<typeof meta>;

const logos = ["Acme", "Globex", "Soylent", "Initech", "Umbrella", "Hooli", "Pied Piper", "Wayne Ent."];

export const Default: Story = {
  args: {
    children: logos.map((name) => (
      <div
        key={name}
        className="flex items-center justify-center rounded-xl border border-muted bg-surface px-6 py-3 shadow-sm"
      >
        <span className="text-sm font-semibold text-navy-text">{name}</span>
      </div>
    )),
  },
};

export const RightDirection: Story = {
  args: {
    direction: "right",
    children: logos.map((name) => (
      <div
        key={name}
        className="flex items-center justify-center rounded-xl border border-muted bg-surface px-6 py-3 shadow-sm"
      >
        <span className="text-sm font-semibold text-navy-text">{name}</span>
      </div>
    )),
  },
};

export const SlowSpeed: Story = {
  args: {
    speed: "slow",
    children: logos.map((name) => (
      <div
        key={name}
        className="flex items-center justify-center rounded-xl border border-muted bg-surface px-6 py-3 shadow-sm"
      >
        <span className="text-sm font-semibold text-navy-text">{name}</span>
      </div>
    )),
  },
};

export const FastSpeed: Story = {
  args: {
    speed: "fast",
    children: logos.map((name) => (
      <div
        key={name}
        className="flex items-center justify-center rounded-xl border border-muted bg-surface px-6 py-3 shadow-sm"
      >
        <span className="text-sm font-semibold text-navy-text">{name}</span>
      </div>
    )),
  },
};

export const NoPauseOnHover: Story = {
  args: {
    pauseOnHover: false,
    children: logos.map((name) => (
      <div
        key={name}
        className="flex items-center justify-center rounded-xl border border-muted bg-surface px-6 py-3 shadow-sm"
      >
        <span className="text-sm font-semibold text-navy-text">{name}</span>
      </div>
    )),
  },
};

export const Vertical: Story = {
  args: {
    direction: "up",
    children: logos.slice(0, 5).map((name) => (
      <div
        key={name}
        className="flex items-center justify-center rounded-xl border border-muted bg-surface px-6 py-3 shadow-sm"
      >
        <span className="text-sm font-semibold text-navy-text">{name}</span>
      </div>
    )),
  },
  decorators: [
    (Story) => (
      <div className="h-48 overflow-hidden">
        <Story />
      </div>
    ),
  ],
};

export const Testimonials: Story = {
  args: {
    speed: "slow",
    gap: 24,
    children: [
      { name: "Alice", text: "Amazing component library!" },
      { name: "Bob", text: "Saved us weeks of development time." },
      { name: "Carol", text: "Best DX I have ever experienced." },
      { name: "Dave", text: "Clean API, great docs." },
    ].map(({ name, text }) => (
      <div
        key={name}
        className="flex flex-col gap-2 rounded-xl border border-muted bg-surface px-6 py-4 shadow-sm w-64"
      >
        <p className="text-sm text-muted-foreground italic">&ldquo;{text}&rdquo;</p>
        <span className="text-xs font-semibold text-navy-text">{name}</span>
      </div>
    )),
  },
};
