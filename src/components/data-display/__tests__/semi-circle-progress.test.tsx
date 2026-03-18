import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SemiCircleProgress } from "../semi-circle-progress";

describe("SemiCircleProgress", () => {
  it("renders without crashing", () => {
    const { container } = render(<SemiCircleProgress value={50} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<SemiCircleProgress ref={ref} value={50} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies className", () => {
    render(<SemiCircleProgress value={50} className="custom-semi" />);
    expect(screen.getByRole("progressbar")).toHaveClass("custom-semi");
  });

  // ── Progressbar role & ARIA ─────────────────────────────────────────

  it("has role=progressbar", () => {
    render(<SemiCircleProgress value={50} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("sets aria-valuenow to clamped value", () => {
    render(<SemiCircleProgress value={75} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "75");
  });

  it("sets aria-valuemin and aria-valuemax", () => {
    render(<SemiCircleProgress value={50} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("sets aria-label with percentage", () => {
    render(<SemiCircleProgress value={60} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-label",
      "Progress: 60%",
    );
  });

  it("hides svg from assistive technology", () => {
    const { container } = render(<SemiCircleProgress value={50} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  // ── Value clamping ──────────────────────────────────────────────────

  it("clamps value above 100", () => {
    render(<SemiCircleProgress value={150} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    expect(bar).toHaveAttribute("aria-label", "Progress: 100%");
  });

  it("clamps negative value to 0", () => {
    render(<SemiCircleProgress value={-20} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "0");
    expect(bar).toHaveAttribute("aria-label", "Progress: 0%");
  });

  it("handles 0 value", () => {
    render(<SemiCircleProgress value={0} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "0");
  });

  it("handles 100 value", () => {
    render(<SemiCircleProgress value={100} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
  });

  // ── Size ────────────────────────────────────────────────────────────

  it("uses default size of 200px width", () => {
    const { container } = render(<SemiCircleProgress value={50} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe("200px");
  });

  it("respects custom size", () => {
    const { container } = render(<SemiCircleProgress value={50} size={300} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe("300px");
  });

  it("calculates correct height (half + thickness/2)", () => {
    // Default: size=200, thickness=12 → center=100, height=100+6=106
    const { container } = render(<SemiCircleProgress value={50} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.height).toBe("106px");
  });

  // ── SVG Paths ───────────────────────────────────────────────────────

  it("renders two path elements (background + progress)", () => {
    const { container } = render(<SemiCircleProgress value={50} />);
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(2);
  });

  it("background path has text-gray-100 class", () => {
    const { container } = render(<SemiCircleProgress value={50} />);
    const paths = container.querySelectorAll("path");
    expect(paths[0]).toHaveClass("text-gray-100");
  });

  it("applies custom color class to progress path", () => {
    const { container } = render(
      <SemiCircleProgress value={50} color="text-red-500" />,
    );
    const paths = container.querySelectorAll("path");
    expect(paths[1]).toHaveClass("text-red-500");
  });

  it("uses default color of text-primary", () => {
    const { container } = render(<SemiCircleProgress value={50} />);
    const paths = container.querySelectorAll("path");
    expect(paths[1]).toHaveClass("text-primary");
  });

  it("applies round linecap to both paths", () => {
    const { container } = render(<SemiCircleProgress value={50} />);
    const paths = container.querySelectorAll("path");
    expect(paths[0].getAttribute("stroke-linecap")).toBe("round");
    expect(paths[1].getAttribute("stroke-linecap")).toBe("round");
  });

  // ── showValue ───────────────────────────────────────────────────────

  it("shows numeric value by default", () => {
    render(<SemiCircleProgress value={42} />);
    expect(screen.getByText("42%")).toBeInTheDocument();
  });

  it("hides numeric value when showValue is false", () => {
    render(<SemiCircleProgress value={42} showValue={false} />);
    expect(screen.queryByText("42%")).not.toBeInTheDocument();
  });

  it("shows clamped value in the display", () => {
    render(<SemiCircleProgress value={150} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  // ── Label ───────────────────────────────────────────────────────────

  it("renders label when provided", () => {
    render(<SemiCircleProgress value={50} label="Uploads" />);
    expect(screen.getByText("Uploads")).toBeInTheDocument();
  });

  it("does not render label element when label is not provided", () => {
    const { container } = render(<SemiCircleProgress value={50} />);
    // Only the value span should be in the center, not a second span
    const centerContent = container.querySelector(".absolute");
    const spans = centerContent?.querySelectorAll("span");
    // Only the value span
    expect(spans).toHaveLength(1);
  });

  it("renders label as ReactNode", () => {
    render(
      <SemiCircleProgress
        value={50}
        label={<strong data-testid="bold-label">Done</strong>}
      />,
    );
    expect(screen.getByTestId("bold-label")).toHaveTextContent("Done");
  });

  // ── Thickness ───────────────────────────────────────────────────────

  it("uses default thickness of 12", () => {
    const { container } = render(<SemiCircleProgress value={50} />);
    const paths = container.querySelectorAll("path");
    expect(paths[0].getAttribute("stroke-width")).toBe("12");
  });

  it("respects custom thickness", () => {
    const { container } = render(
      <SemiCircleProgress value={50} thickness={20} />,
    );
    const paths = container.querySelectorAll("path");
    expect(paths[0].getAttribute("stroke-width")).toBe("20");
    expect(paths[1].getAttribute("stroke-width")).toBe("20");
  });

  // ── Motion ──────────────────────────────────────────────────────────

  it("has motion-reduce transition class on progress path", () => {
    const { container } = render(<SemiCircleProgress value={50} />);
    const paths = container.querySelectorAll("path");
    expect(paths[1]).toHaveClass("motion-reduce:transition-none");
  });

  // ── Extra props ─────────────────────────────────────────────────────

  it("spreads extra HTML attributes", () => {
    render(<SemiCircleProgress value={50} data-testid="my-semi" />);
    expect(screen.getByTestId("my-semi")).toBeInTheDocument();
  });
});
