import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Textarea } from "../textarea";

describe("Textarea", () => {
  it("renders a textarea element", () => {
    render(<Textarea placeholder="Write something" />);
    expect(screen.getByPlaceholderText("Write something")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Write something").tagName).toBe("TEXTAREA");
  });

  it("displays an error message", () => {
    render(<Textarea error="Required field" />);
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("does not show error paragraph when no error", () => {
    const { container } = render(<Textarea />);
    expect(container.querySelector("p")).toBeNull();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("merges custom className", () => {
    render(<Textarea placeholder="test" className="my-custom-class" />);
    expect(screen.getByPlaceholderText("test")).toHaveClass("my-custom-class");
  });

  it("handles user typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea placeholder="Type here" onChange={onChange} />);
    await user.type(screen.getByPlaceholderText("Type here"), "hello");
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  // ── Resize ──────────────────────────────────────────────────────────

  it("applies resize-none class by default", () => {
    render(<Textarea placeholder="default" />);
    const el = screen.getByPlaceholderText("default");
    expect(el.className).toContain("resize-none");
  });

  // ── Error / ARIA ────────────────────────────────────────────────────

  describe("error state", () => {
    it("sets aria-invalid when error is present", () => {
      render(<Textarea error="Required" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("aria-invalid", "true");
    });

    it("does not set aria-invalid when no error", () => {
      render(<Textarea />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).not.toHaveAttribute("aria-invalid");
    });

    it("renders error with role=alert", () => {
      render(<Textarea error="Required" />);
      expect(screen.getByRole("alert")).toHaveTextContent("Required");
    });

    it("adds error border class", () => {
      render(<Textarea error="Required" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea.className).toContain("border-red-300");
    });
  });

  // ── Min height ──────────────────────────────────────────────────────

  it("has min-h-[120px] class", () => {
    render(<Textarea placeholder="min" />);
    const el = screen.getByPlaceholderText("min");
    expect(el.className).toContain("min-h-[120px]");
  });

  // ── Disabled ────────────────────────────────────────────────────────

  it("supports disabled state", () => {
    render(<Textarea placeholder="disabled" disabled />);
    expect(screen.getByPlaceholderText("disabled")).toBeDisabled();
  });
});
