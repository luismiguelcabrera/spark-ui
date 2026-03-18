import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageGrid } from "./image-grid";
import type { ImageGridItem } from "./image-grid";

const meta = {
  title: "Data Display/ImageGrid",
  component: ImageGrid,
  tags: ["autodocs"],
  argTypes: {
    layout: { control: "select", options: ["grid", "masonry"] },
    cols: { control: "select", options: [2, 3, 4, 5, 6] },
    gap: { control: "select", options: ["1", "2", "3", "4"] },
    rounded: { control: "select", options: ["none", "md", "lg", "xl", "2xl"] },
    showOverlay: { control: "boolean" },
  },
} satisfies Meta<typeof ImageGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const images: ImageGridItem[] = [
  { src: "https://picsum.photos/seed/a/400/400", alt: "Photo 1" },
  { src: "https://picsum.photos/seed/b/400/400", alt: "Photo 2" },
  { src: "https://picsum.photos/seed/c/400/400", alt: "Photo 3" },
  { src: "https://picsum.photos/seed/d/400/400", alt: "Photo 4" },
  { src: "https://picsum.photos/seed/e/400/400", alt: "Photo 5" },
  { src: "https://picsum.photos/seed/f/400/400", alt: "Photo 6" },
  { src: "https://picsum.photos/seed/g/400/400", alt: "Photo 7" },
  { src: "https://picsum.photos/seed/h/400/400", alt: "Photo 8" },
  { src: "https://picsum.photos/seed/i/400/400", alt: "Photo 9" },
];

export const Default: Story = {
  args: { images },
};

export const TwoColumns: Story = {
  args: { images: images.slice(0, 6), cols: 2 },
};

export const FourColumns: Story = {
  args: { images, cols: 4 },
};

export const WithOverlay: Story = {
  args: { images: images.slice(0, 6), showOverlay: true },
};

export const LargeGap: Story = {
  args: { images: images.slice(0, 6), gap: "4" },
};

export const NoRounding: Story = {
  args: { images: images.slice(0, 6), rounded: "none" },
};

export const WithSpanningImages: Story = {
  args: {
    images: [
      { src: "https://picsum.photos/seed/j/800/400", alt: "Wide photo", span: 2 },
      { src: "https://picsum.photos/seed/k/400/400", alt: "Photo 2" },
      { src: "https://picsum.photos/seed/l/400/400", alt: "Photo 3" },
      { src: "https://picsum.photos/seed/m/400/400", alt: "Photo 4" },
      { src: "https://picsum.photos/seed/n/800/400", alt: "Wide photo 2", span: 2 },
    ],
    cols: 3,
  },
};

export const Clickable: Story = {
  args: {
    images: images.slice(0, 6),
    onImageClick: (image, index) => alert(`Clicked image ${index + 1}: ${image.alt}`),
    showOverlay: true,
  },
};

// Masonry layout stories

const masonryImages: ImageGridItem[] = [
  { src: "https://picsum.photos/seed/m1/400/500", alt: "Tall photo 1" },
  { src: "https://picsum.photos/seed/m2/400/300", alt: "Wide photo 2" },
  { src: "https://picsum.photos/seed/m3/400/600", alt: "Tall photo 3" },
  { src: "https://picsum.photos/seed/m4/400/350", alt: "Photo 4" },
  { src: "https://picsum.photos/seed/m5/400/450", alt: "Photo 5" },
  { src: "https://picsum.photos/seed/m6/400/280", alt: "Wide photo 6" },
  { src: "https://picsum.photos/seed/m7/400/520", alt: "Tall photo 7" },
  { src: "https://picsum.photos/seed/m8/400/380", alt: "Photo 8" },
  { src: "https://picsum.photos/seed/m9/400/440", alt: "Photo 9" },
];

export const MasonryLayout: Story = {
  args: {
    images: masonryImages,
    layout: "masonry",
    cols: 3,
  },
};

export const MasonryTwoColumns: Story = {
  args: {
    images: masonryImages,
    layout: "masonry",
    cols: 2,
    gap: "3",
  },
};

export const MasonryFourColumns: Story = {
  args: {
    images: masonryImages,
    layout: "masonry",
    cols: 4,
    gap: "2",
    rounded: "lg",
  },
};

export const MasonryWithOverlay: Story = {
  args: {
    images: masonryImages,
    layout: "masonry",
    cols: 3,
    showOverlay: true,
  },
};
