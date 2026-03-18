import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { Masonry } from "../masonry";

describe("Masonry", () => {
  it("renders children", () => {
    render(
      <Masonry>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Masonry>
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  it("applies default column count of 3", () => {
    render(
      <Masonry>
        <div>A</div>
      </Masonry>
    );
    const el = screen.getByTestId("masonry");
    expect(el.style.columnCount).toBe("3");
  });

  it("applies custom column count", () => {
    render(
      <Masonry columns={4}>
        <div>A</div>
      </Masonry>
    );
    const el = screen.getByTestId("masonry");
    expect(el.style.columnCount).toBe("4");
  });

  it("applies default gap of 16px", () => {
    render(
      <Masonry>
        <div>A</div>
      </Masonry>
    );
    const el = screen.getByTestId("masonry");
    expect(el.style.columnGap).toBe("16px");
  });

  it("applies custom gap", () => {
    render(
      <Masonry gap={24}>
        <div>A</div>
      </Masonry>
    );
    const el = screen.getByTestId("masonry");
    expect(el.style.columnGap).toBe("24px");
  });

  it("wraps each child in a container with break-inside avoid", () => {
    render(
      <Masonry>
        <div>Item 1</div>
        <div>Item 2</div>
      </Masonry>
    );
    const masonry = screen.getByTestId("masonry");
    const wrappers = masonry.children;
    expect(wrappers).toHaveLength(2);
    expect((wrappers[0] as HTMLElement).style.breakInside).toBe("avoid");
    expect((wrappers[1] as HTMLElement).style.breakInside).toBe("avoid");
  });

  it("applies margin-bottom gap to item wrappers", () => {
    render(
      <Masonry gap={20}>
        <div>Item 1</div>
      </Masonry>
    );
    const masonry = screen.getByTestId("masonry");
    const wrapper = masonry.children[0] as HTMLElement;
    expect(wrapper.style.marginBottom).toBe("20px");
  });

  it("applies className", () => {
    render(
      <Masonry className="custom-class">
        <div>A</div>
      </Masonry>
    );
    const el = screen.getByTestId("masonry");
    expect(el).toHaveClass("custom-class");
  });

  it("renders with responsive columns (object)", () => {
    const { container } = render(
      <Masonry columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}>
        <div>A</div>
        <div>B</div>
      </Masonry>
    );
    // Should generate a <style> tag for responsive columns
    const styleTag = container.querySelector("style");
    expect(styleTag).toBeInTheDocument();
    expect(styleTag!.innerHTML).toContain("column-count");
  });

  it("responsive columns include correct media queries", () => {
    const { container } = render(
      <Masonry columns={{ sm: 1, md: 2, lg: 3 }}>
        <div>A</div>
      </Masonry>
    );
    const styleTag = container.querySelector("style");
    expect(styleTag!.innerHTML).toContain("640px");
    expect(styleTag!.innerHTML).toContain("768px");
    expect(styleTag!.innerHTML).toContain("1024px");
  });

  it("responsive columns do not include breakpoints not specified", () => {
    const { container } = render(
      <Masonry columns={{ sm: 2, lg: 4 }}>
        <div>A</div>
      </Masonry>
    );
    const styleTag = container.querySelector("style");
    expect(styleTag!.innerHTML).toContain("640px");
    expect(styleTag!.innerHTML).toContain("1024px");
    expect(styleTag!.innerHTML).not.toContain("768px");
    expect(styleTag!.innerHTML).not.toContain("1280px");
  });

  it("does not render style tag for fixed columns", () => {
    const { container } = render(
      <Masonry columns={3}>
        <div>A</div>
      </Masonry>
    );
    const styleTag = container.querySelector("style");
    expect(styleTag).not.toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Masonry ref={ref}>
        <div>A</div>
      </Masonry>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(Masonry.displayName).toBe("Masonry");
  });

  it("passes additional HTML attributes", () => {
    render(
      <Masonry data-custom="test" id="my-masonry">
        <div>A</div>
      </Masonry>
    );
    const el = document.getElementById("my-masonry");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("data-custom", "test");
  });

  it("renders empty children gracefully", () => {
    render(<Masonry>{[]}</Masonry>);
    const el = screen.getByTestId("masonry");
    expect(el.children).toHaveLength(0);
  });

  it("renders single column", () => {
    render(
      <Masonry columns={1}>
        <div>A</div>
        <div>B</div>
      </Masonry>
    );
    const el = screen.getByTestId("masonry");
    expect(el.style.columnCount).toBe("1");
  });

  it("merges custom style prop with inline styles", () => {
    render(
      <Masonry columns={2} style={{ backgroundColor: "red" }}>
        <div>A</div>
      </Masonry>
    );
    const el = screen.getByTestId("masonry");
    expect(el.style.backgroundColor).toBe("red");
    expect(el.style.columnCount).toBe("2");
  });
});
