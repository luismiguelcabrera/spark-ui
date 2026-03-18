import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RingProgress } from "../ring-progress";

describe("RingProgress", () => {
  const defaultSections = [{ value: 50 }];

  it("renders without crashing", () => {
    const { container } = render(<RingProgress sections={defaultSections} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<RingProgress ref={ref} sections={defaultSections} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies className", () => {
    const { container } = render(
      <RingProgress sections={defaultSections} className="custom-ring" />,
    );
    expect(container.firstChild).toHaveClass("custom-ring");
  });

  it("renders an SVG with role=img", () => {
    const { container } = render(<RingProgress sections={defaultSections} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("role", "img");
  });

  it("sets aria-label with total percentage", () => {
    const { container } = render(
      <RingProgress sections={[{ value: 30 }, { value: 20 }]} />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Ring progress: 50% filled");
  });

  it("clamps total to 100", () => {
    const { container } = render(
      <RingProgress sections={[{ value: 80 }, { value: 50 }]} />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Ring progress: 100% filled");
  });

  // ── Size ────────────────────────────────────────────────────────────

  it("uses default size of 120px", () => {
    const { container } = render(<RingProgress sections={defaultSections} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe("120px");
    expect(wrapper.style.height).toBe("120px");
  });

  it("respects custom size", () => {
    const { container } = render(
      <RingProgress sections={defaultSections} size={200} />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe("200px");
    expect(wrapper.style.height).toBe("200px");
  });

  it("sets SVG viewBox to match size", () => {
    const { container } = render(
      <RingProgress sections={defaultSections} size={160} />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("viewBox", "0 0 160 160");
  });

  // ── Sections ────────────────────────────────────────────────────────

  it("renders correct number of section circles plus background", () => {
    const { container } = render(
      <RingProgress
        sections={[
          { value: 30 },
          { value: 20 },
          { value: 10 },
        ]}
      />,
    );
    const circles = container.querySelectorAll("circle");
    // 1 background + 3 section circles
    expect(circles).toHaveLength(4);
  });

  it("renders background circle", () => {
    const { container } = render(<RingProgress sections={defaultSections} />);
    const circles = container.querySelectorAll("circle");
    // First circle is the background
    expect(circles[0]).toHaveAttribute("fill", "none");
    expect(circles[0]).toHaveClass("text-gray-100");
  });

  it("renders section tooltips as title elements", () => {
    const { container } = render(
      <RingProgress
        sections={[
          { value: 50, tooltip: "Half done" },
          { value: 25, tooltip: "Quarter" },
        ]}
      />,
    );
    const titles = container.querySelectorAll("title");
    expect(titles).toHaveLength(2);
    expect(titles[0].textContent).toBe("Half done");
    expect(titles[1].textContent).toBe("Quarter");
  });

  it("does not render title when tooltip is not provided", () => {
    const { container } = render(
      <RingProgress sections={[{ value: 50 }]} />,
    );
    const titles = container.querySelectorAll("title");
    expect(titles).toHaveLength(0);
  });

  it("applies custom color class to sections", () => {
    const { container } = render(
      <RingProgress sections={[{ value: 50, color: "text-blue-500" }]} />,
    );
    const circles = container.querySelectorAll("circle");
    // Second circle is the first section
    expect(circles[1]).toHaveClass("text-blue-500");
  });

  it("applies default colors when no section color is provided", () => {
    const { container } = render(
      <RingProgress sections={[{ value: 50 }]} />,
    );
    const circles = container.querySelectorAll("circle");
    expect(circles[1]).toHaveClass("text-primary");
  });

  // ── Thickness ───────────────────────────────────────────────────────

  it("uses default thickness of 12", () => {
    const { container } = render(<RingProgress sections={defaultSections} />);
    const circles = container.querySelectorAll("circle");
    expect(circles[0].getAttribute("stroke-width")).toBe("12");
  });

  it("respects custom thickness", () => {
    const { container } = render(
      <RingProgress sections={defaultSections} thickness={8} />,
    );
    const circles = container.querySelectorAll("circle");
    expect(circles[0].getAttribute("stroke-width")).toBe("8");
  });

  // ── Round Caps ──────────────────────────────────────────────────────

  it("uses butt linecap by default", () => {
    const { container } = render(<RingProgress sections={defaultSections} />);
    const circles = container.querySelectorAll("circle");
    expect(circles[1].getAttribute("stroke-linecap")).toBe("butt");
  });

  it("uses round linecap when roundCaps is true", () => {
    const { container } = render(
      <RingProgress sections={defaultSections} roundCaps />,
    );
    const circles = container.querySelectorAll("circle");
    expect(circles[1].getAttribute("stroke-linecap")).toBe("round");
  });

  // ── Label ───────────────────────────────────────────────────────────

  it("renders center label when provided", () => {
    render(
      <RingProgress
        sections={defaultSections}
        label={<span data-testid="center-label">50%</span>}
      />,
    );
    expect(screen.getByTestId("center-label")).toHaveTextContent("50%");
  });

  it("does not render center label container when label is not provided", () => {
    const { container } = render(<RingProgress sections={defaultSections} />);
    const centerDiv = container.querySelector(".absolute.inset-0");
    expect(centerDiv).not.toBeInTheDocument();
  });

  // ── Edge Cases ──────────────────────────────────────────────────────

  it("handles empty sections array", () => {
    const { container } = render(<RingProgress sections={[]} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    // Only background circle
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(1);
  });

  it("treats negative section values as 0", () => {
    const { container } = render(
      <RingProgress sections={[{ value: -10 }]} />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Ring progress: 0% filled");
  });

  it("spreads extra HTML attributes", () => {
    render(
      <RingProgress sections={defaultSections} data-testid="my-ring" />,
    );
    expect(screen.getByTestId("my-ring")).toBeInTheDocument();
  });

  it("has motion-reduce transition class on section circles", () => {
    const { container } = render(<RingProgress sections={defaultSections} />);
    const circles = container.querySelectorAll("circle");
    expect(circles[1]).toHaveClass("motion-reduce:transition-none");
  });
});
