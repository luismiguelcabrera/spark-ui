import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { DateTimePicker } from "../date-time-picker";

describe("DateTimePicker", () => {
  it("renders trigger button with placeholder", () => {
    render(<DateTimePicker />);
    expect(screen.getByText("Select date and time")).toBeInTheDocument();
  });

  it("opens popup on click", async () => {
    const user = userEvent.setup();
    render(<DateTimePicker />);
    await user.click(screen.getByText("Select date and time"));
    expect(screen.getByLabelText("Previous month")).toBeInTheDocument();
    expect(screen.getByLabelText("Next month")).toBeInTheDocument();
  });

  it("shows calendar grid in popup", async () => {
    const user = userEvent.setup();
    render(<DateTimePicker />);
    await user.click(screen.getByText("Select date and time"));
    // Day labels should be visible
    expect(screen.getByText("Su")).toBeInTheDocument();
    expect(screen.getByText("Mo")).toBeInTheDocument();
    expect(screen.getByText("Tu")).toBeInTheDocument();
  });

  it("shows time columns in popup", async () => {
    const user = userEvent.setup();
    render(<DateTimePicker />);
    await user.click(screen.getByText("Select date and time"));
    expect(screen.getByText("Hour")).toBeInTheDocument();
    expect(screen.getByText("Min")).toBeInTheDocument();
  });

  it("closes on outside click", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <span data-testid="outside">Outside</span>
        <DateTimePicker />
      </div>,
    );
    await user.click(screen.getByText("Select date and time"));
    expect(screen.getByText("Hour")).toBeInTheDocument();
    await user.click(screen.getByTestId("outside"));
    expect(screen.queryByText("Hour")).not.toBeInTheDocument();
  });

  it("selects date and updates display", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateTimePicker onChange={onChange} />);
    await user.click(screen.getByText("Select date and time"));
    // Find the day button inside the calendar grid (grid-cols-7)
    const calendarGrid = document.querySelector(".grid.grid-cols-7.text-center:not(.mb-1)");
    const dayButton = Array.from(calendarGrid!.querySelectorAll("button")).find(
      (btn) => btn.textContent === "25",
    );
    expect(dayButton).toBeTruthy();
    await user.click(dayButton!);
    expect(onChange).toHaveBeenCalledTimes(1);
    const result = onChange.mock.calls[0][0] as Date;
    expect(result).toBeInstanceOf(Date);
    expect(result.getDate()).toBe(25);
  });

  it("selects hour and minute and updates display", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    // Start with a known date so we can verify time changes
    const initial = new Date(2026, 2, 18, 10, 0);
    render(<DateTimePicker value={initial} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: /Mar 18, 2026/ }));

    // Select hour 14
    const hourButtons = screen
      .getByTestId("time-columns")
      .querySelectorAll("button");
    // Find the button with text "14"
    const hour14 = Array.from(hourButtons).find(
      (btn) => btn.textContent === "14",
    );
    expect(hour14).toBeTruthy();
    await user.click(hour14!);
    expect(onChange).toHaveBeenCalled();
    const hourResult = onChange.mock.calls[0][0] as Date;
    expect(hourResult.getHours()).toBe(14);
  });

  it("Now button sets current date+time", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateTimePicker onChange={onChange} />);
    await user.click(screen.getByText("Select date and time"));
    await user.click(screen.getByText("Now"));
    expect(onChange).toHaveBeenCalledTimes(1);
    const result = onChange.mock.calls[0][0] as Date;
    expect(result).toBeInstanceOf(Date);
    // Should be close to now (within 5 seconds)
    expect(Math.abs(result.getTime() - Date.now())).toBeLessThan(5000);
  });

  it("calls onChange with Date value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateTimePicker onChange={onChange} />);
    await user.click(screen.getByText("Select date and time"));
    // Find the day button inside the calendar grid
    const calendarGrid = document.querySelector(".grid.grid-cols-7.text-center:not(.mb-1)");
    const dayButton = Array.from(calendarGrid!.querySelectorAll("button")).find(
      (btn) => btn.textContent === "28",
    );
    expect(dayButton).toBeTruthy();
    await user.click(dayButton!);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toBeInstanceOf(Date);
  });

  it("formats 24h correctly", () => {
    const date = new Date(2026, 2, 18, 14, 30);
    render(<DateTimePicker value={date} format="24" />);
    expect(screen.getByText("Mar 18, 2026 14:30")).toBeInTheDocument();
  });

  it("formats 12h correctly (with AM/PM)", () => {
    const date = new Date(2026, 2, 18, 14, 30);
    render(<DateTimePicker value={date} format="12" />);
    expect(screen.getByText("Mar 18, 2026 2:30 PM")).toBeInTheDocument();
  });

  it("disabled prevents opening", async () => {
    const user = userEvent.setup();
    render(<DateTimePicker disabled />);
    await user.click(screen.getByText("Select date and time"));
    expect(screen.queryByText("Hour")).not.toBeInTheDocument();
  });

  it("error message renders", () => {
    render(<DateTimePicker error="Required field" />);
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("has displayName", () => {
    expect(DateTimePicker.displayName).toBe("DateTimePicker");
  });

  it("merges className", () => {
    const { container } = render(<DateTimePicker className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders label", () => {
    render(<DateTimePicker label="Event time" />);
    expect(screen.getByText("Event time")).toBeInTheDocument();
  });

  it("trigger has aria-expanded", () => {
    render(<DateTimePicker />);
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
