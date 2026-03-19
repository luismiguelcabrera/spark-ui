import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "./heading";

const meta = {
  title: "Data Display/Heading",
  component: Heading,
  tags: ["autodocs"],
  argTypes: {
    as: { control: "select", options: ["h1", "h2", "h3", "h4", "h5", "h6"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] },
    weight: { control: "select", options: ["normal", "medium", "semibold", "bold", "extrabold", "black"] },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Default Heading" },
};

export const H1: Story = {
  args: { as: "h1", size: "4xl", children: "Heading Level 1" },
};

export const H2: Story = {
  args: { as: "h2", size: "2xl", children: "Heading Level 2" },
};

export const H3: Story = {
  args: { as: "h3", size: "lg", children: "Heading Level 3" },
};

export const H4: Story = {
  args: { as: "h4", size: "md", children: "Heading Level 4" },
};

export const H5: Story = {
  args: { as: "h5", size: "sm", children: "Heading Level 5" },
};

export const H6: Story = {
  args: { as: "h6", size: "xs", children: "Heading Level 6" },
};

export const AllLevels: Story = {
  render: (args) => (
    <div className="space-y-4">
      <Heading {...args} as="h1" size="4xl">h1 — Page Title (4xl)</Heading>
      <Heading {...args} as="h1" size="3xl">h1 — Hero Title (3xl)</Heading>
      <Heading {...args} as="h2" size="2xl">h2 — Section Title (2xl)</Heading>
      <Heading {...args} as="h2" size="xl">h2 — Subsection (xl)</Heading>
      <Heading {...args} as="h3" size="lg">h3 — Card Title (lg)</Heading>
      <Heading {...args} as="h4" size="md">h4 — Label (md)</Heading>
      <Heading {...args} as="h5" size="sm">h5 — Caption (sm)</Heading>
      <Heading {...args} as="h6" size="xs">h6 — Overline (xs)</Heading>
    </div>
  ),
};

export const Weights: Story = {
  render: (args) => (
    <div className="space-y-3">
      {(["normal", "medium", "semibold", "bold", "extrabold", "black"] as const).map((w) => (
        <Heading key={w} {...args} size="xl" weight={w}>
          {w} weight
        </Heading>
      ))}
    </div>
  ),
};

export const AutomaticLevelMapping: Story = {
  render: (args) => (
    <div className="space-y-3">
      <p className="text-sm text-slate-500 mb-4">
        Without specifying &ldquo;as&rdquo;, the heading level is inferred from the size prop.
      </p>
      <Heading {...args} size="4xl">4xl maps to h1</Heading>
      <Heading {...args} size="2xl">2xl maps to h2</Heading>
      <Heading {...args} size="lg">lg maps to h3</Heading>
      <Heading {...args} size="md">md maps to h4</Heading>
      <Heading {...args} size="sm">sm maps to h5</Heading>
      <Heading {...args} size="xs">xs maps to h6</Heading>
    </div>
  ),
};
