import type { Meta, StoryObj } from "@storybook/react-vite";
import { AspectRatio } from "./aspect-ratio";

const meta = {
  title: "Layout/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  argTypes: {
    ratio: { control: { type: "number", min: 0.1, max: 4, step: 0.1 } },
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <div className="max-w-sm">
      <AspectRatio ratio={args.ratio}>
        <div className="w-full h-full bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold">
          16:9
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  render: () => (
    <div className="max-w-xs">
      <AspectRatio ratio={1}>
        <div className="w-full h-full bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-sm font-mono text-slate-700">
          1:1
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Ratios: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {[
        { ratio: 1, label: "1:1" },
        { ratio: 4 / 3, label: "4:3" },
        { ratio: 16 / 9, label: "16:9" },
        { ratio: 21 / 9, label: "21:9" },
        { ratio: 3 / 4, label: "3:4" },
        { ratio: 9 / 16, label: "9:16" },
      ].map(({ ratio, label }) => (
        <AspectRatio key={label} ratio={ratio}>
          <div className="w-full h-full bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-sm font-mono text-slate-700">
            {label}
          </div>
        </AspectRatio>
      ))}
    </div>
  ),
};

export const WithImage: Story = {
  render: () => (
    <div className="max-w-md">
      <AspectRatio ratio={16 / 9}>
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=340&fit=crop"
          alt="Landscape"
          className="w-full h-full object-cover rounded-xl"
        />
      </AspectRatio>
    </div>
  ),
};

export const VideoEmbed: Story = {
  render: () => (
    <div className="max-w-lg">
      <AspectRatio ratio={16 / 9}>
        <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
              <span className="material-symbols-outlined text-white text-[32px]">play_arrow</span>
            </div>
            <p className="text-sm text-white/60">Video placeholder (16:9)</p>
          </div>
        </div>
      </AspectRatio>
    </div>
  ),
};
