import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AreaChart } from "../charts/area-chart";

const sampleData = [
  { label: "Jan", value: 100 },
  { label: "Feb", value: 200 },
  { label: "Mar", value: 150 },
  { label: "Apr", value: 300 },
];

describe("AreaChart", () => {
  it("renders an SVG element", () => {
    const { container } = render(<AreaChart data={sampleData} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with role=img and aria-label", () => {
    const { container } = render(<AreaChart data={sampleData} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Area chart");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<AreaChart ref={ref} data={sampleData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(AreaChart.displayName).toBe("AreaChart");
  });

  it("merges custom className", () => {
    const { container } = render(<AreaChart data={sampleData} className="custom" />);
    expect(container.firstElementChild!.className).toContain("custom");
  });

  it("renders area fill paths", () => {
    const { container } = render(<AreaChart data={sampleData} />);
    const areaFill = container.querySelector("[data-testid='area-fill-0']");
    expect(areaFill).toBeInTheDocument();
  });

  it("renders line paths", () => {
    const { container } = render(<AreaChart data={sampleData} />);
    const linePath = container.querySelector("[data-testid='area-line-0']");
    expect(linePath).toBeInTheDocument();
  });

  it("renders data point dots", () => {
    const { container } = render(<AreaChart data={sampleData} />);
    const dot = container.querySelector("[data-testid='area-dot-0-0']");
    expect(dot).toBeInTheDocument();
  });

  it("renders empty state when no data", () => {
    const { container } = render(<AreaChart data={[]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty area chart");
  });

  it("applies custom height", () => {
    const { container } = render(<AreaChart data={sampleData} height={400} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("height", "400");
  });

  it("renders multi-series data", () => {
    const series = [
      { data: sampleData, color: "#ff0000", name: "Series A" },
      { data: sampleData, color: "#00ff00", name: "Series B" },
    ];
    const { container } = render(<AreaChart series={series} />);
    expect(container.querySelector("[data-testid='area-line-0']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='area-line-1']")).toBeInTheDocument();
  });

  it("renders without grid when showGrid=false", () => {
    const { container } = render(<AreaChart data={sampleData} showGrid={false} />);
    // Gridlines use dashed stroke pattern
    const dashedLines = container.querySelectorAll("[stroke-dasharray]");
    expect(dashedLines.length).toBe(0);
  });
});
