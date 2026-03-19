import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusDot } from "./status-dot";

const meta = {
  title: "Data Display/StatusDot",
  component: StatusDot,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["green", "amber", "red", "blue", "slate"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
    pulse: { control: "boolean" },
  },
} satisfies Meta<typeof StatusDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    color: "green",
  },
};

export const Medium: Story = {
  args: {
    color: "green",
    size: "md",
  },
};

export const Pulsing: Story = {
  args: {
    color: "green",
    pulse: true,
    size: "md",
  },
};

export const AllColors: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      {(["green", "amber", "red", "blue", "slate"] as const).map((color) => (
        <div key={color} className="flex items-center gap-2">
          <StatusDot {...args} color={color} size="md" />
          <span className="text-sm text-gray-600 capitalize">{color}</span>
        </div>
      ))}
    </div>
  ),
};

export const AllColorsPulsing: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      {(["green", "amber", "red", "blue", "slate"] as const).map((color) => (
        <div key={color} className="flex items-center gap-2">
          <StatusDot {...args} color={color} size="md" pulse />
          <span className="text-sm text-gray-600 capitalize">{color}</span>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <StatusDot {...args} color="green" size="sm" />
        <span className="text-sm text-gray-600">Small</span>
      </div>
      <div className="flex items-center gap-2">
        <StatusDot {...args} color="green" size="md" />
        <span className="text-sm text-gray-600">Medium</span>
      </div>
    </div>
  ),
};

export const InlineWithText: Story = {
  render: (args) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <StatusDot {...args} color="green" size="md" />
        <span className="text-sm font-medium">Online</span>
      </div>
      <div className="flex items-center gap-2">
        <StatusDot {...args} color="amber" size="md" />
        <span className="text-sm font-medium">Away</span>
      </div>
      <div className="flex items-center gap-2">
        <StatusDot {...args} color="red" size="md" />
        <span className="text-sm font-medium">Busy</span>
      </div>
      <div className="flex items-center gap-2">
        <StatusDot {...args} color="slate" size="md" />
        <span className="text-sm font-medium">Offline</span>
      </div>
    </div>
  ),
};

export const ServerStatus: Story = {
  render: (args) => (
    <div className="space-y-2 max-w-xs">
      <div className="flex items-center justify-between p-2 bg-white border rounded-lg">
        <span className="text-sm">API Server</span>
        <StatusDot {...args} color="green" size="md" pulse />
      </div>
      <div className="flex items-center justify-between p-2 bg-white border rounded-lg">
        <span className="text-sm">Database</span>
        <StatusDot {...args} color="green" size="md" pulse />
      </div>
      <div className="flex items-center justify-between p-2 bg-white border rounded-lg">
        <span className="text-sm">Cache</span>
        <StatusDot {...args} color="amber" size="md" pulse />
      </div>
      <div className="flex items-center justify-between p-2 bg-white border rounded-lg">
        <span className="text-sm">CDN</span>
        <StatusDot {...args} color="red" size="md" pulse />
      </div>
    </div>
  ),
};
