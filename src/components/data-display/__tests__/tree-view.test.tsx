import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TreeView } from "../tree-view";

describe("TreeView", () => {
  const nodes = [
    {
      id: "1",
      label: "Root",
      children: [
        { id: "1-1", label: "Child 1" },
        { id: "1-2", label: "Child 2" },
      ],
    },
    { id: "2", label: "Leaf" },
  ];

  it("renders root nodes", () => {
    render(<TreeView nodes={nodes} />);
    expect(screen.getByText("Root")).toBeInTheDocument();
    expect(screen.getByText("Leaf")).toBeInTheDocument();
  });

  it("expands node on click", () => {
    render(<TreeView nodes={nodes} />);
    fireEvent.click(screen.getByText("Root"));
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });

  it("calls onSelect when node is clicked", () => {
    const onSelect = vi.fn();
    render(<TreeView nodes={nodes} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Leaf"));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "2", label: "Leaf" }));
  });

  it("shows expanded nodes by default", () => {
    render(<TreeView nodes={nodes} defaultExpandedIds={["1"]} />);
    expect(screen.getByText("Child 1")).toBeInTheDocument();
  });

  it("has tree role", () => {
    render(<TreeView nodes={nodes} />);
    expect(screen.getByRole("tree")).toBeInTheDocument();
  });

  describe("selectable", () => {
    it("renders checkboxes when selectable=true", () => {
      render(<TreeView nodes={nodes} selectable />);
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes.length).toBe(2); // Root + Leaf (children hidden)
    });

    it("toggles checkbox on click", () => {
      const onSelectionChange = vi.fn();
      render(
        <TreeView
          nodes={nodes}
          selectable
          onSelectionChange={onSelectionChange}
        />
      );
      const checkboxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkboxes[1]); // Click Leaf checkbox
      expect(onSelectionChange).toHaveBeenCalledWith(["2"]);
    });

    it("supports controlled selectedIds", () => {
      render(
        <TreeView nodes={nodes} selectable selectedIds={["2"]} />
      );
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes[1]).toBeChecked();
    });

    it("unchecks a previously checked node", () => {
      const onSelectionChange = vi.fn();
      const { rerender } = render(
        <TreeView
          nodes={nodes}
          selectable
          selectedIds={["2"]}
          onSelectionChange={onSelectionChange}
        />
      );
      const checkboxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkboxes[1]); // Uncheck Leaf
      expect(onSelectionChange).toHaveBeenCalledWith([]);
    });
  });

  describe("expandAll", () => {
    it("expands all nodes by default when expandAll=true", () => {
      render(<TreeView nodes={nodes} expandAll />);
      expect(screen.getByText("Child 1")).toBeInTheDocument();
      expect(screen.getByText("Child 2")).toBeInTheDocument();
    });
  });

  describe("searchable", () => {
    it("renders search input when searchable=true", () => {
      render(<TreeView nodes={nodes} searchable />);
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    it("filters nodes by search value", () => {
      render(<TreeView nodes={nodes} searchable />);
      const input = screen.getByPlaceholderText("Search...");
      fireEvent.change(input, { target: { value: "Child 1" } });
      expect(screen.getByText("Child 1")).toBeInTheDocument();
      expect(screen.queryByText("Leaf")).not.toBeInTheDocument();
    });

    it("shows no results message when search matches nothing", () => {
      render(<TreeView nodes={nodes} searchable />);
      const input = screen.getByPlaceholderText("Search...");
      fireEvent.change(input, { target: { value: "zzz_nonexistent" } });
      expect(screen.getByText("No results found")).toBeInTheDocument();
    });

    it("supports controlled search value", () => {
      render(
        <TreeView nodes={nodes} searchable searchValue="Leaf" />
      );
      expect(screen.getByText("Leaf")).toBeInTheDocument();
      expect(screen.queryByText("Root")).not.toBeInTheDocument();
    });

    it("auto-expands parent nodes with matching children", () => {
      render(<TreeView nodes={nodes} searchable searchValue="Child 1" />);
      // Root should be visible (parent of matching child) and Child 1 should be visible
      expect(screen.getByText("Root")).toBeInTheDocument();
      expect(screen.getByText("Child 1")).toBeInTheDocument();
    });
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<TreeView ref={ref} nodes={nodes} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
