import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./card";

const meta = {
  title: "Data Display/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "glass", "elevated", "outline"] },
    padding: { control: "select", options: ["none", "sm", "md", "lg"] },
    loading: { control: "boolean" },
    hoverable: { control: "boolean" },
    clickable: { control: "boolean" },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Card content goes here." } };
export const WithTitle: Story = {
  args: { title: "Card Title", subtitle: "A subtitle", children: "Body content" },
};
export const WithFooter: Story = {
  args: { children: "Card body", footer: "Footer content" },
};
export const Outline: Story = {
  args: { variant: "outline", children: "Outline card" },
};

export const Loading: Story = {
  args: { loading: true, title: "Loading Card", subtitle: "Content is loading...", children: "This content is hidden behind the loading overlay." },
};

export const LoadingRaw: Story = {
  args: { loading: true, children: "Raw card content hidden behind loading overlay." },
};

export const Hoverable: Story = {
  render: (args) => (
    <div className="flex gap-4">
      <Card {...args} hoverable>
        <p className="text-sm text-slate-600">Hover over me to see the shadow elevation effect.</p>
      </Card>
      <Card {...args} hoverable variant="outline">
        <p className="text-sm text-slate-600">Outline card with hover effect.</p>
      </Card>
    </div>
  ),
};

export const Clickable: Story = {
  render: (args) => (
    <Card
      {...args}
      clickable
      hoverable
      onClick={() => alert("Card clicked!")}
    >
      <p className="text-sm text-slate-600">Click me! I have cursor-pointer and interactive styles.</p>
    </Card>
  ),
};

export const InteractiveWithTitle: Story = {
  args: {
    title: "Interactive Card",
    subtitle: "Click anywhere on this card",
    clickable: true,
    hoverable: true,
    children: "This card has both hoverable and clickable enabled with a title header.",
  },
};
