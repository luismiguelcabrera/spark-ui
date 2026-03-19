import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { CurrencyInput } from "../currency-input";

describe("CurrencyInput", () => {
  it("renders with correct value formatted", () => {
    render(<CurrencyInput defaultValue={1234.56} />);
    const input = screen.getByRole("textbox");
    // Should show formatted currency when not focused
    expect(input).toHaveValue("$1,234.56");
  });

  it("shows raw value on focus", () => {
    render(<CurrencyInput defaultValue={1234.56} />);
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    expect(input).toHaveValue("1234.56");
  });

  it("formats on blur", () => {
    render(<CurrencyInput defaultValue={0} />);
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "999.99" } });
    fireEvent.blur(input);
    expect(input).toHaveValue("$999.99");
  });

  it("calls onChange with numeric value", () => {
    const onChange = vi.fn();
    render(<CurrencyInput defaultValue={0} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "42.50" } });
    expect(onChange).toHaveBeenCalledWith(42.5);
  });

  it("clamps to min", () => {
    const onChange = vi.fn();
    render(<CurrencyInput defaultValue={10} min={5} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "2" } });
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("clamps to max", () => {
    const onChange = vi.fn();
    render(<CurrencyInput defaultValue={10} max={100} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "200" } });
    expect(onChange).toHaveBeenCalledWith(100);
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(<CurrencyInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("has displayName", () => {
    expect(CurrencyInput.displayName).toBe("CurrencyInput");
  });

  it("merges className", () => {
    const { container } = render(
      <CurrencyInput className="custom-class" />
    );
    const wrapper = container.querySelector(".custom-class");
    expect(wrapper).toBeInTheDocument();
  });

  it("disabled state", () => {
    render(<CurrencyInput disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("error state sets aria-invalid and shows error text", () => {
    render(<CurrencyInput error="Amount is required" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const errorText = screen.getByRole("alert");
    expect(errorText).toHaveTextContent("Amount is required");
  });

  it("respects currency prop EUR", () => {
    render(<CurrencyInput defaultValue={100} currency="EUR" locale="en-US" />);
    const input = screen.getByRole("textbox");
    // The formatted value should contain the euro symbol
    expect(input.getAttribute("value")).toContain("€");
  });

  it("respects currency prop GBP", () => {
    render(<CurrencyInput defaultValue={100} currency="GBP" locale="en-US" />);
    const input = screen.getByRole("textbox");
    expect(input.getAttribute("value")).toContain("£");
  });

  it("respects precision", () => {
    render(<CurrencyInput defaultValue={42} precision={0} />);
    const input = screen.getByRole("textbox");
    // With precision 0, no decimals in display
    expect(input.getAttribute("value")).toBe("$42");
  });

  it("allows negative when allowNegative is true", () => {
    const onChange = vi.fn();
    render(
      <CurrencyInput defaultValue={0} allowNegative onChange={onChange} />
    );
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "-50.00" } });
    expect(onChange).toHaveBeenCalledWith(-50);
  });

  it("blocks negative when allowNegative is false", () => {
    const onChange = vi.fn();
    render(<CurrencyInput defaultValue={0} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "-10" } });
    // onChange should not be called with a negative value
    expect(onChange).not.toHaveBeenCalled();
  });

  it("label renders", () => {
    render(<CurrencyInput label="Price" />);
    expect(screen.getByText("Price")).toBeInTheDocument();
  });

  it.each(["sm", "md", "lg"] as const)(
    "size %s applies correct classes",
    (size) => {
      const sizeClasses: Record<string, string> = {
        sm: "h-8",
        md: "h-10",
        lg: "h-12",
      };
      render(<CurrencyInput size={size} />);
      const input = screen.getByRole("textbox");
      expect(input.className).toContain(sizeClasses[size]);
    }
  );
});
