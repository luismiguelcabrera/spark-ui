import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./spinner";

const meta = {
  title: "Feedback/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    color: {
      control: "select",
      options: ["primary", "secondary", "destructive", "success", "warning", "accent", "white", "muted", "current"],
    },
    thickness: { control: "select", options: ["thin", "default", "thick"] },
    speed: { control: "select", options: ["normal", "fast"] },
    overlay: { control: "boolean" },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Sizes ──
export const ExtraSmall: Story = { args: { size: "xs" } };
export const Small: Story = { args: { size: "sm" } };
export const Default: Story = {};
export const Large: Story = { args: { size: "lg" } };
export const ExtraLarge: Story = { args: { size: "xl" } };

// ── Colors ──
export const Primary: Story = { args: { color: "primary" } };
export const Destructive: Story = { args: { color: "destructive" } };
export const Success: Story = { args: { color: "success" } };
export const Warning: Story = { args: { color: "warning" } };
export const Muted: Story = { args: { color: "muted" } };
export const WhiteOnDark: Story = {
  args: { color: "white", size: "lg" },
  decorators: [
    (Story) => (
      <div className="bg-slate-900 p-8 rounded-xl inline-flex">
        <Story />
      </div>
    ),
  ],
};

// ── Thickness ──
export const Thin: Story = { args: { thickness: "thin", size: "lg" } };
export const Thick: Story = { args: { thickness: "thick", size: "lg" } };

// ── Speed ──
export const Fast: Story = { args: { speed: "fast" } };

// ── Custom label ──
export const CustomLabel: Story = { args: { label: "Saving changes..." } };

// ── Overlay ──
export const Overlay: Story = {
  render: (args) => (
    <div className="relative w-64 h-40 bg-white border border-slate-200 rounded-2xl p-4">
      <p className="text-sm text-slate-600">Card content underneath</p>
      <p className="text-sm text-slate-400 mt-2">This is loading...</p>
      <Spinner {...args} overlay size="lg" />
    </div>
  ),
};
