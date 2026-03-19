import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorSwatch } from "./color-swatch";

const meta = {
  title: "Data Display/ColorSwatch",
  component: ColorSwatch,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "color" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    radius: { control: "select", options: ["sm", "md", "lg", "full"] },
    withShadow: { control: "boolean" },
  },
} satisfies Meta<typeof ColorSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { color: "#6366f1" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      <ColorSwatch {...args} color="#6366f1" size="sm" />
      <ColorSwatch {...args} color="#6366f1" size="md" />
      <ColorSwatch {...args} color="#6366f1" size="lg" />
    </div>
  ),
};

export const CustomPixelSize: Story = {
  args: { color: "#ec4899", size: 48 },
};

export const RadiusVariants: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <ColorSwatch {...args} color="#f59e0b" radius="sm" />
      <ColorSwatch {...args} color="#f59e0b" radius="md" />
      <ColorSwatch {...args} color="#f59e0b" radius="lg" />
      <ColorSwatch {...args} color="#f59e0b" radius="full" />
    </div>
  ),
};

export const WithShadow: Story = {
  args: { color: "#10b981", withShadow: true, size: "lg" },
};

export const CSSColors: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <ColorSwatch {...args} color="#ef4444" />
      <ColorSwatch {...args} color="rgb(59, 130, 246)" />
      <ColorSwatch {...args} color="hsl(270, 76%, 53%)" />
      <ColorSwatch {...args} color="coral" />
      <ColorSwatch {...args} color="teal" />
    </div>
  ),
};

export const Palette: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {["#fee2e2", "#fecaca", "#fca5a5", "#f87171", "#ef4444", "#dc2626", "#b91c1c", "#991b1b"].map((c) => (
          <ColorSwatch key={c} {...args} color={c} size="lg" radius="sm" />
        ))}
      </div>
      <div className="flex gap-2">
        {["#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"].map((c) => (
          <ColorSwatch key={c} {...args} color={c} size="lg" radius="sm" />
        ))}
      </div>
      <div className="flex gap-2">
        {["#d1fae5", "#a7f3d0", "#6ee7b7", "#34d399", "#10b981", "#059669", "#047857", "#065f46"].map((c) => (
          <ColorSwatch key={c} {...args} color={c} size="lg" radius="sm" />
        ))}
      </div>
    </div>
  ),
};

export const CircleSwatch: Story = {
  args: { color: "#8b5cf6", radius: "full", size: "lg", withShadow: true },
};
