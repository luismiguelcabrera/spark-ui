import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { NavigationMenu } from "../navigation-menu";

const items = [
  { label: "Home", href: "/", active: true },
  { label: "About", href: "/about" },
  {
    label: "Products",
    children: [
      { label: "Widget", href: "/products/widget", description: "A useful widget" },
      { label: "Gadget", href: "/products/gadget" },
    ],
  },
];

describe("NavigationMenu", () => {
  it("renders without error", () => {
    render(<NavigationMenu items={items} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLElement>();
    render(<NavigationMenu ref={ref} items={items} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("NAV");
  });

  it("has displayName", () => {
    expect(NavigationMenu.displayName).toBe("NavigationMenu");
  });

  it("merges className", () => {
    const { container } = render(<NavigationMenu items={items} className="custom-nav" />);
    expect(container.firstChild).toHaveClass("custom-nav");
  });

  it("renders links for items without children", () => {
    render(<NavigationMenu items={items} />);
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders buttons for items with children", () => {
    render(<NavigationMenu items={items} />);
    const productsButton = screen.getByText("Products").closest("button");
    expect(productsButton).toBeInTheDocument();
    expect(productsButton).toHaveAttribute("type", "button");
  });

  it("marks active items with aria-current=page", () => {
    render(<NavigationMenu items={items} />);
    expect(screen.getByText("Home").closest("a")).toHaveAttribute("aria-current", "page");
  });

  it("opens dropdown on mouse enter", () => {
    render(<NavigationMenu items={items} />);
    const productsWrapper = screen.getByText("Products").closest("div[class='relative']") ?? screen.getByText("Products").parentElement!.parentElement!;
    fireEvent.mouseEnter(productsWrapper);
    expect(screen.getByText("Widget")).toBeInTheDocument();
    expect(screen.getByText("Gadget")).toBeInTheDocument();
  });

  it("closes dropdown on mouse leave", () => {
    render(<NavigationMenu items={items} />);
    const productsWrapper = screen.getByText("Products").closest("div[class='relative']") ?? screen.getByText("Products").parentElement!.parentElement!;
    fireEvent.mouseEnter(productsWrapper);
    expect(screen.getByText("Widget")).toBeInTheDocument();
    fireEvent.mouseLeave(productsWrapper);
    expect(screen.queryByText("Widget")).not.toBeInTheDocument();
  });

  it("toggles dropdown on button click", () => {
    render(<NavigationMenu items={items} />);
    const productsButton = screen.getByText("Products").closest("button")!;
    fireEvent.click(productsButton);
    expect(screen.getByText("Widget")).toBeInTheDocument();
    fireEvent.click(productsButton);
    expect(screen.queryByText("Widget")).not.toBeInTheDocument();
  });

  it("sets aria-expanded on dropdown trigger", () => {
    render(<NavigationMenu items={items} />);
    const productsButton = screen.getByText("Products").closest("button")!;
    expect(productsButton).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(productsButton);
    expect(productsButton).toHaveAttribute("aria-expanded", "true");
  });

  it("renders child descriptions", () => {
    render(<NavigationMenu items={items} />);
    fireEvent.click(screen.getByText("Products").closest("button")!);
    expect(screen.getByText("A useful widget")).toBeInTheDocument();
  });

  it("calls child onClick handler", () => {
    const onClick = vi.fn();
    const clickItems = [
      {
        label: "Products",
        children: [
          { label: "Widget", onClick },
        ],
      },
    ];
    render(<NavigationMenu items={clickItems} />);
    fireEvent.click(screen.getByText("Products").closest("button")!);
    fireEvent.click(screen.getByText("Widget"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders vertical orientation", () => {
    const { container } = render(<NavigationMenu items={items} orientation="vertical" />);
    expect(container.firstChild).toHaveClass("flex-col");
  });

  it("renders horizontal orientation by default", () => {
    const { container } = render(<NavigationMenu items={items} />);
    expect(container.firstChild).toHaveClass("flex");
    expect(container.firstChild).toHaveClass("items-center");
  });
});
