import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar } from "./calendar";

const meta = {
  title: "Data Display/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  argTypes: {
    mode: { control: "select", options: ["single", "multiple", "range"] },
    weekStartsOn: { control: "select", options: [0, 1, 2, 3, 4, 5, 6] },
    showToday: { control: "boolean" },
    showTodayButton: { control: "boolean" },
    showSelectedLabel: { control: "boolean" },
    fixedWeeks: { control: "boolean" },
    numberOfMonths: { control: "select", options: [1, 2] },
    max: { control: "number" },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Basic ──

export const Default: Story = {
  args: { showTodayButton: true, showSelectedLabel: true },
};

export const WithEvents: Story = {
  args: { eventDays: [3, 7, 12, 18, 22, 28], defaultSelected: 12, showSelectedLabel: true },
};

// ── Multiple ──

export const MultipleDates: Story = {
  args: { mode: "multiple", defaultSelectedDates: [5, 12, 18, 25], showSelectedLabel: true },
};

// ── Range with hover preview ──

export const DateRange: Story = {
  args: { mode: "range", showSelectedLabel: true, showTodayButton: true },
};

// ── Marked Dates ──

export const MarkedDates: Story = {
  args: {
    markedDates: [
      { day: 3, color: "bg-red-500 text-white", label: "Deadline" },
      { day: 10, color: "bg-green-500 text-white", label: "Payday" },
      { day: 14, color: "bg-pink-500 text-white", label: "Valentine's Day" },
      { day: 7, dotColor: "bg-blue-500" },
      { day: 28, dotColor: "bg-green-500" },
    ],
  },
};

// ── Constraints ──

export const MinMaxDates: Story = {
  args: {
    minDate: new Date(new Date().getFullYear(), new Date().getMonth(), 5),
    maxDate: new Date(new Date().getFullYear(), new Date().getMonth(), 25),
    showTodayButton: true,
  },
};

export const DisabledDates: Story = {
  args: {
    disabledDates: [
      new Date(new Date().getFullYear(), new Date().getMonth(), 10),
      new Date(new Date().getFullYear(), new Date().getMonth(), 11),
      new Date(new Date().getFullYear(), new Date().getMonth(), 12),
      new Date(new Date().getFullYear(), new Date().getMonth(), 20),
    ],
  },
};

// ── Display Options ──

export const MondayStart: Story = {
  args: { weekStartsOn: 1 },
};

export const FixedWeeks: Story = {
  args: { fixedWeeks: true, month: "February", year: 2026 },
};

// ── UX Features ──

export const WithTodayButton: Story = {
  args: { showTodayButton: true, month: "January", year: 2025 },
};

export const WithSelectedLabel: Story = {
  args: { showSelectedLabel: true, defaultSelected: 15 },
};

// ── Dual Calendar (cross-month range) ──

export const DualCalendar: Story = {
  args: {
    mode: "range",
    numberOfMonths: 2,
    showSelectedLabel: true,
    showTodayButton: true,
  },
};

export const DualCalendarMondayStart: Story = {
  args: {
    mode: "range",
    numberOfMonths: 2,
    weekStartsOn: 1,
    showSelectedLabel: true,
    fixedWeeks: true,
  },
};

export const DualCalendarWithEvents: Story = {
  args: {
    mode: "range",
    numberOfMonths: 2,
    eventDays: [3, 7, 12, 18, 22, 28],
    showSelectedLabel: true,
    markedDates: [
      { day: 1, color: "bg-red-100 text-red-700", label: "Holiday" },
      { day: 15, dotColor: "bg-green-500" },
    ],
  },
};

export const ThreeMonths: Story = {
  args: {
    mode: "range",
    numberOfMonths: 3,
    showSelectedLabel: true,
    showTodayButton: true,
  },
};

export const CrossMonthRange: Story = {
  args: {
    mode: "range",
    showSelectedLabel: true,
    showTodayButton: true,
  },
};

export const FullFeatured: Story = {
  args: {
    mode: "range",
    weekStartsOn: 1,
    fixedWeeks: true,
    showToday: true,
    showTodayButton: true,
    showSelectedLabel: true,
    eventDays: [5, 15, 22],
    markedDates: [
      { day: 1, color: "bg-red-100 text-red-700", label: "Holiday" },
      { day: 25, dotColor: "bg-green-500" },
    ],
  },
};
