import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimePicker } from "./time-picker";

const meta = {
  title: "Forms/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
  argTypes: {
    format: { control: "select", options: ["12", "24"] },
    minuteStep: { control: "select", options: [1, 5, 10, 15, 30] },
    label: { control: "text" },
    error: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Time" },
};

export const TwentyFourHour: Story = {
  args: { label: "Time (24h)", format: "24" },
};

export const TwelveHour: Story = {
  args: { label: "Time (12h)", format: "12" },
};

export const WithDefaultValue: Story = {
  args: { label: "Meeting time", defaultValue: "14:30", format: "24" },
};

export const FiveMinuteStep: Story = {
  args: { label: "Appointment", minuteStep: 5, format: "24" },
};

export const ThirtyMinuteStep: Story = {
  args: { label: "Time slot", minuteStep: 30, format: "24" },
};

export const WithError: Story = {
  args: { label: "Time", error: "Please select a valid time" },
};

export const Disabled: Story = {
  args: { label: "Time", disabled: true, defaultValue: "09:00" },
};

export const CustomPlaceholder: Story = {
  args: { label: "Start time", placeholder: "Choose a time..." },
};

export const BothFormats: Story = {
  render: (args) => (
    <div className="flex gap-6">
      <TimePicker {...args} label="24-hour format" format="24" defaultValue="14:30" />
      <TimePicker {...args} label="12-hour format" format="12" defaultValue="14:30" />
    </div>
  ),
};
