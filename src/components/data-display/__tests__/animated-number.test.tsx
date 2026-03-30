import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AnimatedNumber, easingFunctions } from "../animated-number";

describe("AnimatedNumber", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // -----------------------------------------------------------------------
  // Basic rendering
  // -----------------------------------------------------------------------

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

  // -----------------------------------------------------------------------
  // Formatting
  // -----------------------------------------------------------------------

  it("renders with prefix and suffix", () => {
    render(<AnimatedNumber value={100} prefix="$" suffix="%" data-testid="ps" />);
    expect(screen.getByTestId("ps").textContent).toBe("$100%");
  });

  it("renders decimals correctly", () => {
    render(<AnimatedNumber value={3.14159} decimals={2} />);
    expect(screen.getByText("3.14")).toBeInTheDocument();
  });

  it("uses custom formatValue", () => {
    const formatValue = (v: number) => `${Math.round(v)} items`;
    render(<AnimatedNumber value={5} formatValue={formatValue} data-testid="fmt" />);
    expect(screen.getByTestId("fmt").textContent).toBe("5 items");
  });

  it("uses locale formatting", () => {
    render(<AnimatedNumber value={1234567.89} locale="en-US" decimals={2} />);
    expect(screen.getByText("1,234,567.89")).toBeInTheDocument();
  });

  it("locale formatting respects decimals", () => {
    render(<AnimatedNumber value={1000} locale="en-US" decimals={0} />);
    expect(screen.getByText("1,000")).toBeInTheDocument();
  });

  it("formatValue takes priority over locale", () => {
    const fmt = (v: number) => `custom:${Math.round(v)}`;
    render(<AnimatedNumber value={42} formatValue={fmt} locale="en-US" data-testid="fmt-prio" />);
    expect(screen.getByTestId("fmt-prio").textContent).toBe("custom:42");
  });

  it("supports compact notation with locale", () => {
    render(<AnimatedNumber value={1500} locale="en-US" notation="compact" data-testid="compact" />);
    const el = screen.getByTestId("compact");
    // Intl.NumberFormat compact notation produces "1.5K" or "2K" depending on value
    expect(el.textContent).toMatch(/\dK/);
  });

  // -----------------------------------------------------------------------
  // from prop
  // -----------------------------------------------------------------------

  it("uses from as initial display value", () => {
    render(<AnimatedNumber value={100} from={0} data-testid="from-test" />);
    const el = screen.getByTestId("from-test");
    expect(el.textContent).toBe("0");
  });

  it("from only applies on mount, not on subsequent renders", () => {
    const { rerender } = render(
      <AnimatedNumber value={100} from={0} data-testid="from-mount" />,
    );
    // Re-render with a different from — should not jump back to new from
    rerender(<AnimatedNumber value={200} from={50} data-testid="from-mount" />);
    const el = screen.getByTestId("from-mount");
    // Should NOT show "50" — from is only used on mount
    expect(el.textContent).not.toBe("50");
  });

  // -----------------------------------------------------------------------
  // Accessibility
  // -----------------------------------------------------------------------

  it("sets aria-live='polite' by default", () => {
    render(<AnimatedNumber value={42} data-testid="a11y" />);
    const el = screen.getByTestId("a11y");
    expect(el).toHaveAttribute("aria-live", "polite");
    expect(el).toHaveAttribute("aria-atomic", "true");
  });

  it("sets aria-live to assertive when announce='assertive'", () => {
    render(<AnimatedNumber value={42} announce="assertive" data-testid="a11y" />);
    const el = screen.getByTestId("a11y");
    expect(el).toHaveAttribute("aria-live", "assertive");
  });

  it("does not set aria-live when announce='off'", () => {
    render(<AnimatedNumber value={42} announce="off" data-testid="a11y" />);
    const el = screen.getByTestId("a11y");
    expect(el).not.toHaveAttribute("aria-live");
    expect(el).not.toHaveAttribute("aria-atomic");
  });

  // -----------------------------------------------------------------------
  // Reduced motion
  // -----------------------------------------------------------------------

  it("snaps to value immediately when prefers-reduced-motion is set", () => {
    const mql = {
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    };
    vi.spyOn(window, "matchMedia").mockReturnValue(mql as unknown as MediaQueryList);

    const onComplete = vi.fn();
    render(<AnimatedNumber value={100} from={0} onComplete={onComplete} data-testid="rm" />);

    const el = screen.getByTestId("rm");
    expect(el.textContent).toBe("100");
    expect(onComplete).toHaveBeenCalledTimes(1);

    vi.restoreAllMocks();
  });

  // -----------------------------------------------------------------------
  // onComplete callback
  // -----------------------------------------------------------------------

  it("does not call onComplete when no animation is needed", () => {
    const onComplete = vi.fn();
    render(<AnimatedNumber value={50} onComplete={onComplete} />);
    expect(onComplete).not.toHaveBeenCalled();
  });

  // -----------------------------------------------------------------------
  // Easing presets
  // -----------------------------------------------------------------------

  it("exports easing functions", () => {
    expect(easingFunctions.linear(0.5)).toBe(0.5);
    expect(easingFunctions.easeIn(0)).toBe(0);
    expect(easingFunctions.easeIn(1)).toBe(1);
    expect(easingFunctions.easeOut(0)).toBe(0);
    expect(easingFunctions.easeOut(1)).toBe(1);
    expect(easingFunctions.easeInOut(0)).toBe(0);
    expect(easingFunctions.easeInOut(1)).toBe(1);
  });

  it("easeInOut midpoint is 0.5", () => {
    expect(easingFunctions.easeInOut(0.5)).toBe(0.5);
  });

  it("accepts a custom easing function", () => {
    const customEasing = vi.fn((t: number) => t);
    render(<AnimatedNumber value={100} from={0} easing={customEasing} data-testid="custom-ease" />);
    expect(screen.getByTestId("custom-ease")).toBeInTheDocument();
  });

  it.each(["linear", "easeIn", "easeOut", "easeInOut"] as const)(
    "accepts easing preset '%s'",
    (preset) => {
      const { unmount } = render(<AnimatedNumber value={10} easing={preset} />);
      unmount();
    },
  );

  // -----------------------------------------------------------------------
  // Delay
  // -----------------------------------------------------------------------

  it("accepts a delay prop without error", () => {
    render(<AnimatedNumber value={100} delay={500} data-testid="delay" />);
    expect(screen.getByTestId("delay")).toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Trend
  // -----------------------------------------------------------------------

  it("applies trend='up' green color class", () => {
    render(<AnimatedNumber value={100} trend="up" data-testid="trend-up" />);
    const el = screen.getByTestId("trend-up");
    expect(el.className).toContain("text-green-600");
  });

  it("applies trend='down' red color class", () => {
    render(<AnimatedNumber value={100} trend="down" data-testid="trend-down" />);
    const el = screen.getByTestId("trend-down");
    expect(el.className).toContain("text-red-600");
  });

  it("applies no extra color for trend='neutral'", () => {
    render(<AnimatedNumber value={100} trend="neutral" data-testid="trend-neutral" />);
    const el = screen.getByTestId("trend-neutral");
    expect(el.className).not.toContain("text-green");
    expect(el.className).not.toContain("text-red");
  });

  it("trend='auto' resolves based on value vs from", () => {
    render(<AnimatedNumber value={100} from={50} trend="auto" data-testid="trend-auto" />);
    const el = screen.getByTestId("trend-auto");
    expect(el.className).toContain("text-green-600");
  });

  it("trend='auto' resolves down when value < from", () => {
    render(<AnimatedNumber value={10} from={50} trend="auto" data-testid="trend-auto-down" />);
    const el = screen.getByTestId("trend-auto-down");
    expect(el.className).toContain("text-red-600");
  });

  it("shows trend icon when showTrendIcon is true", () => {
    render(<AnimatedNumber value={100} trend="up" showTrendIcon data-testid="trend-icon" />);
    const el = screen.getByTestId("trend-icon");
    expect(el.textContent).toContain("\u25B2"); // ▲
  });

  it("does not show trend icon for neutral", () => {
    render(<AnimatedNumber value={100} trend="neutral" showTrendIcon data-testid="trend-neutral-icon" />);
    const el = screen.getByTestId("trend-neutral-icon");
    expect(el.textContent).not.toContain("\u25B2");
    expect(el.textContent).not.toContain("\u25BC");
  });

  // -----------------------------------------------------------------------
  // asChild (polymorphism via Slot)
  // -----------------------------------------------------------------------

  it("renders as child element when asChild is true", () => {
    render(
      <AnimatedNumber value={42} asChild data-testid="as-child">
        <h2 />
      </AnimatedNumber>,
    );
    const el = screen.getByTestId("as-child");
    expect(el.tagName).toBe("H2");
    expect(el.textContent).toBe("42");
  });

  it("merges className on asChild element", () => {
    render(
      <AnimatedNumber value={42} asChild className="extra">
        <p className="child-class" />
      </AnimatedNumber>,
    );
    const el = screen.getByText("42");
    expect(el.tagName).toBe("P");
    expect(el.className).toContain("tabular-nums");
    expect(el.className).toContain("extra");
    expect(el.className).toContain("child-class");
  });

  // -----------------------------------------------------------------------
  // Compact notation
  // -----------------------------------------------------------------------

  it("notation='standard' is the default (no compact)", () => {
    render(<AnimatedNumber value={1500} locale="en-US" data-testid="standard" />);
    const el = screen.getByTestId("standard");
    expect(el.textContent).toBe("1,500");
  });

  it("warns in dev when notation='compact' is used without locale", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<AnimatedNumber value={1000} notation="compact" data-testid="no-locale" />);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('notation="compact"` requires `locale`'),
    );
    warnSpy.mockRestore();
  });

  // -----------------------------------------------------------------------
  // Edge cases
  // -----------------------------------------------------------------------

  it("handles negative values", () => {
    render(<AnimatedNumber value={-42} decimals={1} data-testid="neg" />);
    expect(screen.getByTestId("neg").textContent).toBe("-42.0");
  });

  it("handles negative values with prefix", () => {
    render(<AnimatedNumber value={-100} prefix="$" data-testid="neg-prefix" />);
    expect(screen.getByTestId("neg-prefix").textContent).toBe("$-100");
  });

  it("does not animate when re-rendered with the same value", () => {
    const onComplete = vi.fn();
    const { rerender } = render(
      <AnimatedNumber value={50} onComplete={onComplete} data-testid="same" />,
    );
    rerender(<AnimatedNumber value={50} onComplete={onComplete} data-testid="same" />);
    // diff === 0, no animation, no onComplete
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("trend='auto' without from resolves as neutral", () => {
    render(<AnimatedNumber value={100} trend="auto" data-testid="auto-no-from" />);
    const el = screen.getByTestId("auto-no-from");
    // Without from, baseline equals value → neutral → no trend color
    expect(el.className).not.toContain("text-green");
    expect(el.className).not.toContain("text-red");
  });

  it("cleans up animation on unmount", () => {
    const cancelSpy = vi.spyOn(window, "cancelAnimationFrame");
    const { unmount } = render(<AnimatedNumber value={100} from={0} />);
    unmount();
    expect(cancelSpy).toHaveBeenCalled();
    cancelSpy.mockRestore();
  });
});
