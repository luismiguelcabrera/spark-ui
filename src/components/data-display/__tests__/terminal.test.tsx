import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Terminal, type TerminalLine } from "../terminal";

const sampleLines: TerminalLine[] = [
  { type: "input", content: "ls -la" },
  { type: "output", content: "file1.txt  file2.txt" },
  { type: "error", content: "Permission denied" },
  { type: "info", content: "3 items" },
];

describe("Terminal", () => {
  it("renders without crashing", () => {
    const { container } = render(<Terminal />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders the title bar with default title", () => {
    render(<Terminal />);
    expect(screen.getByText("Terminal")).toBeInTheDocument();
  });

  it("renders a custom title", () => {
    render(<Terminal title="My Shell" />);
    expect(screen.getByText("My Shell")).toBeInTheDocument();
  });

  it("renders three window dots", () => {
    const { container } = render(<Terminal />);
    const dots = container.querySelectorAll(".rounded-full");
    expect(dots.length).toBe(3);
  });

  describe("lines rendering", () => {
    it("renders all line types", () => {
      const { container } = render(<Terminal lines={sampleLines} />);
      expect(container.textContent).toContain("ls -la");
      expect(container.textContent).toContain("file1.txt  file2.txt");
      expect(container.textContent).toContain("Permission denied");
      expect(container.textContent).toContain("3 items");
    });

    it("renders default prompt for input lines", () => {
      const { container } = render(
        <Terminal lines={[{ type: "input", content: "echo hello" }]} />
      );
      expect(container.textContent).toContain("$ ");
    });

    it("renders custom prompt for a specific line", () => {
      const { container } = render(
        <Terminal
          lines={[
            { type: "input", content: "whoami", prompt: "user@host:~ $ " },
          ]}
        />
      );
      expect(container.textContent).toContain("user@host:~ $ ");
    });

    it("renders custom global prompt", () => {
      const { container } = render(
        <Terminal
          prompt="> "
          lines={[{ type: "input", content: "test" }]}
        />
      );
      expect(container.textContent).toContain("> ");
    });

    it("applies correct color class for error lines", () => {
      render(
        <Terminal lines={[{ type: "error", content: "fatal error" }]} />
      );
      const errorEl = screen.getByText("fatal error");
      expect(errorEl.className).toContain("text-red-400");
    });

    it("applies correct color class for info lines", () => {
      render(
        <Terminal lines={[{ type: "info", content: "info message" }]} />
      );
      const infoEl = screen.getByText("info message");
      expect(infoEl.className).toContain("text-blue-400");
    });

    it("applies correct color class for output lines", () => {
      render(
        <Terminal lines={[{ type: "output", content: "output text" }]} />
      );
      const outputEl = screen.getByText("output text");
      expect(outputEl.className).toContain("text-slate-200");
    });

    it("applies correct color class for input lines", () => {
      render(
        <Terminal lines={[{ type: "input", content: "cmd" }]} />
      );
      const inputEl = screen.getByText("cmd");
      expect(inputEl.className).toContain("text-green-400");
    });
  });

  describe("accessibility", () => {
    it("has role=log on output area", () => {
      render(<Terminal lines={sampleLines} />);
      expect(screen.getByRole("log")).toBeInTheDocument();
    });

    it("has aria-label on output area", () => {
      render(<Terminal />);
      const log = screen.getByRole("log");
      expect(log).toHaveAttribute("aria-label", "Terminal output");
    });

    it("has aria-live=polite on output area", () => {
      render(<Terminal />);
      const log = screen.getByRole("log");
      expect(log).toHaveAttribute("aria-live", "polite");
    });

    it("has role=textbox on input when interactive", () => {
      render(<Terminal interactive />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("has aria-label on input when interactive", () => {
      render(<Terminal interactive />);
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "aria-label",
        "Terminal input"
      );
    });
  });

  describe("interactive mode", () => {
    it("does not show input when not interactive", () => {
      render(<Terminal />);
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    it("shows input field when interactive", () => {
      render(<Terminal interactive />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("calls onCommand when Enter is pressed with input", () => {
      const onCommand = vi.fn();
      render(<Terminal interactive onCommand={onCommand} />);
      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "hello world" } });
      fireEvent.keyDown(input, { key: "Enter" });
      expect(onCommand).toHaveBeenCalledWith("hello world");
    });

    it("does not call onCommand for empty input", () => {
      const onCommand = vi.fn();
      render(<Terminal interactive onCommand={onCommand} />);
      const input = screen.getByRole("textbox");
      fireEvent.keyDown(input, { key: "Enter" });
      expect(onCommand).not.toHaveBeenCalled();
    });

    it("does not call onCommand for whitespace-only input", () => {
      const onCommand = vi.fn();
      render(<Terminal interactive onCommand={onCommand} />);
      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "   " } });
      fireEvent.keyDown(input, { key: "Enter" });
      expect(onCommand).not.toHaveBeenCalled();
    });

    it("clears input after submitting", () => {
      const onCommand = vi.fn();
      render(<Terminal interactive onCommand={onCommand} />);
      const input = screen.getByRole("textbox") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "test cmd" } });
      fireEvent.keyDown(input, { key: "Enter" });
      expect(input.value).toBe("");
    });

    it("navigates history with ArrowUp", () => {
      const onCommand = vi.fn();
      render(<Terminal interactive onCommand={onCommand} />);
      const input = screen.getByRole("textbox") as HTMLInputElement;

      // Submit two commands
      fireEvent.change(input, { target: { value: "first" } });
      fireEvent.keyDown(input, { key: "Enter" });
      fireEvent.change(input, { target: { value: "second" } });
      fireEvent.keyDown(input, { key: "Enter" });

      // ArrowUp should show "second"
      fireEvent.keyDown(input, { key: "ArrowUp" });
      expect(input.value).toBe("second");

      // ArrowUp again should show "first"
      fireEvent.keyDown(input, { key: "ArrowUp" });
      expect(input.value).toBe("first");
    });

    it("navigates history with ArrowDown", () => {
      const onCommand = vi.fn();
      render(<Terminal interactive onCommand={onCommand} />);
      const input = screen.getByRole("textbox") as HTMLInputElement;

      // Submit two commands
      fireEvent.change(input, { target: { value: "first" } });
      fireEvent.keyDown(input, { key: "Enter" });
      fireEvent.change(input, { target: { value: "second" } });
      fireEvent.keyDown(input, { key: "Enter" });

      // Go up to the beginning
      fireEvent.keyDown(input, { key: "ArrowUp" });
      fireEvent.keyDown(input, { key: "ArrowUp" });
      expect(input.value).toBe("first");

      // ArrowDown should go to "second"
      fireEvent.keyDown(input, { key: "ArrowDown" });
      expect(input.value).toBe("second");

      // ArrowDown past end should clear
      fireEvent.keyDown(input, { key: "ArrowDown" });
      expect(input.value).toBe("");
    });
  });

  describe("className merging", () => {
    it("accepts and merges custom className", () => {
      const { container } = render(<Terminal className="my-custom-class" />);
      expect(container.firstElementChild).toHaveClass("my-custom-class");
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to outer div", () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<Terminal ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("empty state", () => {
    it("renders without lines", () => {
      render(<Terminal />);
      expect(screen.getByRole("log")).toBeInTheDocument();
    });

    it("renders with empty lines array", () => {
      render(<Terminal lines={[]} />);
      expect(screen.getByRole("log")).toBeInTheDocument();
    });
  });
});
