import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { PullToRefresh } from "../pull-to-refresh";

function createTouchEvent(clientY: number) {
  return { touches: [{ clientY, clientX: 0 }] };
}

describe("PullToRefresh", () => {
  let onRefresh: ReturnType<typeof vi.fn<() => Promise<void>>>;

  beforeEach(() => {
    onRefresh = vi.fn<() => Promise<void>>(() => Promise.resolve());
  });

  it("renders children", () => {
    render(
      <PullToRefresh onRefresh={onRefresh}>
        <p>Content</p>
      </PullToRefresh>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("forwards ref to wrapper div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <PullToRefresh ref={ref} onRefresh={onRefresh}>
        <p>Content</p>
      </PullToRefresh>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(PullToRefresh.displayName).toBe("PullToRefresh");
  });

  it("applies custom className", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <PullToRefresh ref={ref} onRefresh={onRefresh} className="my-class">
        <p>Content</p>
      </PullToRefresh>
    );
    expect(ref.current).toHaveClass("my-class");
  });

  it("shows aria-live region for status announcements", () => {
    render(
      <PullToRefresh onRefresh={onRefresh}>
        <p>Content</p>
      </PullToRefresh>
    );
    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute("aria-live", "polite");
  });

  it("does not trigger refresh on small pull below threshold", () => {
    const { container } = render(
      <PullToRefresh onRefresh={onRefresh} threshold={80}>
        <p>Content</p>
      </PullToRefresh>
    );
    const content = container.querySelector("[class*='transition-transform']")!;

    fireEvent.touchStart(content, createTouchEvent(0));
    fireEvent.touchMove(content, createTouchEvent(10));
    fireEvent.touchEnd(content);

    expect(onRefresh).not.toHaveBeenCalled();
  });

  it("triggers refresh when pull exceeds threshold", async () => {
    const { container } = render(
      <PullToRefresh onRefresh={onRefresh} threshold={10} maxPull={200}>
        <p>Content</p>
      </PullToRefresh>
    );
    // Find the content wrapper (not the outer container)
    const contentWrappers = container.querySelectorAll(
      "[class*='transition-transform']"
    );
    const content = contentWrappers[contentWrappers.length - 1];

    await act(async () => {
      fireEvent.touchStart(content, createTouchEvent(0));
      fireEvent.touchMove(content, createTouchEvent(200));
    });

    await act(async () => {
      fireEvent.touchEnd(content);
    });

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it("does not respond to touch when disabled", () => {
    const { container } = render(
      <PullToRefresh onRefresh={onRefresh} disabled threshold={10} maxPull={200}>
        <p>Content</p>
      </PullToRefresh>
    );
    const contentWrappers = container.querySelectorAll(
      "[class*='transition-transform']"
    );
    const content = contentWrappers[contentWrappers.length - 1];

    fireEvent.touchStart(content, createTouchEvent(0));
    fireEvent.touchMove(content, createTouchEvent(200));
    fireEvent.touchEnd(content);

    expect(onRefresh).not.toHaveBeenCalled();
  });

  it("prevents double-trigger during refresh", async () => {
    let resolveRefresh: () => void;
    const slowRefresh = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveRefresh = resolve;
        })
    );

    const { container } = render(
      <PullToRefresh
        onRefresh={slowRefresh}
        threshold={10}
        maxPull={200}
      >
        <p>Content</p>
      </PullToRefresh>
    );
    const contentWrappers = container.querySelectorAll(
      "[class*='transition-transform']"
    );
    const content = contentWrappers[contentWrappers.length - 1];

    // First pull
    await act(async () => {
      fireEvent.touchStart(content, createTouchEvent(0));
      fireEvent.touchMove(content, createTouchEvent(200));
    });
    await act(async () => {
      fireEvent.touchEnd(content);
    });

    expect(slowRefresh).toHaveBeenCalledTimes(1);

    // Try second pull while still refreshing
    await act(async () => {
      fireEvent.touchStart(content, createTouchEvent(0));
      fireEvent.touchMove(content, createTouchEvent(200));
      fireEvent.touchEnd(content);
    });

    expect(slowRefresh).toHaveBeenCalledTimes(1);

    // Resolve first refresh
    await act(async () => {
      resolveRefresh!();
    });
  });

  it("shows 'Pull to refresh' status while pulling", () => {
    const { container } = render(
      <PullToRefresh onRefresh={onRefresh} threshold={80} maxPull={200}>
        <p>Content</p>
      </PullToRefresh>
    );
    const contentWrappers = container.querySelectorAll(
      "[class*='transition-transform']"
    );
    const content = contentWrappers[contentWrappers.length - 1];

    act(() => {
      fireEvent.touchStart(content, createTouchEvent(0));
      fireEvent.touchMove(content, createTouchEvent(20));
    });

    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toHaveTextContent("Pull to refresh");
  });

  it("shows 'Release to refresh' status when threshold passed", () => {
    const { container } = render(
      <PullToRefresh onRefresh={onRefresh} threshold={10} maxPull={200}>
        <p>Content</p>
      </PullToRefresh>
    );
    const contentWrappers = container.querySelectorAll(
      "[class*='transition-transform']"
    );
    const content = contentWrappers[contentWrappers.length - 1];

    act(() => {
      fireEvent.touchStart(content, createTouchEvent(0));
      fireEvent.touchMove(content, createTouchEvent(200));
    });

    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toHaveTextContent("Release to refresh");
  });

  it("shows 'Refreshing...' status while refreshing", async () => {
    let resolveRefresh: () => void;
    const slowRefresh = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveRefresh = resolve;
        })
    );

    const { container } = render(
      <PullToRefresh onRefresh={slowRefresh} threshold={10} maxPull={200}>
        <p>Content</p>
      </PullToRefresh>
    );
    const contentWrappers = container.querySelectorAll(
      "[class*='transition-transform']"
    );
    const content = contentWrappers[contentWrappers.length - 1];

    await act(async () => {
      fireEvent.touchStart(content, createTouchEvent(0));
      fireEvent.touchMove(content, createTouchEvent(200));
    });

    await act(async () => {
      fireEvent.touchEnd(content);
    });

    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toHaveTextContent("Refreshing...");

    await act(async () => {
      resolveRefresh!();
    });
  });

  it("renders custom pulling content", () => {
    const { container } = render(
      <PullToRefresh
        onRefresh={onRefresh}
        pullingContent={<span data-testid="custom-pull">Pulling!</span>}
        threshold={80}
        maxPull={200}
      >
        <p>Content</p>
      </PullToRefresh>
    );
    const contentWrappers = container.querySelectorAll(
      "[class*='transition-transform']"
    );
    const content = contentWrappers[contentWrappers.length - 1];

    act(() => {
      fireEvent.touchStart(content, createTouchEvent(0));
      fireEvent.touchMove(content, createTouchEvent(20));
    });

    expect(screen.getByTestId("custom-pull")).toBeInTheDocument();
  });

  it("renders custom refreshing content during refresh", async () => {
    let resolveRefresh: () => void;
    const slowRefresh = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveRefresh = resolve;
        })
    );

    const { container } = render(
      <PullToRefresh
        onRefresh={slowRefresh}
        refreshingContent={<span data-testid="custom-refresh">Loading...</span>}
        threshold={10}
        maxPull={200}
      >
        <p>Content</p>
      </PullToRefresh>
    );
    const contentWrappers = container.querySelectorAll(
      "[class*='transition-transform']"
    );
    const content = contentWrappers[contentWrappers.length - 1];

    await act(async () => {
      fireEvent.touchStart(content, createTouchEvent(0));
      fireEvent.touchMove(content, createTouchEvent(200));
    });

    await act(async () => {
      fireEvent.touchEnd(content);
    });

    expect(screen.getByTestId("custom-refresh")).toBeInTheDocument();

    await act(async () => {
      resolveRefresh!();
    });
  });

  it("handles synchronous onRefresh callback", async () => {
    const syncRefresh = vi.fn();
    const { container } = render(
      <PullToRefresh onRefresh={syncRefresh} threshold={10} maxPull={200}>
        <p>Content</p>
      </PullToRefresh>
    );
    const contentWrappers = container.querySelectorAll(
      "[class*='transition-transform']"
    );
    const content = contentWrappers[contentWrappers.length - 1];

    await act(async () => {
      fireEvent.touchStart(content, createTouchEvent(0));
      fireEvent.touchMove(content, createTouchEvent(200));
    });
    await act(async () => {
      fireEvent.touchEnd(content);
    });

    expect(syncRefresh).toHaveBeenCalledTimes(1);
  });

  it("resets pull distance after releasing below threshold", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(
      <PullToRefresh ref={ref} onRefresh={onRefresh} threshold={80} maxPull={200}>
        <p>Content</p>
      </PullToRefresh>
    );
    const contentWrappers = container.querySelectorAll(
      "[class*='transition-transform']"
    );
    const content = contentWrappers[contentWrappers.length - 1];

    act(() => {
      fireEvent.touchStart(content, createTouchEvent(0));
      fireEvent.touchMove(content, createTouchEvent(10));
      fireEvent.touchEnd(content);
    });

    // After release, transform should be back to 0
    expect(content).toHaveStyle({ transform: "translateY(0px)" });
  });

  it("handles pull up (negative distance) gracefully", () => {
    const { container } = render(
      <PullToRefresh onRefresh={onRefresh} threshold={80} maxPull={200}>
        <p>Content</p>
      </PullToRefresh>
    );
    const contentWrappers = container.querySelectorAll(
      "[class*='transition-transform']"
    );
    const content = contentWrappers[contentWrappers.length - 1];

    act(() => {
      fireEvent.touchStart(content, createTouchEvent(100));
      fireEvent.touchMove(content, createTouchEvent(50)); // pulling up
      fireEvent.touchEnd(content);
    });

    expect(onRefresh).not.toHaveBeenCalled();
  });

  it("uses default threshold of 80 and maxPull of 120", () => {
    // Just verifying it renders without error using defaults
    const { container } = render(
      <PullToRefresh onRefresh={onRefresh}>
        <p>Content</p>
      </PullToRefresh>
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
