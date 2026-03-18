import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Select } from "../select";

describe("Select", () => {
  it("renders a select with options", () => {
    render(
      <Select>
        <option value="a">Alpha</option>
        <option value="b">Beta</option>
      </Select>,
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("fires onChange when selection changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select onChange={onChange}>
        <option value="a">Alpha</option>
        <option value="b">Beta</option>
      </Select>,
    );
    await user.selectOptions(screen.getByRole("combobox"), "b");
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("shows error", () => {
    render(
      <Select error="Pick one">
        <option value="">--</option>
      </Select>,
    );
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLSelectElement | null };
    render(
      <Select ref={ref}>
        <option>X</option>
      </Select>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  // ── Error / ARIA tests ──────────────────────────────────────────────

  describe("error state", () => {
    it("sets aria-invalid when error is present", () => {
      render(
        <Select error="Required">
          <option value="">--</option>
        </Select>,
      );
      expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
    });

    it("does not set aria-invalid when no error", () => {
      render(
        <Select>
          <option value="">--</option>
        </Select>,
      );
      expect(screen.getByRole("combobox")).not.toHaveAttribute("aria-invalid");
    });

    it("renders error with role=alert", () => {
      render(
        <Select error="Required">
          <option value="">--</option>
        </Select>,
      );
      expect(screen.getByRole("alert")).toHaveTextContent("Required");
    });

    it("adds error border class", () => {
      render(
        <Select error="Required">
          <option value="">--</option>
        </Select>,
      );
      expect(screen.getByRole("combobox").className).toContain("border-red-300");
    });
  });

  // ── Styling ─────────────────────────────────────────────────────────

  describe("styling", () => {
    it("has appearance-none class", () => {
      render(
        <Select>
          <option value="a">Alpha</option>
        </Select>,
      );
      expect(screen.getByRole("combobox").className).toContain("appearance-none");
    });

    it("renders the chevron icon", () => {
      const { container } = render(
        <Select>
          <option value="a">Alpha</option>
        </Select>,
      );
      const iconSpan = container.querySelector("[aria-hidden='true']");
      expect(iconSpan).toBeInTheDocument();
      expect(iconSpan?.textContent).toBe("expand_more");
    });

    it("merges custom className", () => {
      render(
        <Select className="my-class">
          <option value="a">Alpha</option>
        </Select>,
      );
      expect(screen.getByRole("combobox")).toHaveClass("my-class");
    });
  });
});
