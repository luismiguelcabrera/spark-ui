import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ColorPicker } from "../color-picker";

describe("ColorPicker", () => {
  it("renders with default color input", () => {
    render(<ColorPicker />);
    expect(screen.getByPlaceholderText("#000000")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<ColorPicker ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(ColorPicker.displayName).toBe("ColorPicker");
  });

  it("merges className", () => {
    const { container } = render(<ColorPicker className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("renders label when provided", () => {
    render(<ColorPicker label="Background Color" />);
    expect(screen.getByText("Background Color")).toBeInTheDocument();
  });

  it("renders preset color swatches", () => {
    render(<ColorPicker presets={["#ff0000", "#00ff00"]} />);
    expect(screen.getByLabelText("Select color #ff0000")).toBeInTheDocument();
    expect(screen.getByLabelText("Select color #00ff00")).toBeInTheDocument();
  });

  it("calls onChange when preset is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorPicker onChange={onChange} presets={["#ff0000"]} />);
    await user.click(screen.getByLabelText("Select color #ff0000"));
    expect(onChange).toHaveBeenCalledWith("#ff0000");
  });

  it("hides text input when showInput is false", () => {
    render(<ColorPicker showInput={false} />);
    expect(screen.queryByPlaceholderText("#000000")).not.toBeInTheDocument();
  });

  it("handles disabled state", () => {
    const { container } = render(<ColorPicker disabled />);
    expect(container.firstChild).toHaveClass("pointer-events-none");
    expect(container.firstChild).toHaveClass("opacity-50");
  });

  it.each(["sm", "md", "lg"] as const)(
    "renders with size=%s without error",
    (size) => {
      const { container } = render(<ColorPicker size={size} />);
      expect(container.firstChild).toBeTruthy();
    },
  );
});
