import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import { CircularProgress } from "../circular-progress";

expect.extend(toHaveNoViolations);

describe("CircularProgress", () => {
  it("renders with correct ARIA attributes", () => {
    render(<CircularProgress value={75} />);
    const progress = screen.getByRole("progressbar");
    expect(progress).toHaveAttribute("aria-valuenow", "75");
    expect(progress).toHaveAttribute("aria-valuemin", "0");
    expect(progress).toHaveAttribute("aria-valuemax", "100");
  });

  it("shows value when showValue is true", () => {
    render(<CircularProgress value={75} showValue />);
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("clamps value between 0 and 100", () => {
    render(<CircularProgress value={150} showValue />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<CircularProgress value={50} aria-label="Loading progress" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
