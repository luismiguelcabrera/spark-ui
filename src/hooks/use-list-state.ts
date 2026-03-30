"use client";

import { useState, useCallback } from "react";

export type UseListStateHandlers<T> = {
  append: (item: T) => void;
  prepend: (item: T) => void;
  remove: (index: number) => void;
  insert: (index: number, item: T) => void;
  reorder: (from: number, to: number) => void;
  setItem: (index: number, item: T) => void;
  filter: (fn: (item: T) => boolean) => void;
  setState: (items: T[]) => void;
};

export type UseListStateReturn<T> = [T[], UseListStateHandlers<T>];

export function useListState<T>(initial: T[] = []): UseListStateReturn<T> {
  const [list, setList] = useState<T[]>(initial);

  const append = useCallback((item: T) => {
    setList((prev) => [...prev, item]);
  }, []);

  const prepend = useCallback((item: T) => {
    setList((prev) => [item, ...prev]);
  }, []);

  const remove = useCallback((index: number) => {
    setList((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
  }, []);

  const insert = useCallback((index: number, item: T) => {
    setList((prev) => {
      const clamped = Math.max(0, Math.min(index, prev.length));
      return [...prev.slice(0, clamped), item, ...prev.slice(clamped)];
    });
  }, []);

  const reorder = useCallback((from: number, to: number) => {
    setList((prev) => {
      if (
        from < 0 ||
        from >= prev.length ||
        to < 0 ||
        to >= prev.length ||
        from === to
      ) {
        return prev;
      }
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }, []);

  const setItem = useCallback((index: number, item: T) => {
    setList((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const next = [...prev];
      next[index] = item;
      return next;
    });
  }, []);

  const filter = useCallback((fn: (item: T) => boolean) => {
    setList((prev) => prev.filter(fn));
  }, []);

  const setState = useCallback((items: T[]) => {
    setList(items);
  }, []);

  return [list, { append, prepend, remove, insert, reorder, setItem, filter, setState }];
}
