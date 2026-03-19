import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollShadow } from "./scroll-shadow";

const meta = {
  title: "Layout/ScrollShadow",
  component: ScrollShadow,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "both"],
    },
    size: { control: { type: "number", min: 10, max: 100 } },
    hideScrollbar: { control: "boolean" },
  },
} satisfies Meta<typeof ScrollShadow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    orientation: "vertical",
    size: 40,
    hideScrollbar: false,
  },
  render: (args) => (
    <ScrollShadow
      orientation={args.orientation}
      size={args.size}
      hideScrollbar={args.hideScrollbar}
      className="h-48 border rounded-xl"
    >
      <div className="p-4 space-y-2">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="py-2 border-b border-slate-100 last:border-0 text-sm text-slate-600">
            Item {i + 1}
          </div>
        ))}
      </div>
    </ScrollShadow>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollShadow orientation="horizontal" className="border rounded-xl">
      <div className="flex gap-4 p-4" style={{ width: "1000px" }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="shrink-0 w-36 h-24 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-sm font-medium text-primary"
          >
            Card {i + 1}
          </div>
        ))}
      </div>
    </ScrollShadow>
  ),
};

export const HiddenScrollbar: Story = {
  render: () => (
    <ScrollShadow orientation="vertical" hideScrollbar className="h-48 border rounded-xl">
      <div className="p-4 space-y-2">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="py-2 border-b border-slate-100 last:border-0 text-sm text-slate-600">
            Item {i + 1} (hidden scrollbar)
          </div>
        ))}
      </div>
    </ScrollShadow>
  ),
};

export const LargeShadow: Story = {
  render: () => (
    <ScrollShadow orientation="vertical" size={80} className="h-48 border rounded-xl">
      <div className="p-4 space-y-2">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="py-2 border-b border-slate-100 last:border-0 text-sm text-slate-600">
            Item {i + 1} (large 80px shadow)
          </div>
        ))}
      </div>
    </ScrollShadow>
  ),
};

export const BothDirections: Story = {
  render: () => (
    <ScrollShadow orientation="both" className="h-48 border rounded-xl">
      <div className="p-4" style={{ width: "800px" }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="py-2 border-b border-slate-100 last:border-0 text-sm text-slate-600 whitespace-nowrap">
            Row {i + 1} — Shadows appear on all sides as you scroll both horizontally and vertically through this content area.
          </div>
        ))}
      </div>
    </ScrollShadow>
  ),
};
