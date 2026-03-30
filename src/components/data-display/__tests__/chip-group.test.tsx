import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { ChipGroup, useChipGroup } from "../chip-group";

/* -------------------------------------------------------------------------- */
/*  Mock Chip that integrates with ChipGroup context                           */
/* -------------------------------------------------------------------------- */

function MockChip({ value, children }: { value: string; children: string }) {
  const ctx = useChipGroup();
  const isSelected = ctx?.selected.includes(value) ?? false;

  return (
    <button
      type="button"
      data-selected={isSelected}
      onClick={() => ctx?.toggle(value)}
    >
      {children}
    </button>
  );
}

describe("ChipGroup", () => {
  it("renders children", () => {
    render(
      <ChipGroup>
        <MockChip value="a">Alpha</MockChip>
        <MockChip value="b">Beta</MockChip>
      </ChipGroup>,
    );
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("has role=group", () => {
    render(
      <ChipGroup>
        <MockChip value="a">A</MockChip>
      </ChipGroup>,
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("single selection — selects one value at a time", () => {
    render(
      <ChipGroup defaultValue="a">
        <MockChip value="a">Alpha</MockChip>
        <MockChip value="b">Beta</MockChip>
      </ChipGroup>,
    );
    expect(screen.getByText("Alpha")).toHaveAttribute("data-selected", "true");
    expect(screen.getByText("Beta")).toHaveAttribute("data-selected", "false");

    fireEvent.click(screen.getByText("Beta"));
    expect(screen.getByText("Alpha")).toHaveAttribute("data-selected", "false");
    expect(screen.getByText("Beta")).toHaveAttribute("data-selected", "true");
  });

  it("single selection — deselects when clicking selected chip", () => {
    render(
      <ChipGroup defaultValue="a">
        <MockChip value="a">Alpha</MockChip>
      </ChipGroup>,
    );
    fireEvent.click(screen.getByText("Alpha"));
    expect(screen.getByText("Alpha")).toHaveAttribute("data-selected", "false");
  });

  it("multiple selection — toggles independently", () => {
    render(
      <ChipGroup multiple defaultValue={["a"]}>
        <MockChip value="a">Alpha</MockChip>
        <MockChip value="b">Beta</MockChip>
        <MockChip value="c">Gamma</MockChip>
      </ChipGroup>,
    );

    fireEvent.click(screen.getByText("Beta"));
    expect(screen.getByText("Alpha")).toHaveAttribute("data-selected", "true");
    expect(screen.getByText("Beta")).toHaveAttribute("data-selected", "true");

    fireEvent.click(screen.getByText("Alpha"));
    expect(screen.getByText("Alpha")).toHaveAttribute("data-selected", "false");
    expect(screen.getByText("Beta")).toHaveAttribute("data-selected", "true");
  });

  it("mandatory — prevents deselecting the last chip", () => {
    render(
      <ChipGroup mandatory defaultValue="a">
        <MockChip value="a">Alpha</MockChip>
        <MockChip value="b">Beta</MockChip>
      </ChipGroup>,
    );

    fireEvent.click(screen.getByText("Alpha"));
    // Should still be selected because mandatory
    expect(screen.getByText("Alpha")).toHaveAttribute("data-selected", "true");
  });

  it("mandatory + multiple — prevents deselecting the last selected chip", () => {
    render(
      <ChipGroup mandatory multiple defaultValue={["a", "b"]}>
        <MockChip value="a">Alpha</MockChip>
        <MockChip value="b">Beta</MockChip>
      </ChipGroup>,
    );

    // Deselect Alpha — should be allowed because Beta is still selected
    fireEvent.click(screen.getByText("Alpha"));
    expect(screen.getByText("Alpha")).toHaveAttribute("data-selected", "false");
    expect(screen.getByText("Beta")).toHaveAttribute("data-selected", "true");

    // Now deselect Beta — should be blocked (mandatory)
    fireEvent.click(screen.getByText("Beta"));
    expect(screen.getByText("Beta")).toHaveAttribute("data-selected", "true");
  });

  it("controlled mode — calls onChange", () => {
    const onChange = vi.fn();
    render(
      <ChipGroup value="a" onChange={onChange}>
        <MockChip value="a">Alpha</MockChip>
        <MockChip value="b">Beta</MockChip>
      </ChipGroup>,
    );

    fireEvent.click(screen.getByText("Beta"));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("controlled mode — multiple calls onChange with array", () => {
    const onChange = vi.fn();
    render(
      <ChipGroup value={["a"]} onChange={onChange} multiple>
        <MockChip value="a">Alpha</MockChip>
        <MockChip value="b">Beta</MockChip>
      </ChipGroup>,
    );

    fireEvent.click(screen.getByText("Beta"));
    expect(onChange).toHaveBeenCalledWith(["a", "b"]);
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ChipGroup ref={ref}>
        <MockChip value="a">A</MockChip>
      </ChipGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges custom className", () => {
    render(
      <ChipGroup className="custom-class">
        <MockChip value="a">A</MockChip>
      </ChipGroup>,
    );
    expect(screen.getByRole("group").className).toContain("custom-class");
  });

  it("passes color via context", () => {
    function ColorReporter() {
      const ctx = useChipGroup();
      return <span data-testid="color">{ctx?.color ?? "none"}</span>;
    }

    render(
      <ChipGroup color="primary">
        <ColorReporter />
      </ChipGroup>,
    );
    expect(screen.getByTestId("color")).toHaveTextContent("primary");
  });

  it("uncontrolled — starts with empty selection by default", () => {
    render(
      <ChipGroup>
        <MockChip value="a">Alpha</MockChip>
      </ChipGroup>,
    );
    expect(screen.getByText("Alpha")).toHaveAttribute("data-selected", "false");
  });

  it("supports string defaultValue (single selection)", () => {
    render(
      <ChipGroup defaultValue="b">
        <MockChip value="a">Alpha</MockChip>
        <MockChip value="b">Beta</MockChip>
      </ChipGroup>,
    );
    expect(screen.getByText("Alpha")).toHaveAttribute("data-selected", "false");
    expect(screen.getByText("Beta")).toHaveAttribute("data-selected", "true");
  });
});
