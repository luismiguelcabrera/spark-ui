"use client";

import { forwardRef, useState, useRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";
import { useClickOutside } from "../../hooks/use-click-outside";

type PopconfirmProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "info" | "warning" | "danger";
  icon?: string;
  placement?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
  disabled?: boolean;
};

const typeMap = {
  info: { icon: "info", color: "text-primary", confirmBg: "bg-primary hover:bg-primary-dark text-white" },
  warning: { icon: "alert-triangle", color: "text-warning", confirmBg: "bg-warning hover:bg-warning/90 text-black" },
  danger: { icon: "alert-circle", color: "text-destructive", confirmBg: "bg-destructive hover:bg-destructive/90 text-white" },
};

const placementMap = {
  top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
  bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
  left: "right-full mr-2 top-1/2 -translate-y-1/2",
  right: "left-full ml-2 top-1/2 -translate-y-1/2",
};

const Popconfirm = forwardRef<HTMLDivElement, PopconfirmProps>(
  (
    {
      className,
      title,
      description,
      onConfirm,
      onCancel,
      confirmText = "Yes",
      cancelText = "No",
      type = "warning",
      icon,
      placement = "top",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useClickOutside(containerRef, () => setOpen(false), open);

    const styles = typeMap[type];

    return (
      <div ref={containerRef} className={cn("relative inline-block", className)} {...props}>
        <div onClick={() => !disabled && setOpen(!open)}>{children}</div>
        {open && (
          <div
            ref={ref}
            className={cn(
              "absolute z-50 w-64 bg-surface border border-muted rounded-xl shadow-float p-4",
              placementMap[placement]
            )}
            role="alertdialog"
          >
            <div className="flex gap-2.5">
              <Icon name={icon ?? styles.icon} size="md" className={cn("shrink-0 mt-0.5", styles.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-secondary">{title}</p>
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={() => { onCancel?.(); setOpen(false); }}
                className="px-3 py-1.5 text-xs font-semibold text-muted-foreground border border-muted rounded-lg hover:bg-muted/30 transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={() => { onConfirm?.(); setOpen(false); }}
                className={cn("px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors", styles.confirmBg)}
              >
                {confirmText}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);
Popconfirm.displayName = "Popconfirm";

export { Popconfirm };
export type { PopconfirmProps };
