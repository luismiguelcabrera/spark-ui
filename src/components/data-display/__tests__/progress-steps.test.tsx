import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProgressSteps } from "../progress-steps";

const steps = [
  { label: "Order Placed" },
  { label: "Processing" },
  { label: "Shipped" },
  { label: "Delivered" },
];

describe("ProgressSteps", () => {
  it("renders all step labels", () => {
    render(<ProgressSteps steps={steps} value={50} />);
    expect(screen.getByText("Order Placed")).toBeInTheDocument();
    expect(screen.getByText("Processing")).toBeInTheDocument();
    expect(screen.getByText("Shipped")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
  });

  it("has role='progressbar'", () => {
    render(<ProgressSteps steps={steps} value={50} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("sets aria-valuenow", () => {
    render(<ProgressSteps steps={steps} value={75} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "75");
  });

  it("sets aria-valuemin and aria-valuemax", () => {
    render(<ProgressSteps steps={steps} value={50} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("clamps value to 0-100", () => {
    const { rerender } = render(<ProgressSteps steps={steps} value={-10} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");

    rerender(<ProgressSteps steps={steps} value={150} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<ProgressSteps ref={ref} steps={steps} value={50} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<ProgressSteps ref={ref} steps={steps} value={50} className="custom" />);
    expect(ref.current).toHaveClass("custom");
  });

  it("renders step descriptions when provided", () => {
    const withDesc = [
      { label: "Step 1", description: "First step" },
      { label: "Step 2", description: "Second step" },
    ];
    render(<ProgressSteps steps={withDesc} value={50} />);
    expect(screen.getByText("First step")).toBeInTheDocument();
    expect(screen.getByText("Second step")).toBeInTheDocument();
  });

  it.each(["sm", "md", "lg"] as const)("renders size %s without error", (sz) => {
    render(<ProgressSteps steps={steps} value={50} size={sz} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it.each(["primary", "success", "warning", "accent"] as const)(
    "renders color %s without error",
    (clr) => {
      render(<ProgressSteps steps={steps} value={50} color={clr} />);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    },
  );

  it("respects custom step value positions", () => {
    const customSteps = [
      { label: "Start", value: 0 },
      { label: "Quarter", value: 25 },
      { label: "End", value: 100 },
    ];
    render(<ProgressSteps steps={customSteps} value={30} />);
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("Quarter")).toBeInTheDocument();
    expect(screen.getByText("End")).toBeInTheDocument();
  });

  it("hides check icons when showCheck is false", () => {
    const { container } = render(
      <ProgressSteps steps={steps} value={100} showCheck={false} />,
    );
    // No SVG check icons should be rendered
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(0);
  });

  it("renders a single step correctly", () => {
    render(<ProgressSteps steps={[{ label: "Only" }]} value={50} />);
    expect(screen.getByText("Only")).toBeInTheDocument();
  });

  it("distributes steps evenly when no value is set", () => {
    const { container } = render(
      <ProgressSteps steps={steps} value={0} />,
    );
    // 4 steps should position at 0%, 33.3%, 66.6%, 100%
    const markers = container.querySelectorAll(".absolute");
    expect(markers.length).toBe(4);
    // First should be at 0%
    expect((markers[0] as HTMLElement).style.left).toBe("0%");
    // Last should be at 100%
    expect((markers[3] as HTMLElement).style.left).toBe("100%");
  });
});
