import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useMap } from "../use-map";

describe("useMap", () => {
  // --- Initial state ---
  it("starts with an empty map by default", () => {
    const { result } = renderHook(() => useMap<string, number>());
    expect(result.current.map.size).toBe(0);
    expect(result.current.size).toBe(0);
  });

  it("accepts initial entries", () => {
    const { result } = renderHook(() =>
      useMap([
        ["a", 1],
        ["b", 2],
      ]),
    );
    expect(result.current.size).toBe(2);
    expect(result.current.get("a")).toBe(1);
    expect(result.current.get("b")).toBe(2);
  });

  // --- set ---
  it("sets a key-value pair", () => {
    const { result } = renderHook(() => useMap<string, number>());
    act(() => result.current.set("x", 42));
    expect(result.current.get("x")).toBe(42);
    expect(result.current.size).toBe(1);
  });

  it("overwrites an existing key", () => {
    const { result } = renderHook(() => useMap([["a", 1]]));
    act(() => result.current.set("a", 99));
    expect(result.current.get("a")).toBe(99);
    expect(result.current.size).toBe(1);
  });

  // --- delete ---
  it("deletes a key", () => {
    const { result } = renderHook(() =>
      useMap([
        ["a", 1],
        ["b", 2],
      ]),
    );
    act(() => result.current.delete("a"));
    expect(result.current.has("a")).toBe(false);
    expect(result.current.size).toBe(1);
  });

  it("does not change map reference when deleting non-existent key", () => {
    const { result } = renderHook(() => useMap([["a", 1]]));
    const before = result.current.map;
    act(() => result.current.delete("z"));
    expect(result.current.map).toBe(before);
  });

  // --- has ---
  it("returns true for existing keys", () => {
    const { result } = renderHook(() => useMap([["key", "val"]]));
    expect(result.current.has("key")).toBe(true);
  });

  it("returns false for missing keys", () => {
    const { result } = renderHook(() => useMap<string, string>());
    expect(result.current.has("nope")).toBe(false);
  });

  // --- get ---
  it("returns undefined for missing keys", () => {
    const { result } = renderHook(() => useMap<string, number>());
    expect(result.current.get("missing")).toBeUndefined();
  });

  // --- clear ---
  it("clears all entries", () => {
    const { result } = renderHook(() =>
      useMap([
        ["a", 1],
        ["b", 2],
      ]),
    );
    act(() => result.current.clear());
    expect(result.current.size).toBe(0);
  });

  // --- reset ---
  it("resets to initial entries", () => {
    const { result } = renderHook(() =>
      useMap([
        ["a", 1],
        ["b", 2],
      ]),
    );
    act(() => result.current.set("c", 3));
    act(() => result.current.delete("a"));
    act(() => result.current.reset());
    expect(result.current.size).toBe(2);
    expect(result.current.get("a")).toBe(1);
    expect(result.current.get("b")).toBe(2);
  });

  it("resets to empty when no initial entries", () => {
    const { result } = renderHook(() => useMap<string, number>());
    act(() => result.current.set("a", 1));
    act(() => result.current.reset());
    expect(result.current.size).toBe(0);
  });

  // --- New Map reference on mutation ---
  it("returns a new Map reference on set", () => {
    const { result } = renderHook(() => useMap<string, number>());
    const before = result.current.map;
    act(() => result.current.set("a", 1));
    expect(result.current.map).not.toBe(before);
  });

  it("returns a new Map reference on delete", () => {
    const { result } = renderHook(() => useMap([["a", 1]]));
    const before = result.current.map;
    act(() => result.current.delete("a"));
    expect(result.current.map).not.toBe(before);
  });

  it("returns a new Map reference on clear", () => {
    const { result } = renderHook(() => useMap([["a", 1]]));
    const before = result.current.map;
    act(() => result.current.clear());
    expect(result.current.map).not.toBe(before);
  });

  // --- Callback reference stability ---
  it("returns stable callback references for set, delete, clear", () => {
    const { result, rerender } = renderHook(() => useMap<string, number>());
    const { set, clear, reset } = result.current;
    const del = result.current.delete;
    rerender();
    expect(result.current.set).toBe(set);
    expect(result.current.delete).toBe(del);
    expect(result.current.clear).toBe(clear);
    expect(result.current.reset).toBe(reset);
  });
});
