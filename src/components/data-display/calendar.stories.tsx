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
    fixedWeeks: { control: "boolean" },
    max: { control: "number" },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Basic ──

export const Default: Story = {};

export const WithSelectedDate: Story = {
  args: { defaultSelected: 15 },
};

export const WithEvents: Story = {
  args: { eventDays: [3, 7, 12, 18, 22, 28], defaultSelected: 12 },
};

// ── Multiple Mode ──

export const MultipleDates: Story = {
  args: { mode: "multiple", defaultSelectedDates: [5, 12, 18, 25] },
};

export const MultipleWithMax: Story = {
  args: { mode: "multiple", max: 3, defaultSelectedDates: [10, 20] },
};

// ── Range Mode ──

export const DateRange: Story = {
  args: { mode: "range", defaultSelectedRange: [10, 20] },
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

export const HideToday: Story = {
  args: { showToday: false, defaultSelected: 15 },
};

// ── Combined ──

export const FullFeatured: Story = {
  args: {
    mode: "range",
    weekStartsOn: 1,
    fixedWeeks: true,
    showToday: true,
    eventDays: [5, 15, 22],
    minDate: new Date(new Date().getFullYear(), new Date().getMonth(), 3),
    maxDate: new Date(new Date().getFullYear(), new Date().getMonth(), 28),
    markedDates: [
      { day: 1, color: "bg-red-100 text-red-700", label: "Holiday" },
      { day: 25, color: "bg-green-100 text-green-700", label: "Christmas" },
    ],
    disabledDates: [
      new Date(new Date().getFullYear(), new Date().getMonth(), 13),
    ],
  },
};
