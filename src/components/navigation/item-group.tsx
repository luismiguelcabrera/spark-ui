"use client";

import {
  createContext,
  useContext,
  forwardRef,
  Children,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
  type ReactElement,
} from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";

/* ── Context ─────────────────────────────────────────────── */

type ItemGroupContextValue = {
  selected: string[];
  toggle: (value: string) => void;
};

const ItemGroupContext = createContext<ItemGroupContextValue | null>(null);

function useItemGroupContext() {
  const ctx = useContext(ItemGroupContext);
  if (!ctx) throw new Error("ItemGroupItem must be used within an <ItemGroup>");
  return ctx;
}

/* ── ItemGroup ───────────────────────────────────────────── */

type ItemGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  /** Controlled selected value(s) */
  value?: string | string[];
  /** Default selected value(s) */
  defaultValue?: string | string[];
  /** Change callback */
  onChange?: (value: string | string[]) => void;
  /** Allow multiple selections */
  multiple?: boolean;
  /** At least one item must remain selected */
  mandatory?: boolean;
  children?: ReactNode;
};

const normalise = (v: string | string[] | undefined): string[] => {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
};

const ItemGroup = forwardRef<HTMLDivElement, ItemGroupProps>(
  (
    {
      className,
      children,
      value: valueProp,
      defaultValue,
      onChange,
      multiple = false,
      mandatory = false,
      ...props
    },
    ref
  ) => {
    const [selected, setSelected] = useControllable<string[]>({
      value: valueProp !== undefined ? normalise(valueProp) : undefined,
      defaultValue: normalise(defaultValue),
      onChange: (next) => {
        if (onChange) {
          onChange(multiple ? next : next[0] ?? "");
        }
      },
    });

    const toggle = (item: string) => {
      const isSelected = selected.includes(item);

      if (isSelected) {
        if (mandatory && selected.length <= 1) return;
        setSelected(selected.filter((v) => v !== item));
      } else {
        if (multiple) {
          setSelected([...selected, item]);
        } else {
          setSelected([item]);
        }
      }
    };

    return (
      <ItemGroupContext.Provider value={{ selected, toggle }}>
        <div ref={ref} role="group" aria-label="Selection group" className={cn("flex gap-2", className)} {...props}>
          {children}
        </div>
      </ItemGroupContext.Provider>
    );
  }
);
ItemGroup.displayName = "ItemGroup";

/* ── ItemGroupItem ───────────────────────────────────────── */

type ItemGroupItemProps = {
  /** The value this item represents */
  value: string;
  /** Render prop or ReactElement children */
  children: ReactNode | ((props: { isSelected: boolean; onSelect: () => void }) => ReactNode);
};

const ItemGroupItem = forwardRef<HTMLDivElement, ItemGroupItemProps & Omit<HTMLAttributes<HTMLDivElement>, "children">>(
  ({ value, children, className, ...props }, ref) => {
    const { selected, toggle } = useItemGroupContext();
    const isSelected = selected.includes(value);
    const onSelect = () => toggle(value);

    // Render prop
    if (typeof children === "function") {
      return (
        <div ref={ref} className={className} {...props}>
          {children({ isSelected, onSelect })}
        </div>
      );
    }

    // Clone element — pass isSelected + onSelect
    if (Children.count(children) === 1 && isValidElement(children)) {
      return cloneElement(children as ReactElement<Record<string, unknown>>, {
        isSelected,
        onSelect,
      });
    }

    // Fallback: clickable wrapper
    return (
      <div
        ref={ref}
        role="button"
        aria-pressed={isSelected}
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
          }
        }}
        className={cn(
          "cursor-pointer select-none rounded-lg px-3 py-2 transition-colors",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          isSelected ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted/50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ItemGroupItem.displayName = "ItemGroupItem";

export { ItemGroup, ItemGroupItem, useItemGroupContext };
export type { ItemGroupProps, ItemGroupItemProps, ItemGroupContextValue };
