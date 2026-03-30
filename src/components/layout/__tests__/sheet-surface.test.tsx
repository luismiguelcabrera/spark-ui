import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SheetSurface } from "../sheet-surface";

describe("SheetSurface", () => {
  it("renders children", () => {
    render(<SheetSurface>Content</SheetSurface>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies default elevation and rounded", () => {
    const { container } = render(<SheetSurface>Content</SheetSurface>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("shadow-sm"); // elevation 1
    expect(el).toHaveClass("rounded-lg"); // rounded lg
  });

  it.each([
    [0, "shadow-none"],
    [1, "shadow-sm"],
    [2, "shadow"],
    [3, "shadow-md"],
    [4, "shadow-lg"],
    [5, "shadow-xl"],
  ] as const)("renders elevation=%i with class %s", (elevation, expectedClass) => {
    const { container } = render(
      <SheetSurface elevation={elevation}>Content</SheetSurface>
    );
    expect(container.firstChild).toHaveClass(expectedClass);
  });

  it.each([
    ["none", "rounded-none"],
    ["sm", "rounded-sm"],
    ["md", "rounded-md"],
    ["lg", "rounded-lg"],
    ["xl", "rounded-xl"],
    ["2xl", "rounded-2xl"],
  ] as const)("renders rounded=%s with class %s", (rounded, expectedClass) => {
    const { container } = render(
      <SheetSurface rounded={rounded}>Content</SheetSurface>
    );
    expect(container.firstChild).toHaveClass(expectedClass);
  });

  it("renders bordered variant", () => {
    const { container } = render(<SheetSurface bordered>Content</SheetSurface>);
    expect(container.firstChild).toHaveClass("border", "border-slate-200");
  });

  it("does not have border classes when bordered is false/unset", () => {
    const { container } = render(<SheetSurface>Content</SheetSurface>);
    expect(container.firstChild).not.toHaveClass("border-slate-200");
  });

  it("applies color class", () => {
    const { container } = render(
      <SheetSurface color="bg-blue-50">Content</SheetSurface>
    );
    expect(container.firstChild).toHaveClass("bg-blue-50");
  });

  it("merges className", () => {
    const { container } = render(
      <SheetSurface className="custom-surface">Content</SheetSurface>
    );
    expect(container.firstChild).toHaveClass("custom-surface");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<SheetSurface ref={ref}>Content</SheetSurface>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("spreads additional HTML attributes", () => {
    render(
      <SheetSurface data-testid="surface" role="region">
        Content
      </SheetSurface>
    );
    expect(screen.getByTestId("surface")).toBeInTheDocument();
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("has bg-white by default", () => {
    const { container } = render(<SheetSurface>Content</SheetSurface>);
    expect(container.firstChild).toHaveClass("bg-white");
  });
});
