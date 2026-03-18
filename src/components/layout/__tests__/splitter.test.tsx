import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { Splitter } from "../splitter";

describe("Splitter", () => {
  it("renders two panes", () => {
    render(
      <Splitter>
        <div>Pane 1</div>
        <div>Pane 2</div>
      </Splitter>
    );
    expect(screen.getByText("Pane 1")).toBeInTheDocument();
    expect(screen.getByText("Pane 2")).toBeInTheDocument();
  });

  it("renders a separator element", () => {
    render(
      <Splitter>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("has correct default aria attributes", () => {
    render(
      <Splitter>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    expect(sep).toHaveAttribute("aria-valuenow", "50");
    expect(sep).toHaveAttribute("aria-valuemin", "10");
    expect(sep).toHaveAttribute("aria-valuemax", "90");
    expect(sep).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("respects custom defaultSize", () => {
    render(
      <Splitter defaultSize={30}>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    expect(sep).toHaveAttribute("aria-valuenow", "30");
  });

  it("respects custom minSize and maxSize", () => {
    render(
      <Splitter minSize={20} maxSize={80}>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    expect(sep).toHaveAttribute("aria-valuemin", "20");
    expect(sep).toHaveAttribute("aria-valuemax", "80");
  });

  it("clamps defaultSize within min/max bounds", () => {
    render(
      <Splitter defaultSize={5} minSize={20} maxSize={80}>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    expect(sep).toHaveAttribute("aria-valuenow", "20");
  });

  it("clamps defaultSize above maxSize", () => {
    render(
      <Splitter defaultSize={95} minSize={20} maxSize={80}>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    expect(sep).toHaveAttribute("aria-valuenow", "80");
  });

  it("renders vertical orientation", () => {
    const { container } = render(
      <Splitter orientation="vertical">
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    expect(container.firstChild).toHaveAttribute("data-orientation", "vertical");
    const sep = screen.getByRole("separator");
    expect(sep).toHaveAttribute("aria-orientation", "vertical");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Splitter className="my-custom">
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    expect(container.firstChild).toHaveClass("my-custom");
  });

  it("applies custom gutterSize", () => {
    render(
      <Splitter gutterSize={12}>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    expect(sep).toHaveStyle({ width: "12px" });
  });

  it("applies vertical gutter height", () => {
    render(
      <Splitter orientation="vertical" gutterSize={12}>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    expect(sep).toHaveStyle({ height: "12px" });
  });

  it("separator is focusable via tab", () => {
    render(
      <Splitter>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    expect(sep).toHaveAttribute("tabindex", "0");
  });

  it("has aria-label on separator", () => {
    render(
      <Splitter>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    expect(sep).toHaveAttribute("aria-label", "Resize");
  });

  // Keyboard: ArrowRight increases size in horizontal
  it("ArrowRight increases size by 1% in horizontal", async () => {
    const onResize = vi.fn();
    render(
      <Splitter defaultSize={50} onResize={onResize}>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    sep.focus();
    fireEvent.keyDown(sep, { key: "ArrowRight" });
    expect(onResize).toHaveBeenCalledWith(51);
    expect(sep).toHaveAttribute("aria-valuenow", "51");
  });

  // Keyboard: ArrowLeft decreases size in horizontal
  it("ArrowLeft decreases size by 1% in horizontal", () => {
    const onResize = vi.fn();
    render(
      <Splitter defaultSize={50} onResize={onResize}>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    sep.focus();
    fireEvent.keyDown(sep, { key: "ArrowLeft" });
    expect(onResize).toHaveBeenCalledWith(49);
  });

  // Keyboard: Shift+ArrowRight increases size by 5%
  it("Shift+ArrowRight increases size by 5%", () => {
    const onResize = vi.fn();
    render(
      <Splitter defaultSize={50} onResize={onResize}>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    sep.focus();
    fireEvent.keyDown(sep, { key: "ArrowRight", shiftKey: true });
    expect(onResize).toHaveBeenCalledWith(55);
  });

  // Keyboard: Shift+ArrowLeft decreases size by 5%
  it("Shift+ArrowLeft decreases size by 5%", () => {
    const onResize = vi.fn();
    render(
      <Splitter defaultSize={50} onResize={onResize}>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    sep.focus();
    fireEvent.keyDown(sep, { key: "ArrowLeft", shiftKey: true });
    expect(onResize).toHaveBeenCalledWith(45);
  });

  // Keyboard: ArrowDown increases size in vertical
  it("ArrowDown increases size in vertical", () => {
    const onResize = vi.fn();
    render(
      <Splitter orientation="vertical" defaultSize={50} onResize={onResize}>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    sep.focus();
    fireEvent.keyDown(sep, { key: "ArrowDown" });
    expect(onResize).toHaveBeenCalledWith(51);
  });

  // Keyboard: ArrowUp decreases size in vertical
  it("ArrowUp decreases size in vertical", () => {
    const onResize = vi.fn();
    render(
      <Splitter orientation="vertical" defaultSize={50} onResize={onResize}>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    sep.focus();
    fireEvent.keyDown(sep, { key: "ArrowUp" });
    expect(onResize).toHaveBeenCalledWith(49);
  });

  // Keyboard: Home sets to min
  it("Home key sets size to minSize", () => {
    const onResize = vi.fn();
    render(
      <Splitter defaultSize={50} minSize={20} onResize={onResize}>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    sep.focus();
    fireEvent.keyDown(sep, { key: "Home" });
    expect(onResize).toHaveBeenCalledWith(20);
  });

  // Keyboard: End sets to max
  it("End key sets size to maxSize", () => {
    const onResize = vi.fn();
    render(
      <Splitter defaultSize={50} maxSize={80} onResize={onResize}>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    sep.focus();
    fireEvent.keyDown(sep, { key: "End" });
    expect(onResize).toHaveBeenCalledWith(80);
  });

  // Keyboard: respects min constraint
  it("does not go below minSize via keyboard", () => {
    const onResize = vi.fn();
    render(
      <Splitter defaultSize={11} minSize={10} onResize={onResize}>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    sep.focus();
    fireEvent.keyDown(sep, { key: "ArrowLeft" });
    expect(onResize).toHaveBeenCalledWith(10);
    fireEvent.keyDown(sep, { key: "ArrowLeft" });
    // Should still be at 10 (clamped)
    expect(sep).toHaveAttribute("aria-valuenow", "10");
  });

  // Keyboard: respects max constraint
  it("does not go above maxSize via keyboard", () => {
    const onResize = vi.fn();
    render(
      <Splitter defaultSize={89} maxSize={90} onResize={onResize}>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const sep = screen.getByRole("separator");
    sep.focus();
    fireEvent.keyDown(sep, { key: "ArrowRight" });
    expect(onResize).toHaveBeenCalledWith(90);
    fireEvent.keyDown(sep, { key: "ArrowRight" });
    expect(sep).toHaveAttribute("aria-valuenow", "90");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Splitter ref={ref}>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(Splitter.displayName).toBe("Splitter");
  });

  it("passes additional HTML attributes", () => {
    render(
      <Splitter data-custom="test" id="my-splitter">
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const el = document.getElementById("my-splitter");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("data-custom", "test");
  });

  // Mouse drag
  it("handles mousedown on gutter", () => {
    render(
      <Splitter>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const gutter = screen.getByTestId("splitter-gutter");
    // Should not throw
    fireEvent.mouseDown(gutter, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(document);
  });

  // Touch drag
  it("handles touchstart on gutter", () => {
    render(
      <Splitter>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const gutter = screen.getByTestId("splitter-gutter");
    fireEvent.touchStart(gutter, { touches: [{ clientX: 100, clientY: 100 }] });
    fireEvent.touchEnd(document);
  });

  it("renders handle dots as decorative", () => {
    render(
      <Splitter>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    const gutter = screen.getByTestId("splitter-gutter");
    const dotsContainer = gutter.querySelector("[aria-hidden='true']");
    expect(dotsContainer).toBeInTheDocument();
  });

  it("first pane has correct test id", () => {
    render(
      <Splitter>
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    expect(screen.getByTestId("splitter-pane-1")).toBeInTheDocument();
    expect(screen.getByTestId("splitter-pane-2")).toBeInTheDocument();
  });

  it("horizontal layout has flex-row", () => {
    const { container } = render(
      <Splitter orientation="horizontal">
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    expect(container.firstChild).toHaveClass("flex-row");
  });

  it("vertical layout has flex-col", () => {
    const { container } = render(
      <Splitter orientation="vertical">
        <div>A</div>
        <div>B</div>
      </Splitter>
    );
    expect(container.firstChild).toHaveClass("flex-col");
  });
});
