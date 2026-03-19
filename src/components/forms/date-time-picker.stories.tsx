import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateTimePicker } from "./date-time-picker";

const meta = {
  title: "Forms/DateTimePicker",
  component: DateTimePicker,
  tags: ["autodocs"],
  argTypes: {
    format: { control: "select", options: ["12", "24"] },
    minuteStep: { control: "number" },
    disabled: { control: "boolean" },
    error: { control: "text" },
    label: { control: "text" },
    placeholder: { control: "text" },
  },
} satisfies Meta<typeof DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwelveHourFormat: Story = {
  args: { format: "12" },
};

export const FiveMinuteStep: Story = {
  args: { minuteStep: 5 },
};

export const WithLabel: Story = {
  args: { label: "Event date & time" },
};

export const WithError: Story = {
  args: { label: "Appointment", error: "Date and time is required" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Preselected: Story = {
  args: { value: new Date(), label: "Current date & time" },
};

export const Controlled: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return (
      <div className="space-y-2">
        <DateTimePicker
          {...args}
          value={date}
          onChange={setDate}
          label="Pick date & time"
        />
        <p className="text-sm text-slate-500">
          Selected: {date ? date.toLocaleString() : "None"}
        </p>
      </div>
    );
  },
};
