import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Avatar, AvatarGroupContext } from "../avatar";

describe("Avatar", () => {
  // ------------------------------------------------------------------
  // Fallback rendering
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // Accessibility
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // Ref forwarding
  // ------------------------------------------------------------------
  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Avatar ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ------------------------------------------------------------------
  // Size
  // ------------------------------------------------------------------
  it("applies size classes", () => {
    const { container } = render(<Avatar size="lg" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("w-12");
    expect(root.className).toContain("h-12");
  });

  it.each(["xs", "sm", "md", "lg", "xl"] as const)(
    "renders at size %s without error",
    (size) => {
      const { container } = render(<Avatar size={size} />);
      expect(container.firstElementChild).toBeInTheDocument();
    }
  );

  // ------------------------------------------------------------------
  // Ring
  // ------------------------------------------------------------------
  it("applies ring classes", () => {
    const { container } = render(<Avatar ring="primary" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("ring-2");
    expect(root.className).toContain("ring-primary");
  });

  // ------------------------------------------------------------------
  // className merging
  // ------------------------------------------------------------------
  it("merges custom className", () => {
    const { container } = render(<Avatar className="custom-class" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("custom-class");
  });

  // ------------------------------------------------------------------
  // Icon fallback
  // ------------------------------------------------------------------
  it("renders icon when icon prop is a string", () => {
    const { container } = render(<Avatar icon="user" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(screen.queryByText("?")).not.toBeInTheDocument();
  });

  it("renders custom ReactNode icon", () => {
    render(<Avatar icon={<span data-testid="custom">IC</span>} />);
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // Color
  // ------------------------------------------------------------------
  it.each([
    "neutral",
    "primary",
    "secondary",
    "success",
    "warning",
    "destructive",
    "accent",
  ] as const)("renders color=%s without error", (color) => {
    const { container } = render(<Avatar color={color} initials="AB" />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("applies neutral color by default", () => {
    const { container } = render(<Avatar initials="AB" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("bg-gray-200");
  });

  it("applies primary color classes", () => {
    const { container } = render(<Avatar color="primary" initials="AB" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("text-primary");
  });

  // ------------------------------------------------------------------
  // Shape
  // ------------------------------------------------------------------
  it("defaults to circle shape", () => {
    const { container } = render(<Avatar />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("rounded-full");
  });

  it("applies square shape", () => {
    const { container } = render(<Avatar shape="square" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("rounded-none");
  });

  it("applies rounded shape", () => {
    const { container } = render(<Avatar shape="rounded" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("rounded-lg");
  });

  // ------------------------------------------------------------------
  // Status indicator
  // ------------------------------------------------------------------
  it("renders status indicator when status is set", () => {
    const { container } = render(<Avatar status="online" alt="User" />);
    const dot = container.querySelector("[aria-label='online']");
    expect(dot).toBeInTheDocument();
    expect(dot?.className).toContain("bg-emerald-500");
  });

  it("does not render status indicator when status is not set", () => {
    const { container } = render(<Avatar alt="User" />);
    expect(container.querySelector("[aria-label]")).toBe(
      container.firstElementChild
    );
  });

  it.each(["online", "offline", "busy", "away"] as const)(
    "renders status=%s without error",
    (status) => {
      const { container } = render(<Avatar status={status} />);
      expect(
        container.querySelector(`[aria-label='${status}']`)
      ).toBeInTheDocument();
    }
  );

  // ------------------------------------------------------------------
  // onLoadingStatusChange
  // ------------------------------------------------------------------
  it("calls onLoadingStatusChange with 'loading' when src is set", () => {
    const cb = vi.fn();
    render(<Avatar src="https://example.com/photo.jpg" onLoadingStatusChange={cb} />);
    expect(cb).toHaveBeenCalledWith("loading");
  });

  // ------------------------------------------------------------------
  // AvatarGroupContext integration
  // ------------------------------------------------------------------
  it("inherits size from AvatarGroupContext", () => {
    const { container } = render(
      <AvatarGroupContext.Provider value={{ size: "lg" }}>
        <Avatar initials="AB" />
      </AvatarGroupContext.Provider>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("w-12");
    expect(root.className).toContain("h-12");
  });

  it("inherits shape from AvatarGroupContext", () => {
    const { container } = render(
      <AvatarGroupContext.Provider value={{ size: "md", shape: "square" }}>
        <Avatar initials="AB" />
      </AvatarGroupContext.Provider>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("rounded-none");
  });

  it("explicit size prop overrides context", () => {
    const { container } = render(
      <AvatarGroupContext.Provider value={{ size: "lg" }}>
        <Avatar size="xs" initials="AB" />
      </AvatarGroupContext.Provider>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("w-6");
  });
});
