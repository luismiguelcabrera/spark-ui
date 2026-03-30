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

  // ── Variant tests ─────────────────────────────────────────────────────

  describe("variants", () => {
    it.each(["outlined", "filled", "underlined"] as const)(
      "renders with variant=%s without error",
      (variant) => {
        const { container } = render(
          <Select variant={variant}>
            <option value="a">Alpha</option>
          </Select>,
        );
        expect(container.querySelector("select")).toBeInTheDocument();
      },
    );

    it("applies filled styles", () => {
      render(
        <Select variant="filled">
          <option value="a">Alpha</option>
        </Select>,
      );
      const select = screen.getByRole("combobox");
      expect(select.className).toContain("bg-slate-100");
    });

    it("applies underlined styles", () => {
      render(
        <Select variant="underlined">
          <option value="a">Alpha</option>
        </Select>,
      );
      const select = screen.getByRole("combobox");
      expect(select.className).toContain("border-b-2");
    });
  });

  // ── Clearable tests ───────────────────────────────────────────────────

  describe("clearable", () => {
    it("shows clear button when clearable and has value", () => {
      render(
        <Select clearable value="a" onChange={() => {}}>
          <option value="">--</option>
          <option value="a">Alpha</option>
        </Select>,
      );
      expect(screen.getByLabelText("Clear selection")).toBeInTheDocument();
    });

    it("does not show clear button when value is empty", () => {
      render(
        <Select clearable value="" onChange={() => {}}>
          <option value="">--</option>
          <option value="a">Alpha</option>
        </Select>,
      );
      expect(screen.queryByLabelText("Clear selection")).not.toBeInTheDocument();
    });

    it("calls onClear when clear button is clicked", async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();
      render(
        <Select clearable value="a" onClear={onClear} onChange={() => {}}>
          <option value="">--</option>
          <option value="a">Alpha</option>
        </Select>,
      );
      await user.click(screen.getByLabelText("Clear selection"));
      expect(onClear).toHaveBeenCalledOnce();
    });
  });

  // ── Loading tests ─────────────────────────────────────────────────────

  describe("loading", () => {
    it("shows spinner when loading", () => {
      render(
        <Select loading>
          <option value="a">Alpha</option>
        </Select>,
      );
      expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    });

    it("disables select when loading", () => {
      render(
        <Select loading>
          <option value="a">Alpha</option>
        </Select>,
      );
      expect(screen.getByRole("combobox")).toBeDisabled();
    });

    it("sets aria-busy when loading", () => {
      render(
        <Select loading>
          <option value="a">Alpha</option>
        </Select>,
      );
      expect(screen.getByRole("combobox")).toHaveAttribute("aria-busy", "true");
    });
  });
});
