import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AnimatedNumber } from "../animated-number";

describe("AnimatedNumber", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders with a value", () => {
    render(<AnimatedNumber value={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<AnimatedNumber ref={ref} value={0} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("has displayName", () => {
    expect(AnimatedNumber.displayName).toBe("AnimatedNumber");
  });

  it("merges className", () => {
    render(<AnimatedNumber value={0} className="custom-class" />);
    const el = screen.getByText("0");
    expect(el.className).toContain("custom-class");
    expect(el.className).toContain("tabular-nums");
  });

  it("renders with prefix and suffix", () => {
    render(<AnimatedNumber value={100} prefix="$" suffix="%" />);
    expect(screen.getByText("$100%")).toBeInTheDocument();
  });

  it("renders decimals correctly", () => {
    render(<AnimatedNumber value={3.14159} decimals={2} />);
    expect(screen.getByText("3.14")).toBeInTheDocument();
  });

  it("uses custom formatValue", () => {
    const formatValue = (v: number) => `${Math.round(v)} items`;
    render(<AnimatedNumber value={5} formatValue={formatValue} />);
    expect(screen.getByText("5 items")).toBeInTheDocument();
  });

  it("renders as a span element", () => {
    render(<AnimatedNumber value={0} data-testid="an" />);
    const el = screen.getByTestId("an");
    expect(el.tagName).toBe("SPAN");
  });

  it("passes through additional HTML attributes", () => {
    render(<AnimatedNumber value={0} data-testid="animated" aria-label="count" />);
    const el = screen.getByTestId("animated");
    expect(el).toHaveAttribute("aria-label", "count");
  });
});
