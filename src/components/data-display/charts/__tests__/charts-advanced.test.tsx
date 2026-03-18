import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RadarChart } from "../radar-chart";
import { ScatterChart } from "../scatter-chart";
import { FunnelChart } from "../funnel-chart";
import { HeatmapChart } from "../heatmap-chart";

// ─── Sample Data ─────────────────────────────────────────────────────────────

const radarData = [
  { label: "Design", value: 80, max: 100 },
  { label: "Frontend", value: 90, max: 100 },
  { label: "Backend", value: 70, max: 100 },
  { label: "DevOps", value: 60, max: 100 },
  { label: "Testing", value: 85, max: 100 },
];

const radarSeries = [
  {
    name: "Alice",
    color: "#6366f1",
    data: [
      { label: "Design", value: 80 },
      { label: "Frontend", value: 90 },
      { label: "Backend", value: 70 },
      { label: "DevOps", value: 60 },
      { label: "Testing", value: 85 },
    ],
  },
  {
    name: "Bob",
    color: "#f59e0b",
    data: [
      { label: "Design", value: 65 },
      { label: "Frontend", value: 75 },
      { label: "Backend", value: 90 },
      { label: "DevOps", value: 85 },
      { label: "Testing", value: 70 },
    ],
  },
];

const scatterData = [
  { x: 10, y: 20, label: "A" },
  { x: 30, y: 50, label: "B" },
  { x: 50, y: 30, label: "C" },
  { x: 70, y: 80, label: "D" },
  { x: 90, y: 60, label: "E" },
];

const scatterSeries = [
  {
    name: "Group 1",
    color: "#6366f1",
    data: [
      { x: 10, y: 20 },
      { x: 30, y: 50 },
      { x: 50, y: 30 },
    ],
  },
  {
    name: "Group 2",
    color: "#f59e0b",
    data: [
      { x: 15, y: 40 },
      { x: 45, y: 60 },
      { x: 75, y: 25 },
    ],
  },
];

const funnelData = [
  { label: "Leads", value: 1000 },
  { label: "Qualified", value: 600 },
  { label: "Proposal", value: 400 },
  { label: "Negotiation", value: 200 },
  { label: "Closed", value: 100 },
];

const heatmapData = [
  { x: "Mon", y: "Morning", value: 10 },
  { x: "Mon", y: "Afternoon", value: 20 },
  { x: "Mon", y: "Evening", value: 5 },
  { x: "Tue", y: "Morning", value: 15 },
  { x: "Tue", y: "Afternoon", value: 30 },
  { x: "Tue", y: "Evening", value: 12 },
  { x: "Wed", y: "Morning", value: 25 },
  { x: "Wed", y: "Afternoon", value: 18 },
  { x: "Wed", y: "Evening", value: 8 },
];

// ─── RadarChart ──────────────────────────────────────────────────────────────

describe("RadarChart", () => {
  it("renders without error", () => {
    const { container } = render(<RadarChart data={radarData} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("has role=img and aria-label on svg", () => {
    const { container } = render(<RadarChart data={radarData} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Radar chart");
  });

  it("renders correct number of axis lines", () => {
    render(<RadarChart data={radarData} />);
    const axes = screen.getAllByTestId(/^radar-axis-\d+$/);
    expect(axes).toHaveLength(5);
  });

  it("renders grid polygons when showGrid is true", () => {
    render(<RadarChart data={radarData} showGrid />);
    const grids = screen.getAllByTestId(/^radar-grid-\d+$/);
    expect(grids).toHaveLength(5); // 5 concentric levels
  });

  it("hides grid polygons when showGrid is false", () => {
    render(<RadarChart data={radarData} showGrid={false} />);
    expect(screen.queryByTestId("radar-grid-0")).not.toBeInTheDocument();
  });

  it("renders labels when showLabels is true", () => {
    render(<RadarChart data={radarData} showLabels />);
    const labels = screen.getAllByTestId(/^radar-label-\d+$/);
    expect(labels).toHaveLength(5);
    expect(screen.getByText("Design")).toBeInTheDocument();
    expect(screen.getByText("Frontend")).toBeInTheDocument();
  });

  it("hides labels when showLabels is false", () => {
    render(<RadarChart data={radarData} showLabels={false} />);
    expect(screen.queryByTestId("radar-label-0")).not.toBeInTheDocument();
  });

  it("renders data polygon", () => {
    render(<RadarChart data={radarData} />);
    expect(screen.getByTestId("radar-polygon-0")).toBeInTheDocument();
  });

  it("renders dots when showDots is true", () => {
    render(<RadarChart data={radarData} showDots />);
    const dots = screen.getAllByTestId(/^radar-dot-0-\d+$/);
    expect(dots).toHaveLength(5);
  });

  it("hides dots when showDots is false", () => {
    render(<RadarChart data={radarData} showDots={false} />);
    expect(screen.queryByTestId("radar-dot-0-0")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <RadarChart data={radarData} className="my-radar" />
    );
    expect(container.firstElementChild).toHaveClass("my-radar");
  });

  it("handles empty data", () => {
    const { container } = render(<RadarChart data={[]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty radar chart");
  });

  it("renders multi-series", () => {
    render(<RadarChart series={radarSeries} />);
    expect(screen.getByTestId("radar-polygon-0")).toBeInTheDocument();
    expect(screen.getByTestId("radar-polygon-1")).toBeInTheDocument();
  });

  it("highlights series on hover", () => {
    render(<RadarChart series={radarSeries} />);
    const polygon = screen.getByTestId("radar-polygon-0");
    fireEvent.mouseEnter(polygon);
    fireEvent.mouseLeave(polygon);
  });

  it("forwards ref to container div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<RadarChart ref={ref} data={radarData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders with custom size", () => {
    const { container } = render(<RadarChart data={radarData} size={400} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "400");
    expect(svg).toHaveAttribute("height", "400");
  });
});

// ─── ScatterChart ────────────────────────────────────────────────────────────

describe("ScatterChart", () => {
  it("renders without error", () => {
    const { container } = render(<ScatterChart data={scatterData} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("has role=img and aria-label on svg", () => {
    const { container } = render(<ScatterChart data={scatterData} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Scatter chart");
  });

  it("renders correct number of data points", () => {
    render(<ScatterChart data={scatterData} />);
    const points = screen.getAllByTestId(/^scatter-point-0-\d+$/);
    expect(points).toHaveLength(5);
  });

  it("renders multi-series with correct point counts", () => {
    render(<ScatterChart series={scatterSeries} />);
    const series0 = screen.getAllByTestId(/^scatter-point-0-\d+$/);
    const series1 = screen.getAllByTestId(/^scatter-point-1-\d+$/);
    expect(series0).toHaveLength(3);
    expect(series1).toHaveLength(3);
  });

  it("shows grid lines when showGrid is true", () => {
    const { container } = render(<ScatterChart data={scatterData} showGrid />);
    const dashLines = container.querySelectorAll("line[stroke-dasharray]");
    expect(dashLines.length).toBeGreaterThan(0);
  });

  it("hides grid lines when showGrid is false", () => {
    const { container } = render(
      <ScatterChart data={scatterData} showGrid={false} />
    );
    const dashLines = container.querySelectorAll("line[stroke-dasharray]");
    expect(dashLines.length).toBe(0);
  });

  it("applies custom className", () => {
    const { container } = render(
      <ScatterChart data={scatterData} className="scatter-test" />
    );
    expect(container.firstElementChild).toHaveClass("scatter-test");
  });

  it("handles empty data", () => {
    const { container } = render(<ScatterChart data={[]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty scatter chart");
  });

  it("renders axis labels", () => {
    render(<ScatterChart data={scatterData} xLabel="Weight" yLabel="Height" />);
    expect(screen.getByTestId("scatter-x-label")).toHaveTextContent("Weight");
    expect(screen.getByTestId("scatter-y-label")).toHaveTextContent("Height");
  });

  it("shows tooltip on hover", () => {
    render(<ScatterChart data={scatterData} />);
    const point = screen.getByTestId("scatter-point-0-0");
    // Use the invisible hit area circle (parent g's first circle)
    const hitArea = point.previousElementSibling!;
    fireEvent.mouseEnter(hitArea);
    fireEvent.mouseLeave(hitArea);
  });

  it("renders with custom dotSize", () => {
    render(<ScatterChart data={scatterData} dotSize={12} />);
    const point = screen.getByTestId("scatter-point-0-0");
    // Default r = dotSize/2 = 6
    expect(point).toHaveAttribute("r", "6");
  });

  it("renders with per-point size (bubble)", () => {
    const bubbleData = [
      { x: 10, y: 20, size: 20 },
      { x: 30, y: 50, size: 10 },
    ];
    render(<ScatterChart data={bubbleData} />);
    const p0 = screen.getByTestId("scatter-point-0-0");
    const p1 = screen.getByTestId("scatter-point-0-1");
    expect(p0).toHaveAttribute("r", "10"); // size 20 / 2
    expect(p1).toHaveAttribute("r", "5"); // size 10 / 2
  });

  it("forwards ref to container div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<ScatterChart ref={ref} data={scatterData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders with per-point color", () => {
    const colorData = [
      { x: 10, y: 20, color: "#ff0000" },
      { x: 30, y: 50, color: "#00ff00" },
    ];
    render(<ScatterChart data={colorData} />);
    const p0 = screen.getByTestId("scatter-point-0-0");
    expect(p0).toHaveAttribute("fill", "#ff0000");
  });
});

// ─── FunnelChart ─────────────────────────────────────────────────────────────

describe("FunnelChart", () => {
  it("renders without error", () => {
    const { container } = render(<FunnelChart data={funnelData} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("has role=img and aria-label on svg", () => {
    const { container } = render(<FunnelChart data={funnelData} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Funnel chart");
  });

  it("renders correct number of funnel segments", () => {
    render(<FunnelChart data={funnelData} />);
    const segments = screen.getAllByTestId(/^funnel-segment-\d+$/);
    expect(segments).toHaveLength(5);
  });

  it("renders labels when showLabels is true", () => {
    render(<FunnelChart data={funnelData} showLabels />);
    const labels = screen.getAllByTestId(/^funnel-label-\d+$/);
    expect(labels).toHaveLength(5);
    expect(screen.getByText("Leads")).toBeInTheDocument();
    expect(screen.getByText("Closed")).toBeInTheDocument();
  });

  it("hides labels when showLabels is false", () => {
    render(<FunnelChart data={funnelData} showLabels={false} />);
    expect(screen.queryByTestId("funnel-label-0")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <FunnelChart data={funnelData} className="funnel-test" />
    );
    expect(container.firstElementChild).toHaveClass("funnel-test");
  });

  it("handles empty data", () => {
    const { container } = render(<FunnelChart data={[]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty funnel chart");
  });

  it("renders horizontal orientation", () => {
    render(<FunnelChart data={funnelData} orientation="horizontal" />);
    const segments = screen.getAllByTestId(/^funnel-segment-\d+$/);
    expect(segments).toHaveLength(5);
  });

  it("shows values when showValues is true", () => {
    const { container } = render(
      <FunnelChart data={funnelData} showValues />
    );
    // Should have value text elements
    const textEls = container.querySelectorAll("text");
    const valueTexts = Array.from(textEls).filter(
      (t) => t.textContent?.includes("1K") || t.textContent?.includes("600")
    );
    expect(valueTexts.length).toBeGreaterThan(0);
  });

  it("shows percentage when showPercentage is true", () => {
    const { container } = render(
      <FunnelChart data={funnelData} showValues showPercentage />
    );
    const textEls = container.querySelectorAll("text");
    const pctTexts = Array.from(textEls).filter(
      (t) => t.textContent?.includes("100%") || t.textContent?.includes("60%")
    );
    expect(pctTexts.length).toBeGreaterThan(0);
  });

  it("highlights segment on hover", () => {
    render(<FunnelChart data={funnelData} />);
    const seg = screen.getByTestId("funnel-segment-0");
    fireEvent.mouseEnter(seg);
    fireEvent.mouseLeave(seg);
  });

  it("forwards ref to container div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<FunnelChart ref={ref} data={funnelData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders with custom colors on segments", () => {
    const coloredData = [
      { label: "A", value: 100, color: "#ff0000" },
      { label: "B", value: 50, color: "#00ff00" },
    ];
    render(<FunnelChart data={coloredData} />);
    const seg0 = screen.getByTestId("funnel-segment-0");
    expect(seg0).toHaveAttribute("fill", "#ff0000");
  });
});

// ─── HeatmapChart ────────────────────────────────────────────────────────────

describe("HeatmapChart", () => {
  it("renders without error", () => {
    const { container } = render(<HeatmapChart data={heatmapData} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("has role=img and aria-label on svg", () => {
    const { container } = render(<HeatmapChart data={heatmapData} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Heatmap chart");
  });

  it("renders correct number of cells", () => {
    render(<HeatmapChart data={heatmapData} />);
    // 3 x-labels (Mon, Tue, Wed) * 3 y-labels (Morning, Afternoon, Evening) = 9
    const cells = screen.getAllByTestId(/^heatmap-cell-\d+-\d+$/);
    expect(cells).toHaveLength(9);
  });

  it("renders x-axis labels", () => {
    render(<HeatmapChart data={heatmapData} />);
    const xLabels = screen.getAllByTestId(/^heatmap-x-label-\d+$/);
    expect(xLabels).toHaveLength(3);
  });

  it("renders y-axis labels", () => {
    render(<HeatmapChart data={heatmapData} />);
    const yLabels = screen.getAllByTestId(/^heatmap-y-label-\d+$/);
    expect(yLabels).toHaveLength(3);
  });

  it("applies custom className", () => {
    const { container } = render(
      <HeatmapChart data={heatmapData} className="heatmap-test" />
    );
    expect(container.firstElementChild).toHaveClass("heatmap-test");
  });

  it("handles empty data", () => {
    const { container } = render(<HeatmapChart data={[]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty heatmap chart");
  });

  it("uses explicit xLabels and yLabels", () => {
    render(
      <HeatmapChart
        data={heatmapData}
        xLabels={["Mon", "Tue", "Wed"]}
        yLabels={["Morning", "Afternoon", "Evening"]}
      />
    );
    const cells = screen.getAllByTestId(/^heatmap-cell-\d+-\d+$/);
    expect(cells).toHaveLength(9);
  });

  it("shows values when showValues is true", () => {
    const { container } = render(
      <HeatmapChart data={heatmapData} showValues />
    );
    const textEls = container.querySelectorAll("text");
    const valueTexts = Array.from(textEls).filter(
      (t) => t.textContent === "30" || t.textContent === "25"
    );
    expect(valueTexts.length).toBeGreaterThan(0);
  });

  it("shows legend when showLegend is true", () => {
    render(<HeatmapChart data={heatmapData} showLegend />);
    expect(screen.getByTestId("heatmap-legend")).toBeInTheDocument();
  });

  it("hides legend when showLegend is false", () => {
    render(<HeatmapChart data={heatmapData} showLegend={false} />);
    expect(screen.queryByTestId("heatmap-legend")).not.toBeInTheDocument();
  });

  it("highlights cell on hover", () => {
    render(<HeatmapChart data={heatmapData} />);
    const cell = screen.getByTestId("heatmap-cell-0-0");
    fireEvent.mouseEnter(cell);
    // Should show tooltip
    fireEvent.mouseLeave(cell);
  });

  it("forwards ref to container div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<HeatmapChart ref={ref} data={heatmapData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders with custom color range", () => {
    const { container } = render(
      <HeatmapChart data={heatmapData} colorRange={["#fef3c7", "#d97706"]} />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
