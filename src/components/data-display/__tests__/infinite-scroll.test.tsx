import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { InfiniteScroll } from "../infinite-scroll";

// Mock IntersectionObserver for jsdom
beforeEach(() => {
  globalThis.IntersectionObserver = class IntersectionObserver {
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
    constructor(
      _callback: IntersectionObserverCallback,
      _options?: IntersectionObserverInit,
    ) {}
    get root() { return null; }
    get rootMargin() { return ""; }
    get thresholds() { return []; }
    takeRecords() { return []; }
  } as unknown as typeof globalThis.IntersectionObserver;
});

describe("InfiniteScroll", () => {
  const defaultProps = {
    hasMore: true,
    loading: false,
    onLoadMore: vi.fn(),
  };

  it("renders children", () => {
    render(
      <InfiniteScroll {...defaultProps}>
        <div>Item 1</div>
      </InfiniteScroll>,
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("renders without error with required props", () => {
    const { container } = render(
      <InfiniteScroll {...defaultProps}>
        <p>Content</p>
      </InfiniteScroll>,
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <InfiniteScroll ref={ref} {...defaultProps}>
        <p>Content</p>
      </InfiniteScroll>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(InfiniteScroll.displayName).toBe("InfiniteScroll");
  });

  it("merges custom className", () => {
    const { container } = render(
      <InfiniteScroll {...defaultProps} className="custom-class">
        <p>Content</p>
      </InfiniteScroll>,
    );
    expect(container.firstElementChild!.className).toContain("custom-class");
  });

  it("shows loading indicator when loading is true", () => {
    const { container } = render(
      <InfiniteScroll {...defaultProps} loading={true}>
        <p>Content</p>
      </InfiniteScroll>,
    );
    // Spinner should be rendered (inside a flex container)
    const loadingDiv = container.querySelector(".flex.items-center.justify-center");
    expect(loadingDiv).toBeInTheDocument();
  });

  it("shows custom loader when loading", () => {
    render(
      <InfiniteScroll {...defaultProps} loading={true} loader={<span>Loading...</span>}>
        <p>Content</p>
      </InfiniteScroll>,
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows end message when hasMore is false and not loading", () => {
    render(
      <InfiniteScroll {...defaultProps} hasMore={false} loading={false} endMessage="No more items">
        <p>Content</p>
      </InfiniteScroll>,
    );
    expect(screen.getByText("No more items")).toBeInTheDocument();
  });

  it("does not show end message when still loading", () => {
    render(
      <InfiniteScroll {...defaultProps} hasMore={false} loading={true} endMessage="No more items">
        <p>Content</p>
      </InfiniteScroll>,
    );
    expect(screen.queryByText("No more items")).not.toBeInTheDocument();
  });

  it("does not show end message when hasMore is true", () => {
    render(
      <InfiniteScroll {...defaultProps} hasMore={true} endMessage="No more items">
        <p>Content</p>
      </InfiniteScroll>,
    );
    expect(screen.queryByText("No more items")).not.toBeInTheDocument();
  });
});
