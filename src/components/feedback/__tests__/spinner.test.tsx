import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Spinner } from "../spinner";
import type { SpinnerType } from "../spinner";

const ALL_TYPES: SpinnerType[] = [
  "spin", "ring", "dual-ring", "dots", "bounce", "typing",
  "pulse", "ping", "ripple", "bars", "wave", "grid",
  "circle-fade", "chase", "orbit", "square",
];

describe("Spinner", () => {
  it("renders with status role", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has default aria-label 'Loading'", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading");
  });

  it("accepts custom label", () => {
    render(<Spinner label="Saving..." />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Saving...");
  });

  // ── All 16 types render ──

  it.each(ALL_TYPES)("renders %s type", (type) => {
    render(<Spinner type={type} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  // ── All sizes ──

  it.each(["xs", "sm", "md", "lg", "xl"] as const)("renders %s size", (size) => {
    render(<Spinner size={size} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  // ── All colors ──

  it.each([
    "primary", "secondary", "destructive", "success",
    "warning", "accent", "white", "muted", "current",
  ] as const)("renders %s color", (color) => {
    render(<Spinner color={color} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  // ── Thickness ──

  it.each(["thin", "default", "thick"] as const)("renders %s thickness", (t) => {
    render(<Spinner thickness={t} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  // ── Speed ──

  it.each(["slowest", "slow", "normal", "fast", "fastest"] as const)(
    "renders %s speed",
    (speed) => {
      render(<Spinner speed={speed} />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    },
  );

  // ── Element counts ──

  it("dots renders 3 dots", () => {
    const { container } = render(<Spinner type="dots" />);
    expect(container.querySelectorAll(".bg-current")).toHaveLength(3);
  });

  it("bounce renders 3 dots", () => {
    const { container } = render(<Spinner type="bounce" />);
    expect(container.querySelectorAll(".bg-current")).toHaveLength(3);
  });

  it("typing renders 3 dots", () => {
    const { container } = render(<Spinner type="typing" />);
    expect(container.querySelectorAll(".bg-current")).toHaveLength(3);
  });

  it("bars renders 4 bars", () => {
    const { container } = render(<Spinner type="bars" />);
    expect(container.querySelectorAll(".bg-current")).toHaveLength(4);
  });

  it("wave renders 5 bars", () => {
    const { container } = render(<Spinner type="wave" />);
    expect(container.querySelectorAll(".bg-current")).toHaveLength(5);
  });

  it("grid renders 9 cells", () => {
    const { container } = render(<Spinner type="grid" />);
    expect(container.querySelectorAll(".bg-current")).toHaveLength(9);
  });

  it("circle-fade renders 8 dots", () => {
    const { container } = render(<Spinner type="circle-fade" />);
    expect(container.querySelectorAll(".bg-current")).toHaveLength(8);
  });

  it("chase renders 6 dots", () => {
    const { container } = render(<Spinner type="chase" />);
    expect(container.querySelectorAll(".bg-current")).toHaveLength(6);
  });

  it("orbit renders 2 dots", () => {
    const { container } = render(<Spinner type="orbit" />);
    expect(container.querySelectorAll(".bg-current")).toHaveLength(2);
  });

  it("ring renders track and arc", () => {
    const { container } = render(<Spinner type="ring" />);
    expect(container.querySelectorAll(".rounded-full").length).toBeGreaterThanOrEqual(2);
  });

  it("dual-ring renders 2 rings", () => {
    const { container } = render(<Spinner type="dual-ring" />);
    expect(container.querySelectorAll(".rounded-full").length).toBeGreaterThanOrEqual(2);
  });

  it("ripple renders 2 rings", () => {
    const { container } = render(<Spinner type="ripple" />);
    expect(container.querySelectorAll(".rounded-full").length).toBeGreaterThanOrEqual(2);
  });

  // ── Overlay ──

  it("renders overlay wrapper when overlay is true", () => {
    const { container } = render(
      <div style={{ position: "relative" }}>
        <Spinner overlay />
      </div>,
    );
    expect(container.querySelector(".absolute.inset-0")).toBeInTheDocument();
  });

  it("does not render overlay by default", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector(".absolute.inset-0")).not.toBeInTheDocument();
  });

  // ── All types work with all sizes & fast speed ──

  it.each(ALL_TYPES)("%s works at xl + fast", (type) => {
    render(<Spinner type={type} size="xl" speed="fast" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it.each(ALL_TYPES)("%s works at slowest", (type) => {
    render(<Spinner type={type} speed="slowest" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it.each(ALL_TYPES)("%s works at fastest", (type) => {
    render(<Spinner type={type} speed="fastest" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
