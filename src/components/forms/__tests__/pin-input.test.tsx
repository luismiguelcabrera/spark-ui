import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PinInput } from "../pin-input";

describe("PinInput", () => {
  it("renders the correct number of input fields", () => {
    render(<PinInput length={4} />);
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
  });

  it("defaults to 6 fields", () => {
    render(<PinInput />);
    expect(screen.getAllByRole("textbox")).toHaveLength(6);
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<PinInput ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(PinInput.displayName).toBe("PinInput");
  });

  it("merges className", () => {
    const { container } = render(<PinInput className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("renders label", () => {
    render(<PinInput label="Verification Code" />);
    expect(screen.getByText("Verification Code")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<PinInput error errorMessage="Invalid code" />);
    expect(screen.getByText("Invalid code")).toBeInTheDocument();
  });

  it("supports disabled state", () => {
    render(<PinInput disabled length={4} />);
    screen.getAllByRole("textbox").forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it("has aria-label on each digit", () => {
    render(<PinInput length={3} />);
    expect(screen.getByLabelText("Pin digit 1 of 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Pin digit 2 of 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Pin digit 3 of 3")).toBeInTheDocument();
  });

  it("fills inputs with controlled value", () => {
    render(<PinInput value="123" length={4} />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveValue("1");
    expect(inputs[1]).toHaveValue("2");
    expect(inputs[2]).toHaveValue("3");
    expect(inputs[3]).toHaveValue("");
  });

  it.each(["sm", "md", "lg"] as const)(
    "renders with size=%s without error",
    (size) => {
      render(<PinInput size={size} length={3} />);
      expect(screen.getAllByRole("textbox")).toHaveLength(3);
    },
  );
});
