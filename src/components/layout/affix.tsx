"use client";

import { forwardRef, type ReactNode, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

type AffixPosition = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

type AffixProps = {
  /** Position offsets for the fixed element */
  position?: AffixPosition;
  /** z-index of the fixed container (default 100) */
  zIndex?: number;
  /** Whether to render via a portal (default true) */
  withinPortal?: boolean;
  /** Content to pin */
  children: ReactNode;
  /** Additional class names */
  className?: string;
};

const Affix = forwardRef<HTMLDivElement, AffixProps>(
  (
    {
      position = { bottom: 20, right: 20 },
      zIndex = 100,
      withinPortal = true,
      children,
      className,
    },
    ref,
  ) => {
    const style: CSSProperties = {
      position: "fixed",
      zIndex,
      ...(position.top !== undefined && { top: position.top }),
      ...(position.bottom !== undefined && { bottom: position.bottom }),
      ...(position.left !== undefined && { left: position.left }),
      ...(position.right !== undefined && { right: position.right }),
    };

    const element = (
      <div ref={ref} style={style} className={cn(className)} data-affix="">
        {children}
      </div>
    );

    if (withinPortal && typeof document !== "undefined") {
      return createPortal(element, document.body);
    }

    return element;
  },
);
Affix.displayName = "Affix";

export { Affix };
export type { AffixProps, AffixPosition };
