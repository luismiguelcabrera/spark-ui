import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("renders custom separator as ReactNode", () => {
    render(<Breadcrumb items={items} separator={<span data-testid="sep">/</span>} />);
    const seps = screen.getAllByTestId("sep");
    expect(seps).toHaveLength(2);
  });

  it("renders item icons", () => {
    const itemsWithIcons = [
      { label: "Home", href: "/", icon: "home" },
      { label: "Settings" },
    ];
    render(<Breadcrumb items={itemsWithIcons} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });
});

describe("Breadcrumb (collapsible)", () => {
  const longItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Category", href: "/products/cat" },
    { label: "Subcategory", href: "/products/cat/sub" },
    { label: "Widget" },
  ];

  it("collapses middle items when maxItems is set", () => {
    render(<Breadcrumb items={longItems} maxItems={3} />);
    // First item visible
    expect(screen.getByText("Home")).toBeInTheDocument();
    // Last 2 visible
    expect(screen.getByText("Subcategory")).toBeInTheDocument();
    expect(screen.getByText("Widget")).toBeInTheDocument();
    // Middle items hidden
    expect(screen.queryByText("Products")).not.toBeInTheDocument();
    expect(screen.queryByText("Category")).not.toBeInTheDocument();
    // Ellipsis button visible
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("ellipsis button has correct aria-label", () => {
    render(<Breadcrumb items={longItems} maxItems={3} />);
    expect(screen.getByLabelText("Show 2 more breadcrumb items")).toBeInTheDocument();
  });

  it("expands all items when ellipsis is clicked", async () => {
    const user = userEvent.setup();
    render(<Breadcrumb items={longItems} maxItems={3} />);
    await user.click(screen.getByText("..."));
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.queryByText("...")).not.toBeInTheDocument();
  });

  it("does not collapse when items count <= maxItems", () => {
    render(<Breadcrumb items={items} maxItems={3} />);
    expect(screen.queryByText("...")).not.toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Widget")).toBeInTheDocument();
  });

  it("does not collapse when maxItems < 2", () => {
    render(<Breadcrumb items={longItems} maxItems={1} />);
    expect(screen.queryByText("...")).not.toBeInTheDocument();
    // All items should be visible
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
  });
});
