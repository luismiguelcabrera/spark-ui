import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "./radio-group";

const basicOptions = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

const cardOptions = [
  { label: "Startup", value: "startup", description: "Up to 5 team members", icon: "rocket_launch" },
  { label: "Business", value: "business", description: "Up to 50 team members", icon: "business" },
  { label: "Enterprise", value: "enterprise", description: "Unlimited members", icon: "corporate_fare" },
];

const meta = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["basic", "card"] },
    orientation: { control: "select", options: ["vertical", "horizontal"] },
  },
  args: {
    options: basicOptions,
    name: "size",
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: { defaultValue: "md" },
};

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
};

export const Card: Story = {
  args: { variant: "card", options: cardOptions, name: "plan" },
};

export const CardHorizontal: Story = {
  args: { variant: "card", options: cardOptions, name: "plan-h", orientation: "horizontal" },
};

export const CardWithDefault: Story = {
  args: { variant: "card", options: cardOptions, name: "plan-def", defaultValue: "business" },
};
