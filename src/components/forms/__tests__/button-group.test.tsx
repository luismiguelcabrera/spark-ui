import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ButtonGroup } from "../button-group";

describe("ButtonGroup", () => {
  it("renders children", () => {
    render(
      <ButtonGroup>
        <button>A</button>
        <button>B</button>
      </ButtonGroup>,
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("has role='group'", () => {
    render(
      <ButtonGroup>
        <button>A</button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("merges className", () => {
    render(
      <ButtonGroup className="custom-class">
        <button>A</button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group")).toHaveClass("custom-class");
  });

  it("defaults to horizontal direction", () => {
    render(
      <ButtonGroup>
        <button>A</button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group")).toHaveClass("flex-row");
  });

  it("supports vertical direction", () => {
    render(
      <ButtonGroup direction="vertical">
        <button>A</button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group")).toHaveClass("flex-col");
  });

  it("applies gap when not attached", () => {
    render(
      <ButtonGroup>
        <button>A</button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group")).toHaveClass("gap-2");
  });

  it("removes gap and attaches children when attached", () => {
    render(
      <ButtonGroup attached>
        <button>A</button>
        <button>B</button>
      </ButtonGroup>,
    );
    const group = screen.getByRole("group");
    expect(group.className).not.toContain("gap-2");
    expect(group.className).toContain("[&>*]:rounded-none");
  });

  it("applies horizontal attached classes", () => {
    render(
      <ButtonGroup attached direction="horizontal">
        <button>A</button>
      </ButtonGroup>,
    );
    const group = screen.getByRole("group");
    expect(group.className).toContain("[&>*:first-child]:rounded-l-xl");
    expect(group.className).toContain("[&>*:last-child]:rounded-r-xl");
  });

  it("applies vertical attached classes", () => {
    render(
      <ButtonGroup attached direction="vertical">
        <button>A</button>
      </ButtonGroup>,
    );
    const group = screen.getByRole("group");
    expect(group.className).toContain("[&>*:first-child]:rounded-t-xl");
    expect(group.className).toContain("[&>*:last-child]:rounded-b-xl");
  });
});
