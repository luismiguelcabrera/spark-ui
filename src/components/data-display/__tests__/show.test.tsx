import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Show } from "../show";

// Mock useBreakpoint to control breakpoint matching
vi.mock("../../../hooks/use-breakpoint", () => ({
  useBreakpoint: vi.fn((bp: string) => {
    // Default: matches "md" and above
    return bp === "sm" || bp === "md";
  }),
}));

describe("Show", () => {
  it("has correct displayName", () => {
    expect(Show.displayName).toBe("Show");
  });

  it("renders children when 'when' is true", () => {
    render(<Show when={true}>Visible</Show>);
    expect(screen.getByText("Visible")).toBeInTheDocument();
  });

  it("does not render children when 'when' is false", () => {
    render(<Show when={false}>Hidden</Show>);
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("renders fallback when 'when' is false", () => {
    render(
      <Show when={false} fallback={<span>Fallback</span>}>
        Hidden
      </Show>,
    );
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
    expect(screen.getByText("Fallback")).toBeInTheDocument();
  });

  it("renders children when no conditions are specified", () => {
    render(<Show>Always visible</Show>);
    expect(screen.getByText("Always visible")).toBeInTheDocument();
  });

  it("renders children with when=true and no fallback", () => {
    render(<Show when={true}>Content</Show>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("does not render fallback when when=true", () => {
    render(
      <Show when={true} fallback={<span>Fallback</span>}>
        Content
      </Show>,
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.queryByText("Fallback")).not.toBeInTheDocument();
  });
});
