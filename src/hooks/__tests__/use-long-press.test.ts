import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useLongPress } from "../use-long-press";

describe("useLongPress", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns event handler functions", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useLongPress(callback));

    expect(result.current.onMouseDown).toBeTypeOf("function");
    expect(result.current.onMouseUp).toBeTypeOf("function");
    expect(result.current.onMouseLeave).toBeTypeOf("function");
    expect(result.current.onTouchStart).toBeTypeOf("function");
    expect(result.current.onTouchEnd).toBeTypeOf("function");
  });

  it("fires callback after default delay (500ms) on mouse", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useLongPress(callback));

    act(() => {
      result.current.onMouseDown({
        nativeEvent: new MouseEvent("mousedown"),
      } as any);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("fires callback after custom delay", () => {
    const callback = vi.fn();
    const { result } = renderHook(() =>
      useLongPress(callback, { delay: 1000 }),
    );

    act(() => {
      result.current.onMouseDown({
        nativeEvent: new MouseEvent("mousedown"),
      } as any);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("cancels on mouseUp before delay", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useLongPress(callback));

    act(() => {
      result.current.onMouseDown({
        nativeEvent: new MouseEvent("mousedown"),
      } as any);
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    act(() => {
      result.current.onMouseUp();
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("cancels on mouseLeave before delay", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useLongPress(callback));

    act(() => {
      result.current.onMouseDown({
        nativeEvent: new MouseEvent("mousedown"),
      } as any);
    });

    act(() => {
      result.current.onMouseLeave();
    });

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("calls onStart when press begins", () => {
    const callback = vi.fn();
    const onStart = vi.fn();
    const { result } = renderHook(() =>
      useLongPress(callback, { onStart }),
    );

    act(() => {
      result.current.onMouseDown({
        nativeEvent: new MouseEvent("mousedown"),
      } as any);
    });

    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when press is cancelled", () => {
    const callback = vi.fn();
    const onCancel = vi.fn();
    const { result } = renderHook(() =>
      useLongPress(callback, { onCancel }),
    );

    act(() => {
      result.current.onMouseDown({
        nativeEvent: new MouseEvent("mousedown"),
      } as any);
    });

    act(() => {
      result.current.onMouseUp();
    });

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("does not call onCancel when long press completes", () => {
    const callback = vi.fn();
    const onCancel = vi.fn();
    const { result } = renderHook(() =>
      useLongPress(callback, { onCancel }),
    );

    act(() => {
      result.current.onMouseDown({
        nativeEvent: new MouseEvent("mousedown"),
      } as any);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Now mouseUp after completion — timer already fired so no cancel
    act(() => {
      result.current.onMouseUp();
    });

    expect(onCancel).not.toHaveBeenCalled();
  });

  it("works with touch events", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useLongPress(callback));

    act(() => {
      result.current.onTouchStart({
        nativeEvent: new TouchEvent("touchstart"),
      } as any);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("cancels on touchEnd", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useLongPress(callback));

    act(() => {
      result.current.onTouchStart({
        nativeEvent: new TouchEvent("touchstart"),
      } as any);
    });

    act(() => {
      result.current.onTouchEnd();
    });

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(callback).not.toHaveBeenCalled();
  });
});
