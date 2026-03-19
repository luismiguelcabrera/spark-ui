import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RadarChart } from "../charts/radar-chart";

const sampleData = [
  { axis: "Speed", score: 80 },
  { axis: "Strength", score: 60 },
  { axis: "Agility", score: 90 },
  { axis: "Defense", score: 70 },
  { axis: "Magic", score: 50 },
];

describe("RadarChart", () => {
  it("renders an SVG element", () => {
    const { container } = render(<RadarChart data={sampleData} index="axis" categories={["score"]} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with role=img and aria-label", () => {
    const { container } = render(<RadarChart data={sampleData} index="axis" categories={["score"]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Radar chart");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<RadarChart ref={ref} data={sampleData} index="axis" categories={["score"]} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(RadarChart.displayName).toBe("RadarChart");
  });

  it("merges custom className", () => {
    const { container } = render(<RadarChart data={sampleData} index="axis" categories={["score"]} className="custom" />);
    expect(container.firstElementChild!.className).toContain("custom");
  });

  it("renders grid polygons by default", () => {
    const { container } = render(<RadarChart data={sampleData} index="axis" categories={["score"]} />);
    // 5 grid levels
    expect(container.querySelector("[data-testid='radar-grid-0']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='radar-grid-4']")).toBeInTheDocument();
  });

  it("renders axis lines", () => {
    const { container } = render(<RadarChart data={sampleData} index="axis" categories={["score"]} />);
    // 5 data points = 5 axis lines
    expect(container.querySelector("[data-testid='radar-axis-0']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='radar-axis-4']")).toBeInTheDocument();
  });

  it("renders data series polygon", () => {
    const { container } = render(<RadarChart data={sampleData} index="axis" categories={["score"]} />);
    expect(container.querySelector("[data-testid='radar-polygon-0']")).toBeInTheDocument();
  });

  it("renders data point dots by default", () => {
    const { container } = render(<RadarChart data={sampleData} index="axis" categories={["score"]} />);
    expect(container.querySelector("[data-testid='radar-dot-0-0']")).toBeInTheDocument();
  });

  it("renders labels by default", () => {
    const { container } = render(<RadarChart data={sampleData} index="axis" categories={["score"]} />);
    expect(container.querySelector("[data-testid='radar-label-0']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='radar-label-0']")!.textContent).toBe("Speed");
  });

  it("renders empty state when no data", () => {
    const { container } = render(<RadarChart data={[]} index="axis" categories={["score"]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty radar chart");
  });

  it("hides grid when showGrid=false", () => {
    const { container } = render(<RadarChart data={sampleData} index="axis" categories={["score"]} showGrid={false} />);
    expect(container.querySelector("[data-testid='radar-grid-0']")).not.toBeInTheDocument();
  });

  it("hides dots when showDots=false", () => {
    const { container } = render(<RadarChart data={sampleData} index="axis" categories={["score"]} showDots={false} />);
    expect(container.querySelector("[data-testid='radar-dot-0-0']")).not.toBeInTheDocument();
  });

  it("renders multi-series data", () => {
    const multiData = sampleData.map((d) => ({ ...d, power: d.score * 0.8 }));
    const { container } = render(
      <RadarChart data={multiData} index="axis" categories={["score", "power"]} colors={["#ff0000", "#00ff00"]} />,
    );
    expect(container.querySelector("[data-testid='radar-polygon-0']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='radar-polygon-1']")).toBeInTheDocument();
  });

  it("applies custom size", () => {
    const { container } = render(<RadarChart data={sampleData} index="axis" categories={["score"]} size={400} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "400");
    expect(svg).toHaveAttribute("height", "400");
  });
});
