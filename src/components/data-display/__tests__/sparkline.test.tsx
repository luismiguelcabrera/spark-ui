import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Sparkline } from "../sparkline";

describe("Sparkline", () => {
  const sampleData = [10, 20, 15, 30, 25];

  it("renders an SVG element", () => {
    const { container } = render(<Sparkline data={sampleData} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with role=img and aria-label", () => {
    const { container } = render(<Sparkline data={sampleData} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg!.getAttribute("aria-label")).toContain("Sparkline chart");
  });

  it("returns null when data has fewer than 2 points", () => {
    const { container } = render(<Sparkline data={[5]} />);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("forwards ref", () => {
    const ref = { current: null as SVGSVGElement | null };
    render(<Sparkline ref={ref} data={sampleData} />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  it("has correct displayName", () => {
    expect(Sparkline.displayName).toBe("Sparkline");
  });

  it("merges custom className", () => {
    const { container } = render(<Sparkline data={sampleData} className="custom" />);
    expect(container.querySelector("svg")!.classList.contains("custom")).toBe(true);
  });

  it("renders a path element for the line", () => {
    const { container } = render(<Sparkline data={sampleData} />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBeGreaterThanOrEqual(1);
  });

  it("renders fill path when fill=true", () => {
    const { container } = render(<Sparkline data={sampleData} fill={true} />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(2); // fill path + line path
  });

  it("renders dots when showDots=true", () => {
    const { container } = render(<Sparkline data={sampleData} showDots={true} />);
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBe(sampleData.length);
  });

  it("applies custom width and height", () => {
    const { container } = render(<Sparkline data={sampleData} width={200} height={50} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "200");
    expect(svg).toHaveAttribute("height", "50");
  });

  it("applies custom color", () => {
    const { container } = render(<Sparkline data={sampleData} color="red" />);
    const path = container.querySelector("path");
    expect(path).toHaveAttribute("stroke", "red");
  });
});
