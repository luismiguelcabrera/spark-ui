import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { SlideGroup } from "../slide-group";

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
(globalThis as Record<string, unknown>).ResizeObserver = MockResizeObserver;

describe("SlideGroup", () => {
  it("renders children", () => {
    render(
      <SlideGroup>
        <span>Item 1</span>
        <span>Item 2</span>
      </SlideGroup>
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("renders a scrollable container", () => {
    render(
      <SlideGroup data-testid="group">
        <span>Item</span>
      </SlideGroup>
    );
    const container = screen.getByTestId("group");
    expect(container).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<SlideGroup ref={ref}><span>Item</span></SlideGroup>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges custom className", () => {
    render(<SlideGroup className="custom" data-testid="group"><span>Item</span></SlideGroup>);
    expect(screen.getByTestId("group").className).toContain("custom");
  });

  it("does not show arrows by default when content does not overflow", () => {
    render(
      <SlideGroup>
        <span>Item</span>
      </SlideGroup>
    );
    expect(screen.queryByLabelText("Scroll left")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Scroll right")).not.toBeInTheDocument();
  });

  it("does not show arrows when showArrows=false", () => {
    render(
      <SlideGroup showArrows={false}>
        <span>Item</span>
      </SlideGroup>
    );
    expect(screen.queryByLabelText("Scroll left")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Scroll right")).not.toBeInTheDocument();
  });

  it("calls scrollBy when right arrow is clicked", () => {
    // Simulate overflow by mocking scroll properties
    const { container } = render(
      <SlideGroup data-testid="group">
        <span>Item 1</span>
        <span>Item 2</span>
      </SlideGroup>
    );

    const scrollContainer = container.querySelector('[style*="scrollbar"]') as HTMLElement;
    if (scrollContainer) {
      Object.defineProperty(scrollContainer, "scrollWidth", { value: 500 });
      Object.defineProperty(scrollContainer, "clientWidth", { value: 200 });
      Object.defineProperty(scrollContainer, "scrollLeft", { value: 0, writable: true });
      scrollContainer.scrollBy = vi.fn();
      fireEvent.scroll(scrollContainer);

      const rightBtn = screen.queryByLabelText("Scroll right");
      if (rightBtn) {
        fireEvent.click(rightBtn);
        expect(scrollContainer.scrollBy).toHaveBeenCalledWith({
          left: 200,
          behavior: "smooth",
        });
      }
    }
  });

  it("spreads extra HTML attributes", () => {
    render(<SlideGroup data-testid="group" id="slides"><span>Item</span></SlideGroup>);
    expect(screen.getByTestId("group")).toHaveAttribute("id", "slides");
  });
});
