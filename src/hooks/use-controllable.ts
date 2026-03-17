"use client";

import { useState, useCallback } from "react";

type UseControllableParams<T> = {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
};

export function useControllable<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableParams<T>) {
  const [internal, setInternal] = useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : internal;

  const update = useCallback(
    (next: T) => {
      if (!controlled) setInternal(next);
      onChange?.(next);
    },
    [controlled, onChange]
  );

  return [current, update] as const;
}
