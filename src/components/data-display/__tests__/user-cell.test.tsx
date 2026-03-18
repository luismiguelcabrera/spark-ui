import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { UserCell } from "../user-cell";

describe("UserCell", () => {
  it("renders name", () => {
    render(<UserCell name="Alice Johnson" />);
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
  });

  it("renders without error with required props", () => {
    const { container } = render(<UserCell name="Bob" />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<UserCell ref={ref} name="Alice" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(UserCell.displayName).toBe("UserCell");
  });

  it("merges custom className", () => {
    const { container } = render(<UserCell name="Alice" className="custom-class" />);
    expect(container.firstElementChild!.className).toContain("custom-class");
  });

  it("renders subtitle when provided", () => {
    render(<UserCell name="Alice" subtitle="admin@example.com" />);
    expect(screen.getByText("admin@example.com")).toBeInTheDocument();
  });

  it("does not render subtitle when not provided", () => {
    const { container } = render(<UserCell name="Alice" />);
    // Only one text span (the name) should be in the text column
    const textCol = container.querySelector(".flex.flex-col");
    expect(textCol!.children.length).toBe(1);
  });

  it("renders an Avatar component", () => {
    const { container } = render(<UserCell name="Alice" avatarSrc="/avatar.png" />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
  });

  it.each(["sm", "md", "lg"] as const)(
    "renders with size=%s without error",
    (size) => {
      render(<UserCell name="Test" size={size} />);
      expect(screen.getByText("Test")).toBeInTheDocument();
    },
  );
});
