import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Text } from "../text";

describe("Text", () => {
  it("renders text content", () => {
    render(<Text>Hello world</Text>);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders as p element by default", () => {
    render(<Text>Content</Text>);
    expect(screen.getByText("Content").tagName).toBe("P");
  });

  it("renders as custom element via 'as' prop", () => {
    render(<Text as="span">Content</Text>);
    expect(screen.getByText("Content").tagName).toBe("SPAN");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLElement | null };
    render(<Text ref={ref}>Content</Text>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("has correct displayName", () => {
    expect(Text.displayName).toBe("Text");
  });

  it("merges custom className", () => {
    render(<Text className="custom-class">Content</Text>);
    expect(screen.getByText("Content").className).toContain("custom-class");
  });

  it.each(["xs", "sm", "md", "lg", "xl"] as const)(
    "renders with size=%s without error",
    (size) => {
      render(<Text size={size}>S</Text>);
      expect(screen.getByText("S")).toBeInTheDocument();
    },
  );

  it.each(["normal", "medium", "semibold", "bold"] as const)(
    "renders with weight=%s without error",
    (weight) => {
      render(<Text weight={weight}>W</Text>);
      expect(screen.getByText("W")).toBeInTheDocument();
    },
  );

  it.each(["default", "muted", "subtle", "primary", "secondary", "success", "warning", "destructive"] as const)(
    "renders with color=%s without error",
    (color) => {
      render(<Text color={color}>C</Text>);
      expect(screen.getByText("C")).toBeInTheDocument();
    },
  );

  it.each(["left", "center", "right", "justify"] as const)(
    "renders with align=%s without error",
    (align) => {
      render(<Text align={align}>A</Text>);
      expect(screen.getByText("A")).toBeInTheDocument();
    },
  );

  it("applies truncate class when truncate is true", () => {
    render(<Text truncate>Long text</Text>);
    expect(screen.getByText("Long text").className).toContain("truncate");
  });

  it.each(["p", "span", "div", "label", "strong", "em", "small", "del", "ins", "mark"] as const)(
    "renders as element=%s",
    (el) => {
      render(<Text as={el}>T</Text>);
      expect(screen.getByText("T").tagName).toBe(el.toUpperCase());
    },
  );
});
