import type { Meta, StoryObj } from "@storybook/react-vite";
import { SheetSurface } from "./sheet-surface";

const meta = {
  title: "Layout/SheetSurface",
  component: SheetSurface,
  tags: ["autodocs"],
  argTypes: {
    elevation: {
      control: "select",
      options: [0, 1, 2, 3, 4, 5],
    },
    rounded: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl", "2xl"],
    },
    bordered: {
      control: "boolean",
    },
    color: {
      control: "text",
    },
  },
} satisfies Meta<typeof SheetSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">Sheet Surface</h3>
        <p className="text-sm text-slate-600">
          A generic surface element with elevation and rounding.
        </p>
      </div>
    ),
  },
};

export const ElevationScale: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-6 p-4">
      {([0, 1, 2, 3, 4, 5] as const).map((elevation) => (
        <SheetSurface key={elevation} {...args} elevation={elevation} className="p-6 text-center">
          <p className="text-xs font-mono text-slate-500 mb-1">elevation={elevation}</p>
          <p className="text-sm font-medium text-slate-700">Content</p>
        </SheetSurface>
      ))}
    </div>
  ),
};

export const RoundedVariants: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-6 p-4">
      {(["none", "sm", "md", "lg", "xl", "2xl"] as const).map((rounded) => (
        <SheetSurface key={rounded} {...args} rounded={rounded} elevation={2} className="p-6 text-center">
          <p className="text-xs font-mono text-slate-500 mb-1">rounded=&quot;{rounded}&quot;</p>
          <p className="text-sm font-medium text-slate-700">Content</p>
        </SheetSurface>
      ))}
    </div>
  ),
};

export const Bordered: Story = {
  args: {
    bordered: true,
    elevation: 0,
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">Bordered Surface</h3>
        <p className="text-sm text-slate-600">
          No shadow, just a subtle border.
        </p>
      </div>
    ),
  },
};

export const CustomColor: Story = {
  args: {
    color: "bg-blue-50",
    bordered: true,
    elevation: 0,
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Custom Background</h3>
        <p className="text-sm text-blue-700">
          Using a custom color class for the background.
        </p>
      </div>
    ),
  },
};

export const CardLayout: Story = {
  name: "Card-like Layout",
  render: (args) => (
    <div className="grid grid-cols-2 gap-4 max-w-lg">
      <SheetSurface {...args} elevation={2} rounded="xl" className="p-4">
        <p className="text-sm font-semibold mb-1">Revenue</p>
        <p className="text-2xl font-bold text-primary">$12,345</p>
      </SheetSurface>
      <SheetSurface {...args} elevation={2} rounded="xl" className="p-4">
        <p className="text-sm font-semibold mb-1">Users</p>
        <p className="text-2xl font-bold text-primary">1,234</p>
      </SheetSurface>
    </div>
  ),
};
