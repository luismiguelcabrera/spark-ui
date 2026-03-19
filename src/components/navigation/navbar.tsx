"use client";

import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

type NavbarProps = HTMLAttributes<HTMLElement> & {
  /** Logo or brand element */
  logo?: ReactNode;
  /** Navigation items */
  children?: ReactNode;
  /** Right-side content (actions, avatar, etc.) */
  actions?: ReactNode;
  /** Sticky positioning */
  sticky?: boolean;
  /** Visual variant */
  variant?: "default" | "bordered" | "floating" | "transparent";
  /** Max width */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Show mobile menu toggle */
  showMobileToggle?: boolean;
};

const variantMap = {
  default: "bg-white shadow-sm",
  bordered: "bg-white border-b border-slate-200",
  floating: "bg-white/80 backdrop-blur-lg shadow-sm mx-4 mt-4 rounded-2xl border border-slate-200/50",
  transparent: "bg-transparent",
};

const maxWidthMap = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      logo,
      children,
      actions,
      sticky = true,
      variant = "bordered",
      maxWidth = "xl",
      showMobileToggle = true,
      ...props
    },
    ref
  ) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
      <nav
        ref={ref}
        className={cn(
          "z-40 w-full",
          sticky && "sticky top-0",
          variantMap[variant],
          className
        )}
        {...props}
      >
        <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", maxWidthMap[maxWidth])}>
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            {logo && <div className="flex items-center shrink-0">{logo}</div>}

            {/* Desktop nav */}
            <div className="hidden md:flex md:items-center md:gap-1 md:flex-1 md:ml-8">
              {children}
            </div>

            {/* Actions */}
            {actions && (
              <div className="hidden md:flex md:items-center md:gap-2 md:ml-4">
                {actions}
              </div>
            )}

            {/* Mobile toggle */}
            {showMobileToggle && (
              <button
                type="button"
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileOpen}
              >
                <Icon name={mobileOpen ? "close" : "menu"} size="md" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white">
            <div className="px-4 py-3 space-y-1">{children}</div>
            {actions && (
              <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        )}
      </nav>
    );
  }
);
Navbar.displayName = "Navbar";

/* ── NavbarLink ─────────────────────────────────────────────────── */

type NavbarLinkProps = HTMLAttributes<HTMLAnchorElement> & {
  /** Whether this link is active */
  active?: boolean;
  /** href */
  href?: string;
};

const NavbarLink = forwardRef<HTMLAnchorElement, NavbarLinkProps>(
  ({ className, active, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
        className
      )}
      aria-current={active ? "page" : undefined}
      {...props}
    >
      {children}
    </a>
  )
);
NavbarLink.displayName = "NavbarLink";

export { Navbar, NavbarLink };
export type { NavbarProps, NavbarLinkProps };
