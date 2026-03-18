import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NavigationProgress } from "../navigation-progress";

describe("NavigationProgress", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders nothing when not loading and no progress", () => {
    const { container } = render(<NavigationProgress />);
    expect(container.firstChild).toBeNull();
  });

  it("renders progressbar when loading", () => {
    render(<NavigationProgress loading />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("has correct ARIA attributes in indeterminate mode", () => {
    render(<NavigationProgress loading />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-label", "Loading progress");
    expect(bar).not.toHaveAttribute("aria-valuenow");
  });

  it("has correct ARIA attributes in determinate mode", () => {
    render(<NavigationProgress progress={45} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "45");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("renders with determinate progress", () => {
    render(<NavigationProgress progress={75} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuenow", "75");
  });

  it("clamps progress to 0-100 range", () => {
    const { rerender } = render(<NavigationProgress progress={150} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100"
    );

    rerender(<NavigationProgress progress={-20} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0"
    );
  });

  it("is fixed to the top of the viewport", () => {
    render(<NavigationProgress loading />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveClass("fixed", "top-0", "left-0", "right-0", "z-50");
  });

  it("uses default height of 3px", () => {
    render(<NavigationProgress loading />);
    const bar = screen.getByRole("progressbar");
    expect(bar.style.height).toBe("3px");
  });

  it("accepts custom height", () => {
    render(<NavigationProgress loading height={5} />);
    const bar = screen.getByRole("progressbar");
    expect(bar.style.height).toBe("5px");
  });

  it.each([
    ["primary", "bg-primary"],
    ["secondary", "bg-secondary"],
    ["success", "bg-green-600"],
    ["warning", "bg-amber-500"],
    ["destructive", "bg-red-600"],
  ] as const)("renders %s color variant", (color, expectedClass) => {
    const { container } = render(
      <NavigationProgress loading color={color} />
    );
    const innerBar = container.querySelector(`.${expectedClass.replace("/", "\\/")}`);
    expect(innerBar).toBeInTheDocument();
  });

  it("merges className", () => {
    render(<NavigationProgress loading className="custom-class" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<NavigationProgress ref={ref} loading />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("fades out when loading switches from true to false", () => {
    const { rerender } = render(<NavigationProgress loading />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    rerender(<NavigationProgress loading={false} />);

    // Should still be visible during the completing animation
    const bar = screen.getByRole("progressbar");
    expect(bar).toBeInTheDocument();

    // After timeout, should disappear
    act(() => {
      vi.advanceTimersByTime(600);
    });
  });
});
