import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ColorSwatch } from "../color-swatch";

describe("ColorSwatch", () => {
  it("renders without crashing", () => {
    const { container } = render(<ColorSwatch color="#ff0000" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<ColorSwatch ref={ref} color="#ff0000" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies className", () => {
    const { container } = render(
      <ColorSwatch color="#ff0000" className="custom-swatch" />,
    );
    expect(container.firstChild).toHaveClass("custom-swatch");
  });

  // ── Role & ARIA ─────────────────────────────────────────────────────

  it("has role=img", () => {
    render(<ColorSwatch color="#ff0000" />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("has aria-label with color value", () => {
    render(<ColorSwatch color="#ff0000" />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "Color swatch: #ff0000",
    );
  });

  it("includes Tailwind class name in aria-label", () => {
    render(<ColorSwatch color="bg-blue-500" />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "Color swatch: bg-blue-500",
    );
  });

  // ── CSS color values ────────────────────────────────────────────────

  it("applies hex color as inline backgroundColor", () => {
    const { container } = render(<ColorSwatch color="#ff0000" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBe("rgb(255, 0, 0)");
  });

  it("applies rgb color as inline backgroundColor", () => {
    const { container } = render(<ColorSwatch color="rgb(0, 128, 255)" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBe("rgb(0, 128, 255)");
  });

  it("applies hsl color as inline backgroundColor", () => {
    const { container } = render(<ColorSwatch color="hsl(120, 100%, 50%)" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBeTruthy();
  });

  it("applies named CSS color as inline backgroundColor", () => {
    const { container } = render(<ColorSwatch color="red" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBe("red");
  });

  // ── Tailwind class colors ───────────────────────────────────────────

  it("applies bg- Tailwind class as className, not inline style", () => {
    const { container } = render(<ColorSwatch color="bg-blue-500" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("bg-blue-500");
    expect(el.style.backgroundColor).toBe("");
  });

  // ── Size ────────────────────────────────────────────────────────────

  it.each([
    ["sm", "w-6", "h-6"],
    ["md", "w-10", "h-10"],
    ["lg", "w-16", "h-16"],
  ] as const)("applies correct classes for size=%s", (size, wClass, hClass) => {
    const { container } = render(<ColorSwatch color="#000" size={size} />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass(wClass);
    expect(el).toHaveClass(hClass);
  });

  it("uses md size by default", () => {
    const { container } = render(<ColorSwatch color="#000" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("w-10");
    expect(el).toHaveClass("h-10");
  });

  it("applies numeric size as inline width/height in px", () => {
    const { container } = render(<ColorSwatch color="#000" size={48} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("48px");
    expect(el.style.height).toBe("48px");
  });

  it("does not apply size classes when using numeric size", () => {
    const { container } = render(<ColorSwatch color="#000" size={48} />);
    const el = container.firstChild as HTMLElement;
    expect(el).not.toHaveClass("w-6");
    expect(el).not.toHaveClass("w-10");
    expect(el).not.toHaveClass("w-16");
  });

  // ── Radius ──────────────────────────────────────────────────────────

  it.each([
    ["sm", "rounded"],
    ["md", "rounded-md"],
    ["lg", "rounded-lg"],
    ["full", "rounded-full"],
  ] as const)("applies correct class for radius=%s", (radius, expectedClass) => {
    const { container } = render(
      <ColorSwatch color="#000" radius={radius} />,
    );
    expect(container.firstChild).toHaveClass(expectedClass);
  });

  it("uses md radius by default", () => {
    const { container } = render(<ColorSwatch color="#000" />);
    expect(container.firstChild).toHaveClass("rounded-md");
  });

  // ── Shadow ──────────────────────────────────────────────────────────

  it("does not apply shadow by default", () => {
    const { container } = render(<ColorSwatch color="#000" />);
    expect(container.firstChild).not.toHaveClass("shadow-md");
  });

  it("applies shadow when withShadow is true", () => {
    const { container } = render(<ColorSwatch color="#000" withShadow />);
    expect(container.firstChild).toHaveClass("shadow-md");
  });

  // ── Border ──────────────────────────────────────────────────────────

  it("has border class", () => {
    const { container } = render(<ColorSwatch color="#000" />);
    expect(container.firstChild).toHaveClass("border");
    expect(container.firstChild).toHaveClass("border-muted");
  });

  // ── Style merging ──────────────────────────────────────────────────

  it("merges custom inline styles", () => {
    const { container } = render(
      <ColorSwatch color="#000" style={{ opacity: 0.5 }} />,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.opacity).toBe("0.5");
  });

  // ── Extra props ─────────────────────────────────────────────────────

  it("spreads extra HTML attributes", () => {
    render(<ColorSwatch color="#000" data-testid="my-swatch" />);
    expect(screen.getByTestId("my-swatch")).toBeInTheDocument();
  });

  it("handles onClick", () => {
    let clicked = false;
    render(
      <ColorSwatch color="#000" onClick={() => { clicked = true; }} />,
    );
    screen.getByRole("img").click();
    expect(clicked).toBe(true);
  });
});
