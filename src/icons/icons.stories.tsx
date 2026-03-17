import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../components/data-display/icon";
import * as icons from "./icons";

const meta = {
  title: "Icons/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { name: "check", size: "lg" } };
export const Search: Story = { args: { name: "search", size: "lg" } };
export const Close: Story = { args: { name: "close", size: "lg" } };

// ── All built-in icons gallery ──

const allIcons = Object.entries(icons)
  .filter(([key]) => key.endsWith("Icon"))
  .map(([key, Comp]) => ({ name: key.replace(/Icon$/, ""), Comp }));

export const AllIcons: Story = {
  args: { name: "check", size: "lg" },
  render: (args) => (
    <div className="grid grid-cols-6 gap-6">
      {allIcons.map(({ name, Comp }) => (
        <div key={name} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50">
          <Comp size={args.size === "xs" ? 12 : args.size === "sm" ? 16 : args.size === "md" ? 20 : args.size === "lg" ? 24 : 32} />
          <span className="text-[10px] text-slate-500 font-mono text-center">{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  args: { name: "star" },
  render: () => (
    <div className="flex items-end gap-6">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
        <div key={s} className="flex flex-col items-center gap-2">
          <Icon name="star" size={s} />
          <span className="text-xs text-slate-500">{s}</span>
        </div>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  args: { name: "heart" },
  render: () => (
    <div className="flex items-center gap-4">
      <Icon name="heart" size="lg" className="text-red-500" />
      <Icon name="check-circle" size="lg" className="text-green-600" />
      <Icon name="info" size="lg" className="text-blue-500" />
      <Icon name="alert-triangle" size="lg" className="text-amber-500" />
      <Icon name="star" size="lg" className="text-yellow-400" />
    </div>
  ),
};

export const StringFallback: Story = {
  args: { name: "rocket_launch", size: "lg" },
};
