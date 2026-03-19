import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { WeekPicker } from "./week-picker";
import type { WeekPickerValue } from "./week-picker";

const meta = {
  title: "Forms/WeekPicker",
  component: WeekPicker,
  tags: ["autodocs"],
  argTypes: {
    weekStartsOn: { control: "select", options: [0, 1] },
    disabled: { control: "boolean" },
    error: { control: "text" },
    label: { control: "text" },
    placeholder: { control: "text" },
  },
} satisfies Meta<typeof WeekPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: "Reporting week" },
};

export const WithError: Story = {
  args: { label: "Sprint week", error: "Week is required" },
};

export const Disabled: Story = {
  args: { disabled: true, label: "Week" },
};

export const Preselected: Story = {
  args: { defaultValue: { year: 2026, week: 12 }, label: "Selected week" },
};

export const SundayStart: Story = {
  args: { weekStartsOn: 0, label: "Week (Sun start)" },
};

export const Controlled: Story = {
  render: (args) => {
    const [week, setWeek] = useState<WeekPickerValue | undefined>(undefined);
    return (
      <div className="space-y-2">
        <WeekPicker {...args} value={week} onChange={setWeek} label="Pick a week" />
        <p className="text-sm text-slate-500">
          Selected: {week ? `Week ${week.week}, ${week.year}` : "None"}
        </p>
      </div>
    );
  },
};
