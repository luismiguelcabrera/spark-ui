import type { Meta, StoryObj } from "@storybook/react-vite";
import { Signature } from "./signature";

const meta = {
  title: "Forms/Signature",
  component: Signature,
  tags: ["autodocs"],
  argTypes: {
    width: { control: "number" },
    height: { control: "number" },
    strokeColor: { control: "color" },
    strokeWidth: { control: "number" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    error: { control: "text" },
    label: { control: "text" },
  },
} satisfies Meta<typeof Signature>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: "Your signature",
  },
};

export const Small: Story = {
  args: {
    width: 200,
    height: 100,
  },
};

export const CustomColor: Story = {
  args: {
    strokeColor: "#3b82f6",
  },
};

export const WithError: Story = {
  args: {
    error: "Signature is required",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
  },
};
