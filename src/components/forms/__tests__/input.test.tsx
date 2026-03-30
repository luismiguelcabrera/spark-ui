import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Input } from "../input";

describe("Input", () => {
  it("renders a text input by default", () => {
    render(<Input placeholder="Name" />);
    expect(screen.getByPlaceholderText("Name")).toHaveAttribute("type", "text");
  });

  it("renders with a label", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows an error message", () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("shows hint when no error", () => {
    render(<Input label="Email" hint="We won't share it" />);
    expect(screen.getByText("We won't share it")).toBeInTheDocument();
  });

  it("hides hint when error is present", () => {
    render(<Input label="Email" hint="Helpful" error="Bad" />);
    expect(screen.queryByText("Helpful")).not.toBeInTheDocument();
    expect(screen.getByText("Bad")).toBeInTheDocument();
  });

  it("handles user typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input placeholder="Type" onChange={onChange} />);
    await user.type(screen.getByPlaceholderText("Type"), "hello");
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  // ── Variant tests ─────────────────────────────────────────────────────

  describe("variants", () => {
    it.each(["outlined", "filled", "underlined"] as const)(
      "renders with variant=%s without error",
      (variant) => {
        render(<Input variant={variant} placeholder="Test" />);
        expect(screen.getByPlaceholderText("Test")).toBeInTheDocument();
      },
    );

    it("applies filled styles", () => {
      render(<Input variant="filled" placeholder="Test" />);
      const input = screen.getByPlaceholderText("Test");
      expect(input.className).toContain("bg-slate-100");
    });

    it("applies underlined styles", () => {
      render(<Input variant="underlined" placeholder="Test" />);
      const input = screen.getByPlaceholderText("Test");
      expect(input.className).toContain("border-b-2");
    });
  });

  // ── Clearable tests ───────────────────────────────────────────────────

  describe("clearable", () => {
    it("shows clear button when clearable and has value", () => {
      render(
        <Input clearable value="hello" onChange={() => {}} label="Name" />,
      );
      expect(screen.getByLabelText("Clear input")).toBeInTheDocument();
    });

    it("does not show clear button when value is empty", () => {
      render(
        <Input clearable value="" onChange={() => {}} label="Name" />,
      );
      expect(screen.queryByLabelText("Clear input")).not.toBeInTheDocument();
    });

    it("calls onChange when clear button is clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <Input clearable value="hello" onChange={onChange} label="Name" />,
      );
      await user.click(screen.getByLabelText("Clear input"));
      expect(onChange).toHaveBeenCalledOnce();
    });
  });

  // ── Loading tests ─────────────────────────────────────────────────────

  describe("loading", () => {
    it("shows spinner when loading", () => {
      render(<Input loading label="Search" />);
      expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    });

    it("sets aria-busy when loading", () => {
      render(<Input loading label="Search" />);
      expect(screen.getByLabelText("Search")).toHaveAttribute("aria-busy", "true");
    });

    it("does not show clear button when loading even if clearable", () => {
      render(
        <Input clearable loading value="hello" onChange={() => {}} label="Name" />,
      );
      expect(screen.queryByLabelText("Clear input")).not.toBeInTheDocument();
      expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    });
  });
});
