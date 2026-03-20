import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FieldDescription } from "../field-description";

describe("FieldDescription", () => {
  it("renders children text", () => {
    render(<FieldDescription>Enter your email address</FieldDescription>);
    expect(screen.getByText("Enter your email address")).toBeInTheDocument();
  });

  it("renders as a <p> element", () => {
    render(<FieldDescription>Help text</FieldDescription>);
    expect(screen.getByText("Help text").tagName).toBe("P");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLParagraphElement | null };
    render(<FieldDescription ref={ref}>Help</FieldDescription>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it("has displayName", () => {
    expect(FieldDescription.displayName).toBe("FieldDescription");
  });

  it("merges className", () => {
    render(
      <FieldDescription className="custom-desc">Help</FieldDescription>,
    );
    expect(screen.getByText("Help")).toHaveClass("custom-desc");
  });

  it("has default styling", () => {
    render(<FieldDescription>Help</FieldDescription>);
    const el = screen.getByText("Help");
    expect(el.className).toContain("text-xs");
    expect(el.className).toContain("text-muted-foreground");
  });

  it("spreads additional HTML attributes", () => {
    render(<FieldDescription id="desc-1">Help</FieldDescription>);
    expect(screen.getByText("Help")).toHaveAttribute("id", "desc-1");
  });
});
