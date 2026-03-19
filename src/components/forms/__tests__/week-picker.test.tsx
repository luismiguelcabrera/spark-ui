import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { WeekPicker, getWeekNumber } from "../week-picker";

describe("WeekPicker", () => {
  it("renders trigger button with placeholder", () => {
    render(<WeekPicker />);
    expect(screen.getByText("Select week")).toBeInTheDocument();
  });

  it("opens popup on click", async () => {
    const user = userEvent.setup();
    render(<WeekPicker />);
    await user.click(screen.getByText("Select week"));
    expect(screen.getByLabelText("Previous month")).toBeInTheDocument();
    expect(screen.getByLabelText("Next month")).toBeInTheDocument();
  });

  it("closes on outside click", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <WeekPicker />
        <button>outside</button>
      </div>,
    );
    await user.click(screen.getByText("Select week"));
    expect(screen.getByLabelText("Previous month")).toBeInTheDocument();
    await user.click(screen.getByText("outside"));
    expect(screen.queryByLabelText("Previous month")).not.toBeInTheDocument();
  });

  it("shows calendar grid with day labels", async () => {
    const user = userEvent.setup();
    render(<WeekPicker />);
    await user.click(screen.getByText("Select week"));
    // Monday-start default: Mo, Tu, We, Th, Fr, Sa, Su
    expect(screen.getByText("Mo")).toBeInTheDocument();
    expect(screen.getByText("Tu")).toBeInTheDocument();
    expect(screen.getByText("We")).toBeInTheDocument();
    expect(screen.getByText("Th")).toBeInTheDocument();
    expect(screen.getByText("Fr")).toBeInTheDocument();
    expect(screen.getByText("Sa")).toBeInTheDocument();
    expect(screen.getByText("Su")).toBeInTheDocument();
  });

  it("selects week when clicking a day and calls onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<WeekPicker onChange={onChange} />);
    await user.click(screen.getByText("Select week"));
    // Click day 15 of the current month
    await user.click(screen.getByRole("button", { name: "15" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    const val = onChange.mock.calls[0][0];
    expect(val).toHaveProperty("year");
    expect(val).toHaveProperty("week");
    expect(typeof val.year).toBe("number");
    expect(typeof val.week).toBe("number");
  });

  it("navigates months with prev/next", async () => {
    const user = userEvent.setup();
    render(<WeekPicker />);
    await user.click(screen.getByText("Select week"));
    const monthText = screen.getByText(/\w+ \d{4}/);
    const initialMonth = monthText.textContent;
    await user.click(screen.getByLabelText("Next month"));
    expect(monthText.textContent).not.toBe(initialMonth);
  });

  it("displays selected week range in trigger", async () => {
    const user = userEvent.setup();
    const { container } = render(<WeekPicker />);
    await user.click(screen.getByText("Select week"));
    await user.click(screen.getByRole("button", { name: "15" }));
    // After selection, trigger should show a date range (contains "–")
    const trigger = container.querySelector("button[aria-haspopup]");
    expect(trigger?.textContent).toMatch(/–/);
  });

  it("disabled prevents opening", async () => {
    const user = userEvent.setup();
    render(<WeekPicker disabled />);
    await user.click(screen.getByText("Select week"));
    expect(screen.queryByLabelText("Previous month")).not.toBeInTheDocument();
  });

  it("error message renders", () => {
    render(<WeekPicker error="Week is required" />);
    expect(screen.getByText("Week is required")).toBeInTheDocument();
  });

  it("has displayName", () => {
    expect(WeekPicker.displayName).toBe("WeekPicker");
  });

  it("merges className", () => {
    const { container } = render(<WeekPicker className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders label", () => {
    render(<WeekPicker label="Select reporting week" />);
    expect(screen.getByText("Select reporting week")).toBeInTheDocument();
  });

  it("getWeekNumber returns correct ISO week", () => {
    // Jan 1, 2026 is a Thursday → ISO week 1 of 2026
    expect(getWeekNumber(new Date(2026, 0, 1), 1)).toEqual({ year: 2026, week: 1 });
    // Dec 31, 2025 is a Wednesday → ISO week 1 of 2026
    expect(getWeekNumber(new Date(2025, 11, 31), 1)).toEqual({ year: 2026, week: 1 });
    // Dec 29, 2025 is a Monday → ISO week 1 of 2026
    expect(getWeekNumber(new Date(2025, 11, 29), 1)).toEqual({ year: 2026, week: 1 });
    // Mar 18, 2026 is a Wednesday → ISO week 12 of 2026
    expect(getWeekNumber(new Date(2026, 2, 18), 1)).toEqual({ year: 2026, week: 12 });
  });

  it("weekStartsOn=0 (Sunday) works", async () => {
    const user = userEvent.setup();
    render(<WeekPicker weekStartsOn={0} />);
    await user.click(screen.getByText("Select week"));
    // Day labels should start with Su
    const labels = screen.getAllByText(/^(Su|Mo|Tu|We|Th|Fr|Sa)$/);
    expect(labels[0].textContent).toBe("Su");
  });

  it("supports defaultValue", () => {
    render(<WeekPicker defaultValue={{ year: 2026, week: 12 }} />);
    const trigger = screen.getByRole("button");
    // Should show a date range, not the placeholder
    expect(trigger.textContent).toMatch(/–/);
    expect(trigger.textContent).not.toContain("Select week");
  });

  it("has aria-expanded on trigger button", () => {
    render(<WeekPicker />);
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
