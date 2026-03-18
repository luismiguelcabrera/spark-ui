import { useState, useEffect, type ReactNode } from "react";

type NoSsrProps = {
  /** Content to render only on the client */
  children: ReactNode;
  /** Fallback to show during SSR / initial render */
  fallback?: ReactNode;
};

/**
 * Prevents server-side rendering of children.
 * Renders `fallback` (or nothing) during SSR and the initial render,
 * then switches to `children` after the component mounts on the client.
 */
function NoSsr({ children, fallback = null }: NoSsrProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect -- intentional: detect client-side mount for SSR guard
  }, []);

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
NoSsr.displayName = "NoSsr";

export { NoSsr };
export type { NoSsrProps };
