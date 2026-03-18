import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Tooltip } from "../tooltip";

describe("Tooltip", () => {
  it("renders children", () => {
    render(
      <Tooltip content="Help text">
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("always renders tooltip element in DOM (CSS-driven visibility)", () => {
    render(
      <Tooltip content="Help text">
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    // The tooltip span is always in the DOM; visibility is controlled via CSS opacity
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Help text");
  });

  it("tooltip content matches the content prop", () => {
    render(
      <Tooltip content="My tooltip">
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByRole("tooltip")).toHaveTextContent("My tooltip");
  });

  it("sets aria-describedby on wrapper span linking to tooltip id", () => {
    render(
      <Tooltip content="Described">
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    const tooltip = screen.getByRole("tooltip");
    const triggerId = tooltip.id;
    expect(screen.getByText("Trigger").parentElement).toHaveAttribute(
      "aria-describedby",
      triggerId,
    );
  });

  it.each(["top", "bottom", "left", "right"] as const)(
    "applies position %s",
    (pos) => {
      render(
        <Tooltip content="Tip" position={pos}>
          <span>Target</span>
        </Tooltip>,
      );
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    },
  );

  it("applies dark variant by default", () => {
    render(
      <Tooltip content="Dark">
        <span>T</span>
      </Tooltip>,
    );
    expect(screen.getByRole("tooltip")).toHaveClass("bg-slate-900");
  });

  it("applies light variant", () => {
    render(
      <Tooltip content="Light" variant="light">
        <span>T</span>
      </Tooltip>,
    );
    expect(screen.getByRole("tooltip")).toHaveClass("bg-white");
  });

  it("forwards ref to wrapper span", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(
      <Tooltip ref={ref} content="Ref test">
        <span>Child</span>
      </Tooltip>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("merges className", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(
      <Tooltip ref={ref} content="Class" className="custom">
        <span>Child</span>
      </Tooltip>,
    );
    expect(ref.current).toHaveClass("custom");
  });

  it("has displayName", () => {
    expect(Tooltip.displayName).toBe("Tooltip");
  });

  it("renders with group-hover and group-focus-within classes for CSS visibility", () => {
    render(
      <Tooltip content="CSS driven">
        <span>T</span>
      </Tooltip>,
    );
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.className).toContain("group-hover:opacity-100");
    expect(tooltip.className).toContain("group-focus-within:opacity-100");
  });

  it("position top applies bottom-full", () => {
    render(
      <Tooltip content="Top" position="top">
        <span>T</span>
      </Tooltip>,
    );
    expect(screen.getByRole("tooltip")).toHaveClass("bottom-full");
  });

  it("position bottom applies top-full", () => {
    render(
      <Tooltip content="Bottom" position="bottom">
        <span>T</span>
      </Tooltip>,
    );
    expect(screen.getByRole("tooltip")).toHaveClass("top-full");
  });

  it("position left applies right-full", () => {
    render(
      <Tooltip content="Left" position="left">
        <span>T</span>
      </Tooltip>,
    );
    expect(screen.getByRole("tooltip")).toHaveClass("right-full");
  });

  it("position right applies left-full", () => {
    render(
      <Tooltip content="Right" position="right">
        <span>T</span>
      </Tooltip>,
    );
    expect(screen.getByRole("tooltip")).toHaveClass("left-full");
  });
});
