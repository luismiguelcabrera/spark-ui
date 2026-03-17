"use client";

import { forwardRef, useState, useRef, useEffect, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

type MenubarMenuItem = {
  label: string;
  icon?: string;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  separator?: false;
  children?: MenubarMenuItem[];
} | {
  separator: true;
};

type MenubarMenu = {
  /** Menu trigger label */
  label: string;
  /** Menu items */
  items: MenubarMenuItem[];
};

type MenubarProps = HTMLAttributes<HTMLDivElement> & {
  /** Menu definitions */
  menus: MenubarMenu[];
};

const Menubar = forwardRef<HTMLDivElement, MenubarProps>(
  ({ className, menus, ...props }, ref) => {
    const [openMenu, setOpenMenu] = useState<number | null>(null);
    const menubarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (openMenu === null) return;

      const handleClick = (e: MouseEvent) => {
        if (menubarRef.current && !menubarRef.current.contains(e.target as Node)) {
          setOpenMenu(null);
        }
      };
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpenMenu(null);
      };

      document.addEventListener("click", handleClick);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("click", handleClick);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [openMenu]);

    return (
      <div
        ref={(el) => {
          (menubarRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        role="menubar"
        className={cn(
          "inline-flex items-center h-9 bg-white border border-slate-200 rounded-lg px-1 gap-0.5",
          className
        )}
        {...props}
      >
        {menus.map((menu, menuIndex) => (
          <div key={menu.label} className="relative">
            <button
              type="button"
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={openMenu === menuIndex}
              onClick={() => setOpenMenu(openMenu === menuIndex ? null : menuIndex)}
              onMouseEnter={() => openMenu !== null && setOpenMenu(menuIndex)}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                openMenu === menuIndex
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {menu.label}
            </button>

            {openMenu === menuIndex && (
              <div
                className="absolute left-0 top-full mt-1 min-w-[200px] bg-white border border-slate-200 rounded-xl shadow-float py-1 z-50"
                role="menu"
              >
                {menu.items.map((item, itemIndex) => {
                  if ("separator" in item && item.separator) {
                    return <div key={`sep-${itemIndex}`} className="my-1 h-px bg-slate-100" />;
                  }

                  const menuItem = item as Exclude<MenubarMenuItem, { separator: true }>;
                  return (
                    <button
                      key={`${menuItem.label}-${itemIndex}`}
                      type="button"
                      role="menuitem"
                      disabled={menuItem.disabled}
                      onClick={() => {
                        menuItem.onClick?.();
                        setOpenMenu(null);
                      }}
                      className={cn(
                        "flex items-center gap-3 w-full px-3 py-2 text-sm transition-colors",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        menuItem.danger
                          ? "text-red-600 hover:bg-red-50"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      {menuItem.icon && <Icon name={menuItem.icon} size="sm" className="shrink-0" />}
                      <span className="flex-1 text-left">{menuItem.label}</span>
                      {menuItem.shortcut && (
                        <span className="text-[11px] font-mono text-slate-400 ml-6">
                          {menuItem.shortcut}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
);
Menubar.displayName = "Menubar";

export { Menubar };
export type { MenubarProps, MenubarMenu, MenubarMenuItem };
