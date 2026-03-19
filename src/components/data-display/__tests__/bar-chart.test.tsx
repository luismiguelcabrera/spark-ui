import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BarChart } from "../charts/bar-chart";

const sampleData = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 200 },
  { month: "Mar", value: 150 },
];

describe("BarChart", () => {
  it("renders an SVG element", () => {
    const { container } = render(<BarChart data={sampleData} index="month" categories={["value"]} animate={false} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with role=img and aria-label", () => {
    const { container } = render(<BarChart data={sampleData} index="month" categories={["value"]} animate={false} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Bar chart");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<BarChart ref={ref} data={sampleData} index="month" categories={["value"]} animate={false} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(BarChart.displayName).toBe("BarChart");
  });

  it("merges custom className", () => {
    const { container } = render(
      <BarChart data={sampleData} index="month" categories={["value"]} animate={false} className="custom" />,
    );
    expect(container.firstElementChild!.className).toContain("custom");
  });

  it("renders bar rect elements", () => {
    const { container } = render(<BarChart data={sampleData} index="month" categories={["value"]} animate={false} />);
    const bar0 = container.querySelector("[data-testid='bar-0-0']");
    const bar1 = container.querySelector("[data-testid='bar-1-0']");
    const bar2 = container.querySelector("[data-testid='bar-2-0']");
    expect(bar0).toBeInTheDocument();
    expect(bar1).toBeInTheDocument();
    expect(bar2).toBeInTheDocument();
  });

  it("renders empty state when no data", () => {
    const { container } = render(<BarChart data={[]} index="month" categories={["value"]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty bar chart");
  });

  it("applies custom height", () => {
    const { container } = render(<BarChart data={sampleData} index="month" categories={["value"]} height={400} animate={false} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("height", "400");
  });

  it("renders horizontal bars", () => {
    const { container } = render(
      <BarChart data={sampleData} index="month" categories={["value"]} layout="horizontal" animate={false} />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Bar chart");
    expect(container.querySelector("[data-testid='bar-0-0']")).toBeInTheDocument();
  });

  it("renders without grid when showGrid=false", () => {
    const { container } = render(
      <BarChart data={sampleData} index="month" categories={["value"]} showGrid={false} animate={false} />,
    );
    const dashedLines = container.querySelectorAll("[stroke-dasharray]");
    expect(dashedLines.length).toBe(0);
  });
});
