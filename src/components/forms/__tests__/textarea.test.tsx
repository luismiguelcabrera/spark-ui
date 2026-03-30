import { render, screen, fireEvent } from "@testing-library/react";
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

  it("applies resize-y when autoResize is false (default)", () => {
    render(<Textarea placeholder="default" />);
    const el = screen.getByPlaceholderText("default");
    expect(el.className).toContain("resize-y");
    expect(el.className).not.toContain("resize-none");
  });

  describe("autoResize", () => {
    it("renders without error when autoResize is true", () => {
      render(<Textarea autoResize placeholder="auto" />);
      expect(screen.getByPlaceholderText("auto")).toBeInTheDocument();
    });

    it("applies resize-none when autoResize is true", () => {
      render(<Textarea autoResize placeholder="auto" />);
      const el = screen.getByPlaceholderText("auto");
      expect(el.className).toContain("resize-none");
    });

    it("forwards ref correctly with autoResize", () => {
      const ref = { current: null as HTMLTextAreaElement | null };
      render(<Textarea autoResize ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });

    it("forwards callback ref correctly with autoResize", () => {
      let node: HTMLTextAreaElement | null = null;
      const callbackRef = (el: HTMLTextAreaElement | null) => {
        node = el;
      };
      render(<Textarea autoResize ref={callbackRef} />);
      expect(node).toBeInstanceOf(HTMLTextAreaElement);
    });

    it("sets minHeight style based on minRows", () => {
      render(<Textarea autoResize minRows={5} placeholder="min" />);
      const el = screen.getByPlaceholderText("min");
      expect(el.style.minHeight).toBe("7.5rem"); // 5 * 1.5rem
    });

    it("uses default minRows of 3", () => {
      render(<Textarea autoResize placeholder="default-min" />);
      const el = screen.getByPlaceholderText("default-min");
      expect(el.style.minHeight).toBe("4.5rem"); // 3 * 1.5rem
    });

    it("merges custom className with autoResize", () => {
      render(<Textarea autoResize placeholder="cls" className="bg-red-500" />);
      const el = screen.getByPlaceholderText("cls");
      expect(el).toHaveClass("bg-red-500");
      expect(el.className).toContain("resize-none");
    });

    it("calls the original onInput handler alongside resize", () => {
      const onInput = vi.fn();
      render(<Textarea autoResize placeholder="input" onInput={onInput} />);
      const el = screen.getByPlaceholderText("input");
      fireEvent.input(el, { target: { value: "hello" } });
      expect(onInput).toHaveBeenCalledTimes(1);
    });

    it("applies overflow-hidden class when autoResize is true", () => {
      render(<Textarea autoResize placeholder="overflow" />);
      const el = screen.getByPlaceholderText("overflow");
      expect(el.className).toContain("overflow-hidden");
    });

    it("does not apply overflow-hidden when autoResize is false", () => {
      render(<Textarea placeholder="no-overflow" />);
      const el = screen.getByPlaceholderText("no-overflow");
      expect(el.className).not.toContain("overflow-hidden");
    });

    it("preserves custom style prop with autoResize", () => {
      render(
        <Textarea autoResize placeholder="styled" style={{ color: "red" }} />
      );
      const el = screen.getByPlaceholderText("styled");
      expect(el.style.color).toBe("red");
      expect(el.style.minHeight).toBe("4.5rem");
    });

    it("accepts maxRows prop without error", () => {
      render(<Textarea autoResize maxRows={10} placeholder="max" />);
      expect(screen.getByPlaceholderText("max")).toBeInTheDocument();
    });
  });
});
