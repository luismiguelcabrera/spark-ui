import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScatterChart } from "../charts/scatter-chart";

const sampleSeries = [
  {
    name: "default",
    data: [
      { x: 10, y: 20 },
      { x: 30, y: 40 },
      { x: 50, y: 60 },
      { x: 70, y: 80 },
    ],
  },
];

describe("ScatterChart", () => {
  it("renders an SVG element", () => {
    const { container } = render(<ScatterChart series={sampleSeries} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with role=img and aria-label", () => {
    const { container } = render(<ScatterChart series={sampleSeries} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Scatter chart");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<ScatterChart ref={ref} series={sampleSeries} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(ScatterChart.displayName).toBe("ScatterChart");
  });

  it("merges custom className", () => {
    const { container } = render(
      <ScatterChart series={sampleSeries} className="custom" />,
    );
    expect(container.firstElementChild!.className).toContain("custom");
  });

  it("renders data point circles", () => {
    const { container } = render(<ScatterChart series={sampleSeries} />);
    expect(container.querySelector("[data-testid='scatter-point-0-0']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='scatter-point-0-1']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='scatter-point-0-2']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='scatter-point-0-3']")).toBeInTheDocument();
  });

  it("renders empty state when no data", () => {
    const { container } = render(<ScatterChart series={[{ name: "empty", data: [] }]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty scatter chart");
  });

  it("renders x-axis label when provided", () => {
    const { container } = render(
      <ScatterChart series={sampleSeries} xLabel="Weight" />,
    );
    expect(container.querySelector("[data-testid='scatter-x-label']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='scatter-x-label']")!.textContent).toBe("Weight");
  });

  it("renders y-axis label when provided", () => {
    const { container } = render(
      <ScatterChart series={sampleSeries} yLabel="Height" />,
    );
    expect(container.querySelector("[data-testid='scatter-y-label']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='scatter-y-label']")!.textContent).toBe("Height");
  });

  it("applies custom height", () => {
    const { container } = render(<ScatterChart series={sampleSeries} height={400} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("height", "400");
  });

  it("renders multi-series data", () => {
    const multiSeries = [
      { data: [{ x: 10, y: 20 }, { x: 30, y: 40 }], color: "#ff0000" as const, name: "A" },
      { data: [{ x: 50, y: 60 }, { x: 70, y: 80 }], color: "#00ff00" as const, name: "B" },
    ];
    const { container } = render(<ScatterChart series={multiSeries} />);
    expect(container.querySelector("[data-testid='scatter-point-0-0']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='scatter-point-1-0']")).toBeInTheDocument();
  });

  it("renders without grid when showGrid=false", () => {
    const { container } = render(
      <ScatterChart series={sampleSeries} showGrid={false} />,
    );
    const dashedLines = container.querySelectorAll("[stroke-dasharray]");
    expect(dashedLines.length).toBe(0);
  });
});
