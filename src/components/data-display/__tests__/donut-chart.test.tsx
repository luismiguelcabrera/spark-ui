import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PieChart } from "../charts/pie-chart";

const sampleData = [
  { name: "Chrome", value: 60 },
  { name: "Firefox", value: 25 },
  { name: "Safari", value: 15 },
];

describe("PieChart (formerly DonutChart)", () => {
  it("renders an SVG element", () => {
    const { container } = render(<PieChart data={sampleData} animate={false} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with role=img and aria-label", () => {
    const { container } = render(<PieChart data={sampleData} animate={false} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Donut chart");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<PieChart ref={ref} data={sampleData} animate={false} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(PieChart.displayName).toBe("PieChart");
  });

  it("merges custom className", () => {
    const { container } = render(
      <PieChart data={sampleData} animate={false} className="custom" />,
    );
    expect(container.firstElementChild!.className).toContain("custom");
  });

  it("renders segment circles for each data point", () => {
    const { container } = render(<PieChart data={sampleData} animate={false} />);
    expect(container.querySelector("[data-testid='segment-0']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='segment-1']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='segment-2']")).toBeInTheDocument();
  });

  it("renders empty state when no data", () => {
    const { container } = render(<PieChart data={[]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty pie chart");
  });

  it("renders legend when showLegend is true", () => {
    const { container } = render(
      <PieChart data={sampleData} animate={false} showLegend />,
    );
    const legend = container.querySelector("[data-testid='chart-legend']");
    expect(legend).toBeInTheDocument();
    expect(screen.getByText("Chrome")).toBeInTheDocument();
    expect(screen.getByText("Firefox")).toBeInTheDocument();
    expect(screen.getByText("Safari")).toBeInTheDocument();
  });

  it("applies custom size", () => {
    const { container } = render(
      <PieChart data={sampleData} animate={false} size={300} />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "300");
    expect(svg).toHaveAttribute("height", "300");
  });

  it("renders center label when provided", () => {
    render(
      <PieChart data={sampleData} animate={false} label={<span>Total</span>} />,
    );
    expect(screen.getByText("Total")).toBeInTheDocument();
  });
});
