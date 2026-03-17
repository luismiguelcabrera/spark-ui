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
});
