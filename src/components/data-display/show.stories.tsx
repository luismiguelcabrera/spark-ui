import type { Meta, StoryObj } from "@storybook/react-vite";
import { Show } from "./show";

const meta = {
  title: "Data Display/Show",
  component: Show,
  tags: ["autodocs"],
  argTypes: {
    when: { control: "boolean" },
    above: { control: "select", options: [undefined, "sm", "md", "lg", "xl", "2xl"] },
    below: { control: "select", options: [undefined, "sm", "md", "lg", "xl", "2xl"] },
  },
} satisfies Meta<typeof Show>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WhenTrue: Story = {
  args: {
    when: true,
    children: <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">Visible content (when=true)</div>,
  },
};

export const WhenFalse: Story = {
  args: {
    when: false,
    children: <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">This is hidden</div>,
    fallback: <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">Fallback content (when=false)</div>,
  },
};

export const WithFallback: Story = {
  args: {
    when: false,
    children: <div className="p-4 bg-blue-50 rounded-lg">Logged in content</div>,
    fallback: <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">Please log in to view this content.</div>,
  },
};

export const AboveBreakpoint: Story = {
  args: {
    above: "md",
    children: <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-800">Only visible on md screens and above. Resize your window to test.</div>,
    fallback: <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">Screen is below md breakpoint.</div>,
  },
};

export const BelowBreakpoint: Story = {
  args: {
    below: "lg",
    children: <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-purple-800">Only visible below lg breakpoint. Resize your window to test.</div>,
    fallback: <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">Screen is at or above lg breakpoint.</div>,
  },
};

export const ConditionalToggle: Story = {
  args: {
    when: true,
    children: <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">Toggle the &quot;when&quot; control to show/hide this content.</div>,
    fallback: <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg text-slate-500">Content is currently hidden.</div>,
  },
};
