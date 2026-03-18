import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BarChart } from "../bar-chart";
import { LineChart } from "../line-chart";
import { AreaChart } from "../area-chart";
import { DonutChart } from "../donut-chart";

const sampleData = [
  { label: "Jan", value: 100 },
  { label: "Feb", value: 200 },
  { label: "Mar", value: 150 },
  { label: "Apr", value: 300 },
];

const donutData = [
  { label: "React", value: 45 },
  { label: "Vue", value: 25 },
  { label: "Angular", value: 20 },
  { label: "Svelte", value: 10 },
];

// ─── BarChart ────────────────────────────────────────────────────────────────

describe("BarChart", () => {
  it("renders without error", () => {
    const { container } = render(<BarChart data={sampleData} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders correct number of bars", () => {
    render(<BarChart data={sampleData} animate={false} />);
    const bars = screen.getAllByTestId(/^bar-\d+$/);
    expect(bars).toHaveLength(4);
  });

  it("has role=img and aria-label on svg", () => {
    const { container } = render(<BarChart data={sampleData} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Bar chart");
  });

  it("applies custom className", () => {
    const { container } = render(
      <BarChart data={sampleData} className="my-custom-class" />
    );
    expect(container.firstElementChild).toHaveClass("my-custom-class");
  });

  it("shows grid lines when showGrid is true", () => {
    const { container } = render(<BarChart data={sampleData} showGrid />);
    const dashLines = container.querySelectorAll("line[stroke-dasharray]");
    expect(dashLines.length).toBeGreaterThan(0);
  });

  it("hides grid lines when showGrid is false", () => {
    const { container } = render(
      <BarChart data={sampleData} showGrid={false} />
    );
    const dashLines = container.querySelectorAll("line[stroke-dasharray]");
    expect(dashLines.length).toBe(0);
  });

  it("handles empty data", () => {
    const { container } = render(<BarChart data={[]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty bar chart");
  });

  it("renders horizontal orientation", () => {
    render(
      <BarChart data={sampleData} orientation="horizontal" animate={false} />
    );
    const bars = screen.getAllByTestId(/^bar-\d+$/);
    expect(bars).toHaveLength(4);
  });

  it("shows values when showValues is true", () => {
    const { container } = render(
      <BarChart data={sampleData} showValues animate={false} />
    );
    // Value labels should render as text elements with numeric content
    const textEls = container.querySelectorAll("text");
    const valueTexts = Array.from(textEls).filter(
      (t) => t.textContent === "300" || t.textContent === "200"
    );
    expect(valueTexts.length).toBeGreaterThan(0);
  });

  it("shows tooltip on hover", () => {
    render(<BarChart data={sampleData} animate={false} />);
    const bar = screen.getByTestId("bar-0");
    fireEvent.mouseEnter(bar);
    // Tooltip should show value
    const tooltipTexts = screen
      .getAllByText("100")
      .filter(
        (el) => el.getAttribute("fill") === "#fff"
      );
    expect(tooltipTexts.length).toBeGreaterThan(0);
    fireEvent.mouseLeave(bar);
  });

  it("forwards ref to container div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<BarChart ref={ref} data={sampleData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders with custom color on data points", () => {
    const coloredData = [
      { label: "A", value: 10, color: "#ff0000" },
      { label: "B", value: 20, color: "#00ff00" },
    ];
    render(<BarChart data={coloredData} animate={false} />);
    const bar0 = screen.getByTestId("bar-0");
    expect(bar0).toHaveAttribute("fill", "#ff0000");
  });
});

// ─── LineChart ────────────────────────────────────────────────────────────────

describe("LineChart", () => {
  it("renders without error", () => {
    const { container } = render(<LineChart data={sampleData} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders the line path", () => {
    render(<LineChart data={sampleData} />);
    expect(screen.getByTestId("line-path")).toBeInTheDocument();
  });

  it("renders correct number of dots when showDots is true", () => {
    render(<LineChart data={sampleData} showDots />);
    const dots = screen.getAllByTestId(/^dot-\d+$/);
    expect(dots).toHaveLength(4);
  });

  it("hides dots when showDots is false", () => {
    render(<LineChart data={sampleData} showDots={false} />);
    expect(screen.queryByTestId("dot-0")).not.toBeInTheDocument();
  });

  it("has role=img and aria-label on svg", () => {
    const { container } = render(<LineChart data={sampleData} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Line chart");
  });

  it("applies custom className", () => {
    const { container } = render(
      <LineChart data={sampleData} className="line-custom" />
    );
    expect(container.firstElementChild).toHaveClass("line-custom");
  });

  it("shows grid lines when showGrid is true", () => {
    const { container } = render(<LineChart data={sampleData} showGrid />);
    const dashLines = container.querySelectorAll("line[stroke-dasharray]");
    expect(dashLines.length).toBeGreaterThan(0);
  });

  it("hides grid lines when showGrid is false", () => {
    const { container } = render(
      <LineChart data={sampleData} showGrid={false} />
    );
    const dashLines = container.querySelectorAll("line[stroke-dasharray]");
    expect(dashLines.length).toBe(0);
  });

  it("handles empty data", () => {
    const { container } = render(<LineChart data={[]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty line chart");
  });

  it("renders area fill when showArea is true", () => {
    render(<LineChart data={sampleData} showArea />);
    expect(screen.getByTestId("line-area")).toBeInTheDocument();
  });

  it("does not render area fill when showArea is false", () => {
    render(<LineChart data={sampleData} showArea={false} />);
    expect(screen.queryByTestId("line-area")).not.toBeInTheDocument();
  });

  it("renders smooth curves when smooth is true", () => {
    render(<LineChart data={sampleData} smooth />);
    const path = screen.getByTestId("line-path");
    // Smooth paths contain C (cubic bezier) commands
    expect(path.getAttribute("d")).toContain("C");
  });

  it("renders straight lines when smooth is false", () => {
    render(<LineChart data={sampleData} smooth={false} />);
    const path = screen.getByTestId("line-path");
    // Straight paths contain L (lineTo) commands, no C
    expect(path.getAttribute("d")).toContain("L");
    expect(path.getAttribute("d")).not.toContain("C");
  });

  it("forwards ref to container div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<LineChart ref={ref} data={sampleData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom color to the line", () => {
    render(<LineChart data={sampleData} color="#ff0000" />);
    const path = screen.getByTestId("line-path");
    expect(path).toHaveAttribute("stroke", "#ff0000");
  });

  it("applies custom strokeWidth", () => {
    render(<LineChart data={sampleData} strokeWidth={4} />);
    const path = screen.getByTestId("line-path");
    expect(path).toHaveAttribute("stroke-width", "4");
  });
});

// ─── AreaChart ────────────────────────────────────────────────────────────────

describe("AreaChart", () => {
  it("renders without error with single data prop", () => {
    const { container } = render(<AreaChart data={sampleData} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders without error with series prop", () => {
    const { container } = render(
      <AreaChart
        series={[
          { data: sampleData, name: "Sales", color: "#6366f1" },
          { data: sampleData.map((d) => ({ ...d, value: d.value * 0.5 })), name: "Returns", color: "#ef4444" },
        ]}
      />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("has role=img and aria-label on svg", () => {
    const { container } = render(<AreaChart data={sampleData} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Area chart");
  });

  it("applies custom className", () => {
    const { container } = render(
      <AreaChart data={sampleData} className="area-custom" />
    );
    expect(container.firstElementChild).toHaveClass("area-custom");
  });

  it("renders area fill", () => {
    render(<AreaChart data={sampleData} />);
    expect(screen.getByTestId("area-fill-0")).toBeInTheDocument();
  });

  it("renders line path", () => {
    render(<AreaChart data={sampleData} />);
    expect(screen.getByTestId("area-line-0")).toBeInTheDocument();
  });

  it("renders multiple series lines", () => {
    render(
      <AreaChart
        series={[
          { data: sampleData, name: "A" },
          { data: sampleData, name: "B" },
        ]}
      />
    );
    expect(screen.getByTestId("area-line-0")).toBeInTheDocument();
    expect(screen.getByTestId("area-line-1")).toBeInTheDocument();
  });

  it("shows grid lines when showGrid is true", () => {
    const { container } = render(<AreaChart data={sampleData} showGrid />);
    const dashLines = container.querySelectorAll("line[stroke-dasharray]");
    expect(dashLines.length).toBeGreaterThan(0);
  });

  it("hides grid lines when showGrid is false", () => {
    const { container } = render(
      <AreaChart data={sampleData} showGrid={false} />
    );
    const dashLines = container.querySelectorAll("line[stroke-dasharray]");
    expect(dashLines.length).toBe(0);
  });

  it("handles empty data", () => {
    const { container } = render(<AreaChart data={[]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty area chart");
  });

  it("handles no data or series", () => {
    const { container } = render(<AreaChart />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty area chart");
  });

  it("renders data point dots", () => {
    render(<AreaChart data={sampleData} />);
    expect(screen.getByTestId("area-dot-0-0")).toBeInTheDocument();
  });

  it("forwards ref to container div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<AreaChart ref={ref} data={sampleData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders stacked areas", () => {
    render(
      <AreaChart
        series={[
          { data: sampleData, name: "A" },
          { data: sampleData, name: "B" },
        ]}
        stacked
      />
    );
    expect(screen.getByTestId("area-fill-0")).toBeInTheDocument();
    expect(screen.getByTestId("area-fill-1")).toBeInTheDocument();
  });
});

// ─── DonutChart ──────────────────────────────────────────────────────────────

describe("DonutChart", () => {
  it("renders without error", () => {
    const { container } = render(<DonutChart data={donutData} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders correct number of segments", () => {
    render(<DonutChart data={donutData} animate={false} />);
    const segments = screen.getAllByTestId(/^segment-\d+$/);
    expect(segments).toHaveLength(4);
  });

  it("has role=img and aria-label on svg", () => {
    const { container } = render(<DonutChart data={donutData} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Donut chart");
  });

  it("applies custom className", () => {
    const { container } = render(
      <DonutChart data={donutData} className="donut-custom" />
    );
    expect(container.firstElementChild).toHaveClass("donut-custom");
  });

  it("handles empty data", () => {
    const { container } = render(<DonutChart data={[]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty donut chart");
  });

  it("renders center label", () => {
    render(
      <DonutChart
        data={donutData}
        centerLabel={<span data-testid="center">100</span>}
      />
    );
    expect(screen.getByTestId("center")).toBeInTheDocument();
  });

  it("renders legend when showLegend is true", () => {
    render(<DonutChart data={donutData} showLegend />);
    expect(screen.getByTestId("donut-legend")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Vue")).toBeInTheDocument();
    expect(screen.getByText("Angular")).toBeInTheDocument();
    expect(screen.getByText("Svelte")).toBeInTheDocument();
  });

  it("hides legend when showLegend is false", () => {
    render(<DonutChart data={donutData} showLegend={false} />);
    expect(screen.queryByTestId("donut-legend")).not.toBeInTheDocument();
  });

  it("renders with custom colors", () => {
    const coloredData = [
      { label: "A", value: 50, color: "#ff0000" },
      { label: "B", value: 50, color: "#00ff00" },
    ];
    render(<DonutChart data={coloredData} animate={false} />);
    const seg0 = screen.getByTestId("segment-0");
    expect(seg0).toHaveAttribute("stroke", "#ff0000");
  });

  it("renders with custom size", () => {
    const { container } = render(
      <DonutChart data={donutData} size={400} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "400");
    expect(svg).toHaveAttribute("height", "400");
  });

  it("handles hover on segments", () => {
    render(<DonutChart data={donutData} animate={false} />);
    const seg = screen.getByTestId("segment-0");
    fireEvent.mouseEnter(seg);
    // Segment should get wider stroke on hover
    // The hovered segment should have larger strokeWidth
    fireEvent.mouseLeave(seg);
  });

  it("forwards ref to container div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<DonutChart ref={ref} data={donutData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("handles all-zero data", () => {
    const zeroData = [
      { label: "A", value: 0 },
      { label: "B", value: 0 },
    ];
    const { container } = render(<DonutChart data={zeroData} />);
    // Should render a grey ring
    const circle = container.querySelector("circle");
    expect(circle).toBeInTheDocument();
  });
});
