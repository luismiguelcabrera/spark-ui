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

  it("has role=img", () => {
    render(<Avatar alt="User" />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("sets aria-label from alt", () => {
    render(<Avatar alt="User" />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "User");
  });

  it("sets aria-label from initials when no alt", () => {
    render(<Avatar initials="JD" />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "JD");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Avatar ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies size classes", () => {
    const { container } = render(<Avatar size="lg" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("w-12");
    expect(root.className).toContain("h-12");
  });

  it("applies ring classes", () => {
    const { container } = render(<Avatar ring="primary" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("ring-2");
    expect(root.className).toContain("ring-primary");
  });

  it("merges custom className", () => {
    const { container } = render(<Avatar className="custom-class" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("custom-class");
  });

  it("renders icon when icon prop is a string", () => {
    const { container } = render(<Avatar icon="user" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(screen.queryByText("?")).not.toBeInTheDocument();
  });

  it("renders custom ReactNode icon", () => {
    render(<Avatar icon={<span data-testid="custom">IC</span>} />);
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  it("applies density variant", () => {
    const { container } = render(<Avatar density="compact" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("p-0.5");
  });

  it.each(["xs", "sm", "md", "lg", "xl"] as const)(
    "renders at size %s without error",
    (size) => {
      const { container } = render(<Avatar size={size} />);
      expect(container.firstElementChild).toBeInTheDocument();
    },
  );
});
