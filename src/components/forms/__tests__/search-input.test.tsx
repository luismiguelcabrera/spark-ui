import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SearchInput } from "../search-input";

describe("SearchInput", () => {
  it("renders a search input", () => {
    render(<SearchInput placeholder="Search..." />);
    expect(screen.getByPlaceholderText("Search...")).toHaveAttribute("type", "search");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<SearchInput ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it("has displayName", () => {
    expect(SearchInput.displayName).toBe("SearchInput");
  });

  it("merges className on wrapper", () => {
    render(<SearchInput className="custom" />);
    expect(screen.getByRole("search")).toHaveClass("custom");
  });

  it("has role='search' on wrapper", () => {
    render(<SearchInput />);
    expect(screen.getByRole("search")).toBeInTheDocument();
  });

  it("does not show clear button when value is empty", () => {
    render(<SearchInput value="" onClear={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
  });

  it("shows clear button when value is present and onClear is provided", () => {
    render(<SearchInput value="test" onClear={vi.fn()} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
  });

  it("calls onClear when clear button is clicked", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<SearchInput value="query" onClear={onClear} onChange={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("does not show clear button when onClear is not provided", () => {
    render(<SearchInput value="test" onChange={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
  });
});
