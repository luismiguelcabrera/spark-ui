"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

type FooterProps = HTMLAttributes<HTMLElement> & {
  /** Footer content */
  children?: ReactNode;
  /** Fixed to the bottom of the viewport */
  fixed?: boolean;
  /** Show a top border */
  bordered?: boolean;
  /** Add horizontal and vertical padding */
  padded?: boolean;
};

const Footer = forwardRef<HTMLElement, FooterProps>(
  ({ className, children, fixed = false, bordered = false, padded = true, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn(
        "w-full bg-white",
        fixed && "fixed bottom-0 left-0 right-0 z-40",
        bordered && "border-t border-slate-200",
        padded && "px-4 py-6 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </footer>
  )
);
Footer.displayName = "Footer";

export { Footer };
export type { FooterProps };
