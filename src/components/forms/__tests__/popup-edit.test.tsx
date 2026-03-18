import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PopupEdit } from "../popup-edit";

describe("PopupEdit", () => {
  const defaultProps = {
    value: "Hello World",
    onSave: vi.fn(),
  };

  // ── Rendering ──

  it("renders children", () => {
    render(
      <PopupEdit {...defaultProps}>
        <span>Display text</span>
      </PopupEdit>
    );
    expect(screen.getByText("Display text")).toBeInTheDocument();
  });

  it("does not show edit popover by default", () => {
    render(
      <PopupEdit {...defaultProps}>
        <span>Text</span>
      </PopupEdit>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the display trigger with role=button", { timeout: 30000 }, () => {
    render(
      <PopupEdit {...defaultProps}>
        <span>Click me</span>
      </PopupEdit>
    );
    expect(screen.getByRole("button", { name: "Click to edit" })).toBeInTheDocument();
  });

  // ── Opening the popover ──

  it("opens popover on click", async () => {
    const user = userEvent.setup();
    render(
      <PopupEdit {...defaultProps}>
        <span>Text</span>
      </PopupEdit>
    );
    await user.click(screen.getByRole("button", { name: "Click to edit" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("opens popover on Enter key", async () => {
    const user = userEvent.setup();
    render(
      <PopupEdit {...defaultProps}>
        <span>Text</span>
      </PopupEdit>
    );
    screen.getByRole("button", { name: "Click to edit" }).focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("opens popover on Space key", async () => {
    const user = userEvent.setup();
    render(
      <PopupEdit {...defaultProps}>
        <span>Text</span>
      </PopupEdit>
    );
    screen.getByRole("button", { name: "Click to edit" }).focus();
    await user.keyboard(" ");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("populates input with current value on open", async () => {
    const user = userEvent.setup();
    render(
      <PopupEdit value="Initial" onSave={vi.fn()}>
        <span>Text</span>
      </PopupEdit>
    );
    await user.click(screen.getByRole("button", { name: "Click to edit" }));
    expect(screen.getByRole("textbox")).toHaveValue("Initial");
  });

  // ── Input mode ──

  it("renders an input by default (mode=input)", async () => {
    const user = userEvent.setup();
    render(
      <PopupEdit {...defaultProps}>
        <span>Text</span>
      </PopupEdit>
    );
    await user.click(screen.getByRole("button", { name: "Click to edit" }));
    expect(screen.getByRole("textbox").tagName).toBe("INPUT");
  });

  it("renders a textarea when mode=textarea", async () => {
    const user = userEvent.setup();
    render(
      <PopupEdit {...defaultProps} mode="textarea">
        <span>Text</span>
      </PopupEdit>
    );
    await user.click(screen.getByRole("button", { name: "Click to edit" }));
    expect(screen.getByRole("textbox").tagName).toBe("TEXTAREA");
  });

  // ── Save behavior ──

  it("calls onSave with edited value when Save is clicked", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <PopupEdit value="Old" onSave={onSave}>
        <span>Text</span>
      </PopupEdit>
    );
    await user.click(screen.getByRole("button", { name: "Click to edit" }));
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "New value");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onSave).toHaveBeenCalledWith("New value");
  });

  it("closes popover after save", async () => {
    const user = userEvent.setup();
    render(
      <PopupEdit value="Test" onSave={vi.fn()}>
        <span>Text</span>
      </PopupEdit>
    );
    await user.click(screen.getByRole("button", { name: "Click to edit" }));
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("saves on Enter key in input mode", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <PopupEdit value="Original" onSave={onSave}>
        <span>Text</span>
      </PopupEdit>
    );
    await user.click(screen.getByRole("button", { name: "Click to edit" }));
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "Updated");
    await user.keyboard("{Enter}");
    expect(onSave).toHaveBeenCalledWith("Updated");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not save on Enter in textarea mode", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <PopupEdit value="Text" onSave={onSave} mode="textarea">
        <span>Text</span>
      </PopupEdit>
    );
    await user.click(screen.getByRole("button", { name: "Click to edit" }));
    await user.keyboard("{Enter}");
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  // ── Cancel behavior ──

  it("closes popover on Cancel click", async () => {
    const user = userEvent.setup();
    render(
      <PopupEdit {...defaultProps}>
        <span>Text</span>
      </PopupEdit>
    );
    await user.click(screen.getByRole("button", { name: "Click to edit" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onCancel when cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <PopupEdit value="Test" onSave={vi.fn()} onCancel={onCancel}>
        <span>Text</span>
      </PopupEdit>
    );
    await user.click(screen.getByRole("button", { name: "Click to edit" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("cancels on Escape key", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <PopupEdit value="Test" onSave={vi.fn()} onCancel={onCancel}>
        <span>Text</span>
      </PopupEdit>
    );
    await user.click(screen.getByRole("button", { name: "Click to edit" }));
    await user.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // ── Click outside ──

  it("cancels on click outside", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <div>
        <span data-testid="outside">Outside</span>
        <PopupEdit value="Test" onSave={vi.fn()} onCancel={onCancel}>
          <span>Text</span>
        </PopupEdit>
      </div>
    );
    await user.click(screen.getByRole("button", { name: "Click to edit" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    // Simulate click outside via mousedown event (useClickOutside uses mousedown)
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(onCancel).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // ── Disabled state ──

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(
      <PopupEdit {...defaultProps} disabled>
        <span>Text</span>
      </PopupEdit>
    );
    await user.click(screen.getByRole("button", { name: "Click to edit" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sets aria-disabled on trigger when disabled", () => {
    render(
      <PopupEdit {...defaultProps} disabled>
        <span>Text</span>
      </PopupEdit>
    );
    expect(screen.getByRole("button", { name: "Click to edit" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  it("applies disabled styling", () => {
    render(
      <PopupEdit {...defaultProps} disabled>
        <span>Text</span>
      </PopupEdit>
    );
    expect(screen.getByRole("button", { name: "Click to edit" }).className).toContain("cursor-not-allowed");
  });

  it("has tabIndex=-1 when disabled", () => {
    render(
      <PopupEdit {...defaultProps} disabled>
        <span>Text</span>
      </PopupEdit>
    );
    expect(screen.getByRole("button", { name: "Click to edit" })).toHaveAttribute("tabindex", "-1");
  });

  // ── Placeholder ──

  it("passes placeholder to input", async () => {
    const user = userEvent.setup();
    render(
      <PopupEdit value="" onSave={vi.fn()} placeholder="Enter text...">
        <span>Text</span>
      </PopupEdit>
    );
    await user.click(screen.getByRole("button", { name: "Click to edit" }));
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Enter text...");
  });

  // ── Ref forwarding ──

  it("forwards ref to the wrapper div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <PopupEdit ref={ref} {...defaultProps}>
        <span>Text</span>
      </PopupEdit>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ── className merging ──

  it("merges custom className", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <PopupEdit ref={ref} {...defaultProps} className="my-custom">
        <span>Text</span>
      </PopupEdit>
    );
    expect(ref.current!.className).toContain("my-custom");
  });

  // ── Save and Cancel buttons ──

  it("renders Save and Cancel buttons in the popover", async () => {
    const user = userEvent.setup();
    render(
      <PopupEdit {...defaultProps}>
        <span>Text</span>
      </PopupEdit>
    );
    await user.click(screen.getByRole("button", { name: "Click to edit" }));
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("Save and Cancel buttons are type=button", async () => {
    const user = userEvent.setup();
    render(
      <PopupEdit {...defaultProps}>
        <span>Text</span>
      </PopupEdit>
    );
    await user.click(screen.getByRole("button", { name: "Click to edit" }));
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "button");
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveAttribute("type", "button");
  });
});
