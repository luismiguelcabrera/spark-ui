"use client";

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useControllable } from "../../hooks/use-controllable";

// ── Context ──────────────────────────────────────────────

type DropdownContextValue = {
  close: () => void;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

// ── Legacy types ─────────────────────────────────────────

type DropdownItem = {
  label: string;
  icon?: string;
  danger?: boolean;
  divider?: boolean;
};

// ── Main component ───────────────────────────────────────

type DropdownMenuProps = {
  items?: DropdownItem[];
  trigger?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onItemClick?: (item: DropdownItem) => void;
  align?: "left" | "right";
  className?: string;
  children?: ReactNode;
};

function DropdownMenu({
  items,
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  onItemClick,
  align = "left",
  className,
  children,
}: DropdownMenuProps) {
  const isManaged =
    trigger !== undefined ||
    open !== undefined ||
    defaultOpen !== undefined;

  const [isOpen, setIsOpen] = useControllable({
    value: open,
    defaultValue: defaultOpen ?? !isManaged,
    onChange: onOpenChange,
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [portalPos, setPortalPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPortalPos({
      top: rect.bottom + window.scrollY,
      left:
        align === "right"
          ? rect.right + window.scrollX
          : rect.left + window.scrollX,
    });
  }, [align]);

  const close = useCallback(() => setIsOpen(false), [setIsOpen]);

  // Position the portal when open
  useEffect(() => {
    if (!isManaged || !isOpen) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isManaged, isOpen, updatePosition]);

  // Click outside to close
  useEffect(() => {
    if (!isManaged || !isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        portalRef.current?.contains(target)
      )
        return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isManaged, isOpen, setIsOpen]);

  // Escape key to close
  useEffect(() => {
    if (!isManaged || !isOpen) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isManaged, isOpen, close]);

  const handleMenuKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const menu = e.currentTarget;
      const items = Array.from(
        menu.querySelectorAll<HTMLElement>('[role="menuitem"]')
      );
      if (items.length === 0) return;

      const current = document.activeElement as HTMLElement;
      const currentIndex = items.indexOf(current);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        items[next]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        items[prev]?.focus();
      }
    },
    []
  );

  // Legacy inline mode: no trigger, render menu directly
  if (!isManaged) {
    return (
      <div
        role="menu"
        className={cn(
          s.dropdownOverlay,
          align === "right" ? "right-0" : "left-0",
          className
        )}
        onKeyDown={handleMenuKeyDown}
      >
        {renderLegacyItems(items, onItemClick)}
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      {trigger && (
        <div
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
          className="cursor-pointer"
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          {trigger}
        </div>
      )}
      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <DropdownContext.Provider value={{ close }}>
            <div
              ref={portalRef}
              role="menu"
              style={{
                position: "absolute",
                top: portalPos.top,
                ...(align === "right"
                  ? { right: `calc(100% - ${portalPos.left}px)` }
                  : { left: portalPos.left }),
              }}
              className={cn(
                s.dropdownOverlay,
                "!absolute",
                className
              )}
              onKeyDown={handleMenuKeyDown}
            >
              {children || renderLegacyItems(items, onItemClick, close)}
            </div>
          </DropdownContext.Provider>,
          document.body
        )}
    </div>
  );
}
DropdownMenu.displayName = "DropdownMenu";

function renderLegacyItems(
  items?: DropdownItem[],
  onItemClick?: (item: DropdownItem) => void,
  close?: () => void
) {
  if (!items) return null;
  return items.map((item, i) => {
    if (item.divider) {
      return <div key={i} role="separator" className={s.dropdownDivider} />;
    }
    return (
      <button
        key={item.label}
        type="button"
        role="menuitem"
        tabIndex={-1}
        onClick={() => {
          onItemClick?.(item);
          close?.();
        }}
        className={cn(
          s.dropdownItem,
          item.danger && s.dropdownItemDanger,
          "focus-visible:outline-none focus-visible:bg-slate-100"
        )}
      >
        {item.icon && <Icon name={item.icon} size="sm" />}
        <span>{item.label}</span>
      </button>
    );
  });
}

// ── Compound sub-components ─────────────────────────────

function DropdownMenuItem({
  icon,
  danger,
  onClick,
  children,
  className,
}: {
  icon?: string;
  danger?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(DropdownContext);

  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      onClick={() => {
        onClick?.();
        ctx?.close();
      }}
      className={cn(
        s.dropdownItem,
        danger && s.dropdownItemDanger,
        "focus-visible:outline-none focus-visible:bg-slate-100",
        className
      )}
    >
      {icon && <Icon name={icon} size="sm" />}
      <span>{children}</span>
    </button>
  );
}
DropdownMenuItem.displayName = "DropdownMenuItem";

function DropdownMenuDivider() {
  return <div role="separator" className={s.dropdownDivider} />;
}
DropdownMenuDivider.displayName = "DropdownMenuDivider";

DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Divider = DropdownMenuDivider;

export { DropdownMenu };
export type { DropdownMenuProps, DropdownItem };
