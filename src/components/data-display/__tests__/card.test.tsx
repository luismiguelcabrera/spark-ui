import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Card } from "../card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Content</Card>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders title and subtitle", () => {
    render(<Card title="Title" subtitle="Subtitle">Body</Card>);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Subtitle")).toBeInTheDocument();
  });

  it("renders footer", () => {
    render(<Card footer={<span>Footer</span>}>Body</Card>);
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders actions when title is provided", () => {
    render(
      <Card title="Card" actions={<button>Edit</button>}>
        Body
      </Card>,
    );
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Card ref={ref}>Ref</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // --- New: loading prop ---
  describe("loading prop", () => {
    it("renders a loading overlay", () => {
      render(<Card loading>Content</Card>);
      expect(screen.getByTestId("card-loading-overlay")).toBeInTheDocument();
    });

    it("sets aria-busy when loading", () => {
      render(<Card loading>Content</Card>);
      const card = screen.getByText("Content").closest("[aria-busy]");
      expect(card).toHaveAttribute("aria-busy", "true");
    });

    it("does not render overlay when not loading", () => {
      render(<Card>Content</Card>);
      expect(screen.queryByTestId("card-loading-overlay")).not.toBeInTheDocument();
    });

    it("renders loading overlay with title mode", () => {
      render(<Card loading title="Title">Content</Card>);
      expect(screen.getByTestId("card-loading-overlay")).toBeInTheDocument();
    });
  });

  // --- New: hoverable prop ---
  describe("hoverable prop", () => {
    it("applies hover shadow classes", () => {
      const { container } = render(<Card hoverable>Content</Card>);
      const card = container.firstElementChild as HTMLElement;
      expect(card.className).toContain("hover:shadow-lg");
      expect(card.className).toContain("hover:-translate-y-0.5");
    });
  });

  // --- New: clickable prop ---
  describe("clickable prop", () => {
    it("adds cursor-pointer class", () => {
      const { container } = render(<Card clickable>Content</Card>);
      const card = container.firstElementChild as HTMLElement;
      expect(card.className).toContain("cursor-pointer");
    });

    it("sets role=button and tabIndex=0", () => {
      render(<Card clickable>Content</Card>);
      const btn = screen.getByRole("button");
      expect(btn).toBeInTheDocument();
      expect(btn).toHaveAttribute("tabindex", "0");
    });

    it("does not set role when not clickable", () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.querySelector("[role='button']")).not.toBeInTheDocument();
    });
  });

  // --- New: onClick handler ---
  describe("onClick handler", () => {
    it("fires onClick callback", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <Card clickable onClick={handleClick}>
          Content
        </Card>,
      );
      fireEvent.click(container.firstElementChild!);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
