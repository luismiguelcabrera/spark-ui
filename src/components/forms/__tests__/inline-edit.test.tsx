import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { InlineEdit } from "../inline-edit";

describe("InlineEdit", () => {
  it("renders value in display mode", () => {
    render(<InlineEdit value="Hello" onSave={vi.fn()} />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("enters edit mode on click", () => {
    render(<InlineEdit value="Hello" onSave={vi.fn()} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
  });

  it("enters edit mode on Enter key", () => {
    render(<InlineEdit value="Hello" onSave={vi.fn()} />);
    const display = screen.getByRole("button");
    fireEvent.keyDown(display, { key: "Enter" });
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
  });

  it("enters edit mode on Space key", () => {
    render(<InlineEdit value="Hello" onSave={vi.fn()} />);
    const display = screen.getByRole("button");
    fireEvent.keyDown(display, { key: " " });
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
  });

  it("saves on Enter key (input mode)", () => {
    const onSave = vi.fn();
    render(<InlineEdit value="Hello" onSave={onSave} />);
    fireEvent.click(screen.getByRole("button"));
    const input = screen.getByDisplayValue("Hello");
    fireEvent.change(input, { target: { value: "World" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSave).toHaveBeenCalledWith("World");
  });

  it("cancels on Escape key", () => {
    const onSave = vi.fn();
    render(<InlineEdit value="Hello" onSave={onSave} />);
    fireEvent.click(screen.getByRole("button"));
    const input = screen.getByDisplayValue("Hello");
    fireEvent.change(input, { target: { value: "World" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onSave).not.toHaveBeenCalled();
    // Should revert to display mode with original value
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("calls onCancel when Escape is pressed", () => {
    const onCancel = vi.fn();
    render(<InlineEdit value="Hello" onSave={vi.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.keyDown(screen.getByDisplayValue("Hello"), { key: "Escape" });
    expect(onCancel).toHaveBeenCalled();
  });

  it("saves on blur when submitOnBlur is true", () => {
    const onSave = vi.fn();
    render(<InlineEdit value="Hello" onSave={onSave} submitOnBlur />);
    fireEvent.click(screen.getByRole("button"));
    const input = screen.getByDisplayValue("Hello");
    fireEvent.change(input, { target: { value: "World" } });
    fireEvent.blur(input);
    expect(onSave).toHaveBeenCalledWith("World");
  });

  it("does not save on blur when submitOnBlur is false", () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    render(
      <InlineEdit value="Hello" onSave={onSave} onCancel={onCancel} submitOnBlur={false} />
    );
    fireEvent.click(screen.getByRole("button"));
    const input = screen.getByDisplayValue("Hello");
    fireEvent.change(input, { target: { value: "World" } });
    fireEvent.blur(input);
    expect(onSave).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });

  it("does not enter edit mode when disabled", () => {
    render(<InlineEdit value="Hello" onSave={vi.fn()} disabled />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("selectAllOnFocus selects text on focus", async () => {
    render(<InlineEdit value="Hello" onSave={vi.fn()} selectAllOnFocus />);
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      const input = screen.getByDisplayValue("Hello") as HTMLInputElement;
      expect(input.selectionStart).toBe(0);
      expect(input.selectionEnd).toBe(5);
    });
  });

  it("forwards ref (HTMLDivElement)", () => {
    const ref = vi.fn();
    render(<InlineEdit ref={ref} value="Hello" onSave={vi.fn()} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(InlineEdit.displayName).toBe("InlineEdit");
  });

  it("merges className", () => {
    render(<InlineEdit value="Hello" onSave={vi.fn()} className="custom-class" />);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("textarea mode: Enter adds newline, Ctrl+Enter saves", () => {
    const onSave = vi.fn();
    render(<InlineEdit value="Hello" onSave={onSave} mode="textarea" />);
    fireEvent.click(screen.getByRole("button"));
    const textarea = screen.getByDisplayValue("Hello");

    // Plain Enter should NOT save (it inserts a newline natively)
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(onSave).not.toHaveBeenCalled();

    // Ctrl+Enter should save
    fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true });
    expect(onSave).toHaveBeenCalledWith("Hello");
  });

  it("renders pencil icon in markup", () => {
    const { container } = render(<InlineEdit value="Hello" onSave={vi.fn()} />);
    // The Icon component renders with the icon name; check the pencil icon is in the DOM
    const icon = container.querySelector("[aria-hidden='true']");
    expect(icon).toBeInTheDocument();
  });

  it("custom renderDisplay works", () => {
    render(
      <InlineEdit
        value="Hello"
        onSave={vi.fn()}
        renderDisplay={(val) => <strong data-testid="custom-display">{val}</strong>}
      />
    );
    expect(screen.getByTestId("custom-display")).toHaveTextContent("Hello");
  });

  it("disabled applies correct styles", () => {
    render(<InlineEdit value="Hello" onSave={vi.fn()} disabled />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("cursor-not-allowed");
    expect(btn).toHaveClass("opacity-50");
    expect(btn).toHaveAttribute("tabindex", "-1");
  });
});
