import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "./icon-button";

const meta = {
  title: "Forms/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "ghost", "outline"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    icon: { control: "text" },
    filled: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { icon: "settings", "aria-label": "Settings" },
};

export const Ghost: Story = {
  args: { icon: "close", variant: "ghost", "aria-label": "Close" },
};

export const Outline: Story = {
  args: { icon: "edit", variant: "outline", "aria-label": "Edit" },
};

export const Filled: Story = {
  args: { icon: "favorite", filled: true, "aria-label": "Favorite" },
};

export const Disabled: Story = {
  args: { icon: "delete", disabled: true, "aria-label": "Delete" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <IconButton key={size} {...args} size={size} icon="settings" aria-label={`Settings ${size}`} />
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["default", "ghost", "outline"] as const).map((variant) => (
        <IconButton key={variant} {...args} variant={variant} icon="more_vert" aria-label={`More ${variant}`} />
      ))}
    </div>
  ),
};
