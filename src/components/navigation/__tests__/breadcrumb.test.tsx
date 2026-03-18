import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Breadcrumb } from "../breadcrumb";

const items = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Widget" },
];

describe("Breadcrumb", () => {
  it("renders all items", () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Widget")).toBeInTheDocument();
  });

  it("renders links for items with href", () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
    expect(screen.getByText("Products").closest("a")).toHaveAttribute("href", "/products");
  });

  it("renders last item as plain text (not a link)", () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText("Widget").closest("a")).toBeNull();
  });

  it("sets aria-current='page' on the last item", () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText("Widget")).toHaveAttribute("aria-current", "page");
  });

  it("has aria-label='Breadcrumb' on nav", () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByLabelText("Breadcrumb")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLElement | null };
    render(<Breadcrumb ref={ref} items={items} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("NAV");
  });

  it("merges className", () => {
    const ref = { current: null as HTMLElement | null };
    render(<Breadcrumb ref={ref} items={items} className="custom" />);
    expect(ref.current).toHaveClass("custom");
  });

  it("renders separator icons between items", () => {
    const { container } = render(<Breadcrumb items={items} />);
    // With 3 items, there should be 2 separators (chevron_right icons)
    const separators = container.querySelectorAll('[aria-hidden="true"]');
    expect(separators.length).toBe(2);
  });

  it("does not render separator before the first item", () => {
    const { container } = render(<Breadcrumb items={items} />);
    const listItems = container.querySelectorAll("li");
    // First list item should not contain chevron_right separator
    const firstLi = listItems[0];
    expect(firstLi.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it("renders items inside an ordered list", () => {
    const { container } = render(<Breadcrumb items={items} />);
    expect(container.querySelector("ol")).toBeInTheDocument();
    const listItems = container.querySelectorAll("li");
    expect(listItems.length).toBe(3);
  });

  it("has displayName", () => {
    expect(Breadcrumb.displayName).toBe("Breadcrumb");
  });
});
