import type { Meta, StoryObj } from "@storybook/react-vite";
import { Parallax } from "./parallax";

const meta = {
  title: "Data Display/Parallax",
  component: Parallax,
  tags: ["autodocs"],
  argTypes: {
    height: { control: { type: "number", min: 100, max: 800, step: 50 } },
    scale: { control: { type: "number", min: 1, max: 3, step: 0.1 } },
    src: { control: "text" },
    alt: { control: "text" },
  },
} satisfies Meta<typeof Parallax>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
    alt: "Mountain landscape",
    height: 400,
  },
};

export const CustomScale: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
    alt: "Mountain landscape",
    height: 400,
    scale: 2,
  },
};

export const ShortContainer: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
    alt: "Mountain landscape",
    height: 200,
    scale: 1.5,
  },
};

export const InPageContext: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
    alt: "Scenic parallax",
    height: 350,
  },
  render: (args) => (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto space-y-4 px-4">
        <h2 className="text-2xl font-bold text-slate-900">Section Above</h2>
        <p className="text-slate-600">
          Scroll down to see the parallax effect. The image moves at a
          different rate than the page scroll, creating depth.
        </p>
      </div>
      <Parallax {...args} />
      <div className="max-w-2xl mx-auto space-y-4 px-4">
        <h2 className="text-2xl font-bold text-slate-900">Section Below</h2>
        <p className="text-slate-600">
          The parallax container clips the image and translates it based on
          scroll position, creating a smooth depth illusion.
        </p>
      </div>
    </div>
  ),
};

export const WithRoundedCorners: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
    alt: "Rounded parallax",
    height: 300,
    className: "rounded-2xl mx-8",
  },
};
