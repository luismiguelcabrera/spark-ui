import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { ItemGroup, ItemGroupItem } from "../item-group";

describe("ItemGroup", () => {
  it("renders a group container with role=listbox", () => {
    render(<ItemGroup data-testid="group"><span>Child</span></ItemGroup>);
    const el = screen.getByTestId("group");
    expect(el).toHaveAttribute("role", "listbox");
  });

  it("renders children", () => {
    render(
      <ItemGroup>
        <span>A</span>
        <span>B</span>
      </ItemGroup>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<ItemGroup className="custom" data-testid="group"><span>X</span></ItemGroup>);
    expect(screen.getByTestId("group").className).toContain("custom");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ItemGroup ref={ref}><span>X</span></ItemGroup>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("ItemGroupItem", () => {
  it("renders fallback wrapper with role=option", () => {
    render(
      <ItemGroup>
        <ItemGroupItem value="a">Alpha</ItemGroupItem>
      </ItemGroup>
    );
    const option = screen.getByRole("option");
    expect(option).toHaveTextContent("Alpha");
    expect(option).toHaveAttribute("aria-selected", "false");
  });

  it("toggles selection on click (single mode)", () => {
    const onChange = vi.fn();
    render(
      <ItemGroup onChange={onChange}>
        <ItemGroupItem value="a">Alpha</ItemGroupItem>
        <ItemGroupItem value="b">Beta</ItemGroupItem>
      </ItemGroup>
    );
    fireEvent.click(screen.getByText("Alpha"));
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("selects and deselects in single mode", () => {
    render(
      <ItemGroup defaultValue="a">
        <ItemGroupItem value="a">Alpha</ItemGroupItem>
        <ItemGroupItem value="b">Beta</ItemGroupItem>
      </ItemGroup>
    );
    const alpha = screen.getByText("Alpha");
    expect(alpha).toHaveAttribute("aria-selected", "true");

    fireEvent.click(screen.getByText("Beta"));
    expect(screen.getByText("Beta")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Alpha")).toHaveAttribute("aria-selected", "false");
  });

  it("supports multiple selection", () => {
    const onChange = vi.fn();
    render(
      <ItemGroup multiple onChange={onChange}>
        <ItemGroupItem value="a">Alpha</ItemGroupItem>
        <ItemGroupItem value="b">Beta</ItemGroupItem>
      </ItemGroup>
    );
    fireEvent.click(screen.getByText("Alpha"));
    expect(onChange).toHaveBeenCalledWith(["a"]);

    fireEvent.click(screen.getByText("Beta"));
    expect(onChange).toHaveBeenCalledWith(["a", "b"]);
  });

  it("prevents deselection when mandatory=true and only one selected", () => {
    const onChange = vi.fn();
    render(
      <ItemGroup mandatory defaultValue="a" onChange={onChange}>
        <ItemGroupItem value="a">Alpha</ItemGroupItem>
        <ItemGroupItem value="b">Beta</ItemGroupItem>
      </ItemGroup>
    );
    fireEvent.click(screen.getByText("Alpha"));
    // Should not have called onChange because it can't deselect the only selected item
    expect(onChange).not.toHaveBeenCalled();
  });

  it("allows deselecting in mandatory mode when another is selected", () => {
    const onChange = vi.fn();
    render(
      <ItemGroup mandatory multiple defaultValue={["a", "b"]} onChange={onChange}>
        <ItemGroupItem value="a">Alpha</ItemGroupItem>
        <ItemGroupItem value="b">Beta</ItemGroupItem>
      </ItemGroup>
    );
    fireEvent.click(screen.getByText("Alpha"));
    expect(onChange).toHaveBeenCalledWith(["b"]);
  });

  it("handles keyboard Enter to toggle", () => {
    const onChange = vi.fn();
    render(
      <ItemGroup onChange={onChange}>
        <ItemGroupItem value="a">Alpha</ItemGroupItem>
      </ItemGroup>
    );
    fireEvent.keyDown(screen.getByText("Alpha"), { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("handles keyboard Space to toggle", () => {
    const onChange = vi.fn();
    render(
      <ItemGroup onChange={onChange}>
        <ItemGroupItem value="a">Alpha</ItemGroupItem>
      </ItemGroup>
    );
    fireEvent.keyDown(screen.getByText("Alpha"), { key: " " });
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("works with render prop children", () => {
    render(
      <ItemGroup defaultValue="a">
        <ItemGroupItem value="a">
          {({ isSelected, onSelect }) => (
            <button type="button" onClick={onSelect} data-testid="rp-btn">
              {isSelected ? "Selected" : "Not selected"}
            </button>
          )}
        </ItemGroupItem>
      </ItemGroup>
    );
    expect(screen.getByTestId("rp-btn")).toHaveTextContent("Selected");
    fireEvent.click(screen.getByTestId("rp-btn"));
    expect(screen.getByTestId("rp-btn")).toHaveTextContent("Not selected");
  });

  it("works in controlled mode", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ItemGroup value="a" onChange={onChange}>
        <ItemGroupItem value="a">Alpha</ItemGroupItem>
        <ItemGroupItem value="b">Beta</ItemGroupItem>
      </ItemGroup>
    );
    expect(screen.getByText("Alpha")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Beta")).toHaveAttribute("aria-selected", "false");

    fireEvent.click(screen.getByText("Beta"));
    expect(onChange).toHaveBeenCalledWith("b");

    // Value doesn't change without parent updating it
    expect(screen.getByText("Alpha")).toHaveAttribute("aria-selected", "true");

    // Parent updates value
    rerender(
      <ItemGroup value="b" onChange={onChange}>
        <ItemGroupItem value="a">Alpha</ItemGroupItem>
        <ItemGroupItem value="b">Beta</ItemGroupItem>
      </ItemGroup>
    );
    expect(screen.getByText("Beta")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Alpha")).toHaveAttribute("aria-selected", "false");
  });

  it("supports defaultValue as array for multiple mode", () => {
    render(
      <ItemGroup multiple defaultValue={["a", "b"]}>
        <ItemGroupItem value="a">Alpha</ItemGroupItem>
        <ItemGroupItem value="b">Beta</ItemGroupItem>
        <ItemGroupItem value="c">Gamma</ItemGroupItem>
      </ItemGroup>
    );
    expect(screen.getByText("Alpha")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Beta")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Gamma")).toHaveAttribute("aria-selected", "false");
  });
});
