import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonGroup } from "./button-group";
import { Button } from "./button";

const meta = {
  title: "Forms/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  argTypes: {
    attached: { control: "boolean" },
    direction: { control: "select", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Left</Button>
      <Button variant="outline">Center</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  ),
};

export const Attached: Story = {
  render: (args) => (
    <ButtonGroup {...args} attached>
      <Button variant="outline">Left</Button>
      <Button variant="outline">Center</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  render: (args) => (
    <ButtonGroup {...args} direction="vertical">
      <Button variant="outline">Top</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Bottom</Button>
    </ButtonGroup>
  ),
};

export const VerticalAttached: Story = {
  render: (args) => (
    <ButtonGroup {...args} direction="vertical" attached>
      <Button variant="outline">Top</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Bottom</Button>
    </ButtonGroup>
  ),
};

export const MixedVariants: Story = {
  render: (args) => (
    <ButtonGroup {...args} attached>
      <Button variant="solid" color="primary">Save</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="ghost" color="destructive">Delete</Button>
    </ButtonGroup>
  ),
};
