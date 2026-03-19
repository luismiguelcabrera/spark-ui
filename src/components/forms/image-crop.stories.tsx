import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageCrop } from "./image-crop";

const PLACEHOLDER_SRC = "https://picsum.photos/seed/spark/800/600";

const meta = {
  title: "Forms/ImageCrop",
  component: ImageCrop,
  tags: ["autodocs"],
  argTypes: {
    aspectRatio: { control: "number" },
    shape: { control: "select", options: ["rect", "round"] },
    zoom: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "text" },
    label: { control: "text" },
  },
} satisfies Meta<typeof ImageCrop>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: PLACEHOLDER_SRC,
  },
};

export const Square: Story = {
  args: {
    src: PLACEHOLDER_SRC,
    aspectRatio: 1,
  },
};

export const Round: Story = {
  args: {
    src: PLACEHOLDER_SRC,
    shape: "round",
    aspectRatio: 1,
  },
};

export const WithLabel: Story = {
  args: {
    src: PLACEHOLDER_SRC,
    label: "Profile photo",
  },
};

export const NoZoom: Story = {
  args: {
    src: PLACEHOLDER_SRC,
    zoom: false,
  },
};

export const WithError: Story = {
  args: {
    src: PLACEHOLDER_SRC,
    error: "Image resolution is too low. Please use at least 800x600.",
  },
};

export const Disabled: Story = {
  args: {
    src: PLACEHOLDER_SRC,
    disabled: true,
  },
};
