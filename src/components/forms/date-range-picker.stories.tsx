import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateRangePicker } from "./date-range-picker";
import type { DateRange } from "./date-range-picker";

const meta = {
  title: "Forms/DateRangePicker",
  component: DateRangePicker,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    label: { control: "text" },
    error: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const DateRangePickerDemo = (props: Partial<React.ComponentProps<typeof DateRangePicker>>) => {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return <DateRangePicker value={range} onChange={setRange} {...props} />;
};

export const Default: Story = {
  render: (args) => <DateRangePickerDemo {...args} />,
};

export const WithLabel: Story = {
  render: (args) => <DateRangePickerDemo {...args} label="Date Range" />,
};

export const WithPlaceholder: Story = {
  render: (args) => <DateRangePickerDemo {...args} placeholder="Pick a date range" label="Booking dates" />,
};

export const WithError: Story = {
  render: (args) => <DateRangePickerDemo {...args} label="Date Range" error="Please select a valid date range" />,
};

export const Disabled: Story = {
  render: (args) => <DateRangePickerDemo {...args} label="Date Range" disabled />,
};

export const WithPreselectedRange: Story = {
  render: (args) => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const [range, setRange] = useState<DateRange>({ start: today, end: nextWeek });
    return <DateRangePicker {...args} value={range} onChange={setRange} label="Trip dates" />;
  },
};

export const WithMinMaxDate: Story = {
  render: (args) => {
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    return (
      <DateRangePickerDemo
        {...args}
        label="Select within this quarter"
        minDate={minDate}
        maxDate={maxDate}
      />
    );
  },
};
