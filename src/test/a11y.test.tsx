import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { describe, it, expect } from "vitest";
import { BarChart } from "../components/data-display/charts/bar-chart";
import { LineChart } from "../components/data-display/charts/line-chart";
import { AreaChart } from "../components/data-display/charts/area-chart";
import { DonutChart } from "../components/data-display/charts/donut-chart";

expect.extend(toHaveNoViolations);

const sampleData = [
  { label: "Jan", value: 100 },
  { label: "Feb", value: 200 },
  { label: "Mar", value: 150 },
];

const donutData = [
  { label: "React", value: 45, color: "#6366f1" },
  { label: "Vue", value: 25, color: "#10b981" },
  { label: "Angular", value: 20, color: "#f59e0b" },
  { label: "Svelte", value: 10, color: "#ef4444" },
];

describe("Charts Accessibility (axe)", () => {
  it("BarChart (vertical)", async () => {
    const { container } = render(
      <BarChart data={sampleData} animate={false} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("BarChart (horizontal)", async () => {
    const { container } = render(
      <BarChart data={sampleData} orientation="horizontal" animate={false} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("BarChart (empty)", async () => {
    const { container } = render(<BarChart data={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("LineChart (default)", async () => {
    const { container } = render(<LineChart data={sampleData} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("LineChart (with area)", async () => {
    const { container } = render(
      <LineChart data={sampleData} showArea smooth />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("LineChart (empty)", async () => {
    const { container } = render(<LineChart data={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("AreaChart (single series)", async () => {
    const { container } = render(<AreaChart data={sampleData} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("AreaChart (multi series)", async () => {
    const { container } = render(
      <AreaChart
        series={[
          { data: sampleData, name: "A", color: "#6366f1" },
          { data: sampleData, name: "B", color: "#10b981" },
        ]}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("AreaChart (empty)", async () => {
    const { container } = render(<AreaChart data={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("DonutChart (default)", async () => {
    const { container } = render(
      <DonutChart data={donutData} animate={false} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("DonutChart (with legend)", async () => {
    const { container } = render(
      <DonutChart data={donutData} showLegend animate={false} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("DonutChart (with center label)", async () => {
    const { container } = render(
      <DonutChart
        data={donutData}
        centerLabel={<span>Total: 100</span>}
        animate={false}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("DonutChart (empty)", async () => {
    const { container } = render(<DonutChart data={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
