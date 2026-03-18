import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Calendar } from "../calendar";

describe("Calendar", () => {
  it("renders without error", () => {
    render(<Calendar month="January" year={2025} />);
    expect(screen.getByText("January 2025")).toBeInTheDocument();
  });

  it("renders day labels", () => {
    render(<Calendar month="January" year={2025} />);
    expect(screen.getByText("Sun")).toBeInTheDocument();
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Sat")).toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(<Calendar month="January" year={2025} className="custom-cal" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("custom-cal");
  });

  it("renders navigation buttons with aria-labels", () => {
    render(<Calendar month="January" year={2025} />);
    expect(screen.getByLabelText("Previous month")).toBeInTheDocument();
    expect(screen.getByLabelText("Next month")).toBeInTheDocument();
  });

  it("calls onPrevMonth when previous button clicked", () => {
    const onPrevMonth = vi.fn();
    render(<Calendar month="March" year={2025} onPrevMonth={onPrevMonth} />);
    fireEvent.click(screen.getByLabelText("Previous month"));
    expect(onPrevMonth).toHaveBeenCalledOnce();
  });

  it("calls onNextMonth when next button clicked", () => {
    const onNextMonth = vi.fn();
    render(<Calendar month="March" year={2025} onNextMonth={onNextMonth} />);
    fireEvent.click(screen.getByLabelText("Next month"));
    expect(onNextMonth).toHaveBeenCalledOnce();
  });

  it("navigates months internally in auto mode", () => {
    render(<Calendar month="January" year={2025} />);
    expect(screen.getByText("January 2025")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Next month"));
    expect(screen.getByText("February 2025")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Previous month"));
    expect(screen.getByText("January 2025")).toBeInTheDocument();
  });

  it("wraps year boundary going forward", () => {
    render(<Calendar month="December" year={2025} />);
    fireEvent.click(screen.getByLabelText("Next month"));
    expect(screen.getByText("January 2026")).toBeInTheDocument();
  });

  it("wraps year boundary going backward", () => {
    render(<Calendar month="January" year={2025} />);
    fireEvent.click(screen.getByLabelText("Previous month"));
    expect(screen.getByText("December 2024")).toBeInTheDocument();
  });

  it("calls onSelect when a day is clicked in auto mode", () => {
    const onSelect = vi.fn();
    render(<Calendar month="January" year={2025} onSelect={onSelect} />);
    // January 2025 starts on Wednesday, so day 15 should be present
    const day15 = screen.getAllByText("15").find((el) => {
      // find the non-muted one (current month)
      return !el.className.includes("muted");
    });
    if (day15) {
      fireEvent.click(day15);
      expect(onSelect).toHaveBeenCalledWith(15);
    }
  });

  it("renders with custom days prop", () => {
    const days = [
      { day: 1, selected: true },
      { day: 2 },
      { day: 3, hasEvent: true },
    ];
    render(<Calendar month="January" year={2025} days={days} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("has aria-live on the month heading", () => {
    render(<Calendar month="January" year={2025} />);
    const heading = screen.getByText("January 2025");
    expect(heading).toHaveAttribute("aria-live", "polite");
  });
});
