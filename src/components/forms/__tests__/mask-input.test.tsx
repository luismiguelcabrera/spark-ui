import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import { MaskInput } from "../mask-input";

expect.extend(toHaveNoViolations);

describe("MaskInput", () => {
  it("renders with mask placeholder", () => {
    render(<MaskInput mask="(999) 999-9999" aria-label="Phone" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("(___) ___-____");
  });

  it("accepts digit input for 9 mask positions", () => {
    const onChange = vi.fn();
    render(<MaskInput mask="99/99" onChange={onChange} aria-label="Date" />);
    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "1" });
    expect(onChange).toHaveBeenCalledWith("1");
  });

  it("rejects letters for digit-only mask", () => {
    const onChange = vi.fn();
    render(<MaskInput mask="9999" onChange={onChange} aria-label="Code" />);
    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "a" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("accepts letters for a mask positions", () => {
    const onChange = vi.fn();
    render(<MaskInput mask="aaa" onChange={onChange} aria-label="Code" />);
    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "A" });
    expect(onChange).toHaveBeenCalledWith("A");
  });

  it("rejects digits for letter-only mask", () => {
    const onChange = vi.fn();
    render(<MaskInput mask="aaa" onChange={onChange} aria-label="Code" />);
    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "1" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("accepts any alphanumeric for * mask positions", () => {
    const onChange = vi.fn();
    render(<MaskInput mask="***" onChange={onChange} aria-label="Code" />);
    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "A" });
    expect(onChange).toHaveBeenCalledWith("A");
  });

  it("handles backspace", () => {
    const onChange = vi.fn();
    render(<MaskInput mask="999" defaultValue="12" onChange={onChange} aria-label="Code" />);
    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(onChange).toHaveBeenCalledWith("1");
  });

  it("does not exceed mask length", () => {
    const onChange = vi.fn();
    render(<MaskInput mask="99" defaultValue="12" onChange={onChange} aria-label="Code" />);
    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "3" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("displays with custom maskChar", () => {
    render(<MaskInput mask="99-99" maskChar="#" aria-label="Code" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("##-##");
  });

  it("renders with controlled value", () => {
    render(<MaskInput mask="(999) 999-9999" value="1234567890" aria-label="Phone" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("(123) 456-7890");
  });

  it("shows label", () => {
    render(<MaskInput mask="99/99" label="Date" />);
    expect(screen.getByText("Date")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<MaskInput mask="99/99" label="Date" error="Invalid date" />);
    expect(screen.getByText("Invalid date")).toBeInTheDocument();
  });

  it("shows hint text", () => {
    render(<MaskInput mask="99/99/9999" label="Date" hint="MM/DD/YYYY" />);
    expect(screen.getByText("MM/DD/YYYY")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<MaskInput ref={ref} mask="999" aria-label="Code" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it("is disabled when disabled prop is true", () => {
    render(<MaskInput mask="999" disabled aria-label="Code" />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<MaskInput mask="(999) 999-9999" label="Phone" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations (simple mode)", async () => {
    const { container } = render(<MaskInput mask="999" aria-label="Code" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
