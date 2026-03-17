import { forwardRef, type AnchorHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type SkipNavLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** ID of the content to skip to (default: "main-content") */
  contentId?: string;
};

/**
 * Accessible skip navigation link. Visually hidden until focused.
 * Place at the very top of your page layout.
 */
const SkipNavLink = forwardRef<HTMLAnchorElement, SkipNavLinkProps>(
  ({ className, contentId = "main-content", children = "Skip to main content", ...props }, ref) => (
    <a
      ref={ref}
      href={`#${contentId}`}
      className={cn(
        "fixed top-0 left-0 z-[100] px-4 py-2 bg-primary text-white text-sm font-semibold rounded-br-lg",
        "transform -translate-y-full focus:translate-y-0 transition-transform",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
);
SkipNavLink.displayName = "SkipNavLink";

type SkipNavContentProps = {
  /** ID for the content landmark (default: "main-content") */
  id?: string;
};

/**
 * Target for the SkipNavLink. Wrap your main content with this,
 * or just add id="main-content" to your main element.
 */
const SkipNavContent = forwardRef<HTMLDivElement, SkipNavContentProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ id = "main-content", ...props }, ref) => (
    <div ref={ref} id={id} tabIndex={-1} {...props} />
  )
);
SkipNavContent.displayName = "SkipNavContent";

export { SkipNavLink, SkipNavContent };
export type { SkipNavLinkProps, SkipNavContentProps };
