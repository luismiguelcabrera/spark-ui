"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";
import { useControllable } from "../../hooks/use-controllable";

type DrawerProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "left" | "right";
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

function Drawer({
  open,
  defaultOpen,
  onOpenChange,
  side = "right",
  title,
  children,
  footer,
  className,
}: DrawerProps) {
  const [isOpen, setIsOpen] = useControllable({
    value: open,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  });

  const close = useCallback(() => setIsOpen(false), [setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={close}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-float",
          side === "left" && "ml-0 mr-auto",
          className,
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-secondary">{title}</h2>
            <button
              type="button"
              aria-label="Close drawer"
              onClick={close}
              className="p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-400"
            >
              <Icon name="close" size="md" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export { Drawer };
export type { DrawerProps };
