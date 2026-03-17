import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Spinner } from "../spinner";

describe("Spinner", () => {
  it("renders with status role", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has default aria-label 'Loading'", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading");
  });

  it("accepts custom label", () => {
    render(<Spinner label="Saving changes..." />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Saving changes...");
  });

  // ── Sizes ──

  it.each([
    ["xs", "w-3"],
    ["sm", "w-4"],
    ["md", "w-6"],
    ["lg", "w-8"],
    ["xl", "w-12"],
  ] as const)("applies %s size", (size, expectedClass) => {
    render(<Spinner size={size} />);
    expect(screen.getByRole("status").className).toContain(expectedClass);
  });

  // ── Colors ──

  it.each([
    ["primary", "text-primary"],
    ["secondary", "text-secondary"],
    ["destructive", "text-red-600"],
    ["success", "text-green-700"],
    ["warning", "text-amber-600"],
    ["accent", "text-accent"],
    ["white", "text-white"],
    ["muted", "text-slate-400"],
    ["current", "text-current"],
  ] as const)("applies %s color", (color, expectedClass) => {
    render(<Spinner color={color} />);
    expect(screen.getByRole("status").className).toContain(expectedClass);
  });

  // ── Thickness ──

  it("applies thin thickness", () => {
    render(<Spinner thickness="thin" />);
    const cls = screen.getByRole("status").className;
    expect(cls).toContain("border");
    expect(cls).not.toContain("border-2");
  });

  it("applies thick thickness", () => {
    render(<Spinner thickness="thick" />);
    expect(screen.getByRole("status").className).toContain("border-3");
  });

  // ── Speed ──

  it("applies fast speed", () => {
    render(<Spinner speed="fast" />);
    expect(screen.getByRole("status").className).toContain("[animation-duration:0.5s]");
  });

  // ── Overlay ──

  it("renders overlay wrapper when overlay is true", () => {
    const { container } = render(
      <div style={{ position: "relative" }}>
        <Spinner overlay />
      </div>,
    );
    const overlay = container.querySelector(".absolute.inset-0");
    expect(overlay).toBeInTheDocument();
    expect(overlay?.querySelector("[role='status']")).toBeInTheDocument();
  });

  it("does not render overlay wrapper by default", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector(".absolute.inset-0")).not.toBeInTheDocument();
  });
});
