import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./switch";

const meta = {
  title: "Forms/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    color: { control: "select", options: ["primary", "secondary", "success", "warning", "destructive", "accent"] },
    labelPlacement: { control: "select", options: ["left", "right"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Enable notifications" },
};

export const WithDescription: Story = {
  args: { label: "Marketing emails", description: "Receive emails about new products and features" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-4">
      <Switch {...args} size="sm" label="Small" />
      <Switch {...args} size="md" label="Medium" />
      <Switch {...args} size="lg" label="Large" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div className="space-y-4">
      {(["primary", "secondary", "success", "warning", "destructive", "accent"] as const).map((color) => (
        <Switch {...args} key={color} color={color} defaultChecked label={color} />
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: "Disabled switch", disabled: true, defaultChecked: true },
};
