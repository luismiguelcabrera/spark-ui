import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea } from "./scroll-area";

const meta = {
  title: "Layout/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  argTypes: {
    maxHeight: { control: { type: "number", min: 100, max: 600 } },
    scrollbar: {
      control: "select",
      options: ["auto", "always", "hover", "hidden"],
    },
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "both"],
    },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    maxHeight: 200,
    scrollbar: "auto",
    orientation: "vertical",
  },
  render: (args) => (
    <ScrollArea maxHeight={args.maxHeight} scrollbar={args.scrollbar} orientation={args.orientation} className="border rounded-xl p-4">
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className="py-2 border-b border-slate-100 last:border-0 text-sm text-slate-600">
          Item {i + 1}
        </div>
      ))}
    </ScrollArea>
  ),
};

export const HiddenScrollbar: Story = {
  render: () => (
    <ScrollArea maxHeight={160} scrollbar="hidden" className="border rounded-xl p-4">
      {Array.from({ length: 15 }, (_, i) => (
        <div key={i} className="py-2 border-b border-slate-100 last:border-0 text-sm text-slate-600">
          Scrollable item {i + 1} (hidden scrollbar)
        </div>
      ))}
    </ScrollArea>
  ),
};

export const AlwaysVisible: Story = {
  render: () => (
    <ScrollArea maxHeight={180} scrollbar="always" className="border rounded-xl p-4">
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className="py-2 border-b border-slate-100 last:border-0 text-sm text-slate-600">
          Item {i + 1} (always visible scrollbar)
        </div>
      ))}
    </ScrollArea>
  ),
};

export const HoverScrollbar: Story = {
  render: () => (
    <ScrollArea maxHeight={180} scrollbar="hover" className="border rounded-xl p-4">
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className="py-2 border-b border-slate-100 last:border-0 text-sm text-slate-600">
          Item {i + 1} (scrollbar appears on hover)
        </div>
      ))}
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea orientation="horizontal" className="border rounded-xl p-4">
      <div className="flex gap-4" style={{ width: "1200px" }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="shrink-0 w-32 h-24 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-sm font-medium text-primary"
          >
            Card {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Both: Story = {
  render: () => (
    <ScrollArea maxHeight={200} orientation="both" className="border rounded-xl p-4">
      <div style={{ width: "800px" }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="py-2 border-b border-slate-100 last:border-0 text-sm text-slate-600 whitespace-nowrap">
            Row {i + 1} — This is a long line of content that extends horizontally beyond the container boundary to demonstrate both-direction scrolling.
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
