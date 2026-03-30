import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRef } from "react";
import { Parallax } from "../parallax";

describe("Parallax", () => {
  beforeEach(() => {
    // Mock matchMedia for prefers-reduced-motion
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(function (query: string) {
        return {
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        };
      }),
    });
  });

  it("renders the container with correct height", () => {
    const { container } = render(<Parallax src="/test.jpg" height={400} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.height).toBe("400px");
  });

  it("renders the image with scaled height (default scale 1.5)", () => {
    const { container } = render(<Parallax src="/test.jpg" height={400} />);
    const img = container.querySelector("img")!;
    expect(img.style.height).toBe("600px"); // 400 * 1.5
  });

  it("renders the image with custom scale", () => {
    const { container } = render(
      <Parallax src="/test.jpg" height={400} scale={2} />,
    );
    const img = container.querySelector("img")!;
    expect(img.style.height).toBe("800px"); // 400 * 2
  });

  it("sets correct src attribute", () => {
    const { container } = render(
      <Parallax src="/photo.jpg" height={300} />,
    );
    const img = container.querySelector("img")!;
    expect(img.getAttribute("src")).toBe("/photo.jpg");
  });

  it("sets alt text on the image", () => {
    render(<Parallax src="/photo.jpg" alt="Scenic view" height={300} />);
    const img = screen.getByAltText("Scenic view");
    expect(img).toBeInTheDocument();
  });

  it("makes image aria-hidden when no alt text is provided", () => {
    const { container } = render(
      <Parallax src="/photo.jpg" height={300} />,
    );
    const img = container.querySelector("img")!;
    expect(img.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not set aria-hidden when alt text is provided", () => {
    const { container } = render(
      <Parallax src="/photo.jpg" alt="A photo" height={300} />,
    );
    const img = container.querySelector("img")!;
    // aria-hidden should be falsy when alt is provided
    expect(img.getAttribute("aria-hidden")).toBeNull();
  });

  it("has overflow-hidden on the container", () => {
    const { container } = render(<Parallax src="/test.jpg" height={300} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("overflow-hidden");
  });

  it("merges custom className", () => {
    const { container } = render(
      <Parallax src="/test.jpg" height={300} className="my-custom" />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("my-custom");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Parallax ref={ref} src="/test.jpg" height={300} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("respects prefers-reduced-motion", () => {
    // Override matchMedia to report reduced motion
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(function (query: string) {
        return {
          matches: query.includes("reduce"),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        };
      }),
    });

    const addEventSpy = vi.spyOn(window, "addEventListener");
    render(<Parallax src="/test.jpg" height={300} />);
    // Should not add scroll listener when reduced motion is preferred
    const scrollCalls = addEventSpy.mock.calls.filter(
      (call) => call[0] === "scroll",
    );
    expect(scrollCalls).toHaveLength(0);
    addEventSpy.mockRestore();
  });

  it("applies will-change on the image for performance", () => {
    const { container } = render(<Parallax src="/test.jpg" height={300} />);
    const img = container.querySelector("img")!;
    expect(img.style.willChange).toBe("transform");
  });
});
