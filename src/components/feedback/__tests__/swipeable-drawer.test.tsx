import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { SwipeableDrawer } from "../swipeable-drawer";

function createTouchEvent(clientX: number, clientY: number = 0) {
  return { touches: [{ clientX, clientY }] };
}

describe("SwipeableDrawer", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.style.overflow = "";
  });

  it("renders children when open", () => {
    render(
      <SwipeableDrawer open>
        <p>Drawer Content</p>
      </SwipeableDrawer>
    );
    expect(screen.getByText("Drawer Content")).toBeInTheDocument();
  });

  it("renders children even when closed (for CSS transform animation)", () => {
    render(
      <SwipeableDrawer open={false}>
        <p>Drawer Content</p>
      </SwipeableDrawer>
    );
    // The drawer panel is in the DOM but transformed off-screen
    expect(screen.getByText("Drawer Content")).toBeInTheDocument();
  });

  it("has displayName", () => {
    expect(SwipeableDrawer.displayName).toBe("SwipeableDrawer");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <SwipeableDrawer ref={ref} open>
        <p>Content</p>
      </SwipeableDrawer>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has role=dialog and aria-modal when open", () => {
    render(
      <SwipeableDrawer open>
        <p>Content</p>
      </SwipeableDrawer>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("uses title as aria-label", () => {
    render(
      <SwipeableDrawer open title="Navigation">
        <p>Content</p>
      </SwipeableDrawer>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-label", "Navigation");
  });

  it("uses 'Drawer' as default aria-label when no title", () => {
    render(
      <SwipeableDrawer open>
        <p>Content</p>
      </SwipeableDrawer>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-label", "Drawer");
  });

  it("renders title in header", () => {
    render(
      <SwipeableDrawer open title="Menu">
        <p>Content</p>
      </SwipeableDrawer>
    );
    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  it("renders close button when title is present", () => {
    render(
      <SwipeableDrawer open title="Menu">
        <p>Content</p>
      </SwipeableDrawer>
    );
    expect(screen.getByLabelText("Close drawer")).toBeInTheDocument();
  });

  it("closes on close button click", () => {
    const onOpenChange = vi.fn();
    render(
      <SwipeableDrawer open onOpenChange={onOpenChange} title="Menu">
        <p>Content</p>
      </SwipeableDrawer>
    );
    fireEvent.click(screen.getByLabelText("Close drawer"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes on overlay click", () => {
    const onOpenChange = vi.fn();
    render(
      <SwipeableDrawer open onOpenChange={onOpenChange} overlay>
        <p>Content</p>
      </SwipeableDrawer>
    );
    const overlay = screen.getByTestId("drawer-overlay");
    fireEvent.click(overlay);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not show overlay when overlay=false", () => {
    render(
      <SwipeableDrawer open overlay={false}>
        <p>Content</p>
      </SwipeableDrawer>
    );
    expect(screen.queryByTestId("drawer-overlay")).not.toBeInTheDocument();
  });

  it("closes on Escape key", () => {
    const onOpenChange = vi.fn();
    render(
      <SwipeableDrawer open onOpenChange={onOpenChange}>
        <p>Content</p>
      </SwipeableDrawer>
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("applies custom className to drawer panel", () => {
    render(
      <SwipeableDrawer open className="custom-drawer">
        <p>Content</p>
      </SwipeableDrawer>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("custom-drawer");
  });

  it("renders left side drawer with rounded-r-2xl", () => {
    render(
      <SwipeableDrawer open side="left">
        <p>Content</p>
      </SwipeableDrawer>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toContain("rounded-r-2xl");
  });

  it("renders right side drawer with rounded-l-2xl", () => {
    render(
      <SwipeableDrawer open side="right">
        <p>Content</p>
      </SwipeableDrawer>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toContain("rounded-l-2xl");
  });

  it("renders bottom drawer with rounded-t-2xl and drag handle", () => {
    render(
      <SwipeableDrawer open side="bottom">
        <p>Content</p>
      </SwipeableDrawer>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toContain("rounded-t-2xl");
    // Drag handle indicator (w-10 h-1)
    const handle = dialog.querySelector(".w-10.h-1");
    expect(handle).toBeInTheDocument();
  });

  it("works as uncontrolled with defaultOpen", () => {
    render(
      <SwipeableDrawer defaultOpen title="Menu">
        <p>Content</p>
      </SwipeableDrawer>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("shows edge swipe area when closed", () => {
    render(
      <SwipeableDrawer open={false} side="left">
        <p>Content</p>
      </SwipeableDrawer>
    );
    expect(screen.getByTestId("swipe-edge-area")).toBeInTheDocument();
  });

  it("hides edge swipe area when open", () => {
    render(
      <SwipeableDrawer open side="left">
        <p>Content</p>
      </SwipeableDrawer>
    );
    expect(screen.queryByTestId("swipe-edge-area")).not.toBeInTheDocument();
  });

  it("applies custom width via style", () => {
    render(
      <SwipeableDrawer open side="left" width={400}>
        <p>Content</p>
      </SwipeableDrawer>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.style.width).toBe("400px");
  });

  it("applies custom height for bottom drawer", () => {
    render(
      <SwipeableDrawer open side="bottom" height="60vh">
        <p>Content</p>
      </SwipeableDrawer>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.style.height).toBe("60vh");
  });

  it("locks body scroll when open", () => {
    const { unmount } = render(
      <SwipeableDrawer open>
        <p>Content</p>
      </SwipeableDrawer>
    );
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
  });

  it("restores body scroll on unmount", () => {
    document.body.style.overflow = "auto";
    const { unmount } = render(
      <SwipeableDrawer open>
        <p>Content</p>
      </SwipeableDrawer>
    );
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });
});
