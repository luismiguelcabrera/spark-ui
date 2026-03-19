import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar } from "./calendar";

const meta = {
  title: "Data Display/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  argTypes: {
    month: {
      control: "select",
      options: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ],
    },
    year: { control: "number" },
    selected: { control: "number" },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const January2026: Story = {
  args: {
    month: "January",
    year: 2026,
    defaultSelected: 1,
    eventDays: [1, 15, 20],
  },
};

export const CustomDays: Story = {
  args: {
    month: "March",
    year: 2026,
    days: [
      { day: 27, muted: true },
      { day: 28, muted: true },
      { day: 1 },
      { day: 2 },
      { day: 3, hasEvent: true },
      { day: 4 },
      { day: 5 },
      { day: 6 },
      { day: 7 },
      { day: 8 },
      { day: 9, today: true },
      { day: 10 },
      { day: 11, selected: true },
      { day: 12 },
      { day: 13 },
      { day: 14 },
      { day: 15, hasEvent: true },
      { day: 16 },
      { day: 17 },
      { day: 18 },
      { day: 19 },
      { day: 20 },
      { day: 21 },
      { day: 22 },
      { day: 23 },
      { day: 24 },
      { day: 25 },
      { day: 26 },
      { day: 27 },
      { day: 28 },
      { day: 29 },
      { day: 30 },
      { day: 31 },
      { day: 1, muted: true },
      { day: 2, muted: true },
      { day: 3, muted: true },
    ],
  },
};
