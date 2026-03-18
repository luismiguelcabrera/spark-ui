import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SegmentedControl } from "../segmented-control";

const items = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

describe("SegmentedControl", () => {
  it("renders all items", () => {
    render(<SegmentedControl items={items} />);
    expect(screen.getByText("Day")).toBeInTheDocument();
    expect(screen.getByText("Week")).toBeInTheDocument();
    expect(screen.getByText("Month")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<SegmentedControl ref={ref} items={items} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(SegmentedControl.displayName).toBe("SegmentedControl");
  });

  it("merges className", () => {
    render(<SegmentedControl items={items} className="custom" />);
    expect(screen.getByRole("radiogroup")).toHaveClass("custom");
  });

  it("has role='radiogroup'", () => {
    render(<SegmentedControl items={items} />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("renders buttons with role='radio'", () => {
    render(<SegmentedControl items={items} />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    radios.forEach((btn) => {
      expect(btn).toHaveAttribute("type", "button");
    });
  });

  it("sets aria-checked on selected item", () => {
    render(<SegmentedControl items={items} defaultValue="week" />);
    const radios = screen.getAllByRole("radio");
    const weekRadio = radios.find((r) => r.textContent === "Week")!;
    expect(weekRadio).toHaveAttribute("aria-checked", "true");
  });

  it("calls onValueChange when segment is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SegmentedControl items={items} onValueChange={onValueChange} />);
    await user.click(screen.getByText("Week"));
    expect(onValueChange).toHaveBeenCalledWith("week");
  });

  it("defaults to first item if no defaultValue", () => {
    render(<SegmentedControl items={items} />);
    const radios = screen.getAllByRole("radio");
    const dayRadio = radios.find((r) => r.textContent === "Day")!;
    expect(dayRadio).toHaveAttribute("aria-checked", "true");
  });
});
