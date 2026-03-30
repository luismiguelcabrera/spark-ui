"use client";

import { useState, useCallback } from "react";

export type UseCounterOptions = {
  min?: number;
  max?: number;
};

export type UseCounterReturn = {
  count: number;
  increment: () => void;
  decrement: () => void;
  set: (v: number) => void;
  reset: () => void;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function useCounter(
  initialValue: number = 0,
  options: UseCounterOptions = {},
): UseCounterReturn {
  const { min = -Infinity, max = Infinity } = options;
  const [count, setCount] = useState(() => clamp(initialValue, min, max));

  const increment = useCallback(() => {
    setCount((c) => clamp(c + 1, min, max));
  }, [min, max]);

  const decrement = useCallback(() => {
    setCount((c) => clamp(c - 1, min, max));
  }, [min, max]);

  const set = useCallback(
    (v: number) => {
      setCount(clamp(v, min, max));
    },
    [min, max],
  );

  const reset = useCallback(() => {
    setCount(clamp(initialValue, min, max));
  }, [initialValue, min, max]);

  return { count, increment, decrement, set, reset };
}
