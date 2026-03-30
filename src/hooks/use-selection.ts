"use client";

import { useState, useCallback } from "react";

export type UseSelectionOptions = {
  multiple?: boolean;
};

export type UseSelectionReturn<T> = {
  selected: T[];
  isSelected: (item: T) => boolean;
  toggle: (item: T) => void;
  select: (item: T) => void;
  deselect: (item: T) => void;
  clear: () => void;
  selectAll: (items: T[]) => void;
};

export function useSelection<T>(
  options: UseSelectionOptions = {},
): UseSelectionReturn<T> {
  const { multiple = false } = options;
  const [selected, setSelected] = useState<T[]>([]);

  const isSelected = useCallback(
    (item: T) => selected.includes(item),
    [selected],
  );

  const select = useCallback(
    (item: T) => {
      setSelected((prev) => {
        if (prev.includes(item)) return prev;
        if (multiple) {
          return [...prev, item];
        }
        return [item];
      });
    },
    [multiple],
  );

  const deselect = useCallback((item: T) => {
    setSelected((prev) => {
      const next = prev.filter((i) => i !== item);
      return next.length === prev.length ? prev : next;
    });
  }, []);

  const toggle = useCallback(
    (item: T) => {
      setSelected((prev) => {
        if (prev.includes(item)) {
          return prev.filter((i) => i !== item);
        }
        if (multiple) {
          return [...prev, item];
        }
        return [item];
      });
    },
    [multiple],
  );

  const clear = useCallback(() => {
    setSelected([]);
  }, []);

  const selectAll = useCallback(
    (items: T[]) => {
      if (multiple) {
        setSelected(items);
      } else if (items.length > 0) {
        setSelected([items[0]]);
      }
    },
    [multiple],
  );

  return {
    selected,
    isSelected,
    toggle,
    select,
    deselect,
    clear,
    selectAll,
  };
}
