import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SortableList, DragHandle } from "../sortable-list";

type Task = { id: string; title: string };

const tasks: Task[] = [
  { id: "1", title: "First" },
  { id: "2", title: "Second" },
  { id: "3", title: "Third" },
];

const defaultRender = (item: Task, handle: React.ReactNode) => (
  <div className="flex items-center gap-2 p-2 flex-1">
    {handle}
    <span>{item.title}</span>
  </div>
);

describe("SortableList", () => {
  it("renders all items", () => {
    const onReorder = vi.fn();
    render(
      <SortableList items={tasks} onReorder={onReorder} renderItem={defaultRender} />,
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.getByText("Third")).toBeInTheDocument();
  });

  it("has role='list' on container", () => {
    const onReorder = vi.fn();
    render(
      <SortableList items={tasks} onReorder={onReorder} renderItem={defaultRender} />,
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("has aria-label on container", () => {
    const onReorder = vi.fn();
    render(
      <SortableList items={tasks} onReorder={onReorder} renderItem={defaultRender} />,
    );
    expect(screen.getByLabelText("Sortable list")).toBeInTheDocument();
  });

  it("renders drag handles with aria-label", () => {
    const onReorder = vi.fn();
    render(
      <SortableList items={tasks} onReorder={onReorder} renderItem={defaultRender} />,
    );
    const handles = screen.getAllByLabelText("Drag to reorder");
    expect(handles).toHaveLength(3);
  });

  it("renders items as list items", () => {
    const onReorder = vi.fn();
    render(
      <SortableList items={tasks} onReorder={onReorder} renderItem={defaultRender} />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("hides handles when showHandle is false", () => {
    const onReorder = vi.fn();
    render(
      <SortableList
        items={tasks}
        onReorder={onReorder}
        renderItem={defaultRender}
        showHandle={false}
      />,
    );
    expect(screen.queryByLabelText("Drag to reorder")).not.toBeInTheDocument();
  });

  it("merges className on container", () => {
    const onReorder = vi.fn();
    render(
      <SortableList
        items={tasks}
        onReorder={onReorder}
        renderItem={defaultRender}
        className="custom-class"
      />,
    );
    expect(screen.getByRole("list")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const onReorder = vi.fn();
    const ref = { current: null as HTMLDivElement | null };
    render(
      <SortableList
        ref={ref}
        items={tasks}
        onReorder={onReorder}
        renderItem={defaultRender}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLUListElement);
  });
});

describe("SortableList (keyboard reorder)", () => {
  it("moves item down with Space + ArrowDown + Space", async () => {
    const user = userEvent.setup();
    const onReorder = vi.fn();
    render(
      <SortableList items={tasks} onReorder={onReorder} renderItem={defaultRender} />,
    );

    const handles = screen.getAllByLabelText("Drag to reorder");
    // Focus first handle
    handles[0].focus();

    // Pick up (Space)
    await user.keyboard(" ");
    // Move down (ArrowDown)
    await user.keyboard("{ArrowDown}");

    expect(onReorder).toHaveBeenCalledWith([
      { id: "2", title: "Second" },
      { id: "1", title: "First" },
      { id: "3", title: "Third" },
    ]);
  });

  it("moves item up with Space + ArrowUp + Space", async () => {
    const user = userEvent.setup();
    const onReorder = vi.fn();
    render(
      <SortableList items={tasks} onReorder={onReorder} renderItem={defaultRender} />,
    );

    const handles = screen.getAllByLabelText("Drag to reorder");
    // Focus last handle
    handles[2].focus();

    // Pick up
    await user.keyboard(" ");
    // Move up
    await user.keyboard("{ArrowUp}");

    expect(onReorder).toHaveBeenCalledWith([
      { id: "1", title: "First" },
      { id: "3", title: "Third" },
      { id: "2", title: "Second" },
    ]);
  });

  it("does not move beyond top boundary", async () => {
    const user = userEvent.setup();
    const onReorder = vi.fn();
    render(
      <SortableList items={tasks} onReorder={onReorder} renderItem={defaultRender} />,
    );

    const handles = screen.getAllByLabelText("Drag to reorder");
    handles[0].focus();

    await user.keyboard(" ");
    await user.keyboard("{ArrowUp}");

    expect(onReorder).not.toHaveBeenCalled();
  });

  it("does not move beyond bottom boundary", async () => {
    const user = userEvent.setup();
    const onReorder = vi.fn();
    render(
      <SortableList items={tasks} onReorder={onReorder} renderItem={defaultRender} />,
    );

    const handles = screen.getAllByLabelText("Drag to reorder");
    handles[2].focus();

    await user.keyboard(" ");
    await user.keyboard("{ArrowDown}");

    expect(onReorder).not.toHaveBeenCalled();
  });

  it("cancels drag on Escape", async () => {
    const user = userEvent.setup();
    const onReorder = vi.fn();
    render(
      <SortableList items={tasks} onReorder={onReorder} renderItem={defaultRender} />,
    );

    const handles = screen.getAllByLabelText("Drag to reorder");
    handles[0].focus();

    // Pick up
    await user.keyboard(" ");
    // Cancel
    await user.keyboard("{Escape}");
    // Try to move — should not work since we cancelled
    await user.keyboard("{ArrowDown}");

    expect(onReorder).not.toHaveBeenCalled();
  });
});

describe("DragHandle", () => {
  it("renders with aria-label", () => {
    render(<DragHandle />);
    expect(screen.getByLabelText("Drag to reorder")).toBeInTheDocument();
  });

  it("renders as a button", () => {
    render(<DragHandle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has type='button'", () => {
    render(<DragHandle />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<DragHandle ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("applies isDragging styles", () => {
    render(<DragHandle isDragging />);
    expect(screen.getByRole("button")).toHaveClass("cursor-grabbing");
  });

  it("merges className", () => {
    render(<DragHandle className="extra" />);
    expect(screen.getByRole("button")).toHaveClass("extra");
  });
});
