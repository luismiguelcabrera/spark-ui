import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { Footer } from "../footer";

describe("Footer", () => {
  it("renders a <footer> element", () => {
    render(<Footer data-testid="footer">Content</Footer>);
    const el = screen.getByTestId("footer");
    expect(el.tagName).toBe("FOOTER");
    expect(el).toHaveTextContent("Content");
  });

  it("renders children", () => {
    render(<Footer><span>Copyright 2024</span></Footer>);
    expect(screen.getByText("Copyright 2024")).toBeInTheDocument();
  });

  it("applies fixed classes when fixed=true", () => {
    render(<Footer fixed data-testid="footer" />);
    const el = screen.getByTestId("footer");
    expect(el.className).toContain("fixed");
    expect(el.className).toContain("bottom-0");
  });

  it("does not apply fixed classes by default", () => {
    render(<Footer data-testid="footer" />);
    const el = screen.getByTestId("footer");
    expect(el.className).not.toContain("fixed");
  });

  it("applies border when bordered=true", () => {
    render(<Footer bordered data-testid="footer" />);
    const el = screen.getByTestId("footer");
    expect(el.className).toContain("border-t");
  });

  it("does not apply border by default", () => {
    render(<Footer data-testid="footer" />);
    const el = screen.getByTestId("footer");
    expect(el.className).not.toContain("border-t");
  });

  it("applies padding by default (padded=true)", () => {
    render(<Footer data-testid="footer" />);
    const el = screen.getByTestId("footer");
    expect(el.className).toContain("px-4");
    expect(el.className).toContain("py-6");
  });

  it("removes padding when padded=false", () => {
    render(<Footer padded={false} data-testid="footer" />);
    const el = screen.getByTestId("footer");
    expect(el.className).not.toContain("px-4");
    expect(el.className).not.toContain("py-6");
  });

  it("merges custom className", () => {
    render(<Footer className="custom-class" data-testid="footer" />);
    const el = screen.getByTestId("footer");
    expect(el.className).toContain("custom-class");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLElement>();
    render(<Footer ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("FOOTER");
  });

  it("spreads extra HTML attributes", () => {
    render(<Footer data-testid="footer" id="main-footer" />);
    expect(screen.getByTestId("footer")).toHaveAttribute("id", "main-footer");
  });

  it("combines fixed and bordered", () => {
    render(<Footer fixed bordered data-testid="footer" />);
    const el = screen.getByTestId("footer");
    expect(el.className).toContain("fixed");
    expect(el.className).toContain("border-t");
  });
});
