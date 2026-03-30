"use client";

import {
  forwardRef,
  Children,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";

/* -------------------------------------------------------------------------- */
/*  WindowItem                                                                 */
/* -------------------------------------------------------------------------- */

type WindowItemProps = HTMLAttributes<HTMLDivElement> & {
  /** Unique value identifying this item */
  value: string;
  /** Content to render when this item is active */
  children: ReactNode;
};

const WindowItem = forwardRef<HTMLDivElement, WindowItemProps>(
  ({ className, children, value: _value, ...props }, ref) => (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      {children}
    </div>
  ),
);
WindowItem.displayName = "WindowItem";

/* -------------------------------------------------------------------------- */
/*  Window                                                                     */
/* -------------------------------------------------------------------------- */

type WindowProps = HTMLAttributes<HTMLDivElement> & {
  /** Controlled active item value */
  value?: string;
  /** Default active item value (uncontrolled) */
  defaultValue?: string;
  /** Callback when the active item changes */
  onValueChange?: (value: string) => void;
  /** WindowItem children */
  children: ReactNode;
};

const WindowBase = forwardRef<HTMLDivElement, WindowProps>(
  ({ className, value, defaultValue, onValueChange, children, ...props }, ref) => {
    // Collect all WindowItem children and their values
    const items: { value: string; element: ReactNode }[] = [];
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.props && typeof (child.props as WindowItemProps).value === "string") {
        items.push({
          value: (child.props as WindowItemProps).value,
          element: child,
        });
      }
    });

    const firstValue = items[0]?.value ?? "";

    const [activeValue] = useControllable({
      value,
      defaultValue: defaultValue ?? firstValue,
      onChange: onValueChange,
    });

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        role="region"
        aria-live="polite"
        {...props}
      >
        {items.map((item) => {
          const isActive = item.value === activeValue;
          return (
            <div
              key={item.value}
              className={cn(
                "transition-opacity duration-200",
                isActive
                  ? "opacity-100 relative"
                  : "opacity-0 absolute inset-0 pointer-events-none",
              )}
              aria-hidden={!isActive}
            >
              {item.element}
            </div>
          );
        })}
      </div>
    );
  },
);
WindowBase.displayName = "Window";

/* -------------------------------------------------------------------------- */
/*  Compound export                                                            */
/* -------------------------------------------------------------------------- */

const Window = Object.assign(WindowBase, { Item: WindowItem });

export { Window, WindowItem };
export type { WindowProps, WindowItemProps };
