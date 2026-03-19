import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MonthPicker } from "../month-picker";

describe("MonthPicker", () => {
  it("renders trigger button with placeholder", () => {
    render(<MonthPicker />);
    expect(screen.getByText("Select month")).toBeInTheDocument();
  });

  it("opens popup on click", async () => {
    const user = userEvent.setup();
    render(<MonthPicker />);
    await user.click(screen.getByText("Select month"));
    expect(screen.getByLabelText("Previous year")).toBeInTheDocument();
    expect(screen.getByLabelText("Next year")).toBeInTheDocument();
  });

  it("closes on outside click", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <MonthPicker />
        <button>Outside</button>
      </div>,
    );
    await user.click(screen.getByText("Select month"));
    expect(screen.getByLabelText("Previous year")).toBeInTheDocument();
    await user.click(screen.getByText("Outside"));
    expect(screen.queryByLabelText("Previous year")).not.toBeInTheDocument();
  });

  it("selects month and calls onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MonthPicker onChange={onChange} />);
    await user.click(screen.getByText("Select month"));
    await user.click(screen.getByText("Mar"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual(
      expect.objectContaining({ month: 2 }),
    );
  });

  it("navigates years with prev/next", async () => {
    const user = userEvent.setup();
    render(<MonthPicker />);
    await user.click(screen.getByText("Select month"));
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(String(currentYear))).toBeInTheDocument();
    await user.click(screen.getByLabelText("Next year"));
    expect(screen.getByText(String(currentYear + 1))).toBeInTheDocument();
  });

  it("shows selected month with correct format", () => {
    render(<MonthPicker value={{ month: 0, year: 2026 }} />);
    expect(screen.getByText("Jan 2026")).toBeInTheDocument();
  });

  it("disables months outside minDate/maxDate", async () => {
    const user = userEvent.setup();
    render(
      <MonthPicker
        defaultValue={{ month: 5, year: 2026 }}
        minDate={{ month: 3, year: 2026 }}
        maxDate={{ month: 8, year: 2026 }}
      />,
    );
    await user.click(screen.getByText("Jun 2026"));
    const jan = screen.getByText("Jan");
    const dec = screen.getByText("Dec");
    expect(jan).toBeDisabled();
    expect(dec).toBeDisabled();
    // A month in range should not be disabled
    expect(screen.getByText("May")).not.toBeDisabled();
  });

  it("disabled prop prevents interaction", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MonthPicker disabled onChange={onChange} />);
    await user.click(screen.getByText("Select month"));
    expect(screen.queryByLabelText("Previous year")).not.toBeInTheDocument();
  });

  it("error message renders", () => {
    render(<MonthPicker error="Month is required" />);
    expect(screen.getByText("Month is required")).toBeInTheDocument();
  });

  it("displayName is set", () => {
    expect(MonthPicker.displayName).toBe("MonthPicker");
  });

  it("merges className", () => {
    const { container } = render(<MonthPicker className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
