import { render, screen, within, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { EventCalendar } from "../event-calendar";
import type { CalendarEvent, CalendarView } from "../event-calendar";

// Fix date to Jan 15, 2025 (Wednesday) for deterministic tests
const FIXED_DATE = new Date(2025, 0, 15, 10, 0, 0);

const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    start: new Date(2025, 0, 15, 9, 0),
    end: new Date(2025, 0, 15, 9, 30),
    color: "blue",
  },
  {
    id: "2",
    title: "Design Review",
    start: new Date(2025, 0, 15, 14, 0),
    end: new Date(2025, 0, 15, 15, 0),
    color: "purple",
  },
  {
    id: "3",
    title: "Lunch with Sarah",
    start: new Date(2025, 0, 15, 12, 0),
    end: new Date(2025, 0, 15, 13, 0),
    color: "green",
  },
  {
    id: "4",
    title: "All-day Workshop",
    start: new Date(2025, 0, 15, 0, 0),
    end: new Date(2025, 0, 15, 23, 59),
    allDay: true,
    color: "orange",
  },
  {
    id: "5",
    title: "Deadline: Q1 Report",
    start: new Date(2025, 0, 16, 17, 0),
    end: new Date(2025, 0, 16, 18, 0),
    color: "red",
  },
];

describe("EventCalendar", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(FIXED_DATE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Rendering ────────────────────────────────────────────────────────────

  it("renders with month view by default", () => {
    render(<EventCalendar date={FIXED_DATE} />);
    expect(screen.getByTestId("event-calendar")).toBeInTheDocument();
    // Month view shows day grid
    expect(screen.getByRole("grid", { name: /month calendar/i })).toBeInTheDocument();
  });

  it("renders the Today button", () => {
    render(<EventCalendar date={FIXED_DATE} />);
    expect(screen.getByRole("button", { name: "Today" })).toBeInTheDocument();
  });

  it("renders navigation arrows", () => {
    render(<EventCalendar date={FIXED_DATE} />);
    expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  it("renders view switcher with all three views", () => {
    render(<EventCalendar date={FIXED_DATE} />);
    expect(screen.getByRole("button", { name: /^month$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^week$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^day$/i })).toBeInTheDocument();
  });

  it("shows month and year in header for month view", () => {
    render(<EventCalendar date={FIXED_DATE} />);
    expect(screen.getByText(/january 2025/i)).toBeInTheDocument();
  });

  // ── View switching ─────────────────────────────────────────────────────

  it.each([
    ["month", "month"],
    ["week", "week"],
    ["day", "day"],
  ] as const)("renders in %s view when view=%s", (viewName, view) => {
    render(<EventCalendar date={FIXED_DATE} view={view} />);
    const btn = screen.getByRole("button", { name: new RegExp(`^${viewName}$`, "i") });
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("switches from month to week view", () => {
    const onViewChange = vi.fn();

    render(
      <EventCalendar
        date={FIXED_DATE}
        defaultView="month"
        onViewChange={onViewChange}
      />
    );

    expect(screen.getByRole("grid", { name: /month calendar/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^week$/i }));
    expect(onViewChange).toHaveBeenCalledWith("week");
  });

  it("switches from month to day view", () => {
    const onViewChange = vi.fn();

    render(
      <EventCalendar
        date={FIXED_DATE}
        defaultView="month"
        onViewChange={onViewChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /^day$/i }));
    expect(onViewChange).toHaveBeenCalledWith("day");
  });

  // ── Navigation ────────────────────────────────────────────────────────

  it("navigates to previous month", () => {
    const onDateChange = vi.fn();

    render(
      <EventCalendar
        date={FIXED_DATE}
        onDateChange={onDateChange}
        view="month"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(onDateChange).toHaveBeenCalledTimes(1);
    const newDate = onDateChange.mock.calls[0][0] as Date;
    expect(newDate.getMonth()).toBe(11); // December
    expect(newDate.getFullYear()).toBe(2024);
  });

  it("navigates to next month", () => {
    const onDateChange = vi.fn();

    render(
      <EventCalendar
        date={FIXED_DATE}
        onDateChange={onDateChange}
        view="month"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onDateChange).toHaveBeenCalledTimes(1);
    const newDate = onDateChange.mock.calls[0][0] as Date;
    expect(newDate.getMonth()).toBe(1); // February
    expect(newDate.getFullYear()).toBe(2025);
  });

  it("navigates to previous week in week view", () => {
    const onDateChange = vi.fn();

    render(
      <EventCalendar
        date={FIXED_DATE}
        onDateChange={onDateChange}
        view="week"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(onDateChange).toHaveBeenCalledTimes(1);
    const newDate = onDateChange.mock.calls[0][0] as Date;
    expect(newDate.getDate()).toBe(8); // Jan 8
  });

  it("navigates to next day in day view", () => {
    const onDateChange = vi.fn();

    render(
      <EventCalendar
        date={FIXED_DATE}
        onDateChange={onDateChange}
        view="day"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onDateChange).toHaveBeenCalledTimes(1);
    const newDate = onDateChange.mock.calls[0][0] as Date;
    expect(newDate.getDate()).toBe(16);
  });

  it("navigates to today", () => {
    const pastDate = new Date(2024, 5, 1);
    const onDateChange = vi.fn();

    render(
      <EventCalendar
        defaultDate={pastDate}
        onDateChange={onDateChange}
        view="month"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    expect(onDateChange).toHaveBeenCalledTimes(1);
    const newDate = onDateChange.mock.calls[0][0] as Date;
    expect(newDate.getMonth()).toBe(0);
    expect(newDate.getDate()).toBe(15);
    expect(newDate.getFullYear()).toBe(2025);
  });

  // ── Event rendering ──────────────────────────────────────────────────

  it("renders events in month view", () => {
    render(
      <EventCalendar
        date={FIXED_DATE}
        events={sampleEvents}
        view="month"
      />
    );

    expect(screen.getByText("Team Standup")).toBeInTheDocument();
    expect(screen.getByText("Design Review")).toBeInTheDocument();
  });

  it("renders events in week view", () => {
    render(
      <EventCalendar
        date={FIXED_DATE}
        events={sampleEvents}
        view="week"
      />
    );

    expect(
      screen.getByRole("button", { name: /Team Standup/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Design Review/i })
    ).toBeInTheDocument();
  });

  it("renders events in day view", () => {
    render(
      <EventCalendar
        date={FIXED_DATE}
        events={sampleEvents}
        view="day"
      />
    );

    expect(
      screen.getByRole("button", { name: /Team Standup/i })
    ).toBeInTheDocument();
  });

  it("renders all-day events in week view", () => {
    render(
      <EventCalendar
        date={FIXED_DATE}
        events={sampleEvents}
        view="week"
      />
    );

    expect(screen.getByText("All-day Workshop")).toBeInTheDocument();
  });

  it("shows +N more when more than 3 events in a day (month view)", () => {
    const manyEvents: CalendarEvent[] = Array.from({ length: 5 }, (_, i) => ({
      id: `e${i}`,
      title: `Event ${i + 1}`,
      start: new Date(2025, 0, 15, 9 + i, 0),
      end: new Date(2025, 0, 15, 10 + i, 0),
    }));

    render(
      <EventCalendar
        date={FIXED_DATE}
        events={manyEvents}
        view="month"
      />
    );

    expect(screen.getByText("+2 more")).toBeInTheDocument();
  });

  // ── Callbacks ────────────────────────────────────────────────────────

  it("fires onEventClick when an event is clicked in month view", () => {
    const onEventClick = vi.fn();

    render(
      <EventCalendar
        date={FIXED_DATE}
        events={sampleEvents}
        view="month"
        onEventClick={onEventClick}
      />
    );

    fireEvent.click(screen.getByText("Team Standup"));
    expect(onEventClick).toHaveBeenCalledTimes(1);
    expect(onEventClick.mock.calls[0][0].id).toBe("1");
  });

  it("fires onEventClick when an event is clicked in week view", () => {
    const onEventClick = vi.fn();

    render(
      <EventCalendar
        date={FIXED_DATE}
        events={sampleEvents}
        view="week"
        onEventClick={onEventClick}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Team Standup/i }));
    expect(onEventClick).toHaveBeenCalledTimes(1);
    expect(onEventClick.mock.calls[0][0].id).toBe("1");
  });

  it("fires onSlotClick when a time slot is clicked in week view", () => {
    const onSlotClick = vi.fn();

    render(
      <EventCalendar
        date={FIXED_DATE}
        events={[]}
        view="week"
        onSlotClick={onSlotClick}
      />
    );

    const slots = screen.getAllByRole("button", { name: /6:00/i });
    if (slots.length > 0) {
      fireEvent.click(slots[0]);
      expect(onSlotClick).toHaveBeenCalledTimes(1);
      const [start, end] = onSlotClick.mock.calls[0];
      expect(start.getHours()).toBe(6);
      expect(end.getHours()).toBe(7);
    }
  });

  it("fires onSlotClick when a time slot is clicked in day view", () => {
    const onSlotClick = vi.fn();

    render(
      <EventCalendar
        date={FIXED_DATE}
        events={[]}
        view="day"
        onSlotClick={onSlotClick}
      />
    );

    const slots = screen.getAllByRole("button", { name: /6:00/i });
    if (slots.length > 0) {
      fireEvent.click(slots[0]);
      expect(onSlotClick).toHaveBeenCalledTimes(1);
    }
  });

  // ── Keyboard navigation ──────────────────────────────────────────────

  it("navigates with arrow keys on the calendar container", () => {
    const onDateChange = vi.fn();

    render(
      <EventCalendar
        date={FIXED_DATE}
        onDateChange={onDateChange}
        view="month"
      />
    );

    const calendar = screen.getByTestId("event-calendar");
    fireEvent.keyDown(calendar, { key: "ArrowRight" });
    expect(onDateChange).toHaveBeenCalled();
  });

  it("handles Enter on day cell in month view", () => {
    const onViewChange = vi.fn();
    const onDateChange = vi.fn();

    render(
      <EventCalendar
        date={FIXED_DATE}
        defaultView="month"
        onViewChange={onViewChange}
        onDateChange={onDateChange}
      />
    );

    // Find a gridcell containing "15" and press Enter
    const cells = screen.getAllByRole("gridcell");
    const cell15 = cells.find((c) => within(c).queryByText("15"));
    if (cell15) {
      fireEvent.keyDown(cell15, { key: "Enter" });
      expect(onViewChange).toHaveBeenCalledWith("day");
    }
  });

  // ── ARIA attributes ──────────────────────────────────────────────────

  it("has role=grid on month view", () => {
    render(<EventCalendar date={FIXED_DATE} view="month" />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("has role=gridcell on day cells in month view", () => {
    render(<EventCalendar date={FIXED_DATE} view="month" />);
    const cells = screen.getAllByRole("gridcell");
    expect(cells.length).toBeGreaterThan(0);
  });

  it("has aria-current=date on today in month view", () => {
    render(<EventCalendar date={FIXED_DATE} view="month" />);
    const todayCells = screen.getAllByRole("gridcell").filter(
      (el) => el.getAttribute("aria-current") === "date"
    );
    expect(todayCells.length).toBe(1);
  });

  it("has aria-label on events", () => {
    render(
      <EventCalendar
        date={FIXED_DATE}
        events={sampleEvents}
        view="week"
      />
    );

    const eventButton = screen.getByRole("button", { name: /Team Standup/i });
    expect(eventButton).toHaveAttribute("aria-label");
    expect(eventButton.getAttribute("aria-label")).toContain("Team Standup");
  });

  it("has aria-pressed on the active view button", () => {
    render(<EventCalendar date={FIXED_DATE} view="week" />);
    const weekBtn = screen.getByRole("button", { name: /^week$/i });
    expect(weekBtn).toHaveAttribute("aria-pressed", "true");
    const monthBtn = screen.getByRole("button", { name: /^month$/i });
    expect(monthBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("has role=group and aria-label on view switcher", () => {
    render(<EventCalendar date={FIXED_DATE} />);
    expect(
      screen.getByRole("group", { name: /calendar view/i })
    ).toBeInTheDocument();
  });

  // ── Ref forwarding ──────────────────────────────────────────────────

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<EventCalendar ref={ref} date={FIXED_DATE} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ── Controlled / Uncontrolled ──────────────────────────────────────

  it("works in uncontrolled mode with defaultView and defaultDate", () => {
    render(
      <EventCalendar
        defaultView="week"
        defaultDate={FIXED_DATE}
      />
    );
    const weekBtn = screen.getByRole("button", { name: /^week$/i });
    expect(weekBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("works in controlled mode with view and date", () => {
    render(
      <EventCalendar
        view="day"
        date={FIXED_DATE}
      />
    );
    const dayBtn = screen.getByRole("button", { name: /^day$/i });
    expect(dayBtn).toHaveAttribute("aria-pressed", "true");
  });

  // ── weekStartsOn ───────────────────────────────────────────────────

  it("starts week on Monday when weekStartsOn=1", () => {
    render(
      <EventCalendar
        date={FIXED_DATE}
        view="month"
        weekStartsOn={1}
      />
    );

    const columnHeaders = screen.getAllByRole("columnheader");
    expect(columnHeaders[0].textContent).toMatch(/mon/i);
  });

  it("starts week on Sunday when weekStartsOn=0", () => {
    render(
      <EventCalendar
        date={FIXED_DATE}
        view="month"
        weekStartsOn={0}
      />
    );

    const columnHeaders = screen.getAllByRole("columnheader");
    expect(columnHeaders[0].textContent).toMatch(/sun/i);
  });

  // ── View-specific rendering with it.each ─────────────────────────────

  it.each<[CalendarView, string]>([
    ["month", "grid"],
    ["week", "button"],
    ["day", "button"],
  ])("renders events in %s view", (view, _role) => {
    render(
      <EventCalendar
        date={FIXED_DATE}
        events={sampleEvents}
        view={view}
      />
    );

    if (view === "month") {
      expect(screen.getByText("Team Standup")).toBeInTheDocument();
    } else {
      expect(
        screen.getByRole("button", { name: /Team Standup/i })
      ).toBeInTheDocument();
    }
  });

  // ── Back button (drill-down from month/week → day) ─────────────────

  it("shows a back button after clicking +N more in month view", () => {
    const manyEvents: CalendarEvent[] = Array.from({ length: 5 }, (_, i) => ({
      id: `e${i}`,
      title: `Event ${i + 1}`,
      start: new Date(2025, 0, 15, 9 + i, 0),
      end: new Date(2025, 0, 15, 10 + i, 0),
    }));

    render(
      <EventCalendar
        defaultDate={FIXED_DATE}
        defaultView="month"
        events={manyEvents}
      />
    );

    // Click "+2 more" to drill into day view
    fireEvent.click(screen.getByText("+2 more"));

    // Should now show a back button to return to month view
    const backBtn = screen.getByRole("button", { name: /back to month/i });
    expect(backBtn).toBeInTheDocument();
  });

  it("returns to the previous view when clicking the back button", () => {
    const manyEvents: CalendarEvent[] = Array.from({ length: 5 }, (_, i) => ({
      id: `e${i}`,
      title: `Event ${i + 1}`,
      start: new Date(2025, 0, 15, 9 + i, 0),
      end: new Date(2025, 0, 15, 10 + i, 0),
    }));

    render(
      <EventCalendar
        defaultDate={FIXED_DATE}
        defaultView="month"
        events={manyEvents}
      />
    );

    // Drill into day view
    fireEvent.click(screen.getByText("+2 more"));
    expect(screen.getByRole("button", { name: /^day$/i })).toHaveAttribute("aria-pressed", "true");

    // Click back → should return to month
    fireEvent.click(screen.getByRole("button", { name: /back to month/i }));
    expect(screen.getByRole("button", { name: /^month$/i })).toHaveAttribute("aria-pressed", "true");

    // Back button should be gone
    expect(screen.queryByRole("button", { name: /back to month/i })).not.toBeInTheDocument();
  });

  it("does not show a back button when directly switching to day view via view switcher", () => {
    render(
      <EventCalendar
        defaultDate={FIXED_DATE}
        defaultView="month"
      />
    );

    // Switch to day view via the view switcher (intentional, not drill-down)
    fireEvent.click(screen.getByRole("button", { name: /^day$/i }));

    // No back button should appear
    expect(screen.queryByRole("button", { name: /back to/i })).not.toBeInTheDocument();
  });

  // ── Edge cases ───────────────────────────────────────────────────────

  it("renders without events", () => {
    render(<EventCalendar date={FIXED_DATE} events={[]} />);
    expect(screen.getByTestId("event-calendar")).toBeInTheDocument();
  });

  it("renders without any props", () => {
    render(<EventCalendar />);
    expect(screen.getByTestId("event-calendar")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<EventCalendar date={FIXED_DATE} className="my-custom-class" />);
    expect(screen.getByTestId("event-calendar")).toHaveClass("my-custom-class");
  });

  it("shows day header text in day view", () => {
    render(
      <EventCalendar
        date={FIXED_DATE}
        view="day"
      />
    );

    // The formatted day header should contain "Wednesday" and "January 15"
    // It appears in both the main header and the day view header, so use getAllByText
    const headers = screen.getAllByText(/wednesday.*january.*15/i);
    expect(headers.length).toBeGreaterThanOrEqual(1);
  });
});
