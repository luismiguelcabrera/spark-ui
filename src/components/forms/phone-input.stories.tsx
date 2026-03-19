import type { Meta, StoryObj } from "@storybook/react-vite";
import { PhoneInput } from "./phone-input";

const meta = {
  title: "Forms/PhoneInput",
  component: PhoneInput,
  tags: ["autodocs"],
  argTypes: {
    defaultCountry: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    error: { control: "text" },
    label: { control: "text" },
    placeholder: { control: "text" },
  },
} satisfies Meta<typeof PhoneInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: "Phone Number" },
};

export const UKDefault: Story = {
  args: { defaultCountry: "GB", label: "UK Phone" },
};

export const WithError: Story = {
  args: { error: "Please enter a valid phone number", label: "Phone" },
};

export const Disabled: Story = {
  args: { disabled: true, label: "Phone (disabled)" },
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 max-w-sm">
      <PhoneInput {...args} size="sm" label="Small" />
      <PhoneInput {...args} size="md" label="Medium" />
      <PhoneInput {...args} size="lg" label="Large" />
    </div>
  ),
};

export const PreferredCountries: Story = {
  args: {
    preferredCountries: ["US", "GB", "CA"],
    label: "Phone Number",
  },
};
