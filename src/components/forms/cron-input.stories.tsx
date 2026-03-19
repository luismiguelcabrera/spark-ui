import type { Meta, StoryObj } from "@storybook/react-vite";
import { CronInput } from "./cron-input";

const meta = {
  title: "Forms/CronInput",
  component: CronInput,
  tags: ["autodocs"],
  argTypes: {
    mode: { control: "select", options: ["basic", "advanced"] },
    disabled: { control: "boolean" },
    error: { control: "text" },
    label: { control: "text" },
  },
} satisfies Meta<typeof CronInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Advanced: Story = {
  args: {
    mode: "advanced",
    defaultValue: "0 9 * * 1-5",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Job Schedule",
  },
};

export const WithError: Story = {
  args: {
    error: "Invalid cron expression",
    defaultValue: "0 9 * * *",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "0 9 * * *",
  },
};

export const DailyPreset: Story = {
  args: {
    defaultValue: "0 9 * * *",
  },
};

export const WeekdaysPreset: Story = {
  args: {
    defaultValue: "0 9 * * 1-5",
  },
};

export const CustomCron: Story = {
  args: {
    defaultValue: "*/15 * * * *",
  },
};
