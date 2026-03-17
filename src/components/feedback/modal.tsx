"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useControllable } from "../../hooks/use-controllable";

const modalVariants = cva(s.modalContent, {
  variants: {
    size: {
      sm: "w-full max-w-sm",
      md: "w-full max-w-lg",
      lg: "w-full max-w-2xl",
      full: "w-full max-w-5xl h-[90vh]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type ModalProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
} & VariantProps<typeof modalVariants>;

function ModalOverlay({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(s.modalOverlay, className)}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClick?.();
      }}
    >
      {children}
    </div>
  );
}

function Modal({
  open,
  defaultOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size,
  className,
}: ModalProps) {
  const isManaged = open !== undefined || defaultOpen !== undefined;

  const [isOpen, setIsOpen] = useControllable({
    value: open,
    defaultValue: defaultOpen ?? true,
    onChange: onOpenChange,
  });

  const close = useCallback(() => setIsOpen(false), [setIsOpen]);

  // Escape key handler (only for managed modals)
  useEffect(() => {
    if (!isManaged || !isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isManaged, isOpen, close]);

  // Inline (legacy) mode: render without overlay when not managed
  if (!isManaged) {
    return (
      <div role="dialog" aria-label={title} className={cn(modalVariants({ size, className }))}>
        {title && (
          <div className={s.modalHeader}>
            <div>
              <h2 className="text-lg font-bold text-secondary">{title}</h2>
              {description && (
                <p className="text-sm text-slate-500 mt-0.5">{description}</p>
              )}
            </div>
            <button type="button" aria-label="Close dialog" className="p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-400">
              <Icon name="close" size="md" />
            </button>
          </div>
        )}
        <div className={s.modalBody}>{children}</div>
        {footer && <div className={s.modalFooter}>{footer}</div>}
      </div>
    );
  }

  // Managed mode with overlay
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={close}>
      <div role="dialog" aria-modal="true" aria-label={title} className={cn(modalVariants({ size, className }))}>
        {title && (
          <div className={s.modalHeader}>
            <div>
              <h2 className="text-lg font-bold text-secondary">{title}</h2>
              {description && (
                <p className="text-sm text-slate-500 mt-0.5">{description}</p>
              )}
            </div>
            <button
              type="button"
              aria-label="Close dialog"
              onClick={close}
              className="p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-400"
            >
              <Icon name="close" size="md" />
            </button>
          </div>
        )}
        <div className={s.modalBody}>{children}</div>
        {footer && <div className={s.modalFooter}>{footer}</div>}
      </div>
    </ModalOverlay>
  );
}

export { Modal, ModalOverlay, modalVariants };
export type { ModalProps };
