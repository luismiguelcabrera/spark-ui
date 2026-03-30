import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useScrollSpy } from "../use-scroll-spy";

// Mock IntersectionObserver
class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  elements: Element[] = [];
  options: IntersectionObserverInit | undefined;

  static instances: MockIntersectionObserver[] = [];

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
    this.callback = callback;
    this.options = options;
    MockIntersectionObserver.instances.push(this);
  }

  observe(el: Element) {
    this.elements.push(el);
  }

  unobserve(el: Element) {
    this.elements = this.elements.filter((e) => e !== el);
  }

  disconnect() {
    this.elements = [];
  }

  // Helper to simulate intersection changes
  triggerEntries(entries: Partial<IntersectionObserverEntry>[]) {
    this.callback(entries as IntersectionObserverEntry[], this as any);
  }
}

describe("useScrollSpy", () => {
  const originalIntersectionObserver = globalThis.IntersectionObserver;

  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    globalThis.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;

    // Create section elements
    ["section-1", "section-2", "section-3"].forEach((id) => {
      const el = document.createElement("div");
      el.id = id;
      document.body.appendChild(el);
    });
  });

  afterEach(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver;
    document.body.innerHTML = "";
  });

  it("returns null when no section is active", () => {
    const { result } = renderHook(() =>
      useScrollSpy(["section-1", "section-2", "section-3"])
    );

    expect(result.current).toBeNull();
  });

  it("observes all provided ids", () => {
    renderHook(() =>
      useScrollSpy(["section-1", "section-2", "section-3"])
    );

    const observer = MockIntersectionObserver.instances[0];
    expect(observer.elements).toHaveLength(3);
  });

  it("returns the first intersecting section id", () => {
    const { result } = renderHook(() =>
      useScrollSpy(["section-1", "section-2", "section-3"])
    );

    const observer = MockIntersectionObserver.instances[0];

    act(() => {
      observer.triggerEntries([
        {
          target: document.getElementById("section-2")!,
          isIntersecting: true,
        },
      ]);
    });

    expect(result.current).toBe("section-2");
  });

  it("returns the first intersecting id in original order when multiple are visible", () => {
    const { result } = renderHook(() =>
      useScrollSpy(["section-1", "section-2", "section-3"])
    );

    const observer = MockIntersectionObserver.instances[0];

    act(() => {
      observer.triggerEntries([
        {
          target: document.getElementById("section-2")!,
          isIntersecting: true,
        },
        {
          target: document.getElementById("section-3")!,
          isIntersecting: true,
        },
      ]);
    });

    expect(result.current).toBe("section-2");
  });

  it("updates when a section leaves the viewport", () => {
    const { result } = renderHook(() =>
      useScrollSpy(["section-1", "section-2", "section-3"])
    );

    const observer = MockIntersectionObserver.instances[0];

    act(() => {
      observer.triggerEntries([
        {
          target: document.getElementById("section-1")!,
          isIntersecting: true,
        },
        {
          target: document.getElementById("section-2")!,
          isIntersecting: true,
        },
      ]);
    });

    expect(result.current).toBe("section-1");

    act(() => {
      observer.triggerEntries([
        {
          target: document.getElementById("section-1")!,
          isIntersecting: false,
        },
      ]);
    });

    expect(result.current).toBe("section-2");
  });

  it("returns null when all sections leave viewport", () => {
    const { result } = renderHook(() =>
      useScrollSpy(["section-1", "section-2"])
    );

    const observer = MockIntersectionObserver.instances[0];

    act(() => {
      observer.triggerEntries([
        {
          target: document.getElementById("section-1")!,
          isIntersecting: true,
        },
      ]);
    });

    expect(result.current).toBe("section-1");

    act(() => {
      observer.triggerEntries([
        {
          target: document.getElementById("section-1")!,
          isIntersecting: false,
        },
      ]);
    });

    expect(result.current).toBeNull();
  });

  it("passes rootMargin to IntersectionObserver", () => {
    renderHook(() =>
      useScrollSpy(["section-1"], { rootMargin: "-100px 0px 0px 0px" })
    );

    const observer = MockIntersectionObserver.instances[0];
    expect(observer.options?.rootMargin).toBe("-100px 0px 0px 0px");
  });

  it("uses offset to compute rootMargin when rootMargin is not provided", () => {
    renderHook(() => useScrollSpy(["section-1"], { offset: 80 }));

    const observer = MockIntersectionObserver.instances[0];
    expect(observer.options?.rootMargin).toBe("-80px 0px -80% 0px");
  });

  it("disconnects observer on unmount", () => {
    const { unmount } = renderHook(() =>
      useScrollSpy(["section-1", "section-2"])
    );

    const observer = MockIntersectionObserver.instances[0];
    const disconnectSpy = vi.spyOn(observer, "disconnect");

    unmount();

    expect(disconnectSpy).toHaveBeenCalled();
  });

  it("ignores ids that do not match any DOM element", () => {
    renderHook(() =>
      useScrollSpy(["section-1", "nonexistent", "section-2"])
    );

    const observer = MockIntersectionObserver.instances[0];
    expect(observer.elements).toHaveLength(2);
  });

  it("handles empty ids array", () => {
    const { result } = renderHook(() => useScrollSpy([]));

    expect(result.current).toBeNull();
    // Should not create an observer for empty ids
    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });

  it("re-creates observer when ids change", () => {
    const { rerender } = renderHook(
      ({ ids }) => useScrollSpy(ids),
      { initialProps: { ids: ["section-1", "section-2"] } }
    );

    expect(MockIntersectionObserver.instances).toHaveLength(1);
    const firstObserver = MockIntersectionObserver.instances[0];
    const disconnectSpy = vi.spyOn(firstObserver, "disconnect");

    // Add section-3 to DOM before rerendering
    rerender({ ids: ["section-1", "section-2", "section-3"] });

    expect(disconnectSpy).toHaveBeenCalled();
    expect(MockIntersectionObserver.instances).toHaveLength(2);
  });
});
