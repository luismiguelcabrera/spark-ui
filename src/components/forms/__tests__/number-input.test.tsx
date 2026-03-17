import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import { NumberInput } from "../number-input";

expect.extend(toHaveNoViolations);

describe("NumberInput", () => {
  it("renders with default value", () => {
    render(<NumberInput defaultValue={5} />);
    expect(screen.getByRole("spinbutton")).toHaveValue("5");
  });

  it("increments on button click", () => {
    const onChange = vi.fn();
    render(<NumberInput defaultValue={5} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("Increase value"));
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it("decrements on button click", () => {
    const onChange = vi.fn();
    render(<NumberInput defaultValue={5} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("Decrease value"));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("respects min/max bounds", () => {
    const onChange = vi.fn();
    render(<NumberInput defaultValue={10} max={10} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("Increase value"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("respects min bound on decrement", () => {
    const onChange = vi.fn();
    render(<NumberInput defaultValue={0} min={0} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("Decrease value"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows label", () => {
    render(<NumberInput label="Quantity" />);
    expect(screen.getByText("Quantity")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<NumberInput error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("increments on ArrowUp key", () => {
    const onChange = vi.fn();
    render(<NumberInput defaultValue={5} onChange={onChange} />);
    const input = screen.getByRole("spinbutton");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it("decrements on ArrowDown key", () => {
    const onChange = vi.fn();
    render(<NumberInput defaultValue={5} onChange={onChange} />);
    const input = screen.getByRole("spinbutton");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("respects step prop", () => {
    const onChange = vi.fn();
    render(<NumberInput defaultValue={10} step={5} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("Increase value"));
    expect(onChange).toHaveBeenCalledWith(15);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<NumberInput label="Quantity" aria-label="Quantity" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
