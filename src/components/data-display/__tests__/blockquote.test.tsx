import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Blockquote } from "../blockquote";

describe("Blockquote", () => {
  it("renders children", () => {
    render(<Blockquote>A wise quote</Blockquote>);
    expect(screen.getByText("A wise quote")).toBeInTheDocument();
  });

  it("forwards ref to the blockquote element", () => {
    const ref = { current: null as HTMLQuoteElement | null };
    render(<Blockquote ref={ref}>Quote</Blockquote>);
    expect(ref.current).toBeInstanceOf(HTMLQuoteElement);
    expect(ref.current?.tagName).toBe("BLOCKQUOTE");
  });

  it("has displayName", () => {
    expect(Blockquote.displayName).toBe("Blockquote");
  });

  it("merges className on the blockquote element", () => {
    render(<Blockquote className="custom-class">Quote</Blockquote>);
    const el = screen.getByText("Quote");
    expect(el.className).toContain("custom-class");
    expect(el.className).toContain("border-l-4");
  });

  it("renders the cite attribute", () => {
    render(<Blockquote cite="https://example.com">Quote</Blockquote>);
    const el = screen.getByText("Quote");
    expect(el).toHaveAttribute("cite", "https://example.com");
  });

  it("renders the author in a figcaption", () => {
    render(<Blockquote author="Jane Doe">Quote</Blockquote>);
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/).tagName).toBe("FIGCAPTION");
  });

  it("does not render figcaption when no author is provided", () => {
    const { container } = render(<Blockquote>Quote</Blockquote>);
    expect(container.querySelector("figcaption")).toBeNull();
  });

  it("wraps in a figure element", () => {
    const { container } = render(<Blockquote>Quote</Blockquote>);
    expect(container.querySelector("figure")).toBeTruthy();
  });

  it.each(["default", "primary", "success", "warning", "destructive"] as const)(
    "renders color=%s without error",
    (color) => {
      render(<Blockquote color={color}>Quote</Blockquote>);
      expect(screen.getByText("Quote")).toBeInTheDocument();
    }
  );

  it("applies primary color classes", () => {
    render(<Blockquote color="primary">Quote</Blockquote>);
    const el = screen.getByText("Quote");
    expect(el.className).toContain("border-primary");
  });

  it("applies destructive color classes", () => {
    render(<Blockquote color="destructive">Quote</Blockquote>);
    const el = screen.getByText("Quote");
    expect(el.className).toContain("destructive");
  });
});
