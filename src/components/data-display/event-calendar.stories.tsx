import type { Meta, StoryObj } from "@storybook/react-vite";
import { EventCalendar } from "./event-calendar";
import type { CalendarEvent } from "./event-calendar";

// ── Sample data ─────────────────────────────────────────────────────────────

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();
const day = today.getDate();

function at(dayOffset: number, hour: number, minute = 0): Date {
  return new Date(year, month, day + dayOffset, hour, minute);
}

const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    start: at(0, 9, 0),
    end: at(0, 9, 30),
    color: "blue",
  },
  {
    id: "2",
    title: "Design Review",
    start: at(0, 14, 0),
    end: at(0, 15, 30),
    color: "purple",
  },
  {
    id: "3",
    title: "Lunch with Sarah",
    start: at(0, 12, 0),
    end: at(0, 13, 0),
    color: "green",
  },
  {
    id: "4",
    title: "Sprint Planning",
    start: at(1, 10, 0),
    end: at(1, 11, 30),
    color: "blue",
  },
  {
    id: "5",
    title: "1:1 with Manager",
    start: at(1, 15, 0),
    end: at(1, 15, 30),
    color: "teal",
  },
  {
    id: "6",
    title: "Deadline: Q1 Report",
    start: at(2, 17, 0),
    end: at(2, 18, 0),
    color: "red",
  },
  {
    id: "7",
    title: "Product Demo",
    start: at(-1, 14, 0),
    end: at(-1, 15, 0),
    color: "orange",
  },
  {
    id: "8",
    title: "Code Review",
    start: at(0, 16, 0),
    end: at(0, 17, 0),
    color: "teal",
  },
  {
    id: "9",
    title: "Coffee Chat",
    start: at(3, 10, 0),
    end: at(3, 10, 30),
    color: "pink",
  },
  {
    id: "10",
    title: "Retrospective",
    start: at(4, 13, 0),
    end: at(4, 14, 0),
    color: "yellow",
  },
];

const allDayEvents: CalendarEvent[] = [
  {
    id: "ad1",
    title: "Company All-Hands",
    start: at(0, 0),
    end: at(0, 23, 59),
    allDay: true,
    color: "purple",
  },
  {
    id: "ad2",
    title: "Design Sprint",
    start: at(1, 0),
    end: at(3, 23, 59),
    allDay: true,
    color: "blue",
  },
  {
    id: "ad3",
    title: "Holiday",
    start: at(5, 0),
    end: at(5, 23, 59),
    allDay: true,
    color: "green",
  },
];

// ── Meta ────────────────────────────────────────────────────────────────────

const meta = {
  title: "Data Display/EventCalendar",
  component: EventCalendar,
  tags: ["autodocs"],
  argTypes: {
    view: {
      control: "select",
      options: ["month", "week", "day"],
    },
    weekStartsOn: {
      control: "select",
      options: [0, 1],
    },
    locale: {
      control: "text",
    },
  },
  args: {
    events: sampleEvents,
  },
} satisfies Meta<typeof EventCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ─────────────────────────────────────────────────────────────────

export const MonthView: Story = {
  args: {
    defaultView: "month",
  },
};

export const WeekView: Story = {
  args: {
    defaultView: "week",
  },
};

export const DayView: Story = {
  args: {
    defaultView: "day",
  },
};

export const WithEvents: Story = {
  args: {
    defaultView: "week",
    events: sampleEvents,
  },
  render: (args) => (
    <div className="max-w-5xl mx-auto">
      <EventCalendar {...args} />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    defaultView: "month",
    events: [...sampleEvents, ...allDayEvents],
  },
  render: (args) => (
    <div className="max-w-5xl mx-auto">
      <EventCalendar
        {...args}
        onEventClick={(event) => alert(`Clicked: ${event.title}`)}
        onSlotClick={(start, end) =>
          alert(
            `New event slot: ${start.toLocaleString()} - ${end.toLocaleString()}`
          )
        }
      />
    </div>
  ),
};

export const AllDayEvents: Story = {
  args: {
    defaultView: "week",
    events: [...sampleEvents, ...allDayEvents],
  },
  render: (args) => (
    <div className="max-w-5xl mx-auto">
      <EventCalendar {...args} />
    </div>
  ),
};

export const MondayStart: Story = {
  args: {
    defaultView: "month",
    weekStartsOn: 1,
  },
  render: (args) => (
    <div className="max-w-5xl mx-auto">
      <EventCalendar {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    defaultView: "week",
    events: [],
  },
};
