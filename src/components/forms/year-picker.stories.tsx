import type { Meta, StoryObj } from "@storybook/react-vite";
import { YearPicker } from "./year-picker";

const meta = {
  title: "Forms/YearPicker",
  component: YearPicker,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    error: { control: "text" },
    placeholder: { control: "text" },
  },
} satisfies Meta<typeof YearPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: "Graduation year" },
};

export const WithError: Story = {
  args: { label: "Year", error: "Year is required" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Preselected: Story = {
  args: { defaultValue: 2026, label: "Selected year" },
};

export const WithMinMax: Story = {
  args: {
    label: "Select year",
    defaultValue: 2025,
    minYear: 2020,
    maxYear: 2030,
  },
};
