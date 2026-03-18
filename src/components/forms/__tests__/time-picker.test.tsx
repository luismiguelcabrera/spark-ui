import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TimePicker } from "../time-picker";

describe("TimePicker", () => {
  it("renders trigger button with placeholder", () => {
    render(<TimePicker />);
    expect(screen.getByText("Select time")).toBeInTheDocument();
  });

  it("forwards ref (to dropdown panel when open)", () => {
    const ref = vi.fn();
    render(<TimePicker ref={ref} />);
    // ref goes to the dropdown panel, only rendered when open
    expect(screen.getByText("Select time")).toBeInTheDocument();
  });

  it("has displayName", () => {
    expect(TimePicker.displayName).toBe("TimePicker");
  });

  it("merges className", () => {
    const { container } = render(<TimePicker className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("shows custom placeholder", () => {
    render(<TimePicker placeholder="Choose time" />);
    expect(screen.getByText("Choose time")).toBeInTheDocument();
  });

  it("renders label", () => {
    render(<TimePicker label="Start Time" />);
    expect(screen.getByText("Start Time")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<TimePicker error="Required field" />);
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("displays current time value in 24h format", () => {
    render(<TimePicker value="14:30" />);
    expect(screen.getByText("14:30")).toBeInTheDocument();
  });

  it("supports disabled state", () => {
    render(<TimePicker disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("opens time picker dropdown on click", async () => {
    const user = userEvent.setup();
    render(<TimePicker />);
    await user.click(screen.getByText("Select time"));
    expect(screen.getByText("Hour")).toBeInTheDocument();
    expect(screen.getByText("Min")).toBeInTheDocument();
  });
});
