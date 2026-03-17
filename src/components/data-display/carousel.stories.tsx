import type { Meta, StoryObj } from "@storybook/react-vite";
import { Carousel } from "./carousel";

const meta = {
  title: "Data Display/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  argTypes: {
    slidesPerView: { control: { type: "number", min: 1, max: 5 } },
    gap: { control: { type: "number", min: 0, max: 32 } },
    autoPlay: { control: { type: "number", min: 0, max: 10000 } },
    showArrows: { control: "boolean" },
    showDots: { control: "boolean" },
    loop: { control: "boolean" },
    pauseOnHover: { control: "boolean" },
    align: { control: "select", options: ["start", "center", "end"] },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const Slide = ({ color, label }: { color: string; label: string }) => (
  <div
    className={`flex items-center justify-center h-48 rounded-xl text-white font-bold text-xl ${color}`}
  >
    {label}
  </div>
);

const slides = [
  <Slide key="1" color="bg-blue-500" label="Slide 1" />,
  <Slide key="2" color="bg-green-500" label="Slide 2" />,
  <Slide key="3" color="bg-purple-500" label="Slide 3" />,
  <Slide key="4" color="bg-orange-500" label="Slide 4" />,
  <Slide key="5" color="bg-pink-500" label="Slide 5" />,
  <Slide key="6" color="bg-teal-500" label="Slide 6" />,
];

export const Default: Story = {
  render: (args) => (
    <div className="max-w-2xl mx-auto">
      <Carousel {...args}>{slides}</Carousel>
    </div>
  ),
};

export const MultipleSlidesPerView: Story = {
  args: { slidesPerView: 3, gap: 16 },
  render: (args) => (
    <div className="max-w-3xl mx-auto">
      <Carousel {...args}>{slides}</Carousel>
    </div>
  ),
};

export const AutoPlay: Story = {
  args: { autoPlay: 3000, loop: true },
  render: (args) => (
    <div className="max-w-2xl mx-auto">
      <Carousel {...args}>{slides}</Carousel>
    </div>
  ),
};

export const WithLoop: Story = {
  args: { loop: true },
  render: (args) => (
    <div className="max-w-2xl mx-auto">
      <Carousel {...args}>{slides}</Carousel>
    </div>
  ),
};

export const NoDots: Story = {
  args: { showDots: false },
  render: (args) => (
    <div className="max-w-2xl mx-auto">
      <Carousel {...args}>{slides}</Carousel>
    </div>
  ),
};

export const NoArrows: Story = {
  args: { showArrows: false },
  render: (args) => (
    <div className="max-w-2xl mx-auto">
      <Carousel {...args}>{slides}</Carousel>
    </div>
  ),
};

export const TwoPerView: Story = {
  args: { slidesPerView: 2, gap: 12 },
  render: (args) => (
    <div className="max-w-3xl mx-auto">
      <Carousel {...args}>{slides}</Carousel>
    </div>
  ),
};
