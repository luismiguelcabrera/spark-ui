"use client";

import { type ReactNode } from "react";
import Link from "next/link";
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

function Sidebar({ logo, children, footer, className, collapsible = false }: SidebarProps) {
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
        className={cn(
          s.sidebar,
          className,
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
            className="hidden md:flex absolute right-0 top-20 translate-x-1/2 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors z-10 cursor-pointer"
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

type SidebarNavGroupProps = {
  label?: string;
  children: ReactNode;
  className?: string;
};

function SidebarNavGroup({ label, children, className }: SidebarNavGroupProps) {
  return (
    <div className={cn("mb-2", className)}>
      {label && (
        <span className={cn(s.sectionLabel, "px-3 py-2 text-[10px]")}>
          {label}
        </span>
      )}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

type SidebarNavItemProps = {
  icon?: string;
  label: string;
  active?: boolean;
  href?: string;
  className?: string;
};

function SidebarNavItem({
  icon,
  label,
  active = false,
  href = "#",
  className,
}: SidebarNavItemProps) {
  const { close } = useSidebar();
  return (
    <Link
      href={href}
      onClick={close}
      className={cn(
        s.navItem,
        active ? s.navItemActive : s.navItemInactive,
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
    </Link>
  );
}

export { Sidebar, SidebarNavGroup, SidebarNavItem };
export type { SidebarProps, SidebarNavGroupProps, SidebarNavItemProps };

