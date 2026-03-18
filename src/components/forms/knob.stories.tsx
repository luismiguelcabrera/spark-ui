import type { Meta, StoryObj } from "@storybook/react-vite";
import { Knob } from "./knob";

const meta = {
  title: "Forms/Knob",
  component: Knob,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "secondary", "success", "warning", "destructive"],
    },
    showValue: { control: "boolean" },
    disabled: { control: "boolean" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    size: { control: "number" },
  },
} satisfies Meta<typeof Knob>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: 50, label: "Volume" },
};

export const Colors: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-8 items-end">
      {(["primary", "secondary", "success", "warning", "destructive"] as const).map(
        (color) => (
          <div key={color} className="flex flex-col items-center gap-2">
            <Knob {...args} color={color} defaultValue={60} label={color} />
          </div>
        ),
      )}
    </div>
  ),
};

export const CustomRange: Story = {
  args: {
    defaultValue: 25,
    min: 0,
    max: 50,
    step: 5,
    label: "Temperature",
  },
};

export const WithLabel: Story = {
  args: {
    defaultValue: 75,
    label: "Brightness",
    color: "warning",
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-8 items-end">
      <Knob {...args} defaultValue={20} size={80} label="Small" color="primary" />
      <Knob {...args} defaultValue={50} size={100} label="Medium" color="success" />
      <Knob {...args} defaultValue={80} size={140} label="Large" color="destructive" />
      <Knob {...args} defaultValue={30} size={100} label="No value" showValue={false} />
      <Knob {...args} defaultValue={60} size={100} label="Disabled" disabled />
    </div>
  ),
};
