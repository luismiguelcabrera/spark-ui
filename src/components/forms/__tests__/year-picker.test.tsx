import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { YearPicker } from "../year-picker";

describe("YearPicker", () => {
  it("renders trigger button with placeholder", () => {
    render(<YearPicker />);
    expect(screen.getByText("Select year")).toBeInTheDocument();
  });

  it("opens popup on click", async () => {
    const user = userEvent.setup();
    render(<YearPicker />);
    await user.click(screen.getByText("Select year"));
    expect(screen.getByLabelText("Previous decade")).toBeInTheDocument();
    expect(screen.getByLabelText("Next decade")).toBeInTheDocument();
  });

  it("closes on outside click", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <YearPicker />
        <button>Outside</button>
      </div>,
    );
    await user.click(screen.getByText("Select year"));
    expect(screen.getByLabelText("Previous decade")).toBeInTheDocument();
    await user.click(screen.getByText("Outside"));
    expect(screen.queryByLabelText("Previous decade")).not.toBeInTheDocument();
  });

  it("selects year and calls onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const currentYear = new Date().getFullYear();
    render(<YearPicker onChange={onChange} />);
    await user.click(screen.getByText("Select year"));
    // The current decade will show; click the first year in the grid
    const decadeStart = Math.floor(currentYear / 10) * 10;
    await user.click(screen.getByText(String(decadeStart)));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(decadeStart);
  });

  it("navigates decades with prev/next", async () => {
    const user = userEvent.setup();
    render(<YearPicker defaultValue={2025} />);
    await user.click(screen.getByRole("button", { name: /2025/ }));
    // Decade starts at 2020, ends at 2031 — check the header text
    const header = screen.getByText(/2020\s.*\s2031/);
    expect(header).toBeInTheDocument();
    await user.click(screen.getByLabelText("Next decade"));
    const nextHeader = screen.getByText(/2030\s.*\s2041/);
    expect(nextHeader).toBeInTheDocument();
  });

  it("shows selected year", () => {
    render(<YearPicker value={2026} />);
    expect(screen.getByText("2026")).toBeInTheDocument();
  });

  it("disables years outside minYear/maxYear", async () => {
    const user = userEvent.setup();
    render(<YearPicker defaultValue={2025} minYear={2022} maxYear={2028} />);
    // Trigger button shows "2025" — click it to open
    await user.click(screen.getByRole("button", { name: /2025/ }));
    // 2020 and 2021 should be disabled (below minYear)
    expect(screen.getByRole("button", { name: "2020" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "2021" })).toBeDisabled();
    // 2029, 2030, 2031 should be disabled (above maxYear)
    expect(screen.getByRole("button", { name: "2029" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "2030" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "2031" })).toBeDisabled();
    // 2025 should not be disabled — use role to target the grid button, not the trigger
    const yearButtons = screen.getAllByRole("button", { name: "2025" });
    const gridButton = yearButtons.find((btn) => !btn.hasAttribute("aria-expanded"));
    expect(gridButton).not.toBeDisabled();
  });

  it("disabled prop prevents interaction", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<YearPicker disabled onChange={onChange} />);
    await user.click(screen.getByText("Select year"));
    expect(screen.queryByLabelText("Previous decade")).not.toBeInTheDocument();
  });

  it("error message renders", () => {
    render(<YearPicker error="Year is required" />);
    expect(screen.getByText("Year is required")).toBeInTheDocument();
  });

  it("displayName is set", () => {
    expect(YearPicker.displayName).toBe("YearPicker");
  });

  it("merges className", () => {
    const { container } = render(<YearPicker className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
