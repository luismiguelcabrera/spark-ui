import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Affix } from "../affix";

describe("Affix", () => {
  it("renders without crashing", () => {
    render(<Affix>Content</Affix>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Affix ref={ref}>Content</Affix>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies className", () => {
    render(<Affix className="custom-affix">Content</Affix>);
    expect(screen.getByText("Content")).toHaveClass("custom-affix");
  });

  it("renders children", () => {
    render(
      <Affix>
        <button type="button">Scroll to top</button>
      </Affix>,
    );
    expect(screen.getByRole("button", { name: "Scroll to top" })).toBeInTheDocument();
  });

  // ── Fixed positioning ───────────────────────────────────────────────

  it("applies position: fixed style", () => {
    render(<Affix>Content</Affix>);
    const el = screen.getByText("Content");
    expect(el.style.position).toBe("fixed");
  });

  it("uses default position (bottom: 20, right: 20)", () => {
    render(<Affix>Content</Affix>);
    const el = screen.getByText("Content");
    expect(el.style.bottom).toBe("20px");
    expect(el.style.right).toBe("20px");
  });

  it("applies custom position offsets", () => {
    render(
      <Affix position={{ top: 10, left: 30 }}>Content</Affix>,
    );
    const el = screen.getByText("Content");
    expect(el.style.top).toBe("10px");
    expect(el.style.left).toBe("30px");
  });

  it("applies all four position offsets", () => {
    render(
      <Affix position={{ top: 5, bottom: 10, left: 15, right: 20 }}>
        Content
      </Affix>,
    );
    const el = screen.getByText("Content");
    expect(el.style.top).toBe("5px");
    expect(el.style.bottom).toBe("10px");
    expect(el.style.left).toBe("15px");
    expect(el.style.right).toBe("20px");
  });

  it("does not set position offsets that are undefined", () => {
    render(
      <Affix position={{ top: 10 }}>Content</Affix>,
    );
    const el = screen.getByText("Content");
    expect(el.style.top).toBe("10px");
    expect(el.style.bottom).toBe("");
    expect(el.style.left).toBe("");
    expect(el.style.right).toBe("");
  });

  // ── z-index ─────────────────────────────────────────────────────────

  it("uses default z-index of 100", () => {
    render(<Affix>Content</Affix>);
    const el = screen.getByText("Content");
    expect(el.style.zIndex).toBe("100");
  });

  it("accepts custom z-index", () => {
    render(<Affix zIndex={50}>Content</Affix>);
    const el = screen.getByText("Content");
    expect(el.style.zIndex).toBe("50");
  });

  // ── Portal ──────────────────────────────────────────────────────────

  it("renders into document.body via portal by default", () => {
    const { container } = render(
      <div data-testid="parent">
        <Affix>Portal Content</Affix>
      </div>,
    );
    // The affix should NOT be a child of the parent container
    const parent = screen.getByTestId("parent");
    expect(parent.querySelector("[data-affix]")).not.toBeInTheDocument();
    // But it should be in the body
    expect(document.body.querySelector("[data-affix]")).toBeInTheDocument();
  });

  it("renders inline when withinPortal is false", () => {
    render(
      <div data-testid="parent">
        <Affix withinPortal={false}>Inline Content</Affix>
      </div>,
    );
    const parent = screen.getByTestId("parent");
    expect(parent.querySelector("[data-affix]")).toBeInTheDocument();
  });

  // ── data-affix attribute ────────────────────────────────────────────

  it("has data-affix attribute", () => {
    render(<Affix>Content</Affix>);
    expect(document.body.querySelector("[data-affix]")).toBeInTheDocument();
  });

  // ── Position zero values ────────────────────────────────────────────

  it("handles position offset of 0 correctly", () => {
    render(
      <Affix position={{ top: 0, left: 0 }}>Content</Affix>,
    );
    const el = screen.getByText("Content");
    expect(el.style.top).toBe("0px");
    expect(el.style.left).toBe("0px");
  });
});
