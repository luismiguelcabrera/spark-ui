import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Spinner } from "../spinner";

describe("Spinner", () => {
  it("renders with status role", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has default aria-label 'Loading'", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading");
  });

  // ── All sizes ──

  it.each(["sm", "md", "lg"] as const)("renders %s size", (size) => {
    render(<Spinner size={size} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  // ── All colors ──

  it.each(["primary", "white", "muted"] as const)("renders %s color", (color) => {
    render(<Spinner color={color} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  // ── Size classes ──

  it("applies sm size classes", () => {
    render(<Spinner size="sm" />);
    expect(screen.getByRole("status")).toHaveClass("w-4", "h-4");
  });

  it("applies md size classes by default", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveClass("w-6", "h-6");
  });

  it("applies lg size classes", () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole("status")).toHaveClass("w-8", "h-8");
  });

  // ── Color classes ──

  it("applies primary color by default", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveClass("text-primary");
  });

  it("applies white color class", () => {
    render(<Spinner color="white" />);
    expect(screen.getByRole("status")).toHaveClass("text-white");
  });

  it("applies muted color class", () => {
    render(<Spinner color="muted" />);
    expect(screen.getByRole("status")).toHaveClass("text-muted-foreground");
  });

  // ── Spinner base classes ──

  it("renders as a span with spinner animation classes", () => {
    render(<Spinner />);
    const el = screen.getByRole("status");
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveClass("animate-spin");
    expect(el).toHaveClass("rounded-full");
  });

  // ── Ref forwarding ──

  it("forwards ref", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<Spinner ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  // ── className merging ──

  it("merges className", () => {
    render(<Spinner className="custom-class" />);
    expect(screen.getByRole("status")).toHaveClass("custom-class");
  });

  // ── displayName ──

  it("has displayName", () => {
    expect(Spinner.displayName).toBe("Spinner");
  });
});
