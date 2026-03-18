import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RadarChart } from "../charts/radar-chart";

const sampleData = [
  { label: "Speed", value: 80 },
  { label: "Strength", value: 60 },
  { label: "Agility", value: 90 },
  { label: "Defense", value: 70 },
  { label: "Magic", value: 50 },
];

describe("RadarChart", () => {
  it("renders an SVG element", () => {
    const { container } = render(<RadarChart data={sampleData} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with role=img and aria-label", () => {
    const { container } = render(<RadarChart data={sampleData} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Radar chart");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<RadarChart ref={ref} data={sampleData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(RadarChart.displayName).toBe("RadarChart");
  });

  it("merges custom className", () => {
    const { container } = render(<RadarChart data={sampleData} className="custom" />);
    expect(container.firstElementChild!.className).toContain("custom");
  });

  it("renders grid polygons by default", () => {
    const { container } = render(<RadarChart data={sampleData} />);
    // 5 grid levels
    expect(container.querySelector("[data-testid='radar-grid-0']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='radar-grid-4']")).toBeInTheDocument();
  });

  it("renders axis lines", () => {
    const { container } = render(<RadarChart data={sampleData} />);
    // 5 data points = 5 axis lines
    expect(container.querySelector("[data-testid='radar-axis-0']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='radar-axis-4']")).toBeInTheDocument();
  });

  it("renders data series polygon", () => {
    const { container } = render(<RadarChart data={sampleData} />);
    expect(container.querySelector("[data-testid='radar-polygon-0']")).toBeInTheDocument();
  });

  it("renders data point dots by default", () => {
    const { container } = render(<RadarChart data={sampleData} />);
    expect(container.querySelector("[data-testid='radar-dot-0-0']")).toBeInTheDocument();
  });

  it("renders labels by default", () => {
    const { container } = render(<RadarChart data={sampleData} />);
    expect(container.querySelector("[data-testid='radar-label-0']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='radar-label-0']")!.textContent).toBe("Speed");
  });

  it("renders empty state when no data", () => {
    const { container } = render(<RadarChart data={[]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty radar chart");
  });

  it("hides grid when showGrid=false", () => {
    const { container } = render(<RadarChart data={sampleData} showGrid={false} />);
    expect(container.querySelector("[data-testid='radar-grid-0']")).not.toBeInTheDocument();
  });

  it("hides dots when showDots=false", () => {
    const { container } = render(<RadarChart data={sampleData} showDots={false} />);
    expect(container.querySelector("[data-testid='radar-dot-0-0']")).not.toBeInTheDocument();
  });

  it("renders multi-series data", () => {
    const series = [
      { data: sampleData.map(d => ({ label: d.label, value: d.value })), color: "#ff0000", name: "A" },
      { data: sampleData.map(d => ({ label: d.label, value: d.value * 0.8 })), color: "#00ff00", name: "B" },
    ];
    const { container } = render(<RadarChart series={series} />);
    expect(container.querySelector("[data-testid='radar-polygon-0']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='radar-polygon-1']")).toBeInTheDocument();
  });

  it("applies custom size", () => {
    const { container } = render(<RadarChart data={sampleData} size={400} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "400");
    expect(svg).toHaveAttribute("height", "400");
  });
});
