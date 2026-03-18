import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { describe, it, expect } from "vitest";
import { RadarChart } from "../components/data-display/charts/radar-chart";
import { ScatterChart } from "../components/data-display/charts/scatter-chart";
import { FunnelChart } from "../components/data-display/charts/funnel-chart";
import { HeatmapChart } from "../components/data-display/charts/heatmap-chart";

expect.extend(toHaveNoViolations);

const radarData = [
  { label: "Design", value: 80, max: 100 },
  { label: "Frontend", value: 90, max: 100 },
  { label: "Backend", value: 70, max: 100 },
  { label: "DevOps", value: 60, max: 100 },
  { label: "Testing", value: 85, max: 100 },
];

const scatterData = [
  { x: 10, y: 20 },
  { x: 30, y: 50 },
  { x: 50, y: 30 },
];

const funnelData = [
  { label: "Leads", value: 1000 },
  { label: "Qualified", value: 600 },
  { label: "Proposal", value: 400 },
];

const heatmapData = [
  { x: "Mon", y: "AM", value: 10 },
  { x: "Mon", y: "PM", value: 20 },
  { x: "Tue", y: "AM", value: 15 },
  { x: "Tue", y: "PM", value: 30 },
];

describe("Accessibility (axe) - Advanced Charts", () => {
  it("RadarChart (default)", async () => {
    const { container } = render(<RadarChart data={radarData} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("RadarChart (empty)", async () => {
    const { container } = render(<RadarChart data={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("RadarChart (multi-series)", async () => {
    const { container } = render(
      <RadarChart
        series={[
          { name: "A", data: radarData.map((d) => ({ label: d.label, value: d.value })) },
          { name: "B", data: radarData.map((d) => ({ label: d.label, value: d.value * 0.8 })) },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("ScatterChart (default)", async () => {
    const { container } = render(<ScatterChart data={scatterData} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("ScatterChart (empty)", async () => {
    const { container } = render(<ScatterChart data={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("ScatterChart (with labels)", async () => {
    const { container } = render(
      <ScatterChart data={scatterData} xLabel="X" yLabel="Y" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("FunnelChart (default)", async () => {
    const { container } = render(<FunnelChart data={funnelData} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("FunnelChart (empty)", async () => {
    const { container } = render(<FunnelChart data={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("FunnelChart (horizontal)", async () => {
    const { container } = render(
      <FunnelChart data={funnelData} orientation="horizontal" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("HeatmapChart (default)", async () => {
    const { container } = render(<HeatmapChart data={heatmapData} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("HeatmapChart (empty)", async () => {
    const { container } = render(<HeatmapChart data={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("HeatmapChart (with legend)", async () => {
    const { container } = render(
      <HeatmapChart data={heatmapData} showLegend showValues />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
