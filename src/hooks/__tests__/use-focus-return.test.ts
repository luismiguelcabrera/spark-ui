import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useFocusReturn } from "../use-focus-return";

describe("useFocusReturn", () => {
  let button: HTMLButtonElement;

  beforeEach(() => {
    vi.useFakeTimers();
    button = document.createElement("button");
    button.textContent = "Focus Target";
    document.body.appendChild(button);
    button.focus();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("captures the previously focused element when opened becomes true", () => {
    const focusSpy = vi.spyOn(button, "focus");

    const { rerender } = renderHook(
      ({ opened }) => useFocusReturn({ opened }),
      { initialProps: { opened: false } }
    );

    rerender({ opened: true });

    // Focus should be captured but not yet restored
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it("restores focus when opened becomes false", () => {
    const focusSpy = vi.spyOn(button, "focus");

    const { rerender } = renderHook(
      ({ opened }) => useFocusReturn({ opened }),
      { initialProps: { opened: false } }
    );

    rerender({ opened: true });
    rerender({ opened: false });

    // requestAnimationFrame is used, so we need to flush it
    vi.advanceTimersByTime(16);

    expect(focusSpy).toHaveBeenCalled();
  });

  it("restores focus on unmount when still opened", () => {
    const focusSpy = vi.spyOn(button, "focus");

    const { rerender, unmount } = renderHook(
      ({ opened }) => useFocusReturn({ opened }),
      { initialProps: { opened: false } }
    );

    rerender({ opened: true });

    unmount();

    // The unmount cleanup calls focus synchronously
    expect(focusSpy).toHaveBeenCalled();
  });

  it("does not restore focus if opened was never true", () => {
    const focusSpy = vi.spyOn(button, "focus");

    const { unmount } = renderHook(() => useFocusReturn({ opened: false }));

    unmount();

    vi.advanceTimersByTime(16);

    // focus() should not have been called (beyond the initial button.focus() in beforeEach)
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it("defaults opened to false when no options provided", () => {
    const focusSpy = vi.spyOn(button, "focus");

    const { unmount } = renderHook(() => useFocusReturn());

    unmount();

    vi.advanceTimersByTime(16);

    expect(focusSpy).not.toHaveBeenCalled();
  });

  it("handles multiple open/close cycles", () => {
    const focusSpy = vi.spyOn(button, "focus");

    const { rerender } = renderHook(
      ({ opened }) => useFocusReturn({ opened }),
      { initialProps: { opened: false } }
    );

    // First cycle
    rerender({ opened: true });
    rerender({ opened: false });
    vi.advanceTimersByTime(16);
    expect(focusSpy).toHaveBeenCalledTimes(1);

    // Re-focus button for second cycle
    button.focus();
    focusSpy.mockClear();

    // Second cycle
    rerender({ opened: true });
    rerender({ opened: false });
    vi.advanceTimersByTime(16);
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });
});
