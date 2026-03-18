import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AvatarGroup } from "../avatar-group";

describe("AvatarGroup", () => {
  it("renders children", () => {
    render(
      <AvatarGroup>
        <span>A1</span>
        <span>A2</span>
      </AvatarGroup>
    );
    expect(screen.getByText("A1")).toBeInTheDocument();
    expect(screen.getByText("A2")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <AvatarGroup ref={ref}>
        <span>A</span>
      </AvatarGroup>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(AvatarGroup.displayName).toBe("AvatarGroup");
  });

  it("merges className", () => {
    const { container } = render(
      <AvatarGroup className="custom-class">
        <span>A</span>
      </AvatarGroup>
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("custom-class");
    expect(el.className).toContain("flex");
  });

  it("limits visible avatars based on max prop", () => {
    render(
      <AvatarGroup max={2}>
        <span>A1</span>
        <span>A2</span>
        <span>A3</span>
        <span>A4</span>
      </AvatarGroup>
    );
    expect(screen.getByText("A1")).toBeInTheDocument();
    expect(screen.getByText("A2")).toBeInTheDocument();
    expect(screen.queryByText("A3")).not.toBeInTheDocument();
    expect(screen.queryByText("A4")).not.toBeInTheDocument();
  });

  it("shows +N counter when children exceed max", () => {
    render(
      <AvatarGroup max={2}>
        <span>A1</span>
        <span>A2</span>
        <span>A3</span>
        <span>A4</span>
      </AvatarGroup>
    );
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("does not show counter when children fit within max", () => {
    render(
      <AvatarGroup max={4}>
        <span>A1</span>
        <span>A2</span>
      </AvatarGroup>
    );
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument();
  });

  it.each(["tight", "normal", "loose"] as const)(
    "renders spacing=%s without error",
    (spacing) => {
      const { container } = render(
        <AvatarGroup spacing={spacing}>
          <span>A</span>
        </AvatarGroup>
      );
      expect(container.firstElementChild).toBeTruthy();
    }
  );

  it.each(["xs", "sm", "md", "lg", "xl"] as const)(
    "renders size=%s without error",
    (size) => {
      render(
        <AvatarGroup size={size} max={1}>
          <span>A1</span>
          <span>A2</span>
        </AvatarGroup>
      );
      expect(screen.getByText("+1")).toBeInTheDocument();
    }
  );
});
