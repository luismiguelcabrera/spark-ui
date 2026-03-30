import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Pie } from "../pie";

const sampleData = [
  { value: 50, color: "#3b82f6", label: "Blue" },
  { value: 30, color: "#ef4444", label: "Red" },
  { value: 20, color: "#22c55e", label: "Green" },
];

describe("Pie", () => {
  it("renders an SVG with role=img", () => {
    const { container } = render(<Pie data={sampleData} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("role", "img");
  });

  it("renders the correct number of circle segments", () => {
    const { container } = render(<Pie data={sampleData} />);
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(3);
  });

  it("generates an aria-label with percentages", () => {
    const { container } = render(<Pie data={sampleData} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-label")).toContain("Blue 50.0%");
    expect(svg?.getAttribute("aria-label")).toContain("Red 30.0%");
    expect(svg?.getAttribute("aria-label")).toContain("Green 20.0%");
  });

  it("applies default size of 200px", () => {
    const { container } = render(<Pie data={sampleData} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe("200px");
    expect(wrapper.style.height).toBe("200px");
  });

  it("respects custom size", () => {
    const { container } = render(<Pie data={sampleData} size={300} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe("300px");
    expect(wrapper.style.height).toBe("300px");
  });

  it("renders as donut with children in center", () => {
    render(
      <Pie data={sampleData} donut>
        <span data-testid="center">75%</span>
      </Pie>,
    );
    expect(screen.getByTestId("center")).toHaveTextContent("75%");
  });

  it("donut center has aria-hidden", () => {
    const { container } = render(
      <Pie data={sampleData} donut>
        <span>Center</span>
      </Pie>,
    );
    const centerDiv = container.querySelector("[aria-hidden='true']");
    expect(centerDiv).toBeInTheDocument();
  });

  it("does not render center content when not donut", () => {
    render(
      <Pie data={sampleData}>
        <span data-testid="center">Nope</span>
      </Pie>,
    );
    expect(screen.queryByTestId("center")).not.toBeInTheDocument();
  });

  it("handles empty data array", () => {
    const { container } = render(<Pie data={[]} />);
    // Should render the empty state circle
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(1);
    expect(circles[0]).toHaveAttribute("stroke", "#e2e8f0");
  });

  it("handles all-zero values", () => {
    const { container } = render(
      <Pie data={[{ value: 0, color: "#000" }]} />,
    );
    // Zero total → empty state ring
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(1);
    expect(circles[0]).toHaveAttribute("stroke", "#e2e8f0");
  });

  it("forwards ref to the container div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Pie ref={ref} data={sampleData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    const { container } = render(
      <Pie data={sampleData} className="custom-pie" />,
    );
    expect(container.firstChild).toHaveClass("custom-pie");
  });

  it("applies segment colors correctly", () => {
    const { container } = render(<Pie data={sampleData} />);
    const circles = container.querySelectorAll("circle");
    expect(circles[0]).toHaveAttribute("stroke", "#3b82f6");
    expect(circles[1]).toHaveAttribute("stroke", "#ef4444");
    expect(circles[2]).toHaveAttribute("stroke", "#22c55e");
  });

  it("respects custom strokeWidth in donut mode", () => {
    const { container } = render(
      <Pie data={sampleData} donut strokeWidth={20} />,
    );
    const circles = container.querySelectorAll("circle");
    circles.forEach((circle) => {
      expect(circle.getAttribute("stroke-width")).toBe("20");
    });
  });

  it("single segment renders full circle", () => {
    const { container } = render(
      <Pie data={[{ value: 100, color: "#000", label: "All" }]} />,
    );
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(1);
  });
});
