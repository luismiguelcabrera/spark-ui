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

describe("Pagination — showFirstLast prop", () => {
  it("shows First and Last buttons in simple variant", () => {
    render(<Pagination total={100} pageSize={10} defaultCurrent={5} showFirstLast />);
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Last")).toBeInTheDocument();
  });

  it("does not show First/Last buttons by default", () => {
    render(<Pagination total={100} pageSize={10} defaultCurrent={5} />);
    expect(screen.queryByText("First")).not.toBeInTheDocument();
    expect(screen.queryByText("Last")).not.toBeInTheDocument();
  });

  it("First button navigates to page 1", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Pagination total={100} pageSize={10} defaultCurrent={5} showFirstLast onPageChange={onChange} />,
    );
    await user.click(screen.getByText("First"));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("Last button navigates to last page", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Pagination total={100} pageSize={10} defaultCurrent={5} showFirstLast onPageChange={onChange} />,
    );
    await user.click(screen.getByText("Last"));
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it("First button is disabled on first page", () => {
    render(<Pagination total={100} pageSize={10} defaultCurrent={1} showFirstLast />);
    expect(screen.getByText("First")).toBeDisabled();
  });

  it("Last button is disabled on last page", () => {
    render(<Pagination total={100} pageSize={10} defaultCurrent={10} showFirstLast />);
    expect(screen.getByText("Last")).toBeDisabled();
  });

  it("shows first/last buttons in numbered variant", () => {
    render(
      <Pagination total={100} pageSize={10} defaultCurrent={5} variant="numbered" showFirstLast />,
    );
    expect(screen.getByLabelText("First page")).toBeInTheDocument();
    expect(screen.getByLabelText("Last page")).toBeInTheDocument();
  });

  it("first page button is disabled on page 1 in numbered variant", () => {
    render(
      <Pagination total={100} pageSize={10} defaultCurrent={1} variant="numbered" showFirstLast />,
    );
    expect(screen.getByLabelText("First page")).toBeDisabled();
  });

  it("last page button is disabled on last page in numbered variant", () => {
    render(
      <Pagination total={100} pageSize={10} defaultCurrent={10} variant="numbered" showFirstLast />,
    );
    expect(screen.getByLabelText("Last page")).toBeDisabled();
  });
});

describe("Pagination — rounded prop", () => {
  it("applies rounded-full class when rounded is true", () => {
    render(<Pagination total={100} pageSize={10} defaultCurrent={1} rounded />);
    const prevButton = screen.getByText("Previous");
    expect(prevButton).toHaveClass("rounded-full");
  });

  it("applies rounded-lg class when rounded is false (default)", () => {
    render(<Pagination total={100} pageSize={10} defaultCurrent={1} />);
    const prevButton = screen.getByText("Previous");
    expect(prevButton).toHaveClass("rounded-lg");
  });
});

describe("Pagination — size prop", () => {
  it.each([
    ["sm", "h-7"],
    ["md", "h-8"],
    ["lg", "h-10"],
  ] as const)("applies %s size styles in numbered variant", (size, expectedClass) => {
    render(
      <Pagination total={100} pageSize={10} defaultCurrent={1} variant="numbered" size={size} />,
    );
    const prevButton = screen.getByLabelText("Previous page");
    expect(prevButton).toHaveClass(expectedClass);
  });

  it("defaults to md size", () => {
    render(
      <Pagination total={100} pageSize={10} defaultCurrent={1} variant="numbered" />,
    );
    const prevButton = screen.getByLabelText("Previous page");
    expect(prevButton).toHaveClass("h-8");
  });
});

describe("Pagination — activeColor prop", () => {
  it("applies custom activeColor to the current page button", () => {
    render(
      <Pagination
        total={100}
        pageSize={10}
        defaultCurrent={3}
        variant="numbered"
        activeColor="bg-blue-600"
      />,
    );
    const activePage = screen.getByLabelText("Page 3");
    expect(activePage).toHaveClass("bg-blue-600");
    expect(activePage).toHaveClass("text-white");
  });

  it("uses bg-primary by default for active page", () => {
    render(
      <Pagination total={100} pageSize={10} defaultCurrent={1} variant="numbered" />,
    );
    const activePage = screen.getByLabelText("Page 1");
    expect(activePage).toHaveClass("bg-primary");
  });
});

describe("Pagination — numbered variant page buttons", () => {
  it("renders page number buttons", () => {
    render(
      <Pagination total={50} pageSize={10} defaultCurrent={1} variant="numbered" />,
    );
    expect(screen.getByLabelText("Page 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Page 5")).toBeInTheDocument();
  });

  it("marks current page with aria-current=page", () => {
    render(
      <Pagination total={50} pageSize={10} defaultCurrent={3} variant="numbered" />,
    );
    const page3 = screen.getByLabelText("Page 3");
    expect(page3).toHaveAttribute("aria-current", "page");
  });

  it("clicking a page number navigates to that page", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Pagination
        total={50}
        pageSize={10}
        defaultCurrent={1}
        variant="numbered"
        onPageChange={onChange}
      />,
    );
    await user.click(screen.getByLabelText("Page 3"));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("shows ellipsis for many pages", () => {
    render(
      <Pagination total={200} pageSize={10} defaultCurrent={10} variant="numbered" />,
    );
    // With 20 pages and current=10, there should be ellipsis markers
    const dots = screen.getAllByText("...");
    expect(dots.length).toBeGreaterThanOrEqual(1);
  });
});
