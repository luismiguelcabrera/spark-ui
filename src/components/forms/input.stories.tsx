import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";

const meta = {
  title: "Forms/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["outlined", "filled", "underlined"] },
    clearable: { control: "boolean" },
    loading: { control: "boolean" },
    iconPosition: { control: "select", options: ["left", "right"] },
    error: { control: "text" },
    hint: { control: "text" },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { placeholder: "Enter your name" } };
export const WithLabel: Story = { args: { label: "Email", placeholder: "you@example.com" } };
export const WithError: Story = {
  args: { label: "Email", placeholder: "you@example.com", error: "This field is required" },
};
export const WithHint: Story = {
  args: { label: "Password", type: "password", hint: "Must be at least 8 characters" },
};
export const WithIcon: Story = {
  args: { label: "Search", placeholder: "Search...", icon: "search", iconPosition: "left" },
};

export const Variants: Story = {
  render: (args) => (
    <div className="space-y-4 max-w-sm">
      {(["outlined", "filled", "underlined"] as const).map((variant) => (
        <div key={variant}>
          <p className="text-xs text-slate-500 mb-1 capitalize">{variant}</p>
          <Input {...args} variant={variant} placeholder={`${variant} input`} />
        </div>
      ))}
    </div>
  ),
};

export const Clearable: Story = {
  args: {
    label: "Search",
    clearable: true,
    value: "Hello world",
    placeholder: "Type to search...",
  },
};

export const Loading: Story = {
  args: {
    label: "Search",
    loading: true,
    placeholder: "Searching...",
  },
};

export const VariantsWithLabel: Story = {
  render: (args) => (
    <div className="space-y-4 max-w-sm">
      <Input {...args} variant="outlined" label="Outlined" placeholder="Outlined variant" />
      <Input {...args} variant="filled" label="Filled" placeholder="Filled variant" />
      <Input {...args} variant="underlined" label="Underlined" placeholder="Underlined variant" />
    </div>
  ),
};
