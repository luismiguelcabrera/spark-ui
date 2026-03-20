import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Highlight } from "../highlight";

describe("Highlight", () => {
  it("renders children", () => {
    render(<Highlight>Important text</Highlight>);
    expect(screen.getByText("Important text")).toBeInTheDocument();
  });

  it("renders as a mark element", () => {
    render(<Highlight>text</Highlight>);
    expect(screen.getByText("text").tagName).toBe("MARK");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLElement | null };
    render(<Highlight ref={ref}>text</Highlight>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("MARK");
  });

  it("has displayName", () => {
    expect(Highlight.displayName).toBe("Highlight");
  });

  it("merges className", () => {
    render(<Highlight className="custom-hl">text</Highlight>);
    const el = screen.getByText("text");
    expect(el.className).toContain("custom-hl");
    expect(el.className).toContain("rounded-sm");
  });

  it("defaults to yellow color", () => {
    render(<Highlight>text</Highlight>);
    const el = screen.getByText("text");
    expect(el.className).toContain("bg-warning");
    expect(el.className).toContain("text-navy-text");
  });

  it.each(["yellow", "green", "blue", "pink", "purple", "orange"] as const)(
    "renders color=%s without error",
    (color) => {
      render(<Highlight color={color}>text</Highlight>);
      const el = screen.getByText("text");
      expect(el).toBeInTheDocument();
    }
  );

  it("applies green color classes", () => {
    render(<Highlight color="green">text</Highlight>);
    const el = screen.getByText("text");
    expect(el.className).toContain("bg-success");
    expect(el.className).toContain("text-navy-text");
  });

  it("passes through additional HTML attributes", () => {
    render(<Highlight data-testid="hl" aria-label="highlighted">text</Highlight>);
    const el = screen.getByTestId("hl");
    expect(el).toHaveAttribute("aria-label", "highlighted");
  });
});
