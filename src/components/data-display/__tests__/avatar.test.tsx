import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Avatar } from "../avatar";

describe("Avatar", () => {
  it("renders initials when no src", () => {
    render(<Avatar initials="JD" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("derives initial from alt text", () => {
    render(<Avatar alt="Alice" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("shows fallback when no src or alt", () => {
    render(<Avatar />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("renders an img when src is provided", () => {
    render(<Avatar src="https://example.com/photo.jpg" alt="User" />);
    expect(screen.getByAltText("User")).toBeInTheDocument();
  });

  // --- New: icon prop ---
  describe("icon prop", () => {
    it("renders an Icon when icon prop is provided and no src", () => {
      const { container } = render(<Avatar icon="person" />);
      // Icon renders as a span (Material Symbols fallback) or SVG
      const root = screen.getByTestId("avatar-root");
      expect(root).toBeInTheDocument();
      // Should not show fallback "?"
      expect(screen.queryByText("?")).not.toBeInTheDocument();
    });

    it("prefers image over icon when both src and icon provided", () => {
      render(<Avatar src="https://example.com/photo.jpg" alt="User" icon="person" />);
      expect(screen.getByAltText("User")).toBeInTheDocument();
    });

    it("does not render initials when icon is provided", () => {
      render(<Avatar icon="person" initials="JD" />);
      expect(screen.queryByText("JD")).not.toBeInTheDocument();
    });
  });

  // --- New: density prop ---
  describe("density prop", () => {
    it("applies compact density classes", () => {
      const { container } = render(<Avatar density="compact" size="md" />);
      const root = screen.getByTestId("avatar-root");
      // compact md = w-8 h-8 override
      expect(root.className).toContain("w-8");
      expect(root.className).toContain("h-8");
    });

    it("applies comfortable density classes", () => {
      const { container } = render(<Avatar density="comfortable" size="md" />);
      const root = screen.getByTestId("avatar-root");
      expect(root.className).toContain("w-11");
      expect(root.className).toContain("h-11");
    });

    it("default density does not add extra classes", () => {
      const { container } = render(<Avatar density="default" size="md" />);
      const root = screen.getByTestId("avatar-root");
      // default md = w-10 h-10 (from base variants)
      expect(root.className).toContain("w-10");
      expect(root.className).toContain("h-10");
    });

    it.each(["xs", "sm", "md", "lg", "xl"] as const)(
      "renders compact density at size %s",
      (size) => {
        render(<Avatar density="compact" size={size} />);
        expect(screen.getByTestId("avatar-root")).toBeInTheDocument();
      },
    );
  });
});
