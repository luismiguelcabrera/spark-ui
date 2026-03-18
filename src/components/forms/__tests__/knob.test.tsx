import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import { Knob } from "../knob";

expect.extend(toHaveNoViolations);

describe("Knob", () => {
  it("renders with role=slider", () => {
    render(<Knob label="Volume" />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("displays correct ARIA attributes", () => {
    render(<Knob value={50} min={0} max={100} label="Volume" />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "50");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
    expect(slider).toHaveAttribute("aria-label", "Volume");
  });

  it("uses default values when none specified", () => {
    render(<Knob label="Test" />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "0");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
  });

  it("displays value in center when showValue is true (default)", () => {
    render(<Knob value={42} label="Volume" />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("does not display value when showValue is false", () => {
    render(<Knob value={42} showValue={false} label="Volume" />);
    expect(screen.queryByText("42")).not.toBeInTheDocument();
  });

  it("shows the label text", () => {
    render(<Knob label="Brightness" />);
    expect(screen.getByText("Brightness")).toBeInTheDocument();
  });

  it("increases value on ArrowUp key", () => {
    const onChange = vi.fn();
    render(<Knob defaultValue={50} onChange={onChange} label="Volume" />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(51);
  });

  it("increases value on ArrowRight key", () => {
    const onChange = vi.fn();
    render(<Knob defaultValue={50} onChange={onChange} label="Volume" />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(51);
  });

  it("decreases value on ArrowDown key", () => {
    const onChange = vi.fn();
    render(<Knob defaultValue={50} onChange={onChange} label="Volume" />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowDown" });
    expect(onChange).toHaveBeenCalledWith(49);
  });

  it("decreases value on ArrowLeft key", () => {
    const onChange = vi.fn();
    render(<Knob defaultValue={50} onChange={onChange} label="Volume" />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith(49);
  });

  it("jumps to min on Home key", () => {
    const onChange = vi.fn();
    render(<Knob defaultValue={50} min={10} onChange={onChange} label="Volume" />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "Home" });
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it("jumps to max on End key", () => {
    const onChange = vi.fn();
    render(<Knob defaultValue={50} max={80} onChange={onChange} label="Volume" />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "End" });
    expect(onChange).toHaveBeenCalledWith(80);
  });

  it("respects step when using arrow keys", () => {
    const onChange = vi.fn();
    render(<Knob defaultValue={50} step={5} onChange={onChange} label="Volume" />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(55);
  });

  it("does not exceed max when pressing ArrowRight", () => {
    const onChange = vi.fn();
    render(<Knob defaultValue={100} max={100} onChange={onChange} label="Volume" />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(100);
  });

  it("does not go below min when pressing ArrowLeft", () => {
    const onChange = vi.fn();
    render(<Knob defaultValue={0} min={0} onChange={onChange} label="Volume" />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("does not respond to keys when disabled", () => {
    const onChange = vi.fn();
    render(<Knob defaultValue={50} disabled onChange={onChange} label="Volume" />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("sets tabIndex to -1 when disabled", () => {
    render(<Knob disabled label="Volume" />);
    expect(screen.getByRole("slider")).toHaveAttribute("tabindex", "-1");
  });

  it("sets tabIndex to 0 when not disabled", () => {
    render(<Knob label="Volume" />);
    expect(screen.getByRole("slider")).toHaveAttribute("tabindex", "0");
  });

  it("applies disabled styling", () => {
    const { container } = render(<Knob disabled label="Volume" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("opacity-50");
  });

  it("works in controlled mode", () => {
    const { rerender } = render(<Knob value={30} label="Volume" />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "30");
    rerender(<Knob value={70} label="Volume" />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "70");
  });

  it.each(["primary", "secondary", "success", "warning", "destructive"] as const)(
    "renders with %s color variant",
    (color) => {
      render(<Knob color={color} value={50} label="Volume" />);
      expect(screen.getByRole("slider")).toBeInTheDocument();
    },
  );

  it("renders with custom size", () => {
    render(<Knob size={200} label="Volume" />);
    const svg = screen.getByRole("slider");
    expect(svg).toHaveAttribute("width", "200");
    expect(svg).toHaveAttribute("height", "200");
  });

  it("accepts custom className", () => {
    const { container } = render(<Knob className="my-custom-class" label="Volume" />);
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Knob label="Volume" value={50} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations when disabled", async () => {
    const { container } = render(<Knob label="Volume" disabled value={50} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
