import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { useMergedRef } from "../use-merged-ref";

describe("useMergedRef", () => {
  it("assigns to a callback ref", () => {
    const callbackRef = vi.fn();
    const { result } = renderHook(() => useMergedRef(callbackRef));

    const element = document.createElement("div");
    result.current(element);

    expect(callbackRef).toHaveBeenCalledWith(element);
  });

  it("assigns to an object ref", () => {
    const objectRef = createRef<HTMLDivElement>();
    const { result } = renderHook(() => useMergedRef(objectRef));

    const element = document.createElement("div");
    result.current(element);

    expect(objectRef.current).toBe(element);
  });

  it("assigns to multiple refs simultaneously", () => {
    const callbackRef = vi.fn();
    const objectRef = createRef<HTMLDivElement>();
    const { result } = renderHook(() =>
      useMergedRef(callbackRef, objectRef)
    );

    const element = document.createElement("div");
    result.current(element);

    expect(callbackRef).toHaveBeenCalledWith(element);
    expect(objectRef.current).toBe(element);
  });

  it("handles null refs gracefully", () => {
    const callbackRef = vi.fn();
    const { result } = renderHook(() =>
      useMergedRef(null, callbackRef, undefined)
    );

    const element = document.createElement("div");
    result.current(element);

    expect(callbackRef).toHaveBeenCalledWith(element);
  });

  it("handles all null/undefined refs without throwing", () => {
    const { result } = renderHook(() =>
      useMergedRef<HTMLDivElement>(null, undefined, null)
    );

    expect(() => result.current(document.createElement("div"))).not.toThrow();
  });

  it("assigns null when element is removed", () => {
    const callbackRef = vi.fn();
    const objectRef = createRef<HTMLDivElement>();
    const { result } = renderHook(() =>
      useMergedRef(callbackRef, objectRef)
    );

    const element = document.createElement("div");
    result.current(element);

    expect(callbackRef).toHaveBeenCalledWith(element);
    expect(objectRef.current).toBe(element);

    // Simulate element removal
    result.current(null);

    expect(callbackRef).toHaveBeenCalledWith(null);
    expect(objectRef.current).toBeNull();
  });

  it("works with mutable ref objects", () => {
    const mutableRef = { current: null } as { current: HTMLDivElement | null };
    const { result } = renderHook(() => useMergedRef(mutableRef));

    const element = document.createElement("div");
    result.current(element);

    expect(mutableRef.current).toBe(element);
  });

  it("handles a mix of all ref types", () => {
    const callbackRef = vi.fn();
    const objectRef = createRef<HTMLDivElement>();
    const mutableRef = { current: null } as { current: HTMLDivElement | null };

    const { result } = renderHook(() =>
      useMergedRef(callbackRef, objectRef, mutableRef, null, undefined)
    );

    const element = document.createElement("div");
    result.current(element);

    expect(callbackRef).toHaveBeenCalledWith(element);
    expect(objectRef.current).toBe(element);
    expect(mutableRef.current).toBe(element);
  });

  it("returns a function", () => {
    const { result } = renderHook(() =>
      useMergedRef<HTMLDivElement>(null)
    );

    expect(typeof result.current).toBe("function");
  });
});
