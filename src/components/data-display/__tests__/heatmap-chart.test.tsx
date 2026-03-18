import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HeatmapChart } from "../charts/heatmap-chart";

const sampleData = [
  { x: "Mon", y: "Morning", value: 10 },
  { x: "Mon", y: "Afternoon", value: 20 },
  { x: "Tue", y: "Morning", value: 30 },
  { x: "Tue", y: "Afternoon", value: 15 },
];

describe("HeatmapChart", () => {
  it("renders an SVG element", () => {
    const { container } = render(<HeatmapChart data={sampleData} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with role=img and aria-label", () => {
    const { container } = render(<HeatmapChart data={sampleData} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Heatmap chart");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<HeatmapChart ref={ref} data={sampleData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(HeatmapChart.displayName).toBe("HeatmapChart");
  });

  it("merges custom className", () => {
    const { container } = render(
      <HeatmapChart data={sampleData} className="custom" />,
    );
    expect(container.firstElementChild!.className).toContain("custom");
  });

  it("renders heatmap cells", () => {
    const { container } = render(<HeatmapChart data={sampleData} />);
    // 2 x-labels * 2 y-labels = 4 cells
    expect(container.querySelector("[data-testid='heatmap-cell-0-0']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='heatmap-cell-1-0']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='heatmap-cell-0-1']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='heatmap-cell-1-1']")).toBeInTheDocument();
  });

  it("renders empty state when no data", () => {
    const { container } = render(<HeatmapChart data={[]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty heatmap chart");
  });

  it("renders x-axis labels", () => {
    const { container } = render(<HeatmapChart data={sampleData} />);
    expect(container.querySelector("[data-testid='heatmap-x-label-0']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='heatmap-x-label-1']")).toBeInTheDocument();
  });

  it("renders y-axis labels", () => {
    const { container } = render(<HeatmapChart data={sampleData} />);
    expect(container.querySelector("[data-testid='heatmap-y-label-0']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='heatmap-y-label-1']")).toBeInTheDocument();
  });

  it("renders legend when showLegend is true", () => {
    const { container } = render(
      <HeatmapChart data={sampleData} showLegend />,
    );
    expect(container.querySelector("[data-testid='heatmap-legend']")).toBeInTheDocument();
  });

  it("does not render legend by default", () => {
    const { container } = render(<HeatmapChart data={sampleData} />);
    expect(container.querySelector("[data-testid='heatmap-legend']")).not.toBeInTheDocument();
  });

  it("uses custom xLabels and yLabels", () => {
    const { container } = render(
      <HeatmapChart
        data={sampleData}
        xLabels={["Mon", "Tue"]}
        yLabels={["Morning", "Afternoon"]}
      />,
    );
    expect(container.querySelector("[data-testid='heatmap-x-label-0']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='heatmap-y-label-0']")).toBeInTheDocument();
  });
});
