"use client";

import { useState, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  children: ReactNode;
  /** DOM element to mount into (default: document.body) */
  container?: Element | null;
};

function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(children, container ?? document.body);
}
Portal.displayName = "Portal";

export { Portal };
export type { PortalProps };
