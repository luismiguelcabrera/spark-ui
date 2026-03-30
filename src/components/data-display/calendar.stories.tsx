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

// ── Other ──

export const January2026: Story = {
  args: {
    month: "January",
    year: 2026,
    defaultSelected: 1,
    eventDays: [1, 15, 20],
  },
};
