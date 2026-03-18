import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Prose } from "../prose";

describe("Prose", () => {
  it("renders children", () => {
    render(<Prose><p>Hello world</p></Prose>);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders as a div element", () => {
    const { container } = render(<Prose>Content</Prose>);
    expect(container.firstElementChild!.tagName).toBe("DIV");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Prose ref={ref}>Content</Prose>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(Prose.displayName).toBe("Prose");
  });

  it("merges custom className", () => {
    const { container } = render(<Prose className="custom-class">Content</Prose>);
    expect(container.firstElementChild!.className).toContain("custom-class");
  });

  it("applies default size (md) classes", () => {
    const { container } = render(<Prose>Content</Prose>);
    expect(container.firstElementChild!.className).toContain("max-w-prose");
  });

  it.each(["sm", "md", "lg", "xl", "full"] as const)(
    "renders with size=%s without error",
    (size) => {
      const { container } = render(<Prose size={size}>Content</Prose>);
      expect(container.firstElementChild).toBeInTheDocument();
    },
  );

  it("applies typography styles to child elements", () => {
    const { container } = render(<Prose>Content</Prose>);
    const el = container.firstElementChild!;
    expect(el.className).toContain("leading-relaxed");
  });
});
