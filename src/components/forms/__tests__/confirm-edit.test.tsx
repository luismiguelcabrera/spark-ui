import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import { ConfirmEdit } from "../confirm-edit";

expect.extend(toHaveNoViolations);

describe("ConfirmEdit", () => {
  it("renders display mode by default", () => {
    render(<ConfirmEdit value="Hello" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("enters edit mode on click", () => {
    render(<ConfirmEdit value="Hello" />);
    fireEvent.click(screen.getByText("Hello"));
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
  });

  it("shows save and cancel buttons in edit mode", () => {
    render(<ConfirmEdit value="Hello" />);
    fireEvent.click(screen.getByText("Hello"));
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onChange on save", () => {
    const onChange = vi.fn();
    render(<ConfirmEdit value="Hello" onChange={onChange} />);
    fireEvent.click(screen.getByText("Hello"));
    const input = screen.getByDisplayValue("Hello");
    fireEvent.change(input, { target: { value: "World" } });
    fireEvent.click(screen.getByText("Save"));
    expect(onChange).toHaveBeenCalledWith("World");
  });

  it("reverts on cancel", () => {
    render(<ConfirmEdit value="Hello" />);
    fireEvent.click(screen.getByText("Hello"));
    const input = screen.getByDisplayValue("Hello");
    fireEvent.change(input, { target: { value: "World" } });
    fireEvent.click(screen.getByText("Cancel"));
    // Should go back to display mode with original value
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("saves on Enter key", () => {
    const onChange = vi.fn();
    render(<ConfirmEdit value="Hello" onChange={onChange} />);
    fireEvent.click(screen.getByText("Hello"));
    const input = screen.getByDisplayValue("Hello");
    fireEvent.change(input, { target: { value: "World" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("World");
  });

  it("cancels on Escape key", () => {
    const onChange = vi.fn();
    render(<ConfirmEdit value="Hello" onChange={onChange} />);
    fireEvent.click(screen.getByText("Hello"));
    const input = screen.getByDisplayValue("Hello");
    fireEvent.change(input, { target: { value: "World" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("supports custom confirm/cancel text", () => {
    render(<ConfirmEdit value="Hello" confirmText="OK" cancelText="Discard" />);
    fireEvent.click(screen.getByText("Hello"));
    expect(screen.getByText("OK")).toBeInTheDocument();
    expect(screen.getByText("Discard")).toBeInTheDocument();
  });

  it("supports custom renderDisplay", () => {
    render(
      <ConfirmEdit
        value="Hello"
        renderDisplay={(val) => <strong data-testid="display">{val}</strong>}
      />
    );
    expect(screen.getByTestId("display")).toHaveTextContent("Hello");
  });

  it("supports custom renderInput", () => {
    render(
      <ConfirmEdit
        value="Hello"
        renderInput={({ value, onChange, ref }) => (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            data-testid="custom-input"
          />
        )}
      />
    );
    fireEvent.click(screen.getByText("Hello"));
    expect(screen.getByTestId("custom-input")).toBeInTheDocument();
  });

  it("does not enter edit mode when disabled", () => {
    render(<ConfirmEdit value="Hello" disabled />);
    fireEvent.click(screen.getByText("Hello"));
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("enters edit mode on Enter key", () => {
    render(<ConfirmEdit value="Hello" />);
    const display = screen.getByRole("button");
    fireEvent.keyDown(display, { key: "Enter" });
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
  });

  it("enters edit mode on Space key", () => {
    render(<ConfirmEdit value="Hello" />);
    const display = screen.getByRole("button");
    fireEvent.keyDown(display, { key: " " });
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<ConfirmEdit ref={ref} value="Hello" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has no accessibility violations in display mode", async () => {
    const { container } = render(<ConfirmEdit value="Hello" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations in edit mode", async () => {
    const { container } = render(<ConfirmEdit value="Hello" />);
    fireEvent.click(screen.getByText("Hello"));
    await waitFor(() => {
      expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
