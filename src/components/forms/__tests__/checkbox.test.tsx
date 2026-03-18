import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Checkbox } from "../checkbox";

describe("Checkbox", () => {
  it("renders a checkbox", () => {
    render(<Checkbox />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders with a label", () => {
    render(<Checkbox label="Accept terms" id="terms" />);
    expect(screen.getByLabelText("Accept terms")).toBeInTheDocument();
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange} />);
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("shows error message", () => {
    render(<Checkbox error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  // ── Error / aria-invalid ────────────────────────────────────────────

  describe("error state", () => {
    it("sets aria-invalid when error is present", () => {
      render(<Checkbox error="Required" />);
      expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true");
    });

    it("does not set aria-invalid when no error", () => {
      render(<Checkbox />);
      expect(screen.getByRole("checkbox")).not.toHaveAttribute("aria-invalid");
    });

    it("renders error with role=alert", () => {
      render(<Checkbox error="Required" />);
      expect(screen.getByRole("alert")).toHaveTextContent("Required");
    });

    it("applies error border class when error is present", () => {
      render(<Checkbox error="Required" />);
      expect(screen.getByRole("checkbox").className).toContain("border-red-300");
    });
  });

  // ── Default color ───────────────────────────────────────────────────

  describe("default styling", () => {
    it("defaults to primary text color", () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox.className).toContain("text-primary");
    });

    it("has focus-visible ring classes", () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox.className).toContain("focus-visible:ring-2");
      expect(checkbox.className).toContain("focus-visible:ring-offset-2");
    });

    it("has disabled styles", () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox.className).toContain("disabled:opacity-50");
      expect(checkbox.className).toContain("disabled:cursor-not-allowed");
    });

    it("has transition-colors class", () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox.className).toContain("transition-colors");
    });
  });

  // ── Label rendering ─────────────────────────────────────────────────

  describe("label", () => {
    it("wraps input in label when label prop is provided", () => {
      render(<Checkbox label="Accept" id="accept" />);
      const label = screen.getByText("Accept");
      expect(label).toBeInTheDocument();
    });

    it("auto-generates id when label is provided without id", () => {
      render(<Checkbox label="Accept" />);
      expect(screen.getByLabelText("Accept")).toBeInTheDocument();
    });
  });
});
