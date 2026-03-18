import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fab } from "./fab";

const meta = {
  title: "Forms/Fab",
  component: Fab,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "select", options: ["primary", "secondary", "destructive", "success"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    position: { control: "select", options: ["bottom-right", "bottom-left", "top-right", "top-left"] },
    extended: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Fab>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { icon: "plus", "aria-label": "Add item" },
};

export const Extended: Story = {
  args: { icon: "plus", extended: true, label: "Create new" },
};

export const Colors: Story = {
  render: (args) => (
    <div className="flex gap-4 items-center">
      {(["primary", "secondary", "destructive", "success"] as const).map((color) => (
        <Fab key={color} {...args} icon="plus" color={color} aria-label={`Add ${color}`} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex gap-4 items-center">
      <Fab {...args} icon="plus" size="sm" aria-label="Small" />
      <Fab {...args} icon="plus" size="md" aria-label="Medium" />
      <Fab {...args} icon="plus" size="lg" aria-label="Large" />
    </div>
  ),
};

export const ExtendedSizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 items-start">
      <Fab {...args} icon="plus" size="sm" extended label="Small" />
      <Fab {...args} icon="plus" size="md" extended label="Medium" />
      <Fab {...args} icon="plus" size="lg" extended label="Large" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { icon: "plus", disabled: true, "aria-label": "Add item" },
};
