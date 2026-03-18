import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
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

  it("has role=list", () => {
    render(
      <List>
        <ListItem title="Item 1" />
      </List>
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("renders as ul by default", () => {
    const { container } = render(
      <List>
        <ListItem title="Item 1" />
      </List>
    );
    expect(container.querySelector("ul")).toBeInTheDocument();
  });

  it("renders as ol when ordered", () => {
    const { container } = render(
      <List ordered>
        <ListItem title="Item 1" />
      </List>
    );
    expect(container.querySelector("ol")).toBeInTheDocument();
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

  it("renders actions in ListItem", () => {
    render(
      <List>
        <ListItem title="Item" actions={<button>Delete</button>} />
      </List>
    );
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("forwards ref on List", () => {
    const ref = { current: null };
    render(
      <List ref={ref}>
        <ListItem title="Item" />
      </List>
    );
    expect(ref.current).toBeInstanceOf(HTMLUListElement);
  });

  it("forwards ref on ListItem", () => {
    const ref = { current: null };
    render(
      <List>
        <ListItem ref={ref} title="Item" />
      </List>
    );
    expect(ref.current).toBeInstanceOf(HTMLLIElement);
  });

  it("merges className on List", () => {
    const { container } = render(
      <List className="custom-list">
        <ListItem title="Item" />
      </List>
    );
    expect(container.firstChild).toHaveClass("custom-list");
  });

  it("merges className on ListItem", () => {
    const { container } = render(
      <List>
        <ListItem title="Item" className="custom-item" />
      </List>
    );
    const li = container.querySelector("li");
    expect(li).toHaveClass("custom-item");
  });

  it("applies default py-3 padding on ListItem", () => {
    const { container } = render(
      <List>
        <ListItem title="Item" />
      </List>
    );
    const item = container.querySelector("[class*='py-3']");
    expect(item).toBeInTheDocument();
  });
});
