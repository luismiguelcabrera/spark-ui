import type { Meta, StoryObj } from "@storybook/react-vite";
import { Galleria, type GalleriaImage } from "./galleria";

const meta = {
  title: "Data Display/Galleria",
  component: Galleria,
  tags: ["autodocs"],
  argTypes: {
    showThumbnails: { control: "boolean" },
    showIndicators: { control: "boolean" },
    showCaption: { control: "boolean" },
    showNavigation: { control: "boolean" },
    fullscreen: { control: "boolean" },
    autoplay: { control: "boolean" },
    autoplayInterval: { control: { type: "number", min: 1000, max: 10000 } },
    thumbnailPosition: {
      control: "select",
      options: ["bottom", "top", "left", "right"],
    },
    circular: { control: "boolean" },
  },
} satisfies Meta<typeof Galleria>;

export default meta;
type Story = StoryObj<typeof meta>;

const images: GalleriaImage[] = [
  {
    src: "https://picsum.photos/seed/1/800/600",
    thumbnail: "https://picsum.photos/seed/1/160/120",
    alt: "Mountain landscape",
    caption: "Majestic mountain peaks at sunrise",
  },
  {
    src: "https://picsum.photos/seed/2/800/600",
    thumbnail: "https://picsum.photos/seed/2/160/120",
    alt: "Ocean view",
    caption: "Crystal clear ocean waters",
  },
  {
    src: "https://picsum.photos/seed/3/800/600",
    thumbnail: "https://picsum.photos/seed/3/160/120",
    alt: "Forest path",
    caption: "A serene forest walking trail",
  },
  {
    src: "https://picsum.photos/seed/4/800/600",
    thumbnail: "https://picsum.photos/seed/4/160/120",
    alt: "City skyline",
    caption: "Downtown skyline at golden hour",
  },
  {
    src: "https://picsum.photos/seed/5/800/600",
    thumbnail: "https://picsum.photos/seed/5/160/120",
    alt: "Desert dunes",
    caption: "Rolling sand dunes at sunset",
  },
  {
    src: "https://picsum.photos/seed/6/800/600",
    thumbnail: "https://picsum.photos/seed/6/160/120",
    alt: "Waterfall",
    caption: "Tropical waterfall in the jungle",
  },
];

export const Default: Story = {
  args: {
    images,
  },
  render: (args) => (
    <div className="max-w-2xl mx-auto p-4">
      <div className="h-[500px]">
        <Galleria {...args} />
      </div>
    </div>
  ),
};

export const WithCaptions: Story = {
  args: {
    images,
    showCaption: true,
  },
  render: (args) => (
    <div className="max-w-2xl mx-auto p-4">
      <div className="h-[500px]">
        <Galleria {...args} />
      </div>
    </div>
  ),
};

export const WithIndicators: Story = {
  args: {
    images,
    showIndicators: true,
    showThumbnails: false,
    showCaption: true,
  },
  render: (args) => (
    <div className="max-w-2xl mx-auto p-4">
      <div className="h-[500px]">
        <Galleria {...args} />
      </div>
    </div>
  ),
};

export const ThumbnailsOnRight: Story = {
  args: {
    images,
    thumbnailPosition: "right",
    showCaption: true,
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto p-4">
      <div className="h-[500px]">
        <Galleria {...args} />
      </div>
    </div>
  ),
};

export const ThumbnailsOnLeft: Story = {
  args: {
    images,
    thumbnailPosition: "left",
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto p-4">
      <div className="h-[500px]">
        <Galleria {...args} />
      </div>
    </div>
  ),
};

export const ThumbnailsOnTop: Story = {
  args: {
    images,
    thumbnailPosition: "top",
  },
  render: (args) => (
    <div className="max-w-2xl mx-auto p-4">
      <div className="h-[500px]">
        <Galleria {...args} />
      </div>
    </div>
  ),
};

export const Autoplay: Story = {
  args: {
    images,
    autoplay: true,
    autoplayInterval: 2000,
    circular: true,
    showCaption: true,
    showIndicators: true,
    showThumbnails: false,
  },
  render: (args) => (
    <div className="max-w-2xl mx-auto p-4">
      <div className="h-[500px]">
        <Galleria {...args} />
      </div>
    </div>
  ),
};

export const Circular: Story = {
  args: {
    images,
    circular: true,
  },
  render: (args) => (
    <div className="max-w-2xl mx-auto p-4">
      <div className="h-[500px]">
        <Galleria {...args} />
      </div>
    </div>
  ),
};

export const NoNavigation: Story = {
  args: {
    images,
    showNavigation: false,
    showIndicators: true,
  },
  render: (args) => (
    <div className="max-w-2xl mx-auto p-4">
      <div className="h-[500px]">
        <Galleria {...args} />
      </div>
    </div>
  ),
};

export const FullFeatured: Story = {
  args: {
    images,
    showCaption: true,
    showIndicators: true,
    circular: true,
    autoplay: true,
    autoplayInterval: 4000,
  },
  render: (args) => (
    <div className="max-w-2xl mx-auto p-4">
      <div className="h-[500px]">
        <Galleria {...args} />
      </div>
    </div>
  ),
};
