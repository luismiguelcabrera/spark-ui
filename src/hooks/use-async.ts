"use client";

import { useState, useCallback, useRef } from "react";

type AsyncStatus = "idle" | "loading" | "success" | "error";

type UseAsyncState<T> = {
  /** Current status of the async operation */
  status: AsyncStatus;
  /** Resolved data (only set on success) */
  data: T | null;
  /** Error (only set on error) */
  error: Error | null;
  /** Whether the operation is currently loading */
  isLoading: boolean;
  /** Whether the operation completed successfully */
  isSuccess: boolean;
  /** Whether the operation errored */
  isError: boolean;
  /** Whether the operation hasn't been triggered yet */
  isIdle: boolean;
};

type UseAsyncReturn<T, Args extends unknown[]> = UseAsyncState<T> & {
  /** Execute the async function */
  execute: (...args: Args) => Promise<T | null>;
  /** Reset state back to idle */
  reset: () => void;
};

/**
 * Manage the lifecycle of an async function with loading, success,
 * and error states.
 *
 * ```tsx
 * const { data, isLoading, error, execute } = useAsync(fetchUser);
 *
 * useEffect(() => { execute(userId); }, [userId]);
 * ```
 *
 * @param asyncFn — The async function to wrap
 * @param options.immediate — When true, execute immediately on mount (no args)
 */
export function useAsync<T, Args extends unknown[] = []>(
  asyncFn: (...args: Args) => Promise<T>,
  options?: { immediate?: boolean },
): UseAsyncReturn<T, Args> {
  const [state, setState] = useState<UseAsyncState<T>>({
    status: "idle",
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    isIdle: true,
  });

  // Track the latest call so we can ignore stale responses
  const callIdRef = useRef(0);
  const mountedRef = useRef(true);
  const immediateRan = useRef(false);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      const id = ++callIdRef.current;

      setState({
        status: "loading",
        data: null,
        error: null,
        isLoading: true,
        isSuccess: false,
        isError: false,
        isIdle: false,
      });

      try {
        const result = await asyncFn(...args);

        // Only update if this is still the latest call and component is mounted
        if (id === callIdRef.current && mountedRef.current) {
          setState({
            status: "success",
            data: result,
            error: null,
            isLoading: false,
            isSuccess: true,
            isError: false,
            isIdle: false,
          });
        }
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));

        if (id === callIdRef.current && mountedRef.current) {
          setState({
            status: "error",
            data: null,
            error,
            isLoading: false,
            isSuccess: false,
            isError: true,
            isIdle: false,
          });
        }
        return null;
      }
    },
    [asyncFn],
  );

  const reset = useCallback(() => {
    callIdRef.current++;
    setState({
      status: "idle",
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
      isIdle: true,
    });
  }, []);

  // Handle immediate execution (run once on first render)
  if (options?.immediate && !immediateRan.current) {
    immediateRan.current = true;
    // Execute without args — only valid when Args is [] or all optional
    (execute as (...args: unknown[]) => Promise<T | null>)();
  }

  return {
    ...state,
    execute,
    reset,
  };
}
