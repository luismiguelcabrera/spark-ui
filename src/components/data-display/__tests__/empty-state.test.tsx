import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EmptyState } from "../empty-state";

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState title="No items" />);
    expect(screen.getByText("No items")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<EmptyState ref={ref} title="Empty" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(EmptyState.displayName).toBe("EmptyState");
  });

  it("merges className", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<EmptyState ref={ref} title="Empty" className="custom-empty" />);
    expect(ref.current?.className).toContain("custom-empty");
  });

  it("renders description when provided", () => {
    render(<EmptyState title="No items" description="Try adding some items." />);
    expect(screen.getByText("Try adding some items.")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    const { container } = render(<EmptyState title="No items" />);
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs.length).toBe(0);
  });

  it("renders action when provided", () => {
    render(<EmptyState title="No items" action={<button>Add item</button>} />);
    expect(screen.getByRole("button", { name: "Add item" })).toBeInTheDocument();
  });

  it("does not render action area when action not provided", () => {
    const { container } = render(<EmptyState title="No items" />);
    // The action wrapper has mt-2 class
    const actionWrappers = container.querySelectorAll(".mt-2");
    expect(actionWrappers.length).toBe(0);
  });

  it("renders title in an h3 element", () => {
    render(<EmptyState title="No Data" />);
    const heading = screen.getByText("No Data");
    expect(heading.tagName).toBe("H3");
  });

  it("passes through additional HTML attributes", () => {
    render(<EmptyState title="No items" data-testid="empty" role="status" />);
    const el = screen.getByTestId("empty");
    expect(el).toHaveAttribute("role", "status");
  });
});
