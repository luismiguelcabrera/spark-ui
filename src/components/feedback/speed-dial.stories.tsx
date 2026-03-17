import type { Meta, StoryObj } from "@storybook/react-vite";
import { SpeedDial } from "./speed-dial";
import type { SpeedDialAction } from "./speed-dial";

const meta = {
  title: "Feedback/SpeedDial",
  component: SpeedDial,
  tags: ["autodocs"],
  argTypes: {
    position: { control: "select", options: ["bottom-right", "bottom-left", "top-right", "top-left"] },
    direction: { control: "select", options: ["up", "down", "left", "right"] },
    color: { control: "select", options: ["primary", "secondary", "accent"] },
    icon: { control: "text" },
  },
} satisfies Meta<typeof SpeedDial>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultActions: SpeedDialAction[] = [
  { icon: "edit", label: "Edit", onClick: () => {} },
  { icon: "copy", label: "Copy", onClick: () => {} },
  { icon: "share", label: "Share", onClick: () => {} },
  { icon: "delete", label: "Delete", onClick: () => {} },
];

export const Default: Story = {
  args: {
    actions: defaultActions,
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-80">
      <SpeedDial {...args} className="absolute bottom-6 right-6" />
    </div>
  ),
};

export const SecondaryColor: Story = {
  args: {
    actions: defaultActions,
    color: "secondary",
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-80">
      <SpeedDial {...args} className="absolute bottom-6 right-6" />
    </div>
  ),
};

export const AccentColor: Story = {
  args: {
    actions: defaultActions,
    color: "accent",
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-80">
      <SpeedDial {...args} className="absolute bottom-6 right-6" />
    </div>
  ),
};

export const CustomIcon: Story = {
  args: {
    actions: [
      { icon: "image", label: "Upload Image", onClick: () => {} },
      { icon: "file", label: "Upload File", onClick: () => {} },
      { icon: "camera", label: "Take Photo", onClick: () => {} },
    ],
    icon: "upload",
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-80">
      <SpeedDial {...args} className="absolute bottom-6 right-6" />
    </div>
  ),
};

export const WithDisabledAction: Story = {
  args: {
    actions: [
      { icon: "edit", label: "Edit", onClick: () => {} },
      { icon: "share", label: "Share", onClick: () => {} },
      { icon: "delete", label: "Delete", onClick: () => {}, disabled: true },
    ],
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-80">
      <SpeedDial {...args} className="absolute bottom-6 right-6" />
    </div>
  ),
};
