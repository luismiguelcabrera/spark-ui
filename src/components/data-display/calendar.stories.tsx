import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar } from "./calendar";

const meta = {
  title: "Data Display/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "select",
      options: ["single", "multiple", "range"],
    },
    month: {
      control: "select",
      options: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ],
    },
    year: { control: "number" },
    selected: { control: "number" },
    max: { control: "number" },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Single Mode ──

export const Default: Story = {};

export const WithSelectedDate: Story = {
  args: {
    defaultSelected: 15,
  },
};

export const SpecificMonth: Story = {
  args: {
    month: "December",
    year: 2025,
    defaultSelected: 25,
  },
};

export const WithEvents: Story = {
  args: {
    eventDays: [3, 7, 12, 18, 22, 28],
    defaultSelected: 12,
  },
};

// ── Multiple Mode ──

export const MultipleDates: Story = {
  args: {
    mode: "multiple",
    defaultSelectedDates: [5, 12, 18, 25],
  },
};

export const MultipleWithMax: Story = {
  args: {
    mode: "multiple",
    max: 3,
    defaultSelectedDates: [10, 20],
  },
};

export const MultipleWithEvents: Story = {
  args: {
    mode: "multiple",
    eventDays: [1, 8, 15, 22],
    defaultSelectedDates: [8, 15],
  },
};

// ── Range Mode ──

export const DateRange: Story = {
  args: {
    mode: "range",
    defaultSelectedRange: [10, 20],
  },
};

export const RangeWithEvents: Story = {
  args: {
    mode: "range",
    eventDays: [5, 12, 18, 25],
    defaultSelectedRange: [8, 22],
  },
};

// ── Marked Dates ──

export const MarkedDates: Story = {
  args: {
    markedDates: [
      { day: 3, color: "bg-red-500 text-white", label: "Deadline" },
      { day: 10, color: "bg-green-500 text-white", label: "Payday" },
      { day: 14, color: "bg-pink-500 text-white", label: "Valentine's Day" },
      { day: 22, color: "bg-amber-500 text-white", label: "Meeting" },
      { day: 7, dotColor: "bg-blue-500" },
      { day: 15, dotColor: "bg-red-500" },
      { day: 28, dotColor: "bg-green-500" },
    ],
  },
};

export const MarkedWithHexColors: Story = {
  args: {
    markedDates: [
      { day: 5, color: "#ef4444", label: "Holiday" },
      { day: 12, color: "#22c55e", label: "Birthday" },
      { day: 20, color: "#f59e0b", label: "Reminder" },
      { day: 8, dotColor: "#3b82f6" },
      { day: 16, dotColor: "#a855f7" },
    ],
  },
};

export const MarkedWithSelection: Story = {
  args: {
    mode: "multiple",
    defaultSelectedDates: [10, 20],
    markedDates: [
      { day: 1, color: "bg-red-100 text-red-700", label: "Holiday" },
      { day: 15, color: "bg-green-100 text-green-700", label: "Payday" },
      { day: 25, color: "bg-blue-100 text-blue-700", label: "Event" },
      { day: 5, dotColor: "bg-orange-400" },
      { day: 18, dotColor: "bg-purple-400" },
    ],
  },
};

// ── Other ──

export const January2026: Story = {
  args: {
    month: "January",
    year: 2026,
    defaultSelected: 1,
    eventDays: [1, 15, 20],
  },
};
