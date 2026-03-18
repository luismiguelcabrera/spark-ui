"use client";

import { useState, useCallback, useRef } from "react";

export type UseStateHistoryReturn<T> = {
  state: T;
  set: (value: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  history: T[];
  pointer: number;
  reset: (value?: T) => void;
};

// eslint-disable react-hooks/refs -- intentional: ref-based state for O(1) undo/redo without re-render on every push
export function useStateHistory<T>(initial: T): UseStateHistoryReturn<T> {
  const [, forceRender] = useState(0);
  const historyRef = useRef<T[]>([initial]);
  const pointerRef = useRef(0);

  const state = historyRef.current[pointerRef.current];

  const set = useCallback((value: T) => {
    const pointer = pointerRef.current;
    // Truncate any future states beyond the current pointer
    const newHistory = historyRef.current.slice(0, pointer + 1);
    newHistory.push(value);
    historyRef.current = newHistory;
    pointerRef.current = newHistory.length - 1;
    forceRender((n) => n + 1);
  }, []);

  const undo = useCallback(() => {
    if (pointerRef.current > 0) {
      pointerRef.current -= 1;
      forceRender((n) => n + 1);
    }
  }, []);

  const redo = useCallback(() => {
    if (pointerRef.current < historyRef.current.length - 1) {
      pointerRef.current += 1;
      forceRender((n) => n + 1);
    }
  }, []);

  const reset = useCallback(
    (value?: T) => {
      const resetValue = value !== undefined ? value : initial;
      historyRef.current = [resetValue];
      pointerRef.current = 0;
      forceRender((n) => n + 1);
    },
    [initial],
  );

  return {
    state,
    set,
    undo,
    redo,
    canUndo: pointerRef.current > 0,
    canRedo: pointerRef.current < historyRef.current.length - 1,
    history: historyRef.current,
    pointer: pointerRef.current,
    reset,
  };
}
