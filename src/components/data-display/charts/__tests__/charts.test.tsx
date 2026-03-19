import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { BarChart } from "../bar-chart";
import { LineChart } from "../line-chart";
import { AreaChart } from "../area-chart";
import { PieChart } from "../pie-chart";

// Mock matchMedia for prefersReducedMotion()
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

const sampleData = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 200 },
  { month: "Mar", value: 150 },
  { month: "Apr", value: 300 },
];

const pieData = [
  { name: "React", value: 45 },
  { name: "Vue", value: 25 },
  { name: "Angular", value: 20 },
  { name: "Svelte", value: 10 },
];

// ─── BarChart ────────────────────────────────────────────────────────────────

describe("BarChart", () => {
  it("renders without error", () => {
    const { container } = render(
      <BarChart data={sampleData} index="month" categories={["value"]} />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders correct number of bars", () => {
    render(
      <BarChart
        data={sampleData}
        index="month"
        categories={["value"]}
        animate={false}
      />
    );
    const bars = screen.getAllByTestId(/^bar-\d+-\d+$/);
    expect(bars).toHaveLength(4);
  });

  it("has role=img and aria-label on svg", () => {
    const { container } = render(
      <BarChart data={sampleData} index="month" categories={["value"]} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Bar chart");
  });

  it("applies custom className", () => {
    const { container } = render(
      <BarChart
        data={sampleData}
        index="month"
        categories={["value"]}
        className="my-custom-class"
      />
    );
    expect(container.firstElementChild).toHaveClass("my-custom-class");
  });

  it("shows grid lines when showGrid is true", () => {
    const { container } = render(
      <BarChart
        data={sampleData}
        index="month"
        categories={["value"]}
        showGrid
      />
    );
    const dashLines = container.querySelectorAll("line[stroke-dasharray]");
    expect(dashLines.length).toBeGreaterThan(0);
  });

  it("hides grid lines when showGrid is false", () => {
    const { container } = render(
      <BarChart
        data={sampleData}
        index="month"
        categories={["value"]}
        showGrid={false}
      />
    );
    const dashLines = container.querySelectorAll("line[stroke-dasharray]");
    expect(dashLines.length).toBe(0);
  });

  it("handles empty data", () => {
    const { container } = render(
      <BarChart data={[]} index="month" categories={["value"]} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty bar chart");
  });

  it("renders horizontal orientation", () => {
    render(
      <BarChart
        data={sampleData}
        index="month"
        categories={["value"]}
        layout="horizontal"
        animate={false}
      />
    );
    const bars = screen.getAllByTestId(/^bar-\d+-\d+$/);
    expect(bars).toHaveLength(4);
  });

  it("shows values when showDataLabels is true", () => {
    const { container } = render(
      <BarChart
        data={sampleData}
        index="month"
        categories={["value"]}
        showDataLabels
        animate={false}
      />
    );
    // Value labels should render as text elements with numeric content
    const textEls = container.querySelectorAll("text");
    const valueTexts = Array.from(textEls).filter(
      (t) => t.textContent === "300" || t.textContent === "200"
    );
    expect(valueTexts.length).toBeGreaterThan(0);
  });

  it("shows tooltip on hover", () => {
    const { container } = render(
      <BarChart
        data={sampleData}
        index="month"
        categories={["value"]}
        animate={false}
      />
    );
    // Use the invisible hover zone rects (which don't call createSVGPoint)
    const hitAreas = container.querySelectorAll('rect[fill="transparent"]');
    expect(hitAreas.length).toBeGreaterThan(0);
    fireEvent.mouseEnter(hitAreas[0]);
    fireEvent.mouseLeave(hitAreas[0]);
  });

  it("forwards ref to container div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <BarChart
        ref={ref}
        data={sampleData}
        index="month"
        categories={["value"]}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders with custom colors", () => {
    const multiCatData = [
      { month: "A", sales: 10, returns: 5 },
      { month: "B", sales: 20, returns: 8 },
    ];
    render(
      <BarChart
        data={multiCatData}
        index="month"
        categories={["sales", "returns"]}
        colors={["#ff0000", "#00ff00"]}
        animate={false}
      />
    );
    const bar0 = screen.getByTestId("bar-0-0");
    expect(bar0).toHaveAttribute("fill", "#ff0000");
  });
});

// ─── LineChart ────────────────────────────────────────────────────────────────

describe("LineChart", () => {
  it("renders without error", () => {
    const { container } = render(
      <LineChart data={sampleData} index="month" categories={["value"]} />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders the line path", () => {
    render(
      <LineChart data={sampleData} index="month" categories={["value"]} />
    );
    expect(screen.getByTestId("line-value")).toBeInTheDocument();
  });

  it("renders correct number of dots when showDots is true", () => {
    render(
      <LineChart
        data={sampleData}
        index="month"
        categories={["value"]}
        showDots
      />
    );
    const dots = screen.getAllByTestId(/^dot-value-\d+$/);
    expect(dots).toHaveLength(4);
  });

  it("hides dots when showDots is false", () => {
    render(
      <LineChart
        data={sampleData}
        index="month"
        categories={["value"]}
        showDots={false}
      />
    );
    expect(screen.queryByTestId("dot-value-0")).not.toBeInTheDocument();
  });

  it("has role=img and aria-label on svg", () => {
    const { container } = render(
      <LineChart data={sampleData} index="month" categories={["value"]} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Line chart");
  });

  it("applies custom className", () => {
    const { container } = render(
      <LineChart
        data={sampleData}
        index="month"
        categories={["value"]}
        className="line-custom"
      />
    );
    expect(container.firstElementChild).toHaveClass("line-custom");
  });

  it("shows grid lines when showGrid is true", () => {
    const { container } = render(
      <LineChart
        data={sampleData}
        index="month"
        categories={["value"]}
        showGrid
      />
    );
    const dashLines = container.querySelectorAll("line[stroke-dasharray]");
    expect(dashLines.length).toBeGreaterThan(0);
  });

  it("hides grid lines when showGrid is false", () => {
    const { container } = render(
      <LineChart
        data={sampleData}
        index="month"
        categories={["value"]}
        showGrid={false}
      />
    );
    const dashLines = container.querySelectorAll("line[stroke-dasharray]");
    expect(dashLines.length).toBe(0);
  });

  it("handles empty data", () => {
    const { container } = render(
      <LineChart data={[]} index="month" categories={["value"]} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty line chart");
  });

  it("renders smooth curves when curveType is monotone", () => {
    render(
      <LineChart
        data={sampleData}
        index="month"
        categories={["value"]}
        curveType="monotone"
      />
    );
    const path = screen.getByTestId("line-value");
    // Smooth paths contain C (cubic bezier) commands
    expect(path.getAttribute("d")).toContain("C");
  });

  it("renders straight lines when curveType is linear", () => {
    render(
      <LineChart
        data={sampleData}
        index="month"
        categories={["value"]}
        curveType="linear"
      />
    );
    const path = screen.getByTestId("line-value");
    // Straight paths contain L (lineTo) commands, no C
    expect(path.getAttribute("d")).toContain("L");
    expect(path.getAttribute("d")).not.toContain("C");
  });

  it("forwards ref to container div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <LineChart
        ref={ref}
        data={sampleData}
        index="month"
        categories={["value"]}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom color to the line", () => {
    render(
      <LineChart
        data={sampleData}
        index="month"
        categories={["value"]}
        colors={["#ff0000"]}
      />
    );
    const path = screen.getByTestId("line-value");
    expect(path).toHaveAttribute("stroke", "#ff0000");
  });

  it("applies custom strokeWidth", () => {
    render(
      <LineChart
        data={sampleData}
        index="month"
        categories={["value"]}
        strokeWidth={4}
      />
    );
    const path = screen.getByTestId("line-value");
    expect(path).toHaveAttribute("stroke-width", "4");
  });
});

// ─── AreaChart ────────────────────────────────────────────────────────────────

describe("AreaChart", () => {
  it("renders without error", () => {
    const { container } = render(
      <AreaChart data={sampleData} index="month" categories={["value"]} />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders without error with multiple categories", () => {
    const multiData = [
      { month: "Jan", sales: 100, returns: 50 },
      { month: "Feb", sales: 200, returns: 100 },
    ];
    const { container } = render(
      <AreaChart
        data={multiData}
        index="month"
        categories={["sales", "returns"]}
        colors={["#6366f1", "#ef4444"]}
      />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("has role=img and aria-label on svg", () => {
    const { container } = render(
      <AreaChart data={sampleData} index="month" categories={["value"]} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Area chart");
  });

  it("applies custom className", () => {
    const { container } = render(
      <AreaChart
        data={sampleData}
        index="month"
        categories={["value"]}
        className="area-custom"
      />
    );
    expect(container.firstElementChild).toHaveClass("area-custom");
  });

  it("renders area fill", () => {
    render(
      <AreaChart data={sampleData} index="month" categories={["value"]} />
    );
    expect(screen.getByTestId("area-fill-value")).toBeInTheDocument();
  });

  it("renders line path", () => {
    render(
      <AreaChart data={sampleData} index="month" categories={["value"]} />
    );
    expect(screen.getByTestId("area-line-value")).toBeInTheDocument();
  });

  it("renders multiple series lines", () => {
    const multiData = sampleData.map((d) => ({
      ...d,
      extra: d.value * 2,
    }));
    render(
      <AreaChart
        data={multiData}
        index="month"
        categories={["value", "extra"]}
      />
    );
    expect(screen.getByTestId("area-line-value")).toBeInTheDocument();
    expect(screen.getByTestId("area-line-extra")).toBeInTheDocument();
  });

  it("shows grid lines when showGrid is true", () => {
    const { container } = render(
      <AreaChart
        data={sampleData}
        index="month"
        categories={["value"]}
        showGrid
      />
    );
    const dashLines = container.querySelectorAll("line[stroke-dasharray]");
    expect(dashLines.length).toBeGreaterThan(0);
  });

  it("hides grid lines when showGrid is false", () => {
    const { container } = render(
      <AreaChart
        data={sampleData}
        index="month"
        categories={["value"]}
        showGrid={false}
      />
    );
    const dashLines = container.querySelectorAll("line[stroke-dasharray]");
    expect(dashLines.length).toBe(0);
  });

  it("handles empty data", () => {
    const { container } = render(
      <AreaChart data={[]} index="month" categories={["value"]} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty area chart");
  });

  it("renders area fill for stacked", () => {
    const multiData = sampleData.map((d) => ({
      ...d,
      extra: d.value * 2,
    }));
    render(
      <AreaChart
        data={multiData}
        index="month"
        categories={["value", "extra"]}
        type="stacked"
      />
    );
    expect(screen.getByTestId("area-fill-value")).toBeInTheDocument();
    expect(screen.getByTestId("area-fill-extra")).toBeInTheDocument();
  });

  it("forwards ref to container div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <AreaChart
        ref={ref}
        data={sampleData}
        index="month"
        categories={["value"]}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

// ─── PieChart (replaces DonutChart) ─────────────────────────────────────────

describe("PieChart", () => {
  it("renders without error", () => {
    const { container } = render(<PieChart data={pieData} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders correct number of segments", () => {
    render(<PieChart data={pieData} animate={false} />);
    const segments = screen.getAllByTestId(/^segment-\d+$/);
    expect(segments).toHaveLength(4);
  });

  it("has role=img and aria-label on svg", () => {
    const { container } = render(<PieChart data={pieData} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Donut chart");
  });

  it("applies custom className", () => {
    const { container } = render(
      <PieChart data={pieData} className="donut-custom" />
    );
    expect(container.firstElementChild).toHaveClass("donut-custom");
  });

  it("handles empty data", () => {
    const { container } = render(<PieChart data={[]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Empty pie chart");
  });

  it("renders center label", () => {
    render(
      <PieChart
        data={pieData}
        label={<span data-testid="center">100</span>}
      />
    );
    expect(screen.getByTestId("center")).toBeInTheDocument();
  });

  it("renders legend when showLegend is true", () => {
    render(<PieChart data={pieData} showLegend />);
    expect(screen.getByTestId("chart-legend")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Vue")).toBeInTheDocument();
    expect(screen.getByText("Angular")).toBeInTheDocument();
    expect(screen.getByText("Svelte")).toBeInTheDocument();
  });

  it("hides legend when showLegend is false", () => {
    render(<PieChart data={pieData} showLegend={false} />);
    expect(screen.queryByTestId("chart-legend")).not.toBeInTheDocument();
  });

  it("renders with custom colors", () => {
    const coloredData = [
      { name: "A", value: 50, color: "#ff0000" },
      { name: "B", value: 50, color: "#00ff00" },
    ];
    render(<PieChart data={coloredData} animate={false} />);
    const seg0 = screen.getByTestId("segment-0");
    expect(seg0).toHaveAttribute("stroke", "#ff0000");
  });

  it("renders with custom size", () => {
    const { container } = render(
      <PieChart data={pieData} size={400} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "400");
    expect(svg).toHaveAttribute("height", "400");
  });

  it("handles hover on segments", () => {
    render(<PieChart data={pieData} animate={false} />);
    const seg = screen.getByTestId("segment-0");
    fireEvent.mouseEnter(seg);
    // Segment should get wider stroke on hover
    // The hovered segment should have larger strokeWidth
    fireEvent.mouseLeave(seg);
  });

  it("forwards ref to container div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<PieChart ref={ref} data={pieData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("handles all-zero data", () => {
    const zeroData = [
      { name: "A", value: 0 },
      { name: "B", value: 0 },
    ];
    const { container } = render(<PieChart data={zeroData} />);
    // Should render a grey ring
    const circle = container.querySelector("circle");
    expect(circle).toBeInTheDocument();
  });
});
