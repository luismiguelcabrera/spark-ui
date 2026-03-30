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

  // ── Range mode tests ──────────────────────────────────────────────────

  describe("range mode", () => {
    it("renders two thumbs when range is true", () => {
      render(<Slider range defaultValue={[20, 80]} aria-label="Price" />);
      const sliders = screen.getAllByRole("slider");
      expect(sliders).toHaveLength(2);
    });

    it("sets correct ARIA values on range thumbs", () => {
      render(<Slider range value={[25, 75]} min={0} max={100} aria-label="Range" />);
      const sliders = screen.getAllByRole("slider");
      expect(sliders[0]).toHaveAttribute("aria-valuenow", "25");
      expect(sliders[0]).toHaveAttribute("aria-label", "Range minimum");
      expect(sliders[1]).toHaveAttribute("aria-valuenow", "75");
      expect(sliders[1]).toHaveAttribute("aria-label", "Range maximum");
    });

    it("moves the low thumb with ArrowRight", () => {
      const onChange = vi.fn();
      render(<Slider range defaultValue={[20, 80]} onChange={onChange} aria-label="Range" />);
      const sliders = screen.getAllByRole("slider");
      fireEvent.keyDown(sliders[0], { key: "ArrowRight" });
      expect(onChange).toHaveBeenCalledWith([21, 80]);
    });

    it("moves the high thumb with ArrowRight", () => {
      const onChange = vi.fn();
      render(<Slider range defaultValue={[20, 80]} onChange={onChange} aria-label="Range" />);
      const sliders = screen.getAllByRole("slider");
      fireEvent.keyDown(sliders[1], { key: "ArrowRight" });
      expect(onChange).toHaveBeenCalledWith([20, 81]);
    });

    it("low thumb cannot exceed high thumb", () => {
      const onChange = vi.fn();
      render(<Slider range defaultValue={[80, 80]} onChange={onChange} aria-label="Range" />);
      const sliders = screen.getAllByRole("slider");
      fireEvent.keyDown(sliders[0], { key: "ArrowRight" });
      // Should be clamped to not exceed the high thumb
      expect(onChange).toHaveBeenCalledWith([80, 80]);
    });

    it("high thumb cannot go below low thumb", () => {
      const onChange = vi.fn();
      render(<Slider range defaultValue={[50, 50]} onChange={onChange} aria-label="Range" />);
      const sliders = screen.getAllByRole("slider");
      fireEvent.keyDown(sliders[1], { key: "ArrowLeft" });
      // Should be clamped to not go below the low thumb
      expect(onChange).toHaveBeenCalledWith([50, 50]);
    });

    it("accepts single number as defaultValue in range mode and normalizes to [min, value]", () => {
      render(<Slider range defaultValue={60} min={10} aria-label="Range" />);
      const sliders = screen.getAllByRole("slider");
      expect(sliders[0]).toHaveAttribute("aria-valuenow", "10");
      expect(sliders[1]).toHaveAttribute("aria-valuenow", "60");
    });

    it("has no accessibility violations in range mode", async () => {
      const { container } = render(<Slider range defaultValue={[20, 80]} aria-label="Range" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  // ── Tick tests ────────────────────────────────────────────────────────

  describe("ticks", () => {
    it("renders tick marks when ticks prop is true", () => {
      const { container } = render(
        <Slider min={0} max={10} step={5} ticks aria-label="Volume" />
      );
      // Should have tick marks: 0, 5, 10 = 3 ticks
      const tickMarks = container.querySelectorAll(".w-0\\.5");
      expect(tickMarks.length).toBe(3);
    });

    it("renders tick labels when provided", () => {
      render(
        <Slider
          min={0}
          max={10}
          step={5}
          ticks
          tickLabels={["Low", "Mid", "High"]}
          aria-label="Volume"
        />
      );
      expect(screen.getByText("Low")).toBeInTheDocument();
      expect(screen.getByText("Mid")).toBeInTheDocument();
      expect(screen.getByText("High")).toBeInTheDocument();
    });
  });

  // ── Thumb label tests ─────────────────────────────────────────────────

  describe("thumbLabel", () => {
    it("shows label when thumbLabel is 'always'", () => {
      render(
        <Slider defaultValue={50} thumbLabel="always" aria-label="Volume" />
      );
      // The label tooltip should be visible
      expect(screen.getByText("50")).toBeInTheDocument();
    });

    it("does not show label when thumbLabel is false", () => {
      render(
        <Slider defaultValue={50} thumbLabel={false} aria-label="Volume" />
      );
      // The tooltip value should not be a visible element (only in aria-valuetext)
      expect(screen.queryByText("50")).not.toBeInTheDocument();
    });
  });
});
