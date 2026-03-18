import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Heading } from "../heading";

describe("Heading", () => {
  it("renders children", () => {
    render(<Heading>Hello World</Heading>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLHeadingElement | null };
    render(<Heading ref={ref}>Title</Heading>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });

  it("has displayName", () => {
    expect(Heading.displayName).toBe("Heading");
  });

  it("merges className", () => {
    render(<Heading className="custom-heading">Title</Heading>);
    const el = screen.getByText("Title");
    expect(el.className).toContain("custom-heading");
    expect(el.className).toContain("font-bold");
  });

  it("defaults to h2 element", () => {
    render(<Heading>Title</Heading>);
    expect(screen.getByText("Title").tagName).toBe("H2");
  });

  it.each([
    ["h1", "H1"],
    ["h2", "H2"],
    ["h3", "H3"],
    ["h4", "H4"],
    ["h5", "H5"],
    ["h6", "H6"],
  ] as const)("renders as=%s as %s element", (as, tag) => {
    render(<Heading as={as}>Title</Heading>);
    expect(screen.getByText("Title").tagName).toBe(tag);
  });

  it("auto-selects heading level based on size", () => {
    // size 4xl -> h1
    render(<Heading size="4xl">Big Title</Heading>);
    expect(screen.getByText("Big Title").tagName).toBe("H1");
  });

  it("auto-selects h3 for size=lg", () => {
    render(<Heading size="lg">Medium</Heading>);
    expect(screen.getByText("Medium").tagName).toBe("H3");
  });

  it("auto-selects h6 for size=xs", () => {
    render(<Heading size="xs">Small</Heading>);
    expect(screen.getByText("Small").tagName).toBe("H6");
  });

  it("as prop overrides auto heading level", () => {
    render(<Heading as="h1" size="xs">Override</Heading>);
    expect(screen.getByText("Override").tagName).toBe("H1");
  });

  it.each(["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const)(
    "renders size=%s without error",
    (size) => {
      render(<Heading size={size}>Title</Heading>);
      expect(screen.getByText("Title")).toBeInTheDocument();
    }
  );

  it.each(["normal", "medium", "semibold", "bold", "extrabold", "black"] as const)(
    "renders weight=%s without error",
    (weight) => {
      render(<Heading weight={weight}>Title</Heading>);
      expect(screen.getByText("Title")).toBeInTheDocument();
    }
  );

  it("applies size class text-2xl for default xl", () => {
    render(<Heading>Title</Heading>);
    expect(screen.getByText("Title").className).toContain("text-2xl");
  });

  it("applies weight class", () => {
    render(<Heading weight="extrabold">Bold Title</Heading>);
    expect(screen.getByText("Bold Title").className).toContain("font-extrabold");
  });
});
