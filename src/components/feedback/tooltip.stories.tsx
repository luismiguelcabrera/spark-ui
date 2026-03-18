import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "./tooltip";
import { Button } from "../forms/button";
import { Icon } from "../data-display/icon";

const meta = {
  title: "Feedback/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    position: { control: "select", options: ["top", "bottom", "left", "right"] },
    variant: { control: "select", options: ["dark", "light"] },
    arrow: { control: "boolean" },
    disabled: { control: "boolean" },
    openDelay: { control: "number" },
    closeDelay: { control: "number" },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: "This is a tooltip",
  },
  render: (args) => (
    <div className="p-16 flex justify-center">
      <Tooltip {...args}>
        <Button variant="outline">Hover me</Button>
      </Tooltip>
    </div>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="p-20 flex flex-col items-center gap-12">
      <Tooltip content="Top tooltip" position="top">
        <Button variant="outline">Top</Button>
      </Tooltip>
      <div className="flex gap-20">
        <Tooltip content="Left tooltip" position="left">
          <Button variant="outline">Left</Button>
        </Tooltip>
        <Tooltip content="Right tooltip" position="right">
          <Button variant="outline">Right</Button>
        </Tooltip>
      </div>
      <Tooltip content="Bottom tooltip" position="bottom">
        <Button variant="outline">Bottom</Button>
      </Tooltip>
    </div>
  ),
};

export const LightVariant: Story = {
  render: () => (
    <div className="p-16 flex justify-center">
      <Tooltip content="Light tooltip" variant="light">
        <Button variant="outline">Light variant</Button>
      </Tooltip>
    </div>
  ),
};

export const NoArrow: Story = {
  render: () => (
    <div className="p-16 flex justify-center">
      <Tooltip content="No arrow" arrow={false}>
        <Button variant="outline">No arrow</Button>
      </Tooltip>
    </div>
  ),
};

export const WithDelay: Story = {
  render: () => (
    <div className="p-16 flex gap-6 justify-center">
      <Tooltip content="Appears after 500ms" openDelay={500}>
        <Button variant="outline">Open delay</Button>
      </Tooltip>
      <Tooltip content="Stays 300ms after leave" closeDelay={300}>
        <Button variant="outline">Close delay</Button>
      </Tooltip>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-16 flex flex-col items-center gap-4">
        <Tooltip content="Controlled tooltip" open={open} onOpenChange={setOpen}>
          <Button variant="outline">Hover me</Button>
        </Tooltip>
        <label className="flex items-center gap-2 text-sm text-slate-500">
          <input
            type="checkbox"
            checked={open}
            onChange={(e) => setOpen(e.target.checked)}
          />
          Toggle tooltip
        </label>
      </div>
    );
  },
};

export const OnIcons: Story = {
  render: () => (
    <div className="p-16 flex gap-4 justify-center">
      <Tooltip content="Settings">
        <button type="button" className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Icon name="settings" size="md" className="text-slate-600" />
        </button>
      </Tooltip>
      <Tooltip content="Notifications">
        <button type="button" className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Icon name="bell" size="md" className="text-slate-600" />
        </button>
      </Tooltip>
      <Tooltip content="Help">
        <button type="button" className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Icon name="help-circle" size="md" className="text-slate-600" />
        </button>
      </Tooltip>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="p-16 flex justify-center">
      <Tooltip content="You won't see this" disabled>
        <Button variant="outline">Disabled tooltip</Button>
      </Tooltip>
    </div>
  ),
};

export const Gallery: Story = {
  render: () => (
    <div className="p-16 flex flex-col gap-8 items-center">
      <div className="flex gap-6">
        <Tooltip content="Dark (default)" variant="dark">
          <Button variant="outline" size="sm">Dark</Button>
        </Tooltip>
        <Tooltip content="Light variant" variant="light">
          <Button variant="outline" size="sm">Light</Button>
        </Tooltip>
        <Tooltip content="No arrow" arrow={false}>
          <Button variant="outline" size="sm">No arrow</Button>
        </Tooltip>
      </div>
      <div className="flex gap-8">
        <Tooltip content="Top" position="top">
          <span className="text-sm text-slate-500 cursor-default">Top</span>
        </Tooltip>
        <Tooltip content="Bottom" position="bottom">
          <span className="text-sm text-slate-500 cursor-default">Bottom</span>
        </Tooltip>
        <Tooltip content="Left" position="left">
          <span className="text-sm text-slate-500 cursor-default">Left</span>
        </Tooltip>
        <Tooltip content="Right" position="right">
          <span className="text-sm text-slate-500 cursor-default">Right</span>
        </Tooltip>
      </div>
    </div>
  ),
};
