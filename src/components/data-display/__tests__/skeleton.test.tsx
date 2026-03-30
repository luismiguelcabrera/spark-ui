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
});

describe("Skeleton type presets", () => {
  it.each(["text", "circle", "card", "list-item", "article", "table"] as const)(
    "renders type=%s without error",
    (type) => {
      const { container } = render(<Skeleton type={type} />);
      expect(container.firstChild).toBeInTheDocument();
    }
  );

  it("renders card type with image and text areas", () => {
    const { container } = render(<Skeleton type="card" />);
    // Card has a rounded-2xl container with image area (h-40) and text lines
    const skeleton = container.firstChild;
    expect(skeleton).toBeInTheDocument();
    const imageArea = container.querySelector(".h-40");
    expect(imageArea).toBeInTheDocument();
  });

  it("renders list-item type with avatar and text", () => {
    const { container } = render(<Skeleton type="list-item" />);
    const avatar = container.querySelector(".rounded-full");
    expect(avatar).toBeInTheDocument();
  });

  it("renders article type with title and paragraphs", () => {
    const { container } = render(<Skeleton type="article" />);
    const title = container.querySelector(".h-6");
    expect(title).toBeInTheDocument();
  });

  it("renders table type with header and rows", () => {
    const { container } = render(<Skeleton type="table" />);
    // Table has multiple flex rows
    const rows = container.querySelectorAll(".flex.gap-4");
    expect(rows.length).toBeGreaterThanOrEqual(4);
  });

  it("renders text type with multiple lines", () => {
    const { container } = render(<Skeleton type="text" />);
    const lines = container.querySelectorAll(".h-3");
    expect(lines.length).toBe(3);
  });

  it("renders circle type", () => {
    const { container } = render(<Skeleton type="circle" />);
    const circle = container.querySelector(".rounded-full");
    expect(circle).toBeInTheDocument();
  });
});

describe("Skeleton boilerplate prop", () => {
  it("renders without animation when boilerplate=true", () => {
    const { container } = render(<Skeleton boilerplate />);
    expect(container.firstChild).not.toHaveClass("animate-pulse");
    expect(container.firstChild).toHaveClass("bg-slate-200");
  });

  it("renders type preset without animation when boilerplate=true", () => {
    const { container } = render(<Skeleton type="card" boilerplate />);
    const animatedElements = container.querySelectorAll(".animate-pulse");
    expect(animatedElements.length).toBe(0);
  });

  it("renders type preset with animation by default", () => {
    const { container } = render(<Skeleton type="card" />);
    const animatedElements = container.querySelectorAll(".animate-pulse");
    expect(animatedElements.length).toBeGreaterThan(0);
  });
});

describe("SkeletonText", () => {
  it("renders default 3 lines", () => {
    const { container } = render(<SkeletonText />);
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(3);
  });

  it("renders custom number of lines", () => {
    const { container } = render(<SkeletonText lines={5} />);
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(5);
  });

  it("renders without animation when boilerplate=true", () => {
    const { container } = render(<SkeletonText boilerplate />);
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(0);
  });
});

describe("SkeletonCircle", () => {
  it("renders with md size by default", () => {
    const { container } = render(<SkeletonCircle />);
    expect(container.firstChild).toHaveClass("rounded-full");
  });

  it.each(["sm", "md", "lg"] as const)("renders size=%s", (size) => {
    const { container } = render(<SkeletonCircle size={size} />);
    expect(container.firstChild).toHaveClass("rounded-full");
  });

  it("renders without animation when boilerplate=true", () => {
    const { container } = render(<SkeletonCircle boilerplate />);
    expect(container.firstChild).not.toHaveClass("animate-pulse");
  });
});
