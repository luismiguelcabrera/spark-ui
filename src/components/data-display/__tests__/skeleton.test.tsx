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

// ── Animation prop ──

describe("Skeleton animation prop", () => {
  it("defaults to pulse animation", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("animate-pulse");
  });

  it("renders wave animation with shimmer classes", () => {
    const { container } = render(<Skeleton animation="wave" />);
    expect(container.firstChild).toHaveClass("bg-slate-200");
    expect(container.firstChild).toHaveClass("overflow-hidden");
    expect(container.firstChild).not.toHaveClass("animate-pulse");
  });

  it('renders no animation when animation="none"', () => {
    const { container } = render(<Skeleton animation="none" />);
    expect(container.firstChild).not.toHaveClass("animate-pulse");
    expect(container.firstChild).toHaveClass("bg-slate-200");
  });

  it("forces none animation when boilerplate=true regardless of animation prop", () => {
    const { container } = render(<Skeleton boilerplate animation="pulse" />);
    expect(container.firstChild).not.toHaveClass("animate-pulse");
    expect(container.firstChild).toHaveClass("bg-slate-200");
  });

  it("renders wave animation on type presets", () => {
    const { container } = render(<Skeleton type="card" animation="wave" />);
    const waveElements = container.querySelectorAll(".overflow-hidden");
    // Card has its own overflow-hidden and wave elements have it too
    expect(waveElements.length).toBeGreaterThan(0);
  });

  it("respects animation prop on SkeletonText", () => {
    const { container } = render(<SkeletonText animation="wave" />);
    const waveElements = container.querySelectorAll(".overflow-hidden");
    expect(waveElements.length).toBeGreaterThan(0);
  });

  it("respects animation prop on SkeletonCircle", () => {
    const { container } = render(<SkeletonCircle animation="wave" />);
    expect(container.firstChild).toHaveClass("overflow-hidden");
  });
});

// ── Preset types ──

describe("Skeleton type presets", () => {
  it.each([
    "text",
    "circle",
    "card",
    "list-item",
    "article",
    "table",
    "form",
    "profile",
    "comment",
  ] as const)("renders type=%s without error", (type) => {
    const { container } = render(<Skeleton type={type} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders card type with image and text areas", () => {
    const { container } = render(<Skeleton type="card" />);
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

  it("renders form type with label+input fields and button", () => {
    const { container } = render(<Skeleton type="form" />);
    const labels = container.querySelectorAll(".h-3.w-24");
    expect(labels.length).toBe(3);
    const inputs = container.querySelectorAll(".h-10");
    // 3 inputs + 1 button = 4
    expect(inputs.length).toBe(4);
  });

  it("renders profile type with avatar, name, and bio lines", () => {
    const { container } = render(<Skeleton type="profile" />);
    const avatar = container.querySelector(".w-16.h-16");
    expect(avatar).toBeInTheDocument();
    const name = container.querySelector(".h-4.w-32");
    expect(name).toBeInTheDocument();
    const bioLines = container.querySelectorAll(".h-3");
    expect(bioLines.length).toBe(3);
  });

  it("renders comment type with avatar, name, and text", () => {
    const { container } = render(<Skeleton type="comment" />);
    const avatar = container.querySelector(".w-10.h-10.rounded-full");
    expect(avatar).toBeInTheDocument();
    const name = container.querySelector(".h-4.w-28");
    expect(name).toBeInTheDocument();
    const textLines = container.querySelectorAll(".h-3");
    expect(textLines.length).toBe(3);
  });
});

// ── Count prop ──

describe("Skeleton count prop", () => {
  it("renders multiple list-items with count", () => {
    const { container } = render(<Skeleton type="list-item" count={5} />);
    const items = container.querySelectorAll(".rounded-full");
    expect(items.length).toBe(5);
  });

  it("renders multiple cards with count", () => {
    const { container } = render(<Skeleton type="card" count={3} />);
    const imageAreas = container.querySelectorAll(".h-40");
    expect(imageAreas.length).toBe(3);
  });

  it("wraps multiple items in a space-y container", () => {
    const { container } = render(<Skeleton type="list-item" count={3} />);
    expect(container.firstChild).toHaveClass("space-y-3");
  });

  it("does not wrap single item in space-y container", () => {
    const { container } = render(<Skeleton type="list-item" count={1} />);
    expect(container.firstChild).not.toHaveClass("space-y-3");
  });

  it("defaults count to 1", () => {
    const { container } = render(<Skeleton type="list-item" />);
    const items = container.querySelectorAll(".rounded-full");
    expect(items.length).toBe(1);
  });

  it("ignores count when type is not set", () => {
    const { container } = render(<Skeleton count={5} />);
    expect(container.children.length).toBe(1);
  });

  it("treats count < 1 as 1", () => {
    const { container } = render(<Skeleton type="comment" count={0} />);
    const avatars = container.querySelectorAll(".rounded-full");
    expect(avatars.length).toBe(1);
  });
});

// ── Width / Height props ──

describe("Skeleton width and height props", () => {
  it("applies custom width via inline style", () => {
    const { container } = render(<Skeleton width="200px" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("200px");
  });

  it("applies custom height via inline style", () => {
    const { container } = render(<Skeleton height="3rem" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.height).toBe("3rem");
  });

  it("applies both width and height", () => {
    const { container } = render(<Skeleton width="100%" height="40px" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("100%");
    expect(el.style.height).toBe("40px");
  });

  it("removes default w-full class when width is set", () => {
    const { container } = render(<Skeleton width="200px" />);
    expect(container.firstChild).not.toHaveClass("w-full");
  });

  it("removes default h-4 class when height is set", () => {
    const { container } = render(<Skeleton height="60px" />);
    expect(container.firstChild).not.toHaveClass("h-4");
  });

  it("keeps default classes when width/height are not set", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("h-4");
    expect(container.firstChild).toHaveClass("w-full");
  });
});

// ── BorderRadius prop ──

describe("Skeleton borderRadius prop", () => {
  it("defaults to rounded-lg (md)", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("rounded-lg");
  });

  it.each([
    ["none", "rounded-none"],
    ["sm", "rounded-sm"],
    ["md", "rounded-lg"],
    ["lg", "rounded-xl"],
    ["full", "rounded-full"],
  ] as const)("renders borderRadius=%s with class %s", (radius, expectedClass) => {
    const { container } = render(<Skeleton borderRadius={radius} />);
    expect(container.firstChild).toHaveClass(expectedClass);
  });
});

// ── Boilerplate prop ──

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

// ── SkeletonText ──

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

// ── SkeletonCircle ──

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
