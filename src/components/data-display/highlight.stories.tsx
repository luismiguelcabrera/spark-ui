import type { Meta, StoryObj } from "@storybook/react-vite";
import { Highlight } from "./highlight";

const meta = {
  title: "Data Display/Highlight",
  component: Highlight,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["yellow", "green", "blue", "pink", "purple", "orange"],
    },
  },
} satisfies Meta<typeof Highlight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "highlighted text" },
};

export const Yellow: Story = {
  args: { children: "yellow highlight", color: "yellow" },
};

export const Green: Story = {
  args: { children: "green highlight", color: "green" },
};

export const Blue: Story = {
  args: { children: "blue highlight", color: "blue" },
};

export const Pink: Story = {
  args: { children: "pink highlight", color: "pink" },
};

export const Purple: Story = {
  args: { children: "purple highlight", color: "purple" },
};

export const Orange: Story = {
  args: { children: "orange highlight", color: "orange" },
};

export const AllColors: Story = {
  render: (args) => (
    <p className="text-slate-700 leading-loose">
      You can use{" "}
      <Highlight {...args} color="yellow">yellow</Highlight>,{" "}
      <Highlight {...args} color="green">green</Highlight>,{" "}
      <Highlight {...args} color="blue">blue</Highlight>,{" "}
      <Highlight {...args} color="pink">pink</Highlight>,{" "}
      <Highlight {...args} color="purple">purple</Highlight>, and{" "}
      <Highlight {...args} color="orange">orange</Highlight>{" "}
      highlights to emphasize different parts of your text.
    </p>
  ),
};

export const InParagraph: Story = {
  render: (args) => (
    <p className="text-slate-700 max-w-prose leading-relaxed">
      The <Highlight {...args} color="blue">Spark UI</Highlight> component library provides a{" "}
      <Highlight {...args} color="green">Highlight component</Highlight> that can be used to draw
      attention to <Highlight {...args} color="pink">important text</Highlight> within paragraphs.
      It supports <Highlight {...args} color="purple">six different colors</Highlight> out of the box.
    </p>
  ),
};
