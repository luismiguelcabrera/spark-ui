import type { Meta, StoryObj } from "@storybook/react-vite";
import { CurrencyInput } from "./currency-input";

const meta = {
  title: "Forms/CurrencyInput",
  component: CurrencyInput,
  tags: ["autodocs"],
  argTypes: {
    currency: {
      control: "select",
      options: ["USD", "EUR", "GBP", "JPY"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    precision: { control: "number" },
    disabled: { control: "boolean" },
    error: { control: "text" },
    allowNegative: { control: "boolean" },
  },
} satisfies Meta<typeof CurrencyInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: 99.99, label: "Amount" },
};

export const Euro: Story = {
  args: {
    defaultValue: 49.99,
    currency: "EUR",
    locale: "de-DE",
    label: "Betrag",
  },
};

export const BritishPound: Story = {
  args: {
    defaultValue: 29.99,
    currency: "GBP",
    locale: "en-GB",
    label: "Amount",
  },
};

export const JapaneseYen: Story = {
  args: {
    defaultValue: 5000,
    currency: "JPY",
    locale: "ja-JP",
    precision: 0,
    label: "Amount",
  },
};

export const WithError: Story = {
  args: {
    defaultValue: 0,
    label: "Donation",
    error: "Please enter an amount",
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 150,
    label: "Total",
    disabled: true,
  },
};

export const Negative: Story = {
  args: {
    defaultValue: -25.5,
    allowNegative: true,
    label: "Adjustment",
  },
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="space-y-4 max-w-xs">
      <CurrencyInput {...args} size="sm" defaultValue={10} label="Small" />
      <CurrencyInput {...args} size="md" defaultValue={100} label="Medium" />
      <CurrencyInput {...args} size="lg" defaultValue={1000} label="Large" />
    </div>
  ),
};

export const LargeValue: Story = {
  args: {
    defaultValue: 1234567.89,
    label: "Revenue",
  },
};
