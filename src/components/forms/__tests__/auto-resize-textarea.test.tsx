import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AutoResizeTextarea } from "../auto-resize-textarea";

describe("AutoResizeTextarea", () => {
  it("renders a textarea element", () => {
    render(<AutoResizeTextarea placeholder="Write something" />);
    expect(
      screen.getByPlaceholderText("Write something")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Write something").tagName
    ).toBe("TEXTAREA");
  });

  it("displays error message", () => {
    render(<AutoResizeTextarea error="Required field" />);
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("does not show error when no error", () => {
    const { container } = render(<AutoResizeTextarea />);
    expect(container.querySelector("p")).toBeNull();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    render(<AutoResizeTextarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("merges custom className", () => {
    render(
      <AutoResizeTextarea placeholder="test" className="my-custom-class" />
    );
    expect(screen.getByPlaceholderText("test")).toHaveClass("my-custom-class");
  });

  it("handles user typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <AutoResizeTextarea placeholder="Type here" onChange={onChange} />
    );
    await user.type(screen.getByPlaceholderText("Type here"), "hello");
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it("has resize-none class", () => {
    render(<AutoResizeTextarea placeholder="default" />);
    const el = screen.getByPlaceholderText("default");
    expect(el.className).toContain("resize-none");
  });

  it("sets aria-invalid when error present", () => {
    render(<AutoResizeTextarea error="Required" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-invalid when no error", () => {
    render(<AutoResizeTextarea />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).not.toHaveAttribute("aria-invalid");
  });

  it("renders error with role=alert", () => {
    render(<AutoResizeTextarea error="Required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("supports disabled state", () => {
    render(<AutoResizeTextarea placeholder="disabled" disabled />);
    expect(screen.getByPlaceholderText("disabled")).toBeDisabled();
  });

  it("has displayName", () => {
    expect(AutoResizeTextarea.displayName).toBe("AutoResizeTextarea");
  });

  it("applies default minRows", () => {
    render(<AutoResizeTextarea placeholder="min" />);
    const el = screen.getByPlaceholderText("min") as HTMLTextAreaElement;
    // The component sets min-height via inline style based on minRows (default 3)
    expect(el.style.minHeight).toBeTruthy();
  });

  it("applies custom minRows", () => {
    render(<AutoResizeTextarea placeholder="custom" minRows={5} />);
    const el = screen.getByPlaceholderText("custom") as HTMLTextAreaElement;
    // The component sets min-height via inline style based on minRows
    expect(el.style.minHeight).toBeTruthy();
  });
});
