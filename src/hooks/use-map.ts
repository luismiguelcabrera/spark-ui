"use client";

import { useState, useCallback, useMemo } from "react";

export type UseMapReturn<K, V> = {
  map: Map<K, V>;
  set: (key: K, value: V) => void;
  delete: (key: K) => void;
  clear: () => void;
  has: (key: K) => boolean;
  get: (key: K) => V | undefined;
  size: number;
  reset: () => void;
};

export function useMap<K, V>(
  initial?: Iterable<[K, V]>,
): UseMapReturn<K, V> {
  const initialEntries = useMemo(
    () => (initial ? Array.from(initial) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [map, setMap] = useState(() => new Map<K, V>(initialEntries));

  const set = useCallback((key: K, value: V) => {
    setMap((prev) => {
      const next = new Map(prev);
      next.set(key, value);
      return next;
    });
  }, []);

  const del = useCallback((key: K) => {
    setMap((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setMap(new Map());
  }, []);

  const has = useCallback(
    (key: K) => map.has(key),
    [map],
  );

  const get = useCallback(
    (key: K) => map.get(key),
    [map],
  );

  const reset = useCallback(() => {
    setMap(new Map<K, V>(initialEntries));
  }, [initialEntries]);

  return {
    map,
    set,
    delete: del,
    clear,
    has,
    get,
    size: map.size,
    reset,
  };
}
