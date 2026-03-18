import type { Meta, StoryObj } from "@storybook/react-vite";
import { Image } from "./image";

const meta = {
  title: "Data Display/Image",
  component: Image,
  tags: ["autodocs"],
  argTypes: {
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl", "full"],
    },
    objectFit: {
      control: "select",
      options: ["cover", "contain", "fill", "none", "scale-down"],
    },
    hoverEffect: {
      control: "select",
      options: [undefined, "zoom", "shine", "grayscale", "blur", "kenburns"],
    },
    hoverOverlay: { control: "boolean" },
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop",
    alt: "Mountain landscape",
    width: 400,
    aspectRatio: 16 / 9,
  },
};

export const RoundedFull: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    alt: "Profile photo",
    width: 120,
    height: 120,
    radius: "full",
  },
};

export const WithAspectRatio: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
    alt: "Nature",
    width: "100%",
    aspectRatio: 4 / 3,
    radius: "xl",
  },
};

export const ObjectContain: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
    alt: "Laptop",
    width: 400,
    height: 300,
    objectFit: "contain",
    radius: "lg",
  },
};

export const ErrorFallback: Story = {
  args: {
    src: "https://invalid-url.example.com/nonexistent.jpg",
    alt: "Broken image",
    width: 400,
    height: 250,
    radius: "lg",
  },
};

export const CustomFallback: Story = {
  args: {
    src: "https://invalid-url.example.com/nonexistent.jpg",
    alt: "Broken image",
    width: 400,
    height: 250,
    radius: "lg",
    fallback: (
      <div className="text-center">
        <p className="text-sm font-medium text-slate-500">Image not available</p>
        <p className="text-xs text-slate-400 mt-1">Please try again later</p>
      </div>
    ),
  },
};

export const NoSource: Story = {
  name: "No Source (Fallback)",
  args: {
    alt: "No image",
    width: 300,
    height: 200,
    radius: "lg",
  },
};

export const SmallRadius: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
    alt: "Landscape",
    width: 300,
    height: 200,
    radius: "sm",
  },
};

export const NoRadius: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
    alt: "Landscape",
    width: 300,
    height: 200,
    radius: "none",
  },
};

export const HoverZoom: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop",
    alt: "Mountain landscape",
    width: 400,
    aspectRatio: 16 / 9,
    radius: "xl",
    hoverEffect: "zoom",
  },
};

export const HoverShine: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop",
    alt: "Nature",
    width: 400,
    aspectRatio: 16 / 9,
    radius: "xl",
    hoverEffect: "shine",
  },
};

export const HoverGrayscale: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    alt: "Portrait",
    width: 300,
    aspectRatio: 1,
    radius: "xl",
    hoverEffect: "grayscale",
  },
};

export const HoverBlur: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
    alt: "Laptop",
    width: 400,
    aspectRatio: 16 / 9,
    radius: "xl",
    hoverEffect: "blur",
  },
};

export const HoverKenBurns: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop",
    alt: "Mountain landscape",
    width: 400,
    aspectRatio: 16 / 9,
    radius: "xl",
    hoverEffect: "kenburns",
  },
};

export const HoverEffectsGallery: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-6">
      {(["zoom", "shine", "grayscale", "blur", "kenburns"] as const).map((effect) => (
        <div key={effect}>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-2">{effect}</p>
          <Image
            {...args}
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop"
            alt={`${effect} effect`}
            width="100%"
            aspectRatio={4 / 3}
            radius="xl"
            hoverEffect={effect}
          />
        </div>
      ))}
    </div>
  ),
};

export const ZoomWithOverlay: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop",
    alt: "Nature",
    width: 400,
    aspectRatio: 16 / 9,
    radius: "xl",
    hoverEffect: "zoom",
    hoverOverlay: true,
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Landscape (16:9)</p>
        <Image
          {...args}
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop"
          alt="Mountains"
          width="100%"
          aspectRatio={16 / 9}
          radius="xl"
        />
      </div>
      <div className="flex gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Square</p>
          <Image
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
            alt="Profile"
            width={150}
            height={150}
            radius="lg"
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Circle</p>
          <Image
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
            alt="Profile circle"
            width={150}
            height={150}
            radius="full"
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Fallback</p>
          <Image
            alt="Missing"
            width={150}
            height={150}
            radius="lg"
          />
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Contain fit</p>
        <Image
          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop"
          alt="Contained"
          width="100%"
          height={200}
          objectFit="contain"
          radius="lg"
        />
      </div>
    </div>
  ),
};
