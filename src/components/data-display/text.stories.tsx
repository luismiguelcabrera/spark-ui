import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./text";

const meta = {
  title: "Data Display/Text",
  component: Text,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    weight: { control: "select", options: ["normal", "medium", "semibold", "bold"] },
    color: {
      control: "select",
      options: ["default", "muted", "subtle", "primary", "secondary", "success", "warning", "destructive"],
    },
    align: { control: "select", options: ["left", "center", "right", "justify"] },
    leading: { control: "select", options: ["none", "tight", "snug", "normal", "relaxed", "loose"] },
    truncate: { control: "boolean" },
    as: { control: "select", options: ["p", "span", "div", "label", "strong", "em", "small", "del", "ins", "mark"] },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-2">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Text {...args} key={size} size={size}>
          Size {size}: The quick brown fox jumps over the lazy dog.
        </Text>
      ))}
    </div>
  ),
};

export const Weights: Story = {
  render: (args) => (
    <div className="space-y-2">
      {(["normal", "medium", "semibold", "bold"] as const).map((weight) => (
        <Text {...args} key={weight} weight={weight}>
          Weight {weight}: The quick brown fox jumps over the lazy dog.
        </Text>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div className="space-y-2">
      {(["default", "muted", "subtle", "primary", "secondary", "success", "warning", "destructive"] as const).map((color) => (
        <Text {...args} key={color} color={color}>
          Color {color}: The quick brown fox jumps over the lazy dog.
        </Text>
      ))}
    </div>
  ),
};

export const Alignment: Story = {
  render: (args) => (
    <div className="space-y-4 max-w-md border p-4 rounded-lg">
      <Text {...args} align="left">Left aligned text</Text>
      <Text {...args} align="center">Center aligned text</Text>
      <Text {...args} align="right">Right aligned text</Text>
      <Text {...args} align="justify">
        Justified text: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Text>
    </div>
  ),
};

export const Truncated: Story = {
  args: {
    children: "This is a very long text that will be truncated when it overflows its container width boundary.",
    truncate: true,
    className: "max-w-xs",
  },
};

export const LineHeight: Story = {
  render: (args) => (
    <div className="space-y-6 max-w-md">
      {(["tight", "snug", "normal", "relaxed", "loose"] as const).map((leading) => (
        <div key={leading}>
          <Text {...args} size="xs" color="muted" weight="semibold" className="mb-1">
            leading=&quot;{leading}&quot;
          </Text>
          <Text {...args} leading={leading}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </div>
      ))}
    </div>
  ),
};

export const SemanticElements: Story = {
  render: (args) => (
    <div className="space-y-2">
      <Text {...args} as="p">Paragraph (p)</Text>
      <Text {...args} as="span">Span element</Text>
      <Text {...args} as="strong" weight="bold">Strong element</Text>
      <Text {...args} as="em">Emphasis element</Text>
      <Text {...args} as="small" size="sm">Small element</Text>
      <Text {...args} as="del" color="destructive">Deleted text</Text>
      <Text {...args} as="ins" color="success">Inserted text</Text>
      <Text {...args} as="mark">Marked text</Text>
    </div>
  ),
};

export const Combined: Story = {
  args: {
    children: "Bold, large, primary text",
    size: "xl",
    weight: "bold",
    color: "primary",
    align: "center",
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="max-w-lg space-y-6">
      <div>
        <Text {...args} size="xl" weight="bold">Heading-style Text</Text>
        <Text {...args} color="muted" size="sm">Supporting description below the heading</Text>
      </div>
      <div>
        <Text {...args} size="lg" weight="semibold" color="primary">$128,400</Text>
        <Text {...args} size="sm" color="success">+12.5% from last month</Text>
      </div>
      <div className="p-4 bg-red-50 rounded-lg">
        <Text {...args} weight="semibold" color="destructive">Error: Something went wrong</Text>
        <Text {...args} size="sm" color="muted">Please try again later or contact support.</Text>
      </div>
    </div>
  ),
};
