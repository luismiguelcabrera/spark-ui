import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LineChart } from "../charts/line-chart";

const sampleData = [
  { label: "Jan", value: 100 },
  { label: "Feb", value: 200 },
  { label: "Mar", value: 150 },
  { label: "Apr", value: 300 },
];

describe("LineChart", () => {
  it("renders an SVG element", () => {
    const { container } = render(<LineChart data={sampleData} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with role=img and aria-label", () => {
    const { container } = render(<LineChart data={sampleData} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Line chart");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<LineChart ref={ref} data={sampleData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(LineChart.displayName).toBe("LineChart");
  });

  it("merges custom className", () => {
    const { container } = render(<LineChart data={sampleData} className="custom" />);
    expect(container.firstElementChild!.className).toContain("custom");
  });

  it("renders the line path", () => {
    const { container } = render(<LineChart data={sampleData} />);
    const linePath = container.querySelector("[data-testid='line-path']");
    expect(linePath).toBeInTheDocument();
    expect(linePath).toHaveAttribute("fill", "none");
  });

  it("renders data point dots by default", () => {
    const { container } = render(<LineChart data={sampleData} />);
    const dot = container.querySelector("[data-testid='dot-0']");
    expect(dot).toBeInTheDocument();
  });

  it("hides dots when showDots=false", () => {
    const { container } = render(<LineChart data={sampleData} showDots={false} />);
    expect(container.querySelector("[data-testid='dot-0']")).not.toBeInTheDocument();
  });

  it("renders empty state when no data", () => {
    const { container } = render(<LineChart data={[]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty line chart");
  });

  it("renders area fill when showArea=true", () => {
    const { container } = render(<LineChart data={sampleData} showArea />);
    const area = container.querySelector("[data-testid='line-area']");
    expect(area).toBeInTheDocument();
  });

  it("does not render area by default", () => {
    const { container } = render(<LineChart data={sampleData} />);
    expect(container.querySelector("[data-testid='line-area']")).not.toBeInTheDocument();
  });

  it("applies custom height", () => {
    const { container } = render(<LineChart data={sampleData} height={400} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("height", "400");
  });

  it("applies custom color to line stroke", () => {
    const { container } = render(<LineChart data={sampleData} color="#ff0000" />);
    const linePath = container.querySelector("[data-testid='line-path']");
    expect(linePath).toHaveAttribute("stroke", "#ff0000");
  });

  it("renders smooth curves when smooth=true", () => {
    const { container } = render(<LineChart data={sampleData} smooth />);
    const linePath = container.querySelector("[data-testid='line-path']");
    // Smooth paths use cubic bezier C commands
    expect(linePath!.getAttribute("d")).toContain("C");
  });
});
