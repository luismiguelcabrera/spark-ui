import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AreaChart } from "../charts/area-chart";

const sampleData = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 200 },
  { month: "Mar", value: 150 },
  { month: "Apr", value: 300 },
];

describe("AreaChart", () => {
  it("renders an SVG element", () => {
    const { container } = render(<AreaChart data={sampleData} index="month" categories={["value"]} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with role=img and aria-label", () => {
    const { container } = render(<AreaChart data={sampleData} index="month" categories={["value"]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Area chart");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<AreaChart ref={ref} data={sampleData} index="month" categories={["value"]} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(AreaChart.displayName).toBe("AreaChart");
  });

  it("merges custom className", () => {
    const { container } = render(<AreaChart data={sampleData} index="month" categories={["value"]} className="custom" />);
    expect(container.firstElementChild!.className).toContain("custom");
  });

  it("renders area fill paths", () => {
    const { container } = render(<AreaChart data={sampleData} index="month" categories={["value"]} />);
    const areaFill = container.querySelector("[data-testid='area-fill-value']");
    expect(areaFill).toBeInTheDocument();
  });

  it("renders line paths", () => {
    const { container } = render(<AreaChart data={sampleData} index="month" categories={["value"]} />);
    const linePath = container.querySelector("[data-testid='area-line-value']");
    expect(linePath).toBeInTheDocument();
  });

  it("renders empty state when no data", () => {
    const { container } = render(<AreaChart data={[]} index="month" categories={["value"]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty area chart");
  });

  it("applies custom height", () => {
    const { container } = render(<AreaChart data={sampleData} index="month" categories={["value"]} height={400} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("height", "400");
  });

  it("renders multi-series data", () => {
    const multiData = sampleData.map((d) => ({ ...d, extra: d.value * 2 }));
    const { container } = render(
      <AreaChart data={multiData} index="month" categories={["value", "extra"]} colors={["#ff0000", "#00ff00"]} />,
    );
    expect(container.querySelector("[data-testid='area-line-value']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='area-line-extra']")).toBeInTheDocument();
  });

  it("renders without grid when showGrid=false", () => {
    const { container } = render(<AreaChart data={sampleData} index="month" categories={["value"]} showGrid={false} />);
    // Gridlines use dashed stroke pattern
    const dashedLines = container.querySelectorAll("[stroke-dasharray]");
    expect(dashedLines.length).toBe(0);
  });
});
