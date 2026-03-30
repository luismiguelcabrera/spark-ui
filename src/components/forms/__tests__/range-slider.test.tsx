import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import { RangeSlider } from "../range-slider";

expect.extend(toHaveNoViolations);

describe("RangeSlider", () => {
  it("renders two slider thumbs", () => {
    render(<RangeSlider defaultValue={[20, 80]} label="Price" />);
    const sliders = screen.getAllByRole("slider");
    expect(sliders).toHaveLength(2);
  });

  it("renders with correct ARIA attributes", () => {
    render(<RangeSlider value={[10, 90]} min={0} max={100} label="Range" />);
    const sliders = screen.getAllByRole("slider");
    expect(sliders[0]).toHaveAttribute("aria-valuenow", "10");
    expect(sliders[0]).toHaveAttribute("aria-valuemin", "0");
    expect(sliders[0]).toHaveAttribute("aria-valuemax", "100");
    expect(sliders[0]).toHaveAttribute("aria-label", "Range minimum");
    expect(sliders[1]).toHaveAttribute("aria-valuenow", "90");
    expect(sliders[1]).toHaveAttribute("aria-label", "Range maximum");
  });

  it("updates min thumb on ArrowRight", () => {
    const onChange = vi.fn();
    render(<RangeSlider defaultValue={[20, 80]} onChange={onChange} label="Range" />);
    const sliders = screen.getAllByRole("slider");
    fireEvent.keyDown(sliders[0], { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith([21, 80]);
  });

  it("updates max thumb on ArrowRight", () => {
    const onChange = vi.fn();
    render(<RangeSlider defaultValue={[20, 80]} onChange={onChange} label="Range" />);
    const sliders = screen.getAllByRole("slider");
    fireEvent.keyDown(sliders[1], { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith([20, 81]);
  });

  it("updates min thumb on ArrowLeft", () => {
    const onChange = vi.fn();
    render(<RangeSlider defaultValue={[20, 80]} onChange={onChange} label="Range" />);
    const sliders = screen.getAllByRole("slider");
    fireEvent.keyDown(sliders[0], { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith([19, 80]);
  });

  it("respects min bound", () => {
    const onChange = vi.fn();
    render(<RangeSlider defaultValue={[0, 80]} min={0} onChange={onChange} label="Range" />);
    const sliders = screen.getAllByRole("slider");
    fireEvent.keyDown(sliders[0], { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith([0, 80]);
  });

  it("respects max bound", () => {
    const onChange = vi.fn();
    render(<RangeSlider defaultValue={[20, 100]} max={100} onChange={onChange} label="Range" />);
    const sliders = screen.getAllByRole("slider");
    fireEvent.keyDown(sliders[1], { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith([20, 100]);
  });

  it("min thumb does not exceed max thumb", () => {
    const onChange = vi.fn();
    render(<RangeSlider defaultValue={[50, 50]} onChange={onChange} label="Range" />);
    const sliders = screen.getAllByRole("slider");
    fireEvent.keyDown(sliders[0], { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith([50, 50]);
  });

  it("max thumb does not go below min thumb", () => {
    const onChange = vi.fn();
    render(<RangeSlider defaultValue={[50, 50]} onChange={onChange} label="Range" />);
    const sliders = screen.getAllByRole("slider");
    fireEvent.keyDown(sliders[1], { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith([50, 50]);
  });

  it("supports step increments", () => {
    const onChange = vi.fn();
    render(<RangeSlider defaultValue={[20, 80]} step={5} onChange={onChange} label="Range" />);
    const sliders = screen.getAllByRole("slider");
    fireEvent.keyDown(sliders[0], { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith([25, 80]);
  });

  it("min thumb jumps to min on Home key", () => {
    const onChange = vi.fn();
    render(<RangeSlider defaultValue={[30, 80]} min={10} onChange={onChange} label="Range" />);
    const sliders = screen.getAllByRole("slider");
    fireEvent.keyDown(sliders[0], { key: "Home" });
    expect(onChange).toHaveBeenCalledWith([10, 80]);
  });

  it("max thumb jumps to max on End key", () => {
    const onChange = vi.fn();
    render(<RangeSlider defaultValue={[20, 60]} max={90} onChange={onChange} label="Range" />);
    const sliders = screen.getAllByRole("slider");
    fireEvent.keyDown(sliders[1], { key: "End" });
    expect(onChange).toHaveBeenCalledWith([20, 90]);
  });

  it("is disabled when disabled prop is true", () => {
    render(<RangeSlider disabled label="Range" />);
    const sliders = screen.getAllByRole("slider");
    expect(sliders[0]).toHaveAttribute("aria-disabled", "true");
    expect(sliders[1]).toHaveAttribute("aria-disabled", "true");
  });

  it("does not change when disabled", () => {
    const onChange = vi.fn();
    render(<RangeSlider defaultValue={[20, 80]} disabled onChange={onChange} label="Range" />);
    const sliders = screen.getAllByRole("slider");
    fireEvent.keyDown(sliders[0], { key: "ArrowRight" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it.each(["primary", "secondary", "accent", "success"] as const)(
    "renders with color=%s without error",
    (color) => {
      const { container } = render(<RangeSlider color={color} label="Range" />);
      expect(container.firstChild).toBeTruthy();
    }
  );

  it.each(["sm", "md", "lg"] as const)(
    "renders with size=%s without error",
    (size) => {
      const { container } = render(<RangeSlider size={size} label="Range" />);
      expect(container.firstChild).toBeTruthy();
    }
  );

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<RangeSlider ref={ref} label="Range" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<RangeSlider label="Price range" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
