import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import { Slider } from "../slider";

expect.extend(toHaveNoViolations);

describe("Slider", () => {
  it("renders with correct ARIA attributes", () => {
    render(<Slider value={50} min={0} max={100} aria-label="Volume" />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "50");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
  });

  it("calls onChange when keyboard arrows are pressed", () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={50} onChange={onChange} aria-label="Volume" />);
    const slider = screen.getByRole("slider");
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(51);
  });

  it("respects min/max bounds", () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={100} max={100} onChange={onChange} aria-label="Volume" />);
    const slider = screen.getByRole("slider");
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(100);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Slider disabled aria-label="Volume" />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-disabled", "true");
  });

  it("supports step increments", () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={50} step={5} onChange={onChange} aria-label="Volume" />);
    const slider = screen.getByRole("slider");
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(55);
  });

  it("jumps to min on Home key", () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={50} min={10} onChange={onChange} aria-label="Volume" />);
    const slider = screen.getByRole("slider");
    fireEvent.keyDown(slider, { key: "Home" });
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it("jumps to max on End key", () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={50} max={90} onChange={onChange} aria-label="Volume" />);
    const slider = screen.getByRole("slider");
    fireEvent.keyDown(slider, { key: "End" });
    expect(onChange).toHaveBeenCalledWith(90);
  });

  it("does not change when disabled and arrow key pressed", () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={50} disabled onChange={onChange} aria-label="Volume" />);
    const slider = screen.getByRole("slider");
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows labels when showLabels is true", () => {
    render(<Slider min={0} max={100} showLabels aria-label="Volume" />);
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Slider aria-label="Volume" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
