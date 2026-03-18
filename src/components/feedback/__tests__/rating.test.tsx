import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Rating } from "../rating";

describe("Rating", () => {
  it("renders with role='img'", () => {
    render(<Rating value={3} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Rating ref={ref} value={3} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(Rating.displayName).toBe("Rating");
  });

  it("merges className", () => {
    render(<Rating value={3} className="custom-class" />);
    expect(screen.getByRole("img")).toHaveClass("custom-class");
  });

  it("has correct aria-label", () => {
    render(<Rating value={3} max={5} />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "3 out of 5 stars");
  });

  it("clamps value to max", () => {
    render(<Rating value={10} max={5} />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "5 out of 5 stars");
  });

  it("clamps value to 0 when negative", () => {
    render(<Rating value={-1} max={5} />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "0 out of 5 stars");
  });

  it("renders correct number of stars based on max", () => {
    const { container } = render(<Rating value={2} max={7} />);
    // Each star is an Icon rendered as svg
    const icons = container.querySelectorAll("svg");
    expect(icons).toHaveLength(7);
  });

  it("defaults to max=5", () => {
    render(<Rating value={4} />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "4 out of 5 stars");
  });
});
