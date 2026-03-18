"use client";

import {
  forwardRef,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";

// ---------------------------------------------------------------------------
// Sidebar Context + Provider + Hook
// ---------------------------------------------------------------------------

type SidebarContextValue = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  toggleCollapsed: () => void;
  mobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return ctx;
}

type SidebarProviderProps = {
  children: ReactNode;
  defaultCollapsed?: boolean;
};

function SidebarProvider({
  children,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const [collapsed, setCollapsedState] = useState(defaultCollapsed);
  const [mobile, setMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // SSR-safe media query listener
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setMobile(e.matches);
      if (!e.matches) setMobileOpen(false);
    };
    handler(mql);
    mql.addEventListener("change", handler as (e: MediaQueryListEvent) => void);
    return () =>
      mql.removeEventListener(
        "change",
        handler as (e: MediaQueryListEvent) => void
      );
  }, []);

  const setCollapsed = useCallback((v: boolean) => {
    setCollapsedState(v);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsedState((prev) => !prev);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed,
        toggleCollapsed,
        mobile,
        mobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

SidebarProvider.displayName = "SidebarProvider";

// ---------------------------------------------------------------------------
// Sidebar (root)
// ---------------------------------------------------------------------------

type SidebarProps = {
  children?: ReactNode;
  className?: string;
  collapsible?: boolean;
  /** @deprecated Use SidebarHeader with logo content instead */
  logo?: ReactNode;
  /** @deprecated Use SidebarFooter instead */
  footer?: ReactNode;
};

const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ children, className, collapsible = false, logo, footer }, ref) => {
    const { collapsed, toggleCollapsed, mobile, mobileOpen, setMobileOpen } =
      useSidebar();

    const isCollapsed = collapsible && collapsed && !mobile;

    return (
      <>
        {/* Backdrop -- mobile only */}
        {mobile && mobileOpen && (
          <div
            className="fixed inset-0 z-[110] bg-black/40 transition-opacity duration-300"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          ref={ref}
          role="navigation"
          aria-label="Sidebar"
          data-collapsed={isCollapsed ? "true" : undefined}
          className={cn(
            s.sidebar,
            // Mobile: fixed overlay drawer sliding in from the left
            "fixed inset-y-0 left-0 transition-transform duration-300 ease-in-out",
            mobile
              ? mobileOpen
                ? "translate-x-0 z-[120]"
                : "-translate-x-full z-[120]"
              : "relative translate-x-0",
            // Collapsed width
            !mobile &&
              collapsible &&
              "transition-[width] duration-300 ease-in-out",
            isCollapsed && "w-16",
            className
          )}
        >
          {/* Legacy logo prop support */}
          {logo && (
            <div className={cn(s.sidebarLogo, isCollapsed && "px-0 justify-center")}>
              {logo}
            </div>
          )}

          {children}

          {/* Legacy footer prop support */}
          {footer && <div className={s.sidebarFooter}>{footer}</div>}

          {/* Desktop collapse toggle */}
          {collapsible && !mobile && (
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden md:flex absolute right-0 top-20 translate-x-1/2 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors z-10 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <Icon
                name={isCollapsed ? "chevron_right" : "chevron_left"}
                size="sm"
                className="text-[14px]"
              />
            </button>
          )}
        </aside>
      </>
    );
  }
);

Sidebar.displayName = "Sidebar";

// ---------------------------------------------------------------------------
// SidebarHeader
// ---------------------------------------------------------------------------

type SidebarHeaderProps = HTMLAttributes<HTMLDivElement>;

const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => {
    const { collapsed, mobile } = useSidebar();
    const isCollapsed = collapsed && !mobile;
    return (
      <div
        ref={ref}
        className={cn(
          "px-5 pt-6 pb-4 shrink-0",
          isCollapsed && "px-2 flex justify-center",
          className
        )}
        {...props}
      />
    );
  }
);

SidebarHeader.displayName = "SidebarHeader";

// ---------------------------------------------------------------------------
// SidebarFooter
// ---------------------------------------------------------------------------

type SidebarFooterProps = HTMLAttributes<HTMLDivElement>;

const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "px-5 py-4 border-t border-gray-100 mt-auto shrink-0",
          className
        )}
        {...props}
      />
    );
  }
);

SidebarFooter.displayName = "SidebarFooter";

// ---------------------------------------------------------------------------
// SidebarContent
// ---------------------------------------------------------------------------

type SidebarContentProps = HTMLAttributes<HTMLDivElement>;

const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex-1 overflow-y-auto custom-scrollbar px-3 py-2",
          className
        )}
        {...props}
      />
    );
  }
);

SidebarContent.displayName = "SidebarContent";

// ---------------------------------------------------------------------------
// SidebarGroup
// ---------------------------------------------------------------------------

type SidebarGroupProps = HTMLAttributes<HTMLDivElement>;

const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mb-2", className)}
        {...props}
      />
    );
  }
);

SidebarGroup.displayName = "SidebarGroup";

// ---------------------------------------------------------------------------
// SidebarGroupLabel
// ---------------------------------------------------------------------------

type SidebarGroupLabelProps = HTMLAttributes<HTMLSpanElement>;

const SidebarGroupLabel = forwardRef<HTMLSpanElement, SidebarGroupLabelProps>(
  ({ className, ...props }, ref) => {
    const { collapsed, mobile } = useSidebar();
    const isCollapsed = collapsed && !mobile;

    if (isCollapsed) return null;

    return (
      <span
        ref={ref}
        className={cn(
          s.sectionLabel,
          "px-3 py-2 text-[10px] block",
          className
        )}
        {...props}
      />
    );
  }
);

SidebarGroupLabel.displayName = "SidebarGroupLabel";

// ---------------------------------------------------------------------------
// SidebarGroupContent
// ---------------------------------------------------------------------------

type SidebarGroupContentProps = HTMLAttributes<HTMLDivElement>;

const SidebarGroupContent = forwardRef<HTMLDivElement, SidebarGroupContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-0.5", className)}
        {...props}
      />
    );
  }
);

SidebarGroupContent.displayName = "SidebarGroupContent";

// ---------------------------------------------------------------------------
// SidebarSeparator
// ---------------------------------------------------------------------------

type SidebarSeparatorProps = HTMLAttributes<HTMLHRElement>;

const SidebarSeparator = forwardRef<HTMLHRElement, SidebarSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <hr
        ref={ref}
        className={cn("border-0 h-px bg-gray-200 my-2 mx-3", className)}
        {...props}
      />
    );
  }
);

SidebarSeparator.displayName = "SidebarSeparator";

// ---------------------------------------------------------------------------
// SidebarMenu
// ---------------------------------------------------------------------------

type SidebarMenuProps = HTMLAttributes<HTMLUListElement>;

const SidebarMenu = forwardRef<HTMLUListElement, SidebarMenuProps>(
  ({ className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn("flex flex-col gap-0.5 list-none p-0 m-0", className)}
        {...props}
      />
    );
  }
);

SidebarMenu.displayName = "SidebarMenu";

// ---------------------------------------------------------------------------
// SidebarMenuItem
// ---------------------------------------------------------------------------

type SidebarMenuItemProps = HTMLAttributes<HTMLLIElement>;

const SidebarMenuItem = forwardRef<HTMLLIElement, SidebarMenuItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn("list-none", className)}
        {...props}
      />
    );
  }
);

SidebarMenuItem.displayName = "SidebarMenuItem";

// ---------------------------------------------------------------------------
// SidebarMenuButton
// ---------------------------------------------------------------------------

type SidebarMenuButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  icon?: string | ReactNode;
  asChild?: boolean;
};

const SidebarMenuButton = forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  (
    {
      className,
      active = false,
      disabled = false,
      icon,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const { collapsed, mobile } = useSidebar();
    const isCollapsed = collapsed && !mobile;

    const iconElement =
      typeof icon === "string" ? (
        <span aria-hidden="true">
          <Icon
            name={icon}
            size="sm"
            className={cn(
              "shrink-0 text-[20px] transition-transform group-hover:scale-110",
              active && "icon-filled"
            )}
          />
        </span>
      ) : icon ? (
        <span aria-hidden="true">{icon}</span>
      ) : null;

    const buttonContent = (
      <>
        {iconElement}
        {!isCollapsed && (
          <span className={cn(s.navLabel, "truncate")}>{children}</span>
        )}
      </>
    );

    const buttonClasses = cn(
      s.navItem,
      "w-full relative group",
      active ? s.navItemActive : s.navItemInactive,
      isCollapsed && "justify-center px-0",
      disabled && "opacity-50 cursor-not-allowed pointer-events-none",
      "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
      className
    );

    if (asChild) {
      // Render children as the root element (first child must be an element)
      // Simple implementation: wrap with a span styled like a button
      return (
        <span
          className={buttonClasses}
          data-active={active ? "true" : undefined}
          aria-disabled={disabled || undefined}
        >
          {children}
        </span>
      );
    }

    return (
      <span className="relative group/tooltip">
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          aria-current={active ? "page" : undefined}
          aria-label={isCollapsed && typeof children === "string" ? children : undefined}
          className={buttonClasses}
          {...props}
        >
          {buttonContent}
        </button>
        {/* Tooltip in collapsed mode */}
        {isCollapsed && typeof children === "string" && (
          <span
            role="tooltip"
            className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded-md bg-slate-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50"
          >
            {children}
          </span>
        )}
      </span>
    );
  }
);

SidebarMenuButton.displayName = "SidebarMenuButton";

// ---------------------------------------------------------------------------
// SidebarMenuSub
// ---------------------------------------------------------------------------

type SidebarMenuSubProps = HTMLAttributes<HTMLUListElement> & {
  open?: boolean;
};

const SidebarMenuSub = forwardRef<HTMLUListElement, SidebarMenuSubProps>(
  ({ className, open = true, ...props }, ref) => {
    const { collapsed, mobile } = useSidebar();
    const isCollapsed = collapsed && !mobile;

    // Hide submenus when collapsed
    if (isCollapsed) return null;

    return (
      <ul
        ref={ref}
        role="group"
        aria-expanded={open}
        className={cn(
          "flex flex-col gap-0.5 list-none pl-6 ml-3 border-l border-gray-200 py-1",
          !open && "hidden",
          className
        )}
        {...props}
      />
    );
  }
);

SidebarMenuSub.displayName = "SidebarMenuSub";

// ---------------------------------------------------------------------------
// SidebarMenuSubItem
// ---------------------------------------------------------------------------

type SidebarMenuSubItemProps = HTMLAttributes<HTMLLIElement>;

const SidebarMenuSubItem = forwardRef<HTMLLIElement, SidebarMenuSubItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn("list-none", className)}
        {...props}
      />
    );
  }
);

SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

// ---------------------------------------------------------------------------
// SidebarMenuSubButton
// ---------------------------------------------------------------------------

type SidebarMenuSubButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

const SidebarMenuSubButton = forwardRef<
  HTMLButtonElement,
  SidebarMenuSubButtonProps
>(({ className, active = false, disabled = false, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors",
        active
          ? "text-primary font-semibold bg-primary/5"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

// ---------------------------------------------------------------------------
// Legacy sub-components (backward compat)
// ---------------------------------------------------------------------------

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

SidebarNavGroup.displayName = "SidebarNavGroup";

type SidebarNavItemProps = {
  icon?: string;
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
};

function SidebarNavItem({
  icon,
  label,
  active = false,
  href = "#",
  onClick,
  className,
}: SidebarNavItemProps) {
  const ctx = useContext(SidebarContext);
  const handleClick = () => {
    ctx?.setMobileOpen(false);
    onClick?.();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
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
    </a>
  );
}

SidebarNavItem.displayName = "SidebarNavItem";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  // Context + hook
  SidebarProvider,
  useSidebar,
  // Root
  Sidebar,
  // Structural sub-components
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
  // Menu sub-components
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  // Legacy
  SidebarNavGroup,
  SidebarNavItem,
};

export type {
  SidebarProps,
  SidebarProviderProps,
  SidebarHeaderProps,
  SidebarFooterProps,
  SidebarContentProps,
  SidebarGroupProps,
  SidebarGroupLabelProps,
  SidebarGroupContentProps,
  SidebarSeparatorProps,
  SidebarMenuProps,
  SidebarMenuItemProps,
  SidebarMenuButtonProps,
  SidebarMenuSubProps,
  SidebarMenuSubItemProps,
  SidebarMenuSubButtonProps,
  SidebarNavGroupProps,
  SidebarNavItemProps,
  SidebarContextValue,
};
