import type { Meta, StoryObj } from "@storybook/react-vite";
import { Affix } from "./affix";

const meta = {
  title: "Layout/Affix",
  component: Affix,
  tags: ["autodocs"],
  argTypes: {
    zIndex: { control: { type: "number", min: 1, max: 200 } },
    withinPortal: { control: "boolean" },
  },
} satisfies Meta<typeof Affix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="relative h-64 bg-slate-50 rounded-xl border border-dashed border-slate-300 p-4">
      <p className="text-sm text-slate-500">Scroll down to see the Affix stay fixed in the viewport.</p>
      <Affix {...args} withinPortal={false}>
        <button
          type="button"
          className="rounded-full bg-primary p-3 text-white shadow-lg hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
        </button>
      </Affix>
    </div>
  ),
  args: {
    position: { bottom: 20, right: 20 },
    zIndex: 100,
    withinPortal: false,
  },
};

export const TopLeft: Story = {
  render: () => (
    <div className="relative h-64 bg-slate-50 rounded-xl border border-dashed border-slate-300 p-4">
      <p className="text-sm text-slate-500">Affix pinned to the top-left corner.</p>
      <Affix position={{ top: 20, left: 20 }} withinPortal={false}>
        <div className="rounded-lg bg-amber-100 border border-amber-300 px-3 py-2 text-xs font-medium text-amber-800">
          New feature available
        </div>
      </Affix>
    </div>
  ),
};

export const BottomLeft: Story = {
  render: () => (
    <div className="relative h-64 bg-slate-50 rounded-xl border border-dashed border-slate-300 p-4">
      <p className="text-sm text-slate-500">Affix pinned to the bottom-left corner.</p>
      <Affix position={{ bottom: 20, left: 20 }} withinPortal={false}>
        <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-medium text-primary">
          Help Center
        </div>
      </Affix>
    </div>
  ),
};

export const CustomZIndex: Story = {
  args: {
    position: { bottom: 20, right: 20 },
    zIndex: 50,
    withinPortal: false,
  },
  render: (args) => (
    <div className="relative h-64 bg-slate-50 rounded-xl border border-dashed border-slate-300 p-4">
      <p className="text-sm text-slate-500">Affix with custom z-index of {args.zIndex}.</p>
      <Affix {...args}>
        <button
          type="button"
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          Chat
        </button>
      </Affix>
    </div>
  ),
};
