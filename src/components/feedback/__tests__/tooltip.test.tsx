import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Tooltip } from "../tooltip";

describe("Tooltip", () => {
  it("renders children", () => {
    render(
      <Tooltip content="Help text">
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("does not show tooltip content initially", () => {
    render(
      <Tooltip content="Help text">
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows tooltip on mouse enter", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Help text">
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    await user.hover(screen.getByText("Hover me"));
    expect(screen.getByRole("tooltip")).toHaveTextContent("Help text");
  });

  it("hides tooltip on mouse leave", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Help text">
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    await user.hover(screen.getByText("Hover me"));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await user.unhover(screen.getByText("Hover me"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows tooltip on focus", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Focus tip">
        <button type="button">Tab to me</button>
      </Tooltip>,
    );
    await user.tab();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Focus tip");
  });

  it("sets aria-describedby on trigger when open", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Described">
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    await user.hover(screen.getByText("Trigger"));
    const tooltip = screen.getByRole("tooltip");
    const triggerId = tooltip.id;
    expect(screen.getByText("Trigger").parentElement).toHaveAttribute(
      "aria-describedby",
      triggerId,
    );
  });

  it("does not set aria-describedby when closed", () => {
    render(
      <Tooltip content="Described">
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    expect(screen.getByText("Trigger").parentElement).not.toHaveAttribute(
      "aria-describedby",
    );
  });

  it.each(["top", "bottom", "left", "right"] as const)(
    "applies position %s",
    async (pos) => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tip" position={pos}>
          <span>Target</span>
        </Tooltip>,
      );
      await user.hover(screen.getByText("Target"));
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    },
  );

  it("applies dark variant by default", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Dark">
        <span>T</span>
      </Tooltip>,
    );
    await user.hover(screen.getByText("T"));
    expect(screen.getByRole("tooltip")).toHaveClass("bg-slate-900");
  });

  it("applies light variant", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Light" variant="light">
        <span>T</span>
      </Tooltip>,
    );
    await user.hover(screen.getByText("T"));
    expect(screen.getByRole("tooltip")).toHaveClass("bg-white");
  });

  it("does not show tooltip when disabled", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Disabled tip" disabled>
        <span>Disabled</span>
      </Tooltip>,
    );
    await user.hover(screen.getByText("Disabled"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("forwards ref to wrapper span", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(
      <Tooltip ref={ref} content="Ref test">
        <span>Child</span>
      </Tooltip>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("merges className", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(
      <Tooltip ref={ref} content="Class" className="custom">
        <span>Child</span>
      </Tooltip>,
    );
    expect(ref.current).toHaveClass("custom");
  });
});

describe("Tooltip (controlled)", () => {
  it("shows when open is true", () => {
    render(
      <Tooltip content="Controlled" open={true}>
        <span>Trigger</span>
      </Tooltip>,
    );
    expect(screen.getByRole("tooltip")).toHaveTextContent("Controlled");
  });

  it("hides when open is false", () => {
    render(
      <Tooltip content="Controlled" open={false}>
        <span>Trigger</span>
      </Tooltip>,
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("calls onOpenChange on hover", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Tooltip content="Controlled" open={false} onOpenChange={onOpenChange}>
        <span>Trigger</span>
      </Tooltip>,
    );
    await user.hover(screen.getByText("Trigger"));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

describe("Tooltip (delay)", () => {
  it("accepts openDelay prop without error", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Delayed" openDelay={0}>
        <span>Hover</span>
      </Tooltip>,
    );
    await user.hover(screen.getByText("Hover"));
    expect(screen.getByRole("tooltip")).toHaveTextContent("Delayed");
  });

  it("accepts closeDelay prop without error", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Sticky" closeDelay={0}>
        <span>Hover</span>
      </Tooltip>,
    );
    await user.hover(screen.getByText("Hover"));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await user.unhover(screen.getByText("Hover"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("calls onOpenChange with delay props set", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Tooltip content="D" openDelay={0} closeDelay={0} open={false} onOpenChange={onOpenChange}>
        <span>Hover</span>
      </Tooltip>,
    );
    await user.hover(screen.getByText("Hover"));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

describe("Tooltip (arrow)", () => {
  it("renders arrow styles by default", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Arrow" position="top">
        <span>T</span>
      </Tooltip>,
    );
    await user.hover(screen.getByText("T"));
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.className).toContain("after:");
  });

  it("omits arrow styles when arrow is false", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="No arrow" arrow={false}>
        <span>T</span>
      </Tooltip>,
    );
    await user.hover(screen.getByText("T"));
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.className).not.toContain("after:");
  });
});
