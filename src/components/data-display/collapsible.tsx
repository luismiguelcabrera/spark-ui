"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";

type CollapsibleProps = HTMLAttributes<HTMLDivElement> & {
  /** Whether the content is expanded */
  open?: boolean;
  /** Default expanded state */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Disable interaction */
  disabled?: boolean;
};

const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ className, open, defaultOpen = false, onOpenChange, disabled, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = useControllable({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    return (
      <div
        ref={ref}
        data-state={isOpen ? "open" : "closed"}
        data-disabled={disabled || undefined}
        className={cn(className)}
        {...props}
      >
        {typeof children === "function"
          ? (children as (props: { isOpen: boolean; toggle: () => void }) => ReactNode)({
              isOpen,
              toggle: () => !disabled && setIsOpen(!isOpen),
            })
          : children}
      </div>
    );
  }
);
Collapsible.displayName = "Collapsible";

type CollapsibleTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn("flex items-center", className)}
      {...props}
    >
      {children}
    </button>
  )
);
CollapsibleTrigger.displayName = "CollapsibleTrigger";

type CollapsibleContentProps = HTMLAttributes<HTMLDivElement> & {
  /** Whether the content is visible */
  open?: boolean;
};

const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ className, open, children, ...props }, ref) => {
    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden transition-all data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
export type { CollapsibleProps, CollapsibleTriggerProps, CollapsibleContentProps };
