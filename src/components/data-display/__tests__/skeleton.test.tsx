import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Skeleton, SkeletonText, SkeletonCircle } from "../skeleton";

describe("Skeleton", () => {
  it("renders a skeleton div", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("animate-pulse");
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("accepts className", () => {
    const { container } = render(<Skeleton className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("has aria-busy=true", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute("aria-busy", "true");
  });

  it("has aria-label=Loading", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute("aria-label", "Loading");
  });

  it("has default h-4 and w-full classes", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("h-4");
    expect(container.firstChild).toHaveClass("w-full");
  });

  it("has rounded-lg class", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("rounded-lg");
  });

  it("respects motion-reduce", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("motion-reduce:animate-none");
  });
});

// ── SkeletonText ──

describe("SkeletonText", () => {
  it("renders default 3 lines", () => {
    const { container } = render(<SkeletonText />);
    const lines = container.querySelectorAll(".h-3");
    expect(lines.length).toBe(3);
  });

  it("renders custom number of lines", () => {
    const { container } = render(<SkeletonText lines={5} />);
    const lines = container.querySelectorAll(".h-3");
    expect(lines.length).toBe(5);
  });

  it("last line has w-2/3 class", () => {
    const { container } = render(<SkeletonText lines={3} />);
    const lines = container.querySelectorAll(".h-3");
    expect(lines[2]).toHaveClass("w-2/3");
  });

  it("non-last lines have w-full class", () => {
    const { container } = render(<SkeletonText lines={3} />);
    const lines = container.querySelectorAll(".h-3");
    expect(lines[0]).toHaveClass("w-full");
    expect(lines[1]).toHaveClass("w-full");
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<SkeletonText ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has aria-busy=true", () => {
    const { container } = render(<SkeletonText />);
    expect(container.firstChild).toHaveAttribute("aria-busy", "true");
  });

  it("has aria-label=Loading text", () => {
    const { container } = render(<SkeletonText />);
    expect(container.firstChild).toHaveAttribute("aria-label", "Loading text");
  });

  it("accepts className", () => {
    const { container } = render(<SkeletonText className="custom-text" />);
    expect(container.firstChild).toHaveClass("custom-text");
  });
});

// ── SkeletonCircle ──

describe("SkeletonCircle", () => {
  it("renders with md size by default", () => {
    const { container } = render(<SkeletonCircle />);
    expect(container.firstChild).toHaveClass("rounded-full");
    expect(container.firstChild).toHaveClass("w-12");
    expect(container.firstChild).toHaveClass("h-12");
  });

  it("renders sm size", () => {
    const { container } = render(<SkeletonCircle size="sm" />);
    expect(container.firstChild).toHaveClass("w-8");
    expect(container.firstChild).toHaveClass("h-8");
  });

  it("renders lg size", () => {
    const { container } = render(<SkeletonCircle size="lg" />);
    expect(container.firstChild).toHaveClass("w-16");
    expect(container.firstChild).toHaveClass("h-16");
  });

  it.each(["sm", "md", "lg"] as const)("renders size=%s with rounded-full", (size) => {
    const { container } = render(<SkeletonCircle size={size} />);
    expect(container.firstChild).toHaveClass("rounded-full");
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<SkeletonCircle ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has aria-busy=true", () => {
    const { container } = render(<SkeletonCircle />);
    expect(container.firstChild).toHaveAttribute("aria-busy", "true");
  });

  it("has aria-label=Loading", () => {
    const { container } = render(<SkeletonCircle />);
    expect(container.firstChild).toHaveAttribute("aria-label", "Loading");
  });

  it("accepts className", () => {
    const { container } = render(<SkeletonCircle className="custom-circle" />);
    expect(container.firstChild).toHaveClass("custom-circle");
  });

  it("respects motion-reduce", () => {
    const { container } = render(<SkeletonCircle />);
    expect(container.firstChild).toHaveClass("motion-reduce:animate-none");
  });
});
