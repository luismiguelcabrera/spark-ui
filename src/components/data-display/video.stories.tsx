import type { Meta, StoryObj } from "@storybook/react-vite";
import { Video } from "./video";

const meta = {
  title: "Data Display/Video",
  component: Video,
  tags: ["autodocs"],
  argTypes: {
    rounded: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
    },
    aspectRatio: { control: { type: "number", min: 0.5, max: 3, step: 0.1 } },
  },
} satisfies Meta<typeof Video>;

export default meta;
type Story = StoryObj<typeof meta>;

// Use a public domain sample video
const sampleSrc = "https://www.w3schools.com/html/mov_bbb.mp4";
const samplePoster = "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=640&h=360&fit=crop";

export const Default: Story = {
  args: {
    src: sampleSrc,
    width: 640,
    aspectRatio: 16 / 9,
  },
};

export const WithPoster: Story = {
  args: {
    src: sampleSrc,
    poster: samplePoster,
    width: 640,
    aspectRatio: 16 / 9,
  },
};

export const RoundedNone: Story = {
  args: {
    src: sampleSrc,
    width: 480,
    aspectRatio: 16 / 9,
    rounded: "none",
  },
};

export const RoundedXl: Story = {
  args: {
    src: sampleSrc,
    width: 480,
    aspectRatio: 16 / 9,
    rounded: "xl",
  },
};

export const FourByThree: Story = {
  name: "4:3 Aspect Ratio",
  args: {
    src: sampleSrc,
    width: 480,
    aspectRatio: 4 / 3,
    rounded: "lg",
  },
};

export const FullWidth: Story = {
  args: {
    src: sampleSrc,
    width: "100%",
    aspectRatio: 16 / 9,
    rounded: "lg",
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Default (md rounded)</p>
        <Video {...args} src={sampleSrc} width="100%" aspectRatio={16 / 9} />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-400 uppercase mb-2">No Rounding</p>
          <Video src={sampleSrc} width="100%" aspectRatio={16 / 9} rounded="none" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-400 uppercase mb-2">XL Rounding</p>
          <Video src={sampleSrc} width="100%" aspectRatio={16 / 9} rounded="xl" />
        </div>
      </div>
    </div>
  ),
};
