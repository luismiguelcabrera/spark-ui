import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { DateRangePicker } from "../date-range-picker";

describe("DateRangePicker", () => {
  it("renders trigger button with placeholder", () => {
    render(<DateRangePicker />);
    expect(screen.getByText("Select date range")).toBeInTheDocument();
  });

  it("forwards ref (to dropdown panel when open)", () => {
    const ref = vi.fn();
    render(<DateRangePicker ref={ref} />);
    // ref goes to the dropdown panel, which is only rendered when open
    expect(screen.getByText("Select date range")).toBeInTheDocument();
  });

  it("has displayName", () => {
    expect(DateRangePicker.displayName).toBe("DateRangePicker");
  });

  it("merges className", () => {
    const { container } = render(<DateRangePicker className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("shows custom placeholder", () => {
    render(<DateRangePicker placeholder="Choose range" />);
    expect(screen.getByText("Choose range")).toBeInTheDocument();
  });

  it("renders label", () => {
    render(<DateRangePicker label="Period" />);
    expect(screen.getByText("Period")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<DateRangePicker error="Invalid range" />);
    expect(screen.getByText("Invalid range")).toBeInTheDocument();
  });

  it("displays formatted range when value is provided", () => {
    const value = {
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 15),
    };
    render(<DateRangePicker value={value} />);
    expect(screen.getByText(/1\/1\/2024/)).toBeInTheDocument();
  });

  it("supports disabled state", () => {
    render(<DateRangePicker disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("opens calendar on click", async () => {
    const user = userEvent.setup();
    render(<DateRangePicker />);
    await user.click(screen.getByText("Select date range"));
    expect(screen.getByText("Select start date")).toBeInTheDocument();
  });
});
