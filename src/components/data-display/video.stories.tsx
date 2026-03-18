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
    privacyMode: { control: "boolean" },
  },
} satisfies Meta<typeof Video>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample sources
const nativeSrc = "https://www.w3schools.com/html/mov_bbb.mp4";
const youtubeSrc = "https://www.youtube.com/watch?v=aqz-KE-bpKQ";
const youtubeShortSrc = "https://youtu.be/aqz-KE-bpKQ";
const vimeoSrc = "https://vimeo.com/76979871";
const samplePoster =
  "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=640&h=360&fit=crop";

/* -------------------------------------------------------------------------- */
/*  Native video stories                                                       */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
  args: {
    src: nativeSrc,
    width: 640,
    aspectRatio: 16 / 9,
  },
};

export const WithPoster: Story = {
  args: {
    src: nativeSrc,
    poster: samplePoster,
    width: 640,
    aspectRatio: 16 / 9,
  },
};

export const RoundedNone: Story = {
  args: {
    src: nativeSrc,
    width: 480,
    aspectRatio: 16 / 9,
    rounded: "none",
  },
};

export const RoundedXl: Story = {
  args: {
    src: nativeSrc,
    width: 480,
    aspectRatio: 16 / 9,
    rounded: "xl",
  },
};

export const FourByThree: Story = {
  name: "4:3 Aspect Ratio",
  args: {
    src: nativeSrc,
    width: 480,
    aspectRatio: 4 / 3,
    rounded: "lg",
  },
};

export const FullWidth: Story = {
  args: {
    src: nativeSrc,
    width: "100%",
    aspectRatio: 16 / 9,
    rounded: "lg",
  },
};

/* -------------------------------------------------------------------------- */
/*  YouTube stories                                                            */
/* -------------------------------------------------------------------------- */

export const YouTube: Story = {
  name: "YouTube",
  args: {
    src: youtubeSrc,
    width: 640,
    aspectRatio: 16 / 9,
  },
};

export const YouTubeShortUrl: Story = {
  name: "YouTube (short URL)",
  args: {
    src: youtubeShortSrc,
    width: 640,
    aspectRatio: 16 / 9,
  },
};

export const YouTubeCustomPoster: Story = {
  name: "YouTube (custom poster)",
  args: {
    src: youtubeSrc,
    poster: samplePoster,
    width: 640,
    aspectRatio: 16 / 9,
  },
};

export const YouTubeNoPrivacy: Story = {
  name: "YouTube (privacy mode off)",
  args: {
    src: youtubeSrc,
    width: 640,
    aspectRatio: 16 / 9,
    privacyMode: false,
  },
};

/* -------------------------------------------------------------------------- */
/*  Vimeo stories                                                              */
/* -------------------------------------------------------------------------- */

export const Vimeo: Story = {
  name: "Vimeo",
  args: {
    src: vimeoSrc,
    width: 640,
    aspectRatio: 16 / 9,
  },
};

export const VimeoWithPoster: Story = {
  name: "Vimeo (with poster)",
  args: {
    src: vimeoSrc,
    poster: samplePoster,
    width: 640,
    aspectRatio: 16 / 9,
  },
};

/* -------------------------------------------------------------------------- */
/*  Gallery                                                                    */
/* -------------------------------------------------------------------------- */

export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
          Native Video
        </p>
        <Video {...args} src={nativeSrc} width="100%" aspectRatio={16 / 9} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
          YouTube (lite embed)
        </p>
        <Video {...args} src={youtubeSrc} width="100%" aspectRatio={16 / 9} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
          Vimeo (lite embed)
        </p>
        <Video
          {...args}
          src={vimeoSrc}
          poster={samplePoster}
          width="100%"
          aspectRatio={16 / 9}
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
            No Rounding
          </p>
          <Video
            src={youtubeSrc}
            width="100%"
            aspectRatio={16 / 9}
            rounded="none"
          />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
            XL Rounding
          </p>
          <Video
            src={youtubeSrc}
            width="100%"
            aspectRatio={16 / 9}
            rounded="xl"
          />
        </div>
      </div>
    </div>
  ),
};
