import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import { ToggleGroup, ToggleGroupItem } from "../toggle-group";

expect.extend(toHaveNoViolations);

describe("ToggleGroup", () => {
  it("renders items", () => {
    render(
      <ToggleGroup>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("selects single item", () => {
    const onChange = vi.fn();
    render(
      <ToggleGroup type="single" onValueChange={onChange}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    );
    fireEvent.click(screen.getByText("A"));
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("deselects single item on second click", () => {
    const onChange = vi.fn();
    render(
      <ToggleGroup type="single" defaultValue="a" onValueChange={onChange}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    );
    fireEvent.click(screen.getByText("A"));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("selects multiple items", () => {
    const onChange = vi.fn();
    render(
      <ToggleGroup type="multiple" onValueChange={onChange}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    );
    fireEvent.click(screen.getByText("A"));
    expect(onChange).toHaveBeenCalledWith(["a"]);
  });

  it("toggles off in multiple mode", () => {
    const onChange = vi.fn();
    render(
      <ToggleGroup type="multiple" defaultValue={["a"]} onValueChange={onChange}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    );
    fireEvent.click(screen.getByText("A"));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("marks selected item with aria-checked", () => {
    render(
      <ToggleGroup type="single" defaultValue="a">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    );
    expect(screen.getByText("A").closest("button")).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("B").closest("button")).toHaveAttribute("aria-checked", "false");
  });

  it("disables all items when group is disabled", () => {
    render(
      <ToggleGroup disabled>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    );
    expect(screen.getByText("A").closest("button")).toBeDisabled();
    expect(screen.getByText("B").closest("button")).toBeDisabled();
  });

  it("does not call onValueChange when disabled", () => {
    const onChange = vi.fn();
    render(
      <ToggleGroup type="single" disabled onValueChange={onChange}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>
    );
    fireEvent.click(screen.getByText("A"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders with group role", () => {
    render(
      <ToggleGroup>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ToggleGroup aria-label="Options">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
