"use client";

import { forwardRef, useState, useRef, useEffect, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

type ContextMenuItem = {
  label: string;
  icon?: string;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  separator?: false;
} | {
  separator: true;
};

type ContextMenuProps = HTMLAttributes<HTMLDivElement> & {
  /** Menu items to display */
  items: ContextMenuItem[];
  /** Trigger element */
  children: ReactNode;
  /** Disabled state */
  disabled?: boolean;
};

const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(
  ({ className, items, children, disabled, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

    const handleContextMenu = (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      setPosition({ x: e.clientX, y: e.clientY });
      setOpen(true);
    };

    useEffect(() => {
      if (!open) return;

      const close = () => setOpen(false);
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") close();
      };

      document.addEventListener("click", close);
      document.addEventListener("contextmenu", close);
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("scroll", close);

      return () => {
        document.removeEventListener("click", close);
        document.removeEventListener("contextmenu", close);
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener("scroll", close);
      };
    }, [open]);

    // Adjust position to stay within viewport
    useEffect(() => {
      if (!open || !menuRef.current) return;
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const newPos = { ...position };

      if (rect.right > window.innerWidth) {
        newPos.x = window.innerWidth - rect.width - 8;
      }
      if (rect.bottom > window.innerHeight) {
        newPos.y = window.innerHeight - rect.height - 8;
      }

      if (newPos.x !== position.x || newPos.y !== position.y) {
        setPosition(newPos);
      }
    }, [open, position]);

    return (
      <>
        <div ref={ref} onContextMenu={handleContextMenu} className={className} {...props}>
          {children}
        </div>
        {open && (
          <div
            ref={menuRef}
            className={cn(
              "fixed z-50 min-w-[180px] bg-white border border-slate-200 rounded-xl shadow-float py-1 overflow-hidden",
              "animate-in fade-in zoom-in-95"
            )}
            style={{ left: position.x, top: position.y }}
            role="menu"
          >
            {items.map((item, i) => {
              if ("separator" in item && item.separator) {
                return <div key={`sep-${i}`} className="my-1 h-px bg-slate-100" />;
              }

              const menuItem = item as Exclude<ContextMenuItem, { separator: true }>;
              return (
                <button
                  key={`${menuItem.label}-${i}`}
                  type="button"
                  role="menuitem"
                  disabled={menuItem.disabled}
                  onClick={() => {
                    menuItem.onClick?.();
                    setOpen(false);
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
                    <span className="text-[11px] font-mono text-slate-400 ml-4">
                      {menuItem.shortcut}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </>
    );
  }
);
ContextMenu.displayName = "ContextMenu";

export { ContextMenu };
export type { ContextMenuProps, ContextMenuItem };
