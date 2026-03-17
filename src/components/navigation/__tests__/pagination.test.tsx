import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Pagination } from "../pagination";

describe("Pagination", () => {
  it("shows page range info", () => {
    render(<Pagination total={100} pageSize={10} defaultCurrent={1} />);
    expect(screen.getByText("1-10")).toBeInTheDocument();
  });

  it("disables Previous on first page", () => {
    render(<Pagination total={100} pageSize={10} defaultCurrent={1} />);
    expect(screen.getByText("Previous")).toBeDisabled();
  });

  it("disables Next on last page", () => {
    render(<Pagination total={100} pageSize={10} defaultCurrent={10} />);
    expect(screen.getByText("Next")).toBeDisabled();
  });

  it("calls onPageChange when navigating", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination total={100} pageSize={10} defaultCurrent={1} onPageChange={onChange} />);
    await user.click(screen.getByText("Next"));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});
