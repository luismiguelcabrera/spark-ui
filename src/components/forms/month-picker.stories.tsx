import type { Meta, StoryObj } from "@storybook/react-vite";
import { MonthPicker } from "./month-picker";

const meta = {
  title: "Forms/MonthPicker",
  component: MonthPicker,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    error: { control: "text" },
    placeholder: { control: "text" },
  },
} satisfies Meta<typeof MonthPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: "Birth month" },
};

export const WithError: Story = {
  args: { label: "Expiry month", error: "Month is required" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Preselected: Story = {
  args: { defaultValue: { month: 2, year: 2026 }, label: "Start month" },
};

export const WithMinMax: Story = {
  args: {
    label: "Select month",
    defaultValue: { month: 5, year: 2026 },
    minDate: { month: 1, year: 2026 },
    maxDate: { month: 10, year: 2026 },
  },
};
