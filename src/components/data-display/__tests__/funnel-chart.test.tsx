import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FunnelChart } from "../charts/funnel-chart";

const sampleData = [
  { name: "Visitors", value: 1000 },
  { name: "Leads", value: 600 },
  { name: "Customers", value: 200 },
];

describe("FunnelChart", () => {
  it("renders an SVG element", () => {
    const { container } = render(<FunnelChart data={sampleData} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with role=img and aria-label", () => {
    const { container } = render(<FunnelChart data={sampleData} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Funnel chart");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<FunnelChart ref={ref} data={sampleData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(FunnelChart.displayName).toBe("FunnelChart");
  });

  it("merges custom className", () => {
    const { container } = render(
      <FunnelChart data={sampleData} className="custom" />,
    );
    expect(container.firstElementChild!.className).toContain("custom");
  });

  it("renders funnel segments as polygons", () => {
    const { container } = render(<FunnelChart data={sampleData} />);
    expect(container.querySelector("[data-testid='funnel-segment-0']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='funnel-segment-1']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='funnel-segment-2']")).toBeInTheDocument();
  });

  it("renders empty state when no data", () => {
    const { container } = render(<FunnelChart data={[]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty funnel chart");
  });

  it("renders labels by default", () => {
    const { container } = render(<FunnelChart data={sampleData} />);
    expect(container.querySelector("[data-testid='funnel-label-0']")).toBeInTheDocument();
    expect(screen.getByText("Visitors")).toBeInTheDocument();
  });

  it("hides labels when showLabels=false", () => {
    const { container } = render(
      <FunnelChart data={sampleData} showLabels={false} />,
    );
    expect(container.querySelector("[data-testid='funnel-label-0']")).not.toBeInTheDocument();
  });

  it("renders in horizontal orientation", () => {
    const { container } = render(
      <FunnelChart data={sampleData} orientation="horizontal" />,
    );
    expect(container.querySelector("svg")).toHaveAttribute("aria-label", "Funnel chart");
    expect(container.querySelector("[data-testid='funnel-segment-0']")).toBeInTheDocument();
  });

  it("applies custom height", () => {
    const { container } = render(<FunnelChart data={sampleData} height={400} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("height", "400");
  });
});
