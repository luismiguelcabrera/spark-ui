import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LineChart } from "../charts/line-chart";

const sampleData = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 200 },
  { month: "Mar", value: 150 },
  { month: "Apr", value: 300 },
];

describe("LineChart", () => {
  it("renders an SVG element", () => {
    const { container } = render(<LineChart data={sampleData} index="month" categories={["value"]} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with role=img and aria-label", () => {
    const { container } = render(<LineChart data={sampleData} index="month" categories={["value"]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Line chart");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<LineChart ref={ref} data={sampleData} index="month" categories={["value"]} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(LineChart.displayName).toBe("LineChart");
  });

  it("merges custom className", () => {
    const { container } = render(<LineChart data={sampleData} index="month" categories={["value"]} className="custom" />);
    expect(container.firstElementChild!.className).toContain("custom");
  });

  it("renders the line path", () => {
    const { container } = render(<LineChart data={sampleData} index="month" categories={["value"]} />);
    const linePath = container.querySelector("[data-testid='line-value']");
    expect(linePath).toBeInTheDocument();
    expect(linePath).toHaveAttribute("fill", "none");
  });

  it("renders data point dots by default", () => {
    const { container } = render(<LineChart data={sampleData} index="month" categories={["value"]} />);
    const dot = container.querySelector("[data-testid='dot-value-0']");
    expect(dot).toBeInTheDocument();
  });

  it("hides dots when showDots=false", () => {
    const { container } = render(<LineChart data={sampleData} index="month" categories={["value"]} showDots={false} />);
    expect(container.querySelector("[data-testid='dot-value-0']")).not.toBeInTheDocument();
  });

  it("renders empty state when no data", () => {
    const { container } = render(<LineChart data={[]} index="month" categories={["value"]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty line chart");
  });

  it("applies custom height", () => {
    const { container } = render(<LineChart data={sampleData} index="month" categories={["value"]} height={400} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("height", "400");
  });

  it("applies custom color to line stroke", () => {
    const { container } = render(<LineChart data={sampleData} index="month" categories={["value"]} colors={["#ff0000"]} />);
    const linePath = container.querySelector("[data-testid='line-value']");
    expect(linePath).toHaveAttribute("stroke", "#ff0000");
  });

  it("renders smooth curves when curveType is monotone", () => {
    const { container } = render(<LineChart data={sampleData} index="month" categories={["value"]} curveType="monotone" />);
    const linePath = container.querySelector("[data-testid='line-value']");
    // Smooth paths use cubic bezier C commands
    expect(linePath!.getAttribute("d")).toContain("C");
  });
});
