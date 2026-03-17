import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "./progress-bar";

const meta = {
  title: "Data Display/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    size: { control: "select", options: ["sm", "md"] },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { value: 60 } };
export const Full: Story = { args: { value: 100 } };
export const Empty: Story = { args: { value: 0 } };
export const Medium: Story = { args: { value: 45, size: "md" } };
