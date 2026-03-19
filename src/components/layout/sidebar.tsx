"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { useSidebar } from "./sidebar-context";

type SidebarProps = {
  logo?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  collapsible?: boolean;
};

const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ logo, children, footer, className, collapsible = false }, ref) => {
    const { isOpen, close, isCollapsed, toggleCollapse } = useSidebar();
    const collapsed = collapsible && isCollapsed;

    return (
      <>
        {/* Backdrop — mobile only */}
        <div
          className={cn(
            "fixed inset-0 z-[110] bg-black/40 md:hidden transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={close}
          aria-hidden="true"
        />

        {/* Sidebar — fixed drawer on mobile, static on desktop */}
        <aside
          ref={ref}
          className={cn(
            s.sidebar,
            // Mobile: fixed overlay drawer sliding in from the left
            "fixed inset-y-0 left-0 transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full",
            // Desktop: undo fixed, sit in normal flex flow
            "md:relative md:translate-x-0",
            collapsible
              ? "md:transition-[width] md:duration-300 md:ease-in-out"
              : "md:transition-none",
            // Collapsed width (overrides className width on desktop)
            collapsed && "md:w-16",
            // z-[120] on mobile so it appears above drawers/dialogs (z-[100]/z-[101])
            "max-md:z-[120]",
            // Override `hidden` from className when open on mobile
            isOpen && "flex",
            className
          )}
        >
          {logo && (
            <div className={cn(s.sidebarLogo, collapsed && "px-0")}>
              {logo}
            </div>
          )}
          <nav className={s.sidebarNav}>{children}</nav>
          {footer && <div className={s.sidebarFooter}>{footer}</div>}

          {/* Desktop collapse toggle — floating on right edge */}
          {collapsible && (
            <button
              type="button"
              onClick={toggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden md:flex absolute right-0 top-20 translate-x-1/2 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-colors z-10 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <span className="material-symbols-outlined text-[14px]">
                {collapsed ? "chevron_right" : "chevron_left"}
              </span>
            </button>
          )}
        </aside>
      </>
    );
  }
);
Sidebar.displayName = "Sidebar";

type SidebarNavGroupProps = {
  label?: string;
  children: ReactNode;
  className?: string;
};

const SidebarNavGroup = forwardRef<HTMLDivElement, SidebarNavGroupProps>(
  ({ label, children, className }, ref) => {
    return (
      <div ref={ref} className={cn("mb-2", className)}>
        {label && (
          <span className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {label}
          </span>
        )}
        <div className="flex flex-col gap-0.5">{children}</div>
      </div>
    );
  }
);
SidebarNavGroup.displayName = "SidebarNavGroup";

type SidebarNavItemProps = {
  icon?: string;
  label: string;
  active?: boolean;
  href?: string;
  className?: string;
};

const SidebarNavItem = forwardRef<HTMLAnchorElement, SidebarNavItemProps>(
  ({ icon, label, active = false, href = "#", className }, ref) => {
    const { close } = useSidebar();
    return (
      <a
        ref={ref}
        href={href}
        onClick={close}
        aria-current={active ? "page" : undefined}
        className={cn(
          s.navItem,
          active ? s.navItemActive : s.navItemInactive,
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          className
        )}
      >
        {icon && (
          <span
            className={cn(
              "material-symbols-outlined text-[20px]",
              s.navIcon,
              active && "icon-filled"
            )}
          >
            {icon}
          </span>
        )}
        <span className={s.navLabel}>{label}</span>
      </a>
    );
  }
);
SidebarNavItem.displayName = "SidebarNavItem";

export { Sidebar, SidebarNavGroup, SidebarNavItem };
export type { SidebarProps, SidebarNavGroupProps, SidebarNavItemProps };

