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

  // ── Indeterminate tests ───────────────────────────────────────────────

  describe("indeterminate", () => {
    it("sets indeterminate property on the DOM element", () => {
      const ref = { current: null as HTMLInputElement | null };
      render(<Checkbox ref={ref} indeterminate />);
      expect(ref.current?.indeterminate).toBe(true);
    });

    it("sets aria-checked to mixed when indeterminate", () => {
      render(<Checkbox indeterminate />);
      expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "mixed");
    });

    it("does not set aria-checked to mixed when not indeterminate", () => {
      render(<Checkbox />);
      expect(screen.getByRole("checkbox")).not.toHaveAttribute("aria-checked", "mixed");
    });

    it("sets indeterminate with label", () => {
      const ref = { current: null as HTMLInputElement | null };
      render(<Checkbox ref={ref} indeterminate label="Select all" id="selectall" />);
      expect(ref.current?.indeterminate).toBe(true);
      expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "mixed");
    });
  });

  // ── Color tests ───────────────────────────────────────────────────────

  describe("color", () => {
    it.each(["primary", "secondary", "success", "warning", "destructive"] as const)(
      "renders with color=%s without error",
      (color) => {
        render(<Checkbox color={color} />);
        expect(screen.getByRole("checkbox")).toBeInTheDocument();
      },
    );

    it("applies success color classes", () => {
      render(<Checkbox color="success" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox.className).toContain("text-green-600");
    });

    it("applies destructive color classes", () => {
      render(<Checkbox color="destructive" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox.className).toContain("text-red-600");
    });

    it("defaults to primary color", () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox.className).toContain("text-primary");
    });
  });
});
