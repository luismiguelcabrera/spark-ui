import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "./icon";

const meta = {
  title: "Data Display/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    filled: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Renders an icon by string name via the 3-tier resolution system (IconProvider → built-in SVGs → Material Symbols font fallback). See **Icons / Icon Gallery** for the full browsable catalog.",
      },
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: "home", size: "lg" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      <Icon {...args} name="star" size="sm" />
      <Icon {...args} name="star" size="md" />
      <Icon {...args} name="star" size="lg" />
      <Icon {...args} name="star" size="xl" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Icon {...args} name="heart" size="lg" className="text-red-500" />
      <Icon {...args} name="check-circle" size="lg" className="text-green-500" />
      <Icon {...args} name="alert-triangle" size="lg" className="text-amber-500" />
      <Icon {...args} name="info" size="lg" className="text-blue-500" />
      <Icon {...args} name="star" size="lg" className="text-purple-500" />
    </div>
  ),
};

export const MaterialSymbolsFallback: Story = {
  args: {
    name: "deployed_code",
    size: "xl",
  },
};
