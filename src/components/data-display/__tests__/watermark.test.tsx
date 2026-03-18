import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Watermark } from "../watermark";

describe("Watermark", () => {
  it("renders children", () => {
    render(
      <Watermark text="CONFIDENTIAL">
        <p>Secret document</p>
      </Watermark>,
    );
    expect(screen.getByText("Secret document")).toBeInTheDocument();
  });

  it("renders without error with required props", () => {
    const { container } = render(<Watermark text="Draft">Content</Watermark>);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Watermark ref={ref} text="Test">Content</Watermark>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(Watermark.displayName).toBe("Watermark");
  });

  it("merges custom className", () => {
    const { container } = render(
      <Watermark text="Test" className="custom-class">
        Content
      </Watermark>,
    );
    expect(container.firstElementChild!.className).toContain("custom-class");
  });

  it("renders the watermark overlay with aria-hidden", () => {
    const { container } = render(
      <Watermark text="DRAFT">Content</Watermark>,
    );
    const overlay = container.querySelector("[aria-hidden='true']");
    expect(overlay).toBeInTheDocument();
  });

  it("makes the watermark overlay non-interactive", () => {
    const { container } = render(
      <Watermark text="DRAFT">Content</Watermark>,
    );
    const overlay = container.querySelector("[aria-hidden='true']");
    expect(overlay!.className).toContain("pointer-events-none");
  });

  it("sets the watermark as a background image", () => {
    const { container } = render(
      <Watermark text="DRAFT">Content</Watermark>,
    );
    const overlay = container.querySelector("[aria-hidden='true']") as HTMLElement;
    expect(overlay.style.backgroundImage).toContain("DRAFT");
  });
});
