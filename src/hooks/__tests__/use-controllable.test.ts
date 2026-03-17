import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useControllable } from "../use-controllable";

describe("useControllable", () => {
  it("uses defaultValue when uncontrolled", () => {
    const { result } = renderHook(() =>
      useControllable({ defaultValue: "hello" }),
    );
    expect(result.current[0]).toBe("hello");
  });

  it("updates internal state when uncontrolled", () => {
    const { result } = renderHook(() =>
      useControllable({ defaultValue: "a" }),
    );
    act(() => result.current[1]("b"));
    expect(result.current[0]).toBe("b");
  });

  it("uses value when controlled", () => {
    const { result } = renderHook(() =>
      useControllable({ value: "controlled", defaultValue: "default" }),
    );
    expect(result.current[0]).toBe("controlled");
  });

  it("calls onChange in controlled mode", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllable({ value: "a", defaultValue: "a", onChange }),
    );
    act(() => result.current[1]("b"));
    expect(onChange).toHaveBeenCalledWith("b");
  });
});
