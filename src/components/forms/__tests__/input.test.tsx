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

  // ── Error / ARIA tests ──────────────────────────────────────────────

  describe("error state", () => {
    it("sets aria-invalid when error is present", () => {
      render(<Input label="Email" error="Required" />);
      expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    });

    it("does not set aria-invalid when no error", () => {
      render(<Input label="Email" />);
      expect(screen.getByLabelText("Email")).not.toHaveAttribute("aria-invalid");
    });

    it("renders error with role=alert", () => {
      render(<Input label="Email" error="Required" />);
      expect(screen.getByRole("alert")).toHaveTextContent("Required");
    });

    it("adds error border class", () => {
      render(<Input label="Email" error="Required" />);
      expect(screen.getByLabelText("Email").className).toContain("border-destructive");
    });
  });

  // ── Icon tests ──────────────────────────────────────────────────────

  describe("icon", () => {
    it("renders icon on the right by default", () => {
      const { container } = render(<Input label="Search" icon="search" />);
      const iconEl = container.querySelector("[aria-hidden='true']");
      expect(iconEl).toBeInTheDocument();
    });

    it("renders icon on the left when iconPosition='left'", () => {
      const { container } = render(<Input label="Search" icon="search" iconPosition="left" />);
      const iconEl = container.querySelector("[aria-hidden='true']");
      expect(iconEl).toBeInTheDocument();
    });

    it("adds left padding when icon is on the left", () => {
      render(<Input label="Search" icon="search" iconPosition="left" />);
      expect(screen.getByLabelText("Search").className).toContain("pl-11");
    });

    it("adds right padding when icon is on the right", () => {
      render(<Input label="Search" icon="search" />);
      expect(screen.getByLabelText("Search").className).toContain("pr-11");
    });
  });

  // ── Simple mode (no wrapper) ────────────────────────────────────────

  describe("simple mode", () => {
    it("renders a raw input when no label, icon, error, or hint", () => {
      const { container } = render(<Input placeholder="Simple" />);
      // Should not wrap in div with flex-col
      expect(container.querySelector(".flex.flex-col")).not.toBeInTheDocument();
      expect(screen.getByPlaceholderText("Simple").tagName).toBe("INPUT");
    });

    it("wraps in div when label is provided", () => {
      const { container } = render(<Input label="Name" placeholder="Simple" />);
      expect(container.querySelector(".flex.flex-col")).toBeInTheDocument();
    });
  });
});
