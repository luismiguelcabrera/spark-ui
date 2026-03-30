import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Window } from "../window";

describe("Window", () => {
  it("renders the default active item", () => {
    render(
      <Window defaultValue="a">
        <Window.Item value="a">Content A</Window.Item>
        <Window.Item value="b">Content B</Window.Item>
      </Window>,
    );
    expect(screen.getByText("Content A")).toBeInTheDocument();
    expect(screen.getByText("Content B")).toBeInTheDocument();
    // A is visible, B is hidden
    expect(screen.getByText("Content A").parentElement).not.toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Content B").parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("defaults to the first item when no defaultValue given", () => {
    render(
      <Window>
        <Window.Item value="x">First</Window.Item>
        <Window.Item value="y">Second</Window.Item>
      </Window>,
    );
    expect(screen.getByText("First").parentElement).not.toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Second").parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("controlled: shows the item matching `value` prop", () => {
    render(
      <Window value="b" onValueChange={() => {}}>
        <Window.Item value="a">Alpha</Window.Item>
        <Window.Item value="b">Beta</Window.Item>
      </Window>,
    );
    expect(screen.getByText("Alpha").parentElement).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Beta").parentElement).not.toHaveAttribute("aria-hidden", "true");
  });

  it("has region role and aria-live", () => {
    const { container } = render(
      <Window defaultValue="a">
        <Window.Item value="a">A</Window.Item>
      </Window>,
    );
    const region = container.querySelector("[role='region']");
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("aria-live", "polite");
  });

  it("merges className", () => {
    const { container } = render(
      <Window defaultValue="a" className="custom-cls">
        <Window.Item value="a">A</Window.Item>
      </Window>,
    );
    expect(container.firstChild).toHaveClass("custom-cls");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Window ref={ref} defaultValue="a">
        <Window.Item value="a">A</Window.Item>
      </Window>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("inactive items have pointer-events-none", () => {
    render(
      <Window defaultValue="a">
        <Window.Item value="a">Active</Window.Item>
        <Window.Item value="b">Inactive</Window.Item>
      </Window>,
    );
    const inactiveWrapper = screen.getByText("Inactive").parentElement;
    expect(inactiveWrapper).toHaveClass("pointer-events-none");
  });

  it("active items are opacity-100, inactive are opacity-0", () => {
    render(
      <Window defaultValue="a">
        <Window.Item value="a">Active</Window.Item>
        <Window.Item value="b">Inactive</Window.Item>
      </Window>,
    );
    const activeWrapper = screen.getByText("Active").parentElement;
    const inactiveWrapper = screen.getByText("Inactive").parentElement;
    expect(activeWrapper).toHaveClass("opacity-100");
    expect(inactiveWrapper).toHaveClass("opacity-0");
  });

  it("WindowItem merges className", () => {
    render(
      <Window defaultValue="a">
        <Window.Item value="a" className="item-cls">Content</Window.Item>
      </Window>,
    );
    expect(screen.getByText("Content").closest("[class*='item-cls']")).toBeInTheDocument();
  });

  it("WindowItem forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Window defaultValue="a">
        <Window.Item ref={ref} value="a">Content</Window.Item>
      </Window>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("ignores non-WindowItem children gracefully", () => {
    render(
      <Window defaultValue="a">
        <Window.Item value="a">Valid</Window.Item>
        <span>Ignored</span>
      </Window>,
    );
    expect(screen.getByText("Valid")).toBeInTheDocument();
  });
});
