import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "./date-picker";

const meta = {
  title: "Forms/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    label: { control: "text" },
    error: { control: "text" },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: "Start date" },
};

export const WithPlaceholder: Story = {
  args: { placeholder: "Choose a date..." },
};

export const WithError: Story = {
  args: { label: "Due date", error: "Date is required" },
};

export const PreselectedDate: Story = {
  args: { value: new Date(2025, 5, 15), label: "Event date" },
};

export const Controlled: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return (
      <div className="space-y-2">
        <DatePicker {...args} value={date} onChange={setDate} label="Pick a date" />
        <p className="text-sm text-slate-500">
          Selected: {date ? date.toLocaleDateString() : "None"}
        </p>
      </div>
    );
  },
};
