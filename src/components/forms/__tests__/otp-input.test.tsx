import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OtpInput } from "../otp-input";

describe("OtpInput", () => {
  it("renders the correct number of inputs", () => {
    render(<OtpInput value="" onChange={vi.fn()} length={6} />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<OtpInput value="" onChange={vi.fn()} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(OtpInput.displayName).toBe("OtpInput");
  });

  it("merges className", () => {
    render(<OtpInput value="" onChange={vi.fn()} className="custom" />);
    expect(screen.getByRole("group")).toHaveClass("custom");
  });

  it("renders custom length", () => {
    render(<OtpInput value="" onChange={vi.fn()} length={4} />);
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
  });

  it("fills inputs with value characters", () => {
    render(<OtpInput value="1234" onChange={vi.fn()} length={6} />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveValue("1");
    expect(inputs[1]).toHaveValue("2");
    expect(inputs[2]).toHaveValue("3");
    expect(inputs[3]).toHaveValue("4");
    expect(inputs[4]).toHaveValue("");
  });

  it("has role='group' with aria-label", () => {
    render(<OtpInput value="" onChange={vi.fn()} />);
    expect(screen.getByRole("group")).toHaveAttribute("aria-label", "One-time password");
  });

  it("uses numeric inputMode", () => {
    render(<OtpInput value="" onChange={vi.fn()} length={4} />);
    screen.getAllByRole("textbox").forEach((input) => {
      expect(input).toHaveAttribute("inputMode", "numeric");
    });
  });

  it("supports disabled state", () => {
    render(<OtpInput value="" onChange={vi.fn()} disabled length={4} />);
    screen.getAllByRole("textbox").forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it("has aria-label on each digit", () => {
    render(<OtpInput value="" onChange={vi.fn()} length={3} />);
    expect(screen.getByLabelText("Digit 1 of 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Digit 2 of 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Digit 3 of 3")).toBeInTheDocument();
  });
});
