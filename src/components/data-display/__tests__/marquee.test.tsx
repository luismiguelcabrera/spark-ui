import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Marquee } from "../marquee";

describe("Marquee", () => {
  it("renders children", () => {
    render(<Marquee>Hello</Marquee>);
    // Marquee repeats children, so use getAllByText
    const items = screen.getAllByText("Hello");
    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  it("renders without error with required props", () => {
    const { container } = render(<Marquee>Content</Marquee>);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Marquee ref={ref}>Content</Marquee>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(Marquee.displayName).toBe("Marquee");
  });

  it("merges custom className", () => {
    const { container } = render(<Marquee className="custom-class">Content</Marquee>);
    expect(container.firstElementChild!.className).toContain("custom-class");
  });

  it("repeats children based on repeat prop", () => {
    const { container } = render(<Marquee repeat={3}>Item</Marquee>);
    const track = container.querySelector("[data-marquee-track]");
    expect(track!.children.length).toBe(3);
  });

  it("sets aria-hidden on duplicate copies", () => {
    const { container } = render(<Marquee repeat={4}>Item</Marquee>);
    const track = container.querySelector("[data-marquee-track]");
    expect(track).toBeInTheDocument();
    const children = track!.children;
    expect(children.length).toBe(4);
    // First child has aria-hidden="false" (i > 0 is false)
    expect(children[0].getAttribute("aria-hidden")).toBe("false");
    // Subsequent children have aria-hidden="true"
    expect(children[1].getAttribute("aria-hidden")).toBe("true");
    expect(children[2].getAttribute("aria-hidden")).toBe("true");
    expect(children[3].getAttribute("aria-hidden")).toBe("true");
  });

  it("applies animation styles to the track", () => {
    const { container } = render(<Marquee speed="fast">Content</Marquee>);
    const track = container.querySelector("[data-marquee-track]") as HTMLElement;
    expect(track.style.animationDuration).toBe("15s");
  });

  it.each(["left", "right", "up", "down"] as const)(
    "renders with direction=%s without error",
    (direction) => {
      const { container } = render(<Marquee direction={direction}>Item</Marquee>);
      expect(container.firstElementChild).toBeInTheDocument();
    },
  );

  it.each(["slow", "normal", "fast"] as const)(
    "renders with speed=%s without error",
    (speed) => {
      const { container } = render(<Marquee speed={speed}>Item</Marquee>);
      expect(container.firstElementChild).toBeInTheDocument();
    },
  );
});
