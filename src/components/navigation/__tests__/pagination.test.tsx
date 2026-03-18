import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Pagination } from "../pagination";

describe("Pagination (simple variant)", () => {
  it("shows page range info", () => {
    render(<Pagination total={100} pageSize={10} defaultCurrent={1} />);
    expect(screen.getByText(/1-10/)).toBeInTheDocument();
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

  it("enables Previous when not on first page", () => {
    render(<Pagination total={100} pageSize={10} defaultCurrent={5} />);
    expect(screen.getByText("Previous")).not.toBeDisabled();
  });

  it("enables Next when not on last page", () => {
    render(<Pagination total={100} pageSize={10} defaultCurrent={5} />);
    expect(screen.getByText("Next")).not.toBeDisabled();
  });

  it("navigates backward with Previous", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination total={100} pageSize={10} defaultCurrent={5} onPageChange={onChange} />);
    await user.click(screen.getByText("Previous"));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("has aria-label='Pagination' on nav", () => {
    render(<Pagination total={100} pageSize={10} defaultCurrent={1} />);
    expect(screen.getByLabelText("Pagination")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLElement | null };
    render(<Pagination ref={ref} total={100} pageSize={10} defaultCurrent={1} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("NAV");
  });

  it("merges className", () => {
    const ref = { current: null as HTMLElement | null };
    render(<Pagination ref={ref} total={100} pageSize={10} defaultCurrent={1} className="custom" />);
    expect(ref.current).toHaveClass("custom");
  });
});

describe("Pagination (numbered variant)", () => {
  it("renders Previous and Next icon buttons", () => {
    render(<Pagination total={100} pageSize={10} defaultCurrent={1} variant="numbered" />);
    expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
    expect(screen.getByLabelText("Next page")).toBeInTheDocument();
  });

  it("disables Previous page on first page", () => {
    render(<Pagination total={100} pageSize={10} defaultCurrent={1} variant="numbered" />);
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
  });

  it("disables Next page on last page", () => {
    render(<Pagination total={100} pageSize={10} defaultCurrent={10} variant="numbered" />);
    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });

  it("shows page range info with toLocaleString formatting", () => {
    render(<Pagination total={1000} pageSize={10} defaultCurrent={1} variant="numbered" />);
    expect(screen.getByText(/1,000/)).toBeInTheDocument();
  });

  it("navigates forward with Next", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination total={100} pageSize={10} defaultCurrent={1} variant="numbered" onPageChange={onChange} />);
    await user.click(screen.getByLabelText("Next page"));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("navigates backward with Previous", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination total={100} pageSize={10} defaultCurrent={5} variant="numbered" onPageChange={onChange} />);
    await user.click(screen.getByLabelText("Previous page"));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("has focus-visible ring styles on buttons", () => {
    render(<Pagination total={100} pageSize={10} defaultCurrent={1} variant="numbered" />);
    const nextBtn = screen.getByLabelText("Next page");
    expect(nextBtn).toHaveClass("focus-visible:ring-2");
  });
});

describe("Pagination — displayName", () => {
  it("has displayName", () => {
    expect(Pagination.displayName).toBe("Pagination");
  });
});
