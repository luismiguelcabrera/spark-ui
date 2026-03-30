import type { Meta, StoryObj } from "@storybook/react-vite";
import { SystemBar } from "./system-bar";

const meta = {
  title: "Navigation/SystemBar",
  component: SystemBar,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "text" },
    height: { control: "number" },
    window: { control: "boolean" },
  },
} satisfies Meta<typeof SystemBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <SystemBar {...args}>
      <span className="font-medium">9:41</span>
    </SystemBar>
  ),
};

export const WithIcons: Story = {
  args: {},
  render: (args) => (
    <SystemBar {...args}>
      <div className="flex items-center justify-between w-full px-4">
        <span className="text-xs font-medium">9:41</span>
        <div className="flex gap-1 text-xs">
          <span>&#9679;</span>
          <span>&#9679;</span>
          <span>&#9679;</span>
        </div>
      </div>
    </SystemBar>
  ),
};

export const CustomColor: Story = {
  args: {
    color: "bg-blue-600",
  },
  render: (args) => (
    <SystemBar {...args}>
      <span className="font-medium">12:00 PM</span>
    </SystemBar>
  ),
};

export const WindowMode: Story = {
  args: {
    window: true,
  },
  render: (args) => (
    <SystemBar {...args}>
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="ml-2 font-medium">My App</span>
      </div>
    </SystemBar>
  ),
};

export const CustomHeight: Story = {
  args: {
    height: 40,
    color: "bg-slate-800",
  },
  render: (args) => (
    <SystemBar {...args}>
      <span className="font-medium">Tall bar</span>
    </SystemBar>
  ),
};
