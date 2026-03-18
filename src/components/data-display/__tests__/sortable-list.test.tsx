import { render, screen, fireEvent } from "@testing-library/react";
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

  it("hides handle buttons when showHandle is false", () => {
    const onReorder = vi.fn();
    render(
      <SortableList
        items={tasks}
        onReorder={onReorder}
        renderItem={defaultRender}
        showHandle={false}
      />,
    );
    expect(screen.queryByRole("button", { name: "Drag to reorder" })).not.toBeInTheDocument();
  });

  it("makes rows draggable when showHandle is false", () => {
    const onReorder = vi.fn();
    render(
      <SortableList
        items={tasks}
        onReorder={onReorder}
        renderItem={defaultRender}
        showHandle={false}
      />,
    );
    const listItems = screen.getAllByRole("listitem");
    listItems.forEach((item) => {
      expect(item).toHaveClass("cursor-grab");
    });
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

describe("SortableList (pointer drag cancel)", () => {
  it("cancels pointer drag on Escape without reordering", () => {
    const onReorder = vi.fn();
    render(
      <SortableList items={tasks} onReorder={onReorder} renderItem={defaultRender} />,
    );

    const handles = screen.getAllByLabelText("Drag to reorder");

    // Start drag
    fireEvent.pointerDown(handles[0], { clientX: 100, clientY: 50 });

    // Move pointer (simulates dragging)
    fireEvent(document, new PointerEvent("pointermove", { clientX: 100, clientY: 150, bubbles: true }));

    // Cancel with Escape
    fireEvent.keyDown(document, { key: "Escape" });

    // Should NOT have reordered
    expect(onReorder).not.toHaveBeenCalled();

    // Ghost should be gone — list items should all be visible
    const items = screen.getAllByRole("listitem");
    items.forEach((item) => {
      expect(item).not.toHaveClass("opacity-0");
    });
  });
});

describe("SortableList (labelKey)", () => {
  it("renders item labels using labelKey when renderItem is omitted", () => {
    const onReorder = vi.fn();
    render(
      <SortableList items={tasks} onReorder={onReorder} labelKey="title" />,
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.getByText("Third")).toBeInTheDocument();
  });

  it("falls back to id when neither renderItem nor labelKey is provided", () => {
    const onReorder = vi.fn();
    const items = [{ id: "alpha" }, { id: "bravo" }];
    render(
      <SortableList items={items} onReorder={onReorder} />,
    );
    expect(screen.getByText("alpha")).toBeInTheDocument();
    expect(screen.getByText("bravo")).toBeInTheDocument();
  });

  it("still shows drag handles with labelKey", () => {
    const onReorder = vi.fn();
    render(
      <SortableList items={tasks} onReorder={onReorder} labelKey="title" />,
    );
    expect(screen.getAllByLabelText("Drag to reorder")).toHaveLength(3);
  });

  it("supports keyboard reorder with labelKey", async () => {
    const user = userEvent.setup();
    const onReorder = vi.fn();
    render(
      <SortableList items={tasks} onReorder={onReorder} labelKey="title" />,
    );

    const handles = screen.getAllByLabelText("Drag to reorder");
    handles[0].focus();
    await user.keyboard(" ");
    await user.keyboard("{ArrowDown}");

    expect(onReorder).toHaveBeenCalledWith([
      { id: "2", title: "Second" },
      { id: "1", title: "First" },
      { id: "3", title: "Third" },
    ]);
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
