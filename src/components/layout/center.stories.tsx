import type { Meta, StoryObj } from "@storybook/react-vite";
import { Center } from "./center";

const meta = {
  title: "Layout/Center",
  component: Center,
  tags: ["autodocs"],
  argTypes: {
    inline: { control: "boolean" },
  },
} satisfies Meta<typeof Center>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Center className="h-48 bg-slate-50 rounded-xl border border-dashed border-slate-300">
      <div className="text-sm text-slate-500">Centered content</div>
    </Center>
  ),
};

export const WithCard: Story = {
  render: () => (
    <Center className="h-64 bg-slate-50 rounded-xl border border-dashed border-slate-300">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 max-w-xs text-center">
        <h3 className="text-base font-semibold text-slate-900 mb-2">Centered Card</h3>
        <p className="text-sm text-slate-500">This card is centered both horizontally and vertically.</p>
      </div>
    </Center>
  ),
};

export const Inline: Story = {
  render: () => (
    <p className="text-sm text-slate-600">
      Text with an inline centered element:
      <Center inline className="mx-2 h-8 w-8 rounded-full bg-primary text-white text-xs font-bold">
        42
      </Center>
      embedded in a paragraph.
    </p>
  ),
};

export const FullPage: Story = {
  render: () => (
    <Center className="h-96 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-slate-200">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-primary text-[28px]">check_circle</span>
        </div>
        <h2 className="text-lg font-semibold text-slate-900">All Done</h2>
        <p className="text-sm text-slate-500 max-w-xs">
          Center is useful for hero sections, loading states, and empty states.
        </p>
      </div>
    </Center>
  ),
};

export const NestedCenters: Story = {
  render: () => (
    <Center className="h-64 bg-slate-100 rounded-xl">
      <Center className="h-40 w-40 bg-primary/10 rounded-xl border border-primary/20">
        <Center className="h-20 w-20 bg-primary/20 rounded-lg">
          <span className="text-xs font-bold text-indigo-900">Hi</span>
        </Center>
      </Center>
    </Center>
  ),
};
