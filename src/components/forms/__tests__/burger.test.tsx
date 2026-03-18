import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Burger } from "../burger";

// Mock matchMedia for usePrefersReducedMotion
function mockMatchMedia(reducedMotion = false) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)" ? reducedMotion : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("Burger", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  // ── Rendering ──

  it("renders a button element", { timeout: 30000 }, () => {
    render(<Burger opened={false} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders 3 bars", () => {
    render(<Burger opened={false} />);
    expect(screen.getByTestId("burger-bar-top")).toBeInTheDocument();
    expect(screen.getByTestId("burger-bar-middle")).toBeInTheDocument();
    expect(screen.getByTestId("burger-bar-bottom")).toBeInTheDocument();
  });

  it("defaults to type='button'", () => {
    render(<Burger opened={false} />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  // ── Aria attributes ──

  it("has default aria-label 'Toggle navigation'", () => {
    render(<Burger opened={false} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Toggle navigation");
  });

  it("accepts custom aria-label", () => {
    render(<Burger opened={false} aria-label="Open menu" />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Open menu");
  });

  it("sets aria-expanded=false when closed", () => {
    render(<Burger opened={false} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });

  it("sets aria-expanded=true when opened", () => {
    render(<Burger opened={true} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  // ── Click behavior ──

  it("calls onToggle when clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<Burger opened={false} onToggle={onToggle} />);
    await user.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("does not call onToggle when disabled", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<Burger opened={false} onToggle={onToggle} disabled />);
    await user.click(screen.getByRole("button"));
    expect(onToggle).not.toHaveBeenCalled();
  });

  // ── Disabled state ──

  it("is disabled when disabled prop is true", () => {
    render(<Burger opened={false} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("has disabled styling classes", () => {
    render(<Burger opened={false} disabled />);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("disabled:opacity-50");
    expect(cls).toContain("disabled:cursor-not-allowed");
  });

  // ── Size variants ──

  it.each([
    ["xs", 24],
    ["sm", 30],
    ["md", 36],
    ["lg", 42],
    ["xl", 48],
  ] as const)("applies %s size (%dpx)", (size, expectedSize) => {
    render(<Burger opened={false} size={size} />);
    const btn = screen.getByRole("button");
    expect(btn.style.width).toBe(`${expectedSize}px`);
    expect(btn.style.height).toBe(`${expectedSize}px`);
  });

  it("defaults to md size", () => {
    render(<Burger opened={false} />);
    const btn = screen.getByRole("button");
    expect(btn.style.width).toBe("36px");
    expect(btn.style.height).toBe("36px");
  });

  // ── Animation / opened state ──

  it("fades middle bar when opened", () => {
    render(<Burger opened={true} />);
    const middle = screen.getByTestId("burger-bar-middle");
    expect(middle.style.opacity).toBe("0");
  });

  it("shows middle bar when closed", () => {
    render(<Burger opened={false} />);
    const middle = screen.getByTestId("burger-bar-middle");
    expect(middle.style.opacity).toBe("1");
  });

  it("applies rotation to top bar when opened", () => {
    render(<Burger opened={true} />);
    const top = screen.getByTestId("burger-bar-top");
    expect(top.style.transform).toContain("rotate(45deg)");
  });

  it("applies rotation to bottom bar when opened", () => {
    render(<Burger opened={true} />);
    const bottom = screen.getByTestId("burger-bar-bottom");
    expect(bottom.style.transform).toContain("rotate(-45deg)");
  });

  it("no rotation on top bar when closed", () => {
    render(<Burger opened={false} />);
    const top = screen.getByTestId("burger-bar-top");
    expect(top.style.transform).toContain("rotate(0)");
  });

  // ── Custom color ──

  it("uses custom color for bars", () => {
    render(<Burger opened={false} color="red" />);
    const top = screen.getByTestId("burger-bar-top");
    expect(top.style.backgroundColor).toBe("red");
  });

  it("defaults to currentColor", () => {
    render(<Burger opened={false} />);
    const top = screen.getByTestId("burger-bar-top");
    expect(top.style.backgroundColor.toLowerCase()).toBe("currentcolor");
  });

  // ── Transition duration ──

  it("applies custom transition duration", () => {
    render(<Burger opened={false} transitionDuration={500} />);
    const top = screen.getByTestId("burger-bar-top");
    expect(top.style.transitionDuration).toBe("500ms");
  });

  it("defaults to 300ms transition", () => {
    render(<Burger opened={false} />);
    const top = screen.getByTestId("burger-bar-top");
    expect(top.style.transitionDuration).toBe("300ms");
  });

  // ── Prefers reduced motion ──

  it("disables transition when prefers-reduced-motion", () => {
    mockMatchMedia(true);
    render(<Burger opened={false} />);
    const top = screen.getByTestId("burger-bar-top");
    expect(top.style.transitionDuration).toBe("0ms");
  });

  // ── Focus ring ──

  it("has focus-visible ring classes", () => {
    render(<Burger opened={false} />);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("focus-visible:ring-2");
    expect(cls).toContain("focus-visible:ring-offset-2");
  });

  // ── Ref forwarding ──

  it("forwards ref", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Burger ref={ref} opened={false} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  // ── className merging ──

  it("merges custom className", () => {
    render(<Burger opened={false} className="my-custom-class" />);
    expect(screen.getByRole("button")).toHaveClass("my-custom-class");
  });

  // ── Keyboard interaction ──

  it("can be activated with Enter key", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<Burger opened={false} onToggle={onToggle} />);
    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("can be activated with Space key", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<Burger opened={false} onToggle={onToggle} />);
    screen.getByRole("button").focus();
    await user.keyboard(" ");
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
