"use client";

import { type ReactNode } from "react";
import { useBreakpoint } from "../../hooks/use-breakpoint";

type ShowProps = {
  /** Content to show/hide */
  children: ReactNode;
  /** Show above this breakpoint */
  above?: "sm" | "md" | "lg" | "xl" | "2xl";
  /** Show below this breakpoint */
  below?: "sm" | "md" | "lg" | "xl" | "2xl";
  /** Show only when condition is true */
  when?: boolean;
  /** Fallback content when hidden */
  fallback?: ReactNode;
};

/**
 * Conditionally render content based on breakpoints or conditions.
 *
 * @example
 * <Show above="md">Desktop content</Show>
 * <Show below="md">Mobile content</Show>
 * <Show when={isLoggedIn}>Private content</Show>
 */
function Show({ children, above, below, when, fallback = null }: ShowProps) {
  const aboveMatch = useBreakpoint(above ?? "sm");
  const belowMatch = useBreakpoint(below ?? "sm");

  if (when !== undefined) {
    return when ? <>{children}</> : <>{fallback}</>;
  }

  if (above) {
    return aboveMatch ? <>{children}</> : <>{fallback}</>;
  }

  if (below) {
    return !belowMatch ? <>{children}</> : <>{fallback}</>;
  }

  return <>{children}</>;
}
Show.displayName = "Show";

export { Show };
export type { ShowProps };
