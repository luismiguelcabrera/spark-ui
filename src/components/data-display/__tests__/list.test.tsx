import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { List, ListItem } from "../list";

describe("List", () => {
  it("renders children", () => {
    render(
      <List>
        <ListItem title="Item 1" />
        <ListItem title="Item 2" />
      </List>
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("applies card variant styling", () => {
    const { container } = render(
      <List variant="card">
        <ListItem title="Item 1" />
      </List>
    );
    expect(container.firstChild).toHaveClass("bg-surface");
  });

  it("applies divided variant styling", () => {
    const { container } = render(
      <List variant="divided">
        <ListItem title="Item 1" />
      </List>
    );
    expect(container.firstChild).toHaveClass("divide-y");
  });

  it("renders icon, description, and timestamp", () => {
    render(
      <List>
        <ListItem
          icon="check"
          title="Done"
          description="Task completed"
          timestamp="2m ago"
        />
      </List>
    );
    expect(screen.getByText("Done")).toBeInTheDocument();
    expect(screen.getByText("Task completed")).toBeInTheDocument();
    expect(screen.getByText("2m ago")).toBeInTheDocument();
  });

  it("forwards ref on List", () => {
    const ref = { current: null };
    render(
      <List ref={ref}>
        <ListItem title="Item" />
      </List>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("forwards ref on ListItem", () => {
    const ref = { current: null };
    render(
      <List>
        <ListItem ref={ref} title="Item" />
      </List>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("List - nav mode", () => {
  it("has navigation role when nav=true", () => {
    render(
      <List nav>
        <ListItem title="Home" active />
        <ListItem title="Settings" />
      </List>
    );
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("highlights active item", () => {
    const { container } = render(
      <List nav>
        <ListItem title="Home" active />
        <ListItem title="Settings" />
      </List>
    );
    // The active ListItem root div should have border-primary class
    const items = container.querySelectorAll(".flex.items-start");
    expect(items[0]).toHaveClass("border-primary");
  });

  it("non-active items do not have active styling", () => {
    const { container } = render(
      <List nav>
        <ListItem title="Home" active />
        <ListItem title="Settings" />
      </List>
    );
    const items = container.querySelectorAll(".flex.items-start");
    expect(items[1]).not.toHaveClass("border-primary");
  });
});

describe("List - density", () => {
  it("applies compact density", () => {
    const { container } = render(
      <List density="compact">
        <ListItem title="Item" />
      </List>
    );
    const item = container.querySelector("[class*='py-1.5']");
    expect(item).toBeInTheDocument();
  });

  it("applies comfortable density", () => {
    const { container } = render(
      <List density="comfortable">
        <ListItem title="Item" />
      </List>
    );
    const item = container.querySelector("[class*='py-4']");
    expect(item).toBeInTheDocument();
  });

  it("applies default density", () => {
    const { container } = render(
      <List density="default">
        <ListItem title="Item" />
      </List>
    );
    const item = container.querySelector("[class*='py-3']");
    expect(item).toBeInTheDocument();
  });
});

describe("List - selectable", () => {
  it("has listbox role when selectable=true", () => {
    render(
      <List selectable>
        <ListItem title="Item 1" value="1" />
        <ListItem title="Item 2" value="2" />
      </List>
    );
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("items have option role when selectable", () => {
    render(
      <List selectable>
        <ListItem title="Item 1" value="1" />
      </List>
    );
    expect(screen.getByRole("option")).toBeInTheDocument();
  });

  it("calls onSelect when clicking an item", () => {
    const onSelect = vi.fn();
    render(
      <List selectable onSelect={onSelect}>
        <ListItem title="Item 1" value="1" />
        <ListItem title="Item 2" value="2" />
      </List>
    );
    fireEvent.click(screen.getByText("Item 1").closest("[role='option']")!);
    expect(onSelect).toHaveBeenCalledWith("1");
  });

  it("highlights selected item", () => {
    render(
      <List selectable selectedKey="1">
        <ListItem title="Item 1" value="1" />
        <ListItem title="Item 2" value="2" />
      </List>
    );
    const item1 = screen.getByText("Item 1").closest("[role='option']");
    expect(item1).toHaveAttribute("aria-selected", "true");
  });

  it("supports keyboard selection with Enter", () => {
    const onSelect = vi.fn();
    render(
      <List selectable onSelect={onSelect}>
        <ListItem title="Item 1" value="1" />
      </List>
    );
    const option = screen.getByRole("option");
    fireEvent.keyDown(option, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith("1");
  });

  it("supports keyboard selection with Space", () => {
    const onSelect = vi.fn();
    render(
      <List selectable onSelect={onSelect}>
        <ListItem title="Item 1" value="1" />
      </List>
    );
    const option = screen.getByRole("option");
    fireEvent.keyDown(option, { key: " " });
    expect(onSelect).toHaveBeenCalledWith("1");
  });
});
