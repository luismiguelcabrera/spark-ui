import type { Meta, StoryObj } from "@storybook/react-vite";
import { NativeSelect } from "./native-select";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
];

const meta = {
  title: "Forms/NativeSelect",
  component: NativeSelect,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    variant: { control: "select", options: ["outline", "filled", "unstyled"] },
    disabled: { control: "boolean" },
    error: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    placeholder: { control: "text" },
  },
  args: { options },
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "Select a framework" },
};

export const WithLabel: Story = {
  args: { label: "Framework", placeholder: "Select a framework" },
};

export const WithDescription: Story = {
  args: {
    label: "Framework",
    description: "Choose your preferred frontend framework",
    placeholder: "Select...",
  },
};

export const WithError: Story = {
  args: { label: "Framework", error: "Selection is required", placeholder: "Select..." },
};

export const Disabled: Story = {
  args: { label: "Framework", disabled: true, defaultValue: "react" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-3 max-w-sm">
      {(["sm", "md", "lg"] as const).map((size) => (
        <NativeSelect key={size} {...args} size={size} label={`Size: ${size}`} placeholder="Select..." />
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="space-y-3 max-w-sm">
      {(["outline", "filled", "unstyled"] as const).map((variant) => (
        <NativeSelect
          key={variant}
          {...args}
          variant={variant}
          label={`Variant: ${variant}`}
          placeholder="Select..."
        />
      ))}
    </div>
  ),
};

export const WithDisabledOptions: Story = {
  args: {
    label: "Framework",
    placeholder: "Select...",
    options: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue", disabled: true },
      { value: "angular", label: "Angular" },
      { value: "svelte", label: "Svelte", disabled: true },
    ],
  },
};
