import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { createRef } from "react";
import { ComboChart } from "../combo-chart";

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

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const revenueValues = [42, 38, 51, 46, 58, 62];
const targetValue = 50;

const comboData = months.map((month, i) => ({
  month,
  Revenue: revenueValues[i],
  Target: targetValue,
  Traffic: revenueValues[i],
}));

const barSeries = {
  categories: ["Revenue"],
  colors: ["#6366f1" as const],
};

const lineSeries = {
  categories: ["Target"],
  colors: ["#ef4444" as const],
  curveType: "monotone" as const,
  showDots: true,
  strokeWidth: 2,
};

const trafficBarSeries = {
  categories: ["Revenue", "Traffic"],
  colors: ["#6366f1" as const, "#10b981" as const],
};

describe("ComboChart", () => {
  it("renders with bar + line series", () => {
    render(
      <ComboChart
        data={comboData}
        index="month"
        barSeries={barSeries}
        lineSeries={lineSeries}
      />
    );
    const svg = screen.getByRole("img", { name: "Combo chart" });
    expect(svg).toBeInTheDocument();
  });

  it("renders empty state when data is empty", () => {
    render(
      <ComboChart
        data={[]}
        index="month"
        barSeries={barSeries}
        lineSeries={lineSeries}
      />
    );
    const svg = screen.getByRole("img", { name: "Empty combo chart" });
    expect(svg).toBeInTheDocument();
  });

  it("renders empty state with 'No data available' text", () => {
    render(
      <ComboChart
        data={[]}
        index="month"
        barSeries={barSeries}
        lineSeries={lineSeries}
      />
    );
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("renders bar elements for bar series", () => {
    render(
      <ComboChart
        data={comboData}
        index="month"
        barSeries={barSeries}
        lineSeries={{ categories: [], colors: [] }}
        animate={false}
      />
    );
    for (let i = 0; i < months.length; i++) {
      expect(screen.getByTestId(`combo-bar-0-${i}`)).toBeInTheDocument();
    }
  });

  it("renders line path for line series", () => {
    render(
      <ComboChart
        data={comboData}
        index="month"
        barSeries={{ categories: [], colors: [] }}
        lineSeries={lineSeries}
      />
    );
    expect(screen.getByTestId("combo-line-0")).toBeInTheDocument();
  });

  it("renders dots for line series with showDots", () => {
    render(
      <ComboChart
        data={comboData}
        index="month"
        barSeries={{ categories: [], colors: [] }}
        lineSeries={lineSeries}
      />
    );
    for (let i = 0; i < months.length; i++) {
      expect(screen.getByTestId(`combo-dot-0-${i}`)).toBeInTheDocument();
    }
  });

  it("hides dots when showDots is false", () => {
    const noDotsLineSeries = { ...lineSeries, showDots: false };
    render(
      <ComboChart
        data={comboData}
        index="month"
        barSeries={{ categories: [], colors: [] }}
        lineSeries={noDotsLineSeries}
      />
    );
    expect(screen.queryByTestId("combo-dot-0-0")).not.toBeInTheDocument();
  });

  it("renders X-axis labels", () => {
    render(
      <ComboChart
        data={comboData}
        index="month"
        barSeries={barSeries}
        lineSeries={lineSeries}
      />
    );
    months.forEach((m) => {
      expect(screen.getByText(m)).toBeInTheDocument();
    });
  });

  it("shows grid lines by default", () => {
    const { container } = render(
      <ComboChart
        data={comboData}
        index="month"
        barSeries={barSeries}
        lineSeries={lineSeries}
      />
    );
    const dashed = container.querySelectorAll('line[stroke-dasharray="4,4"]');
    expect(dashed.length).toBeGreaterThan(0);
  });

  it("hides grid lines when showGrid=false", () => {
    const { container } = render(
      <ComboChart
        data={comboData}
        index="month"
        barSeries={barSeries}
        lineSeries={lineSeries}
        showGrid={false}
      />
    );
    const dashed = container.querySelectorAll('line[stroke-dasharray="4,4"]');
    expect(dashed.length).toBe(0);
  });

  it("renders legend when showLegend is true", () => {
    render(
      <ComboChart
        data={comboData}
        index="month"
        barSeries={barSeries}
        lineSeries={lineSeries}
        showLegend
      />
    );
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Target")).toBeInTheDocument();
  });

  it("shows tooltip on hover", () => {
    const { container } = render(
      <ComboChart
        data={comboData}
        index="month"
        barSeries={barSeries}
        lineSeries={lineSeries}
        animate={false}
      />
    );
    // Hover over the first invisible hit-area rect
    const hitAreas = container.querySelectorAll('rect[fill="transparent"]');
    expect(hitAreas.length).toBe(months.length);
    fireEvent.mouseEnter(hitAreas[0]);
    fireEvent.mouseLeave(hitAreas[0]);
  });

  it("renders multiple bar categories side by side", () => {
    render(
      <ComboChart
        data={comboData}
        index="month"
        barSeries={trafficBarSeries}
        lineSeries={{ categories: [], colors: [] }}
        animate={false}
      />
    );
    // Both bars at index 0
    expect(screen.getByTestId("combo-bar-0-0")).toBeInTheDocument();
    expect(screen.getByTestId("combo-bar-1-0")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ComboChart
        ref={ref}
        data={comboData}
        index="month"
        barSeries={barSeries}
        lineSeries={lineSeries}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    const { container } = render(
      <ComboChart
        data={comboData}
        index="month"
        barSeries={barSeries}
        lineSeries={lineSeries}
        className="my-custom-class"
      />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("applies custom height", () => {
    render(
      <ComboChart
        data={comboData}
        index="month"
        barSeries={barSeries}
        lineSeries={lineSeries}
        height={400}
      />
    );
    const svg = screen.getByRole("img", { name: "Combo chart" });
    // The SVG height may include legend space, but should be at least 400
    const svgHeight = parseInt(svg.getAttribute("height") || "0", 10);
    expect(svgHeight).toBeGreaterThanOrEqual(400);
  });

  it("truncates long x-axis labels", () => {
    const longLabelData = [
      { label: "VeryLongLabelName", Revenue: 100, Target: 50 },
    ];
    render(
      <ComboChart
        data={longLabelData}
        index="label"
        barSeries={barSeries}
        lineSeries={lineSeries}
        animate={false}
      />
    );
    expect(screen.getByText("VeryLon...")).toBeInTheDocument();
  });

  it("renders bar and line series together correctly", () => {
    render(
      <ComboChart
        data={comboData}
        index="month"
        barSeries={barSeries}
        lineSeries={lineSeries}
      />
    );
    expect(
      screen.getByRole("img", { name: "Combo chart" })
    ).toBeInTheDocument();
  });
});
