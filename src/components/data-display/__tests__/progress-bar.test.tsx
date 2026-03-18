import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProgressBar } from "../progress-bar";

describe("ProgressBar", () => {
  it("renders with correct width", () => {
    const { container } = render(<ProgressBar value={50} />);
    const bar = container.querySelector("[style]") as HTMLElement;
    expect(bar.style.width).toBe("50%");
  });

  it("clamps value to 0-100", () => {
    const { container } = render(<ProgressBar value={150} />);
    const bar = container.querySelector("[style]") as HTMLElement;
    expect(bar.style.width).toBe("100%");
  });

  it("clamps negative value to 0", () => {
    const { container } = render(<ProgressBar value={-10} />);
    const bar = container.querySelector("[style]") as HTMLElement;
    expect(bar.style.width).toBe("0%");
  });

  it("has role=progressbar", () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("allows custom label", () => {
    render(<ProgressBar value={50} label="Upload progress" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Upload progress");
  });

  it("allows custom aria-label via props spread", () => {
    render(<ProgressBar value={50} aria-label="Download progress" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Download progress");
  });

  it("sets aria-valuenow to clamped value", () => {
    render(<ProgressBar value={75} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "75");
  });

  it("sets aria-valuemin and aria-valuemax", () => {
    render(<ProgressBar value={50} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("supports custom max value", () => {
    render(<ProgressBar value={50} max={200} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemax", "200");
    // 50/200 = 25%
    const inner = bar.querySelector("[style]") as HTMLElement;
    expect(inner.style.width).toBe("25%");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<ProgressBar ref={ref} value={50} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("merges className", () => {
    render(<ProgressBar value={50} className="custom-bar" />);
    expect(screen.getByRole("progressbar")).toHaveClass("custom-bar");
  });

  it("applies sm size by default", () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole("progressbar")).toHaveClass("h-1.5");
  });

  it("applies md size", () => {
    render(<ProgressBar value={50} size="md" />);
    expect(screen.getByRole("progressbar")).toHaveClass("h-2.5");
  });

  it("applies custom trackColor", () => {
    render(<ProgressBar value={50} trackColor="bg-blue-100" />);
    expect(screen.getByRole("progressbar")).toHaveClass("bg-blue-100");
  });
});
