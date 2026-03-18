import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { DatePicker } from "../date-picker";

describe("DatePicker", () => {
  it("renders trigger button with placeholder", () => {
    render(<DatePicker />);
    expect(screen.getByText("Pick a date")).toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(<DatePicker className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("renders label when provided", () => {
    render(<DatePicker label="Birthday" />);
    expect(screen.getByText("Birthday")).toBeInTheDocument();
  });

  it("shows custom placeholder", () => {
    render(<DatePicker placeholder="Select date" />);
    expect(screen.getByText("Select date")).toBeInTheDocument();
  });

  it("has aria-expanded on trigger button", () => {
    render(<DatePicker />);
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("displays selected date value", () => {
    const date = new Date(2024, 5, 15);
    render(<DatePicker value={date} />);
    expect(screen.getByText("June 15, 2024")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<DatePicker error="Date is required" />);
    expect(screen.getByText("Date is required")).toBeInTheDocument();
  });

  it("opens calendar on click", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    await user.click(screen.getByText("Pick a date"));
    expect(screen.getByLabelText("Previous month")).toBeInTheDocument();
    expect(screen.getByLabelText("Next month")).toBeInTheDocument();
  });

  it("calls onChange when a day is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);
    await user.click(screen.getByText("Pick a date"));
    await user.click(screen.getByRole("button", { name: "15" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toBeInstanceOf(Date);
  });

  it("navigates months with prev/next buttons", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    await user.click(screen.getByText("Pick a date"));
    const monthText = screen.getByText(/\w+ \d{4}/);
    const initialMonth = monthText.textContent;
    await user.click(screen.getByLabelText("Next month"));
    expect(monthText.textContent).not.toBe(initialMonth);
  });
});
