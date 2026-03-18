"use client";

import { useCallback, type RefObject, type MutableRefObject } from "react";

type RefInput<T> =
  | RefObject<T | null>
  | MutableRefObject<T | null>
  | ((el: T | null) => void)
  | null
  | undefined;

function assignRef<T>(ref: RefInput<T>, value: T | null) {
  if (ref === null || ref === undefined) return;
  if (typeof ref === "function") {
    ref(value);
  } else {
    // Both RefObject and MutableRefObject have a `current` property
    (ref as MutableRefObject<T | null>).current = value;
  }
}

/**
 * Combine multiple refs into a single stable callback ref.
 *
 * Handles callback refs, object refs (RefObject / MutableRefObject),
 * and null/undefined values.
 *
 * @param refs - Refs to merge
 * @returns A single callback ref that assigns to all provided refs
 */
export function useMergedRef<T>(
  ...refs: RefInput<T>[]
): (el: T | null) => void {
   
  return useCallback(
    (el: T | null) => {
      for (const ref of refs) {
        assignRef(ref, el);
      }
    },
    // We spread refs as deps so the callback updates when any ref changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  );
}
