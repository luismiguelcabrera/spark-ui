import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Countdown } from "../countdown";

describe("Countdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Fix "now" so time calculations are deterministic
    vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders without error", () => {
    const target = new Date("2025-01-02T00:00:00Z"); // 1 day ahead
    const { container } = render(<Countdown targetDate={target} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    const target = new Date("2025-01-02T00:00:00Z");
    render(<Countdown ref={ref} targetDate={target} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("has displayName", () => {
    expect(Countdown.displayName).toBe("Countdown");
  });

  it("merges className", () => {
    const target = new Date("2025-01-02T00:00:00Z");
    const { container } = render(<Countdown targetDate={target} className="custom-cd" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("custom-cd");
  });

  it("displays time labels (Days, Hours, Min, Sec)", () => {
    const target = new Date("2025-01-02T00:00:00Z");
    render(<Countdown targetDate={target} />);
    expect(screen.getByText("Days")).toBeInTheDocument();
    expect(screen.getByText("Hours")).toBeInTheDocument();
    expect(screen.getByText("Min")).toBeInTheDocument();
    expect(screen.getByText("Sec")).toBeInTheDocument();
  });

  it("hides units when show* props are false", () => {
    const target = new Date("2025-01-02T00:00:00Z");
    render(<Countdown targetDate={target} showDays={false} showSeconds={false} />);
    expect(screen.queryByText("Days")).not.toBeInTheDocument();
    expect(screen.queryByText("Sec")).not.toBeInTheDocument();
    expect(screen.getByText("Hours")).toBeInTheDocument();
    expect(screen.getByText("Min")).toBeInTheDocument();
  });

  it("accepts custom labels", () => {
    const target = new Date("2025-01-02T00:00:00Z");
    render(
      <Countdown
        targetDate={target}
        labels={{ days: "D", hours: "H", minutes: "M", seconds: "S" }}
      />
    );
    expect(screen.getByText("D")).toBeInTheDocument();
    expect(screen.getByText("H")).toBeInTheDocument();
    expect(screen.getByText("M")).toBeInTheDocument();
    expect(screen.getByText("S")).toBeInTheDocument();
  });

  it("renders compact variant as a span", () => {
    const target = new Date("2025-01-02T00:00:00Z");
    const { container } = render(<Countdown targetDate={target} variant="compact" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("SPAN");
  });

  it.each(["default", "cards", "minimal", "compact"] as const)(
    "renders variant=%s without error",
    (variant) => {
      const target = new Date("2025-01-02T00:00:00Z");
      const { container } = render(<Countdown targetDate={target} variant={variant} />);
      expect(container.firstElementChild).toBeTruthy();
    }
  );

  it.each(["sm", "md", "lg"] as const)(
    "renders size=%s without error",
    (size) => {
      const target = new Date("2025-01-02T00:00:00Z");
      const { container } = render(<Countdown targetDate={target} size={size} />);
      expect(container.firstElementChild).toBeTruthy();
    }
  );

  it("calls onComplete when countdown reaches zero", () => {
    const onComplete = vi.fn();
    const target = new Date("2025-01-01T00:00:02Z"); // 2 seconds ahead
    render(<Countdown targetDate={target} onComplete={onComplete} />);

    // Advance past the target
    vi.advanceTimersByTime(3000);
    expect(onComplete).toHaveBeenCalled();
  });

  it("accepts string targetDate", () => {
    const { container } = render(<Countdown targetDate="2025-01-02T00:00:00Z" />);
    expect(container.firstElementChild).toBeTruthy();
  });
});
