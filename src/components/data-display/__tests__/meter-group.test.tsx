import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MeterGroup } from "../meter-group";

const sampleItems = [
  { label: "Documents", value: 25, color: "bg-blue-500" },
  { label: "Photos", value: 40, color: "bg-emerald-500" },
  { label: "Music", value: 15, color: "bg-amber-500" },
];

describe("MeterGroup", () => {
  // ── Rendering ──

  it("renders without crashing", () => {
    const { container } = render(<MeterGroup items={sampleItems} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders a meter role element", () => {
    render(<MeterGroup items={sampleItems} />);
    expect(screen.getByRole("meter")).toBeInTheDocument();
  });

  it("renders all segment labels by default", () => {
    render(<MeterGroup items={sampleItems} />);
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("Photos")).toBeInTheDocument();
    expect(screen.getByText("Music")).toBeInTheDocument();
  });

  it("renders all segment values by default", () => {
    render(<MeterGroup items={sampleItems} />);
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("renders colored segments for each item", () => {
    const { container } = render(<MeterGroup items={sampleItems} />);
    const meter = container.querySelector("[role='meter']")!;
    const segments = meter.children;
    expect(segments).toHaveLength(3);
  });

  // ── Props ──

  it("hides labels when showLabels is false", () => {
    render(<MeterGroup items={sampleItems} showLabels={false} />);
    expect(screen.queryByText("Documents")).not.toBeInTheDocument();
    expect(screen.queryByText("Photos")).not.toBeInTheDocument();
  });

  it("hides values when showValues is false", () => {
    render(<MeterGroup items={sampleItems} showValues={false} />);
    // Values should not appear as separate text nodes
    // Labels should still be present
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.queryByText("25")).not.toBeInTheDocument();
  });

  it("hides the legend when both showLabels and showValues are false", () => {
    const { container } = render(
      <MeterGroup items={sampleItems} showLabels={false} showValues={false} />,
    );
    // Should only have the meter bar, no legend div
    const children = container.firstChild!.childNodes;
    expect(children).toHaveLength(1);
  });

  // ── Sizes ──

  it.each([
    ["sm", "h-2"],
    ["md", "h-3"],
    ["lg", "h-4"],
  ] as const)("applies %s size class", (size, expectedClass) => {
    render(<MeterGroup items={sampleItems} size={size} />);
    const meter = screen.getByRole("meter");
    expect(meter.className).toContain(expectedClass);
  });

  it("defaults to md size", () => {
    render(<MeterGroup items={sampleItems} />);
    const meter = screen.getByRole("meter");
    expect(meter.className).toContain("h-3");
  });

  // ── Accessibility ──

  it("sets aria-valuenow to total of item values", () => {
    render(<MeterGroup items={sampleItems} />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "80");
  });

  it("sets aria-valuemin to 0", () => {
    render(<MeterGroup items={sampleItems} />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
  });

  it("sets aria-valuemax to max prop", () => {
    render(<MeterGroup items={sampleItems} max={200} />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuemax", "200");
  });

  it("defaults aria-valuemax to 100", () => {
    render(<MeterGroup items={sampleItems} />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
  });

  it("each segment has a title with label and value", () => {
    const { container } = render(<MeterGroup items={sampleItems} />);
    const segments = container.querySelectorAll("[role='meter'] > div");
    expect(segments[0]).toHaveAttribute("title", "Documents: 25");
    expect(segments[1]).toHaveAttribute("title", "Photos: 40");
    expect(segments[2]).toHaveAttribute("title", "Music: 15");
  });

  // ── Edge cases ──

  it("clamps total to max", () => {
    const items = [
      { label: "A", value: 60 },
      { label: "B", value: 60 },
    ];
    render(<MeterGroup items={items} max={100} />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "100");
  });

  it("handles empty items array", () => {
    const { container } = render(<MeterGroup items={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("treats negative values as 0", () => {
    const items = [{ label: "Negative", value: -10 }];
    render(<MeterGroup items={items} />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "0");
  });

  // ── Custom className ──

  it("applies custom className", () => {
    const { container } = render(
      <MeterGroup items={sampleItems} className="my-custom-class" />,
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  // ── Ref forwarding ──

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<MeterGroup items={sampleItems} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ── Default color ──

  it("uses bg-primary when no color is specified", () => {
    const items = [{ label: "Default", value: 50 }];
    const { container } = render(<MeterGroup items={items} />);
    const segment = container.querySelector("[role='meter'] > div");
    expect(segment?.className).toContain("bg-primary");
  });
});
