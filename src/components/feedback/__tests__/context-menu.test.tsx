import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ContextMenu } from "../context-menu";

describe("ContextMenu", () => {
  const items = [
    { label: "Cut", shortcut: "⌘X", onClick: vi.fn() },
    { label: "Copy", shortcut: "⌘C", onClick: vi.fn() },
    { separator: true as const },
    { label: "Delete", danger: true, onClick: vi.fn() },
  ];

  it("renders trigger children", () => {
    render(
      <ContextMenu items={items}>
        <div>Right click me</div>
      </ContextMenu>
    );
    expect(screen.getByText("Right click me")).toBeInTheDocument();
  });

  it("has displayName", () => {
    expect(ContextMenu.displayName).toBe("ContextMenu");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(
      <ContextMenu ref={ref} items={items}>
        <div>Trigger</div>
      </ContextMenu>
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("merges className on the wrapper", () => {
    const { container } = render(
      <ContextMenu items={items} className="custom-class">
        <div>Trigger</div>
      </ContextMenu>
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("does not show menu initially", () => {
    render(
      <ContextMenu items={items}>
        <div>Trigger</div>
      </ContextMenu>
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("shows menu on right-click", () => {
    render(
      <ContextMenu items={items}>
        <div>Trigger</div>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText("Trigger"), { clientX: 100, clientY: 200 });
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
  });

  it("renders item labels and shortcuts", () => {
    render(
      <ContextMenu items={items}>
        <div>Trigger</div>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText("Trigger"));
    expect(screen.getByText("Cut")).toBeInTheDocument();
    expect(screen.getByText("⌘X")).toBeInTheDocument();
  });

  it("does not open when disabled", () => {
    render(
      <ContextMenu items={items} disabled>
        <div>Trigger</div>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText("Trigger"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("calls onClick and closes menu when item clicked", () => {
    const onClick = vi.fn();
    const testItems = [{ label: "Action", onClick }];
    render(
      <ContextMenu items={testItems}>
        <div>Trigger</div>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText("Trigger"));
    fireEvent.click(screen.getByRole("menuitem", { name: "Action" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
