import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FilterBar } from "../filter-bar";

const filters = [
  { label: "Design", value: "design" },
  { label: "Engineering", value: "engineering" },
  { label: "Marketing", value: "marketing" },
];

describe("FilterBar", () => {
  it("renders all filter chips", () => {
    render(<FilterBar filters={filters} />);
    expect(screen.getByText("Design")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Marketing")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<FilterBar ref={ref} filters={filters} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(FilterBar.displayName).toBe("FilterBar");
  });

  it("merges className", () => {
    render(<FilterBar filters={filters} className="custom" />);
    expect(screen.getByRole("group")).toHaveClass("custom");
  });

  it("has role='group' with aria-label", () => {
    render(<FilterBar filters={filters} />);
    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("aria-label", "Filters");
  });

  it("supports custom aria-label", () => {
    render(<FilterBar filters={filters} aria-label="Categories" />);
    expect(screen.getByRole("group")).toHaveAttribute("aria-label", "Categories");
  });

  it("toggles filter on click", () => {
    const onFilterChange = vi.fn();
    render(<FilterBar filters={filters} onFilterChange={onFilterChange} />);
    fireEvent.click(screen.getByText("Design"));
    expect(onFilterChange).toHaveBeenCalledWith(["design"]);
  });

  it("sets aria-pressed on active filters", () => {
    render(<FilterBar filters={filters} activeValues={["design"]} />);
    const designBtn = screen.getByText("Design").closest("button")!;
    expect(designBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("shows clear all button when filters are active", () => {
    render(<FilterBar filters={filters} activeValues={["design"]} showClearAll />);
    expect(screen.getByText("Clear all")).toBeInTheDocument();
  });

  it("hides clear all when no filters are active", () => {
    render(<FilterBar filters={filters} activeValues={[]} showClearAll />);
    expect(screen.queryByText("Clear all")).not.toBeInTheDocument();
  });

  it("calls onFilterChange with empty array on clear all", () => {
    const onFilterChange = vi.fn();
    render(
      <FilterBar
        filters={filters}
        activeValues={["design"]}
        onFilterChange={onFilterChange}
        showClearAll
      />,
    );
    fireEvent.click(screen.getByText("Clear all"));
    expect(onFilterChange).toHaveBeenCalledWith([]);
  });
});
