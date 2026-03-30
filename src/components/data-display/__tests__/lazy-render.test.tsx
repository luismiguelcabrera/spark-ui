import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRef } from "react";
import { LazyRender } from "../lazy-render";

/* -------------------------------------------------------------------------- */
/*  IntersectionObserver mock                                                  */
/* -------------------------------------------------------------------------- */

type IntersectionCallback = (entries: IntersectionObserverEntry[]) => void;

let observerCallback: IntersectionCallback;
let observerInstance: {
  observe: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  observerInstance = {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };

  // Use a function expression (not arrow) so vitest recognizes it as class-like
  const MockIntersectionObserver = vi.fn(function (
    this: unknown,
    callback: IntersectionCallback,
  ) {
    observerCallback = callback;
    return observerInstance;
  });

  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

function simulateIntersection(isIntersecting: boolean) {
  act(() => {
    observerCallback([{ isIntersecting } as IntersectionObserverEntry]);
  });
}

describe("LazyRender", () => {
  it("shows placeholder before intersection", () => {
    render(
      <LazyRender placeholder={<span>Loading...</span>}>
        <span>Content</span>
      </LazyRender>,
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("shows nothing when no placeholder and not visible", () => {
    const { container } = render(
      <LazyRender>
        <span>Content</span>
      </LazyRender>,
    );
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
    // Container should be rendered but empty (just the wrapper div)
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders children after intersection", () => {
    render(
      <LazyRender placeholder={<span>Loading...</span>}>
        <span>Content</span>
      </LazyRender>,
    );

    simulateIntersection(true);

    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("unobserves after first intersection when once=true (default)", () => {
    render(
      <LazyRender>
        <span>Content</span>
      </LazyRender>,
    );

    simulateIntersection(true);

    expect(observerInstance.unobserve).toHaveBeenCalled();
  });

  it("does not unobserve when once=false", () => {
    render(
      <LazyRender once={false}>
        <span>Content</span>
      </LazyRender>,
    );

    simulateIntersection(true);

    expect(observerInstance.unobserve).not.toHaveBeenCalled();
  });

  it("hides children again when element leaves viewport and once=false", () => {
    render(
      <LazyRender once={false} placeholder={<span>Placeholder</span>}>
        <span>Content</span>
      </LazyRender>,
    );

    simulateIntersection(true);
    expect(screen.getByText("Content")).toBeInTheDocument();

    simulateIntersection(false);
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
    expect(screen.getByText("Placeholder")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <LazyRender ref={ref}>
        <span>Content</span>
      </LazyRender>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges custom className", () => {
    const { container } = render(
      <LazyRender className="my-lazy">
        <span>Content</span>
      </LazyRender>,
    );
    expect(container.firstChild).toHaveClass("my-lazy");
  });

  it("passes rootMargin and threshold to IntersectionObserver", () => {
    render(
      <LazyRender rootMargin="200px 0px" threshold={0.5}>
        <span>Content</span>
      </LazyRender>,
    );

    expect(IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      rootMargin: "200px 0px",
      threshold: 0.5,
    });
  });

  it("observes the sentinel element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <LazyRender ref={ref}>
        <span>Content</span>
      </LazyRender>,
    );
    expect(observerInstance.observe).toHaveBeenCalledWith(ref.current);
  });

  it("disconnects observer on unmount", () => {
    const { unmount } = render(
      <LazyRender>
        <span>Content</span>
      </LazyRender>,
    );
    unmount();
    expect(observerInstance.disconnect).toHaveBeenCalled();
  });
});
