"use client";

import { useState, useCallback, useMemo } from "react";

export type UseSetReturn<T> = {
  set: Set<T>;
  add: (value: T) => void;
  delete: (value: T) => void;
  clear: () => void;
  has: (value: T) => boolean;
  size: number;
  toggle: (value: T) => void;
  reset: () => void;
};

export function useSet<T>(initial?: Iterable<T>): UseSetReturn<T> {
  const initialValues = useMemo(
    () => (initial ? Array.from(initial) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [set, setSet] = useState(() => new Set<T>(initialValues));

  const add = useCallback((value: T) => {
    setSet((prev) => {
      if (prev.has(value)) return prev;
      const next = new Set(prev);
      next.add(value);
      return next;
    });
  }, []);

  const del = useCallback((value: T) => {
    setSet((prev) => {
      if (!prev.has(value)) return prev;
      const next = new Set(prev);
      next.delete(value);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSet(new Set());
  }, []);

  const has = useCallback(
    (value: T) => set.has(value),
    [set],
  );

  const toggle = useCallback((value: T) => {
    setSet((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setSet(new Set<T>(initialValues));
  }, [initialValues]);

  return {
    set,
    add,
    delete: del,
    clear,
    has,
    size: set.size,
    toggle,
    reset,
  };
}
