import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useMouse } from "../use-mouse";

describe("useMouse", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns initial state with zeroed coordinates", () => {
    const { result } = renderHook(() => useMouse<HTMLDivElement>());

    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
    expect(result.current.elementX).toBe(0);
    expect(result.current.elementY).toBe(0);
    expect(result.current.elementWidth).toBe(0);
    expect(result.current.elementHeight).toBe(0);
  });

  it("returns a ref", () => {
    const { result } = renderHook(() => useMouse<HTMLDivElement>());
    expect(result.current.ref).toBeDefined();
    expect(result.current.ref.current).toBeNull();
  });

  it("updates page coordinates on mousemove", () => {
    const { result } = renderHook(() => useMouse<HTMLDivElement>());

    act(() => {
      document.dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: 100,
          clientY: 200,
        }),
      );
    });

    expect(result.current.x).toBe(100);
    expect(result.current.y).toBe(200);
  });

  it("updates element-relative coordinates when ref is set", () => {
    const { result } = renderHook(() => useMouse<HTMLDivElement>());

    const el = document.createElement("div");
    vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
      top: 50,
      left: 30,
      width: 200,
      height: 100,
      right: 230,
      bottom: 150,
      x: 30,
      y: 50,
      toJSON: () => {},
    });

    (result.current.ref as React.MutableRefObject<HTMLDivElement | null>).current = el;

    act(() => {
      document.dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: 80,
          clientY: 75,
        }),
      );
    });

    expect(result.current.elementX).toBe(50); // 80 - 30
    expect(result.current.elementY).toBe(25); // 75 - 50
    expect(result.current.elementWidth).toBe(200);
    expect(result.current.elementHeight).toBe(100);
  });

  it("cleans up event listener on unmount", () => {
    const addSpy = vi.spyOn(document, "addEventListener");
    const removeSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => useMouse<HTMLDivElement>());

    expect(addSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));
  });

  it("tracks multiple mouse moves", () => {
    const { result } = renderHook(() => useMouse<HTMLDivElement>());

    act(() => {
      document.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 10, clientY: 20 }),
      );
    });

    expect(result.current.x).toBe(10);
    expect(result.current.y).toBe(20);

    act(() => {
      document.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 300, clientY: 400 }),
      );
    });

    expect(result.current.x).toBe(300);
    expect(result.current.y).toBe(400);
  });
});
