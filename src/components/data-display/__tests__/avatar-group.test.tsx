import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AvatarGroup } from "../avatar-group";
import { Avatar } from "../avatar";

describe("AvatarGroup", () => {
  // ------------------------------------------------------------------
  // Basic rendering
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // Accessibility
  // ------------------------------------------------------------------
  it("has role=group", () => {
    render(
      <AvatarGroup>
        <span>A</span>
      </AvatarGroup>
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("has a default aria-label with user count", () => {
    render(
      <AvatarGroup>
        <span>A1</span>
        <span>A2</span>
        <span>A3</span>
      </AvatarGroup>
    );
    expect(screen.getByRole("group")).toHaveAttribute(
      "aria-label",
      "Avatar group, 3 users"
    );
  });

  it("accepts custom aria-label", () => {
    render(
      <AvatarGroup aria-label="Team members">
        <span>A</span>
      </AvatarGroup>
    );
    expect(screen.getByRole("group")).toHaveAttribute(
      "aria-label",
      "Team members"
    );
  });

  it("excess counter has aria-label", () => {
    render(
      <AvatarGroup max={1}>
        <span>A1</span>
        <span>A2</span>
        <span>A3</span>
      </AvatarGroup>
    );
    const counter = screen.getByText("+2");
    expect(counter).toHaveAttribute("aria-label", "2 more users");
  });

  // ------------------------------------------------------------------
  // max prop
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // Size propagation via context
  // ------------------------------------------------------------------
  it("propagates size to child Avatars via context", () => {
    const { container } = render(
      <AvatarGroup size="lg">
        <Avatar initials="AB" />
      </AvatarGroup>
    );
    // The Avatar should pick up lg size (w-12 h-12) from context
    const avatar = container.querySelector("[role='img']") as HTMLElement;
    expect(avatar.className).toContain("w-12");
  });

  it("propagates shape to child Avatars via context", () => {
    const { container } = render(
      <AvatarGroup size="md" shape="square">
        <Avatar initials="AB" />
      </AvatarGroup>
    );
    const avatar = container.querySelector("[role='img']") as HTMLElement;
    expect(avatar.className).toContain("rounded-none");
  });

  // ------------------------------------------------------------------
  // borderColor
  // ------------------------------------------------------------------
  it("applies white border by default", () => {
    const { container } = render(
      <AvatarGroup>
        <span>A1</span>
        <span>A2</span>
      </AvatarGroup>
    );
    const wrapper = container.querySelector(".ring-white");
    expect(wrapper).toBeInTheDocument();
  });

  it("applies dark border when specified", () => {
    const { container } = render(
      <AvatarGroup borderColor="dark">
        <span>A1</span>
        <span>A2</span>
      </AvatarGroup>
    );
    const wrapper = container.querySelector(".ring-gray-900");
    expect(wrapper).toBeInTheDocument();
  });

  it("removes border ring when borderColor=none", () => {
    const { container } = render(
      <AvatarGroup borderColor="none">
        <span>A1</span>
        <span>A2</span>
      </AvatarGroup>
    );
    expect(container.querySelector(".ring-2")).not.toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // renderExcess
  // ------------------------------------------------------------------
  it("uses renderExcess for custom counter", () => {
    render(
      <AvatarGroup max={1} renderExcess={(n) => <span data-testid="custom-counter">and {n} more</span>}>
        <span>A1</span>
        <span>A2</span>
        <span>A3</span>
      </AvatarGroup>
    );
    expect(screen.getByTestId("custom-counter")).toHaveTextContent(
      "and 2 more"
    );
    expect(screen.queryByText("+2")).not.toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // reversed
  // ------------------------------------------------------------------
  it("applies z-index when reversed", () => {
    const { container } = render(
      <AvatarGroup reversed>
        <span>A1</span>
        <span>A2</span>
        <span>A3</span>
      </AvatarGroup>
    );
    const wrappers = container.querySelectorAll("[style]");
    expect(wrappers).toHaveLength(3);
    expect((wrappers[0] as HTMLElement).style.zIndex).toBe("3");
    expect((wrappers[1] as HTMLElement).style.zIndex).toBe("2");
    expect((wrappers[2] as HTMLElement).style.zIndex).toBe("1");
  });

  it("does not apply z-index when not reversed", () => {
    const { container } = render(
      <AvatarGroup>
        <span>A1</span>
        <span>A2</span>
      </AvatarGroup>
    );
    const wrappers = container.querySelectorAll("[style]");
    expect(wrappers).toHaveLength(0);
  });

  // ------------------------------------------------------------------
  // Spacing + size combinations
  // ------------------------------------------------------------------
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
