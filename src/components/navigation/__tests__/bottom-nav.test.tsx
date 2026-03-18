import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { BottomNav } from "../bottom-nav";

const items = [
  { label: "Home", icon: "home" },
  { label: "Search", icon: "search" },
  { label: "Profile", icon: "user" },
];

describe("BottomNav", () => {
  it("renders without error", () => {
    render(<BottomNav items={items} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders all items", () => {
    render(<BottomNav items={items} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLElement>();
    render(<BottomNav ref={ref} items={items} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("NAV");
  });

  it("has displayName", () => {
    expect(BottomNav.displayName).toBe("BottomNav");
  });

  it("merges className", () => {
    const { container } = render(<BottomNav items={items} className="custom-nav" />);
    expect(container.firstChild).toHaveClass("custom-nav");
  });

  it("has aria-label for navigation", () => {
    render(<BottomNav items={items} />);
    expect(screen.getByLabelText("Bottom navigation")).toBeInTheDocument();
  });

  it("renders items as buttons by default", () => {
    render(<BottomNav items={items} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });

  it("renders items as links when href is provided", () => {
    const itemsWithHref = [
      { label: "Home", icon: "home", href: "/home" },
      { label: "Search", icon: "search", href: "/search" },
    ];
    render(<BottomNav items={itemsWithHref} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/home");
  });

  it("marks active item with aria-current=page", () => {
    const activeItems = [
      { label: "Home", icon: "home", active: true },
      { label: "Search", icon: "search" },
    ];
    render(<BottomNav items={activeItems} />);
    expect(screen.getByText("Home").closest("button")).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("Search").closest("button")).not.toHaveAttribute("aria-current");
  });

  it("shows badge count", () => {
    const badgeItems = [
      { label: "Home", icon: "home", badge: 5 },
    ];
    render(<BottomNav items={badgeItems} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("caps badge at 99+", () => {
    const badgeItems = [
      { label: "Home", icon: "home", badge: 150 },
    ];
    render(<BottomNav items={badgeItems} />);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("hides labels when showLabels is false", () => {
    render(<BottomNav items={items} showLabels={false} />);
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
  });

  it("calls onClick handler", () => {
    const onClick = vi.fn();
    const clickItems = [
      { label: "Home", icon: "home", onClick },
    ];
    render(<BottomNav items={clickItems} />);
    fireEvent.click(screen.getByText("Home"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disables items when disabled is true", () => {
    const disabledItems = [
      { label: "Home", icon: "home", disabled: true },
    ];
    render(<BottomNav items={disabledItems} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it.each(["default", "floating", "bordered"] as const)(
    "renders variant=%s without error",
    (variant) => {
      render(<BottomNav items={items} variant={variant} />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    },
  );
});
