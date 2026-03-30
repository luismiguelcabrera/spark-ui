import { forwardRef, createContext, useContext, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "./icon";

type ListDensity = "default" | "comfortable" | "compact";

type ListContextValue = {
  nav: boolean;
  density: ListDensity;
  selectable: boolean;
  selectedKey?: string;
  onSelect?: (key: string) => void;
};

const ListContext = createContext<ListContextValue>({
  nav: false,
  density: "default",
  selectable: false,
});

type ListProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "plain" | "card" | "divided";
  children: ReactNode;
  className?: string;
  /** Enable navigation list mode (active item highlight) */
  nav?: boolean;
  /** Density of list items */
  density?: ListDensity;
  /** Enable click-to-select on items */
  selectable?: boolean;
  /** Currently selected item key (controlled) */
  selectedKey?: string;
  /** Callback when an item is selected */
  onSelect?: (key: string) => void;
};

const densityPadding: Record<ListDensity, string> = {
  default: "py-3 px-4",
  comfortable: "py-4 px-5",
  compact: "py-1.5 px-3",
};

const List = forwardRef<HTMLDivElement, ListProps>(
  (
    {
      variant = "plain",
      children,
      className,
      nav = false,
      density = "default",
      selectable = false,
      selectedKey,
      onSelect,
      role,
      ...props
    },
    ref
  ) => {
    const resolvedRole = role ?? (nav ? "navigation" : selectable ? "listbox" : undefined);
    return (
      <ListContext.Provider value={{ nav, density, selectable, selectedKey, onSelect }}>
        <div
          ref={ref}
          role={resolvedRole}
          className={cn(
            variant === "card" && s.cardBase,
            variant === "divided" && "divide-y divide-slate-100",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ListContext.Provider>
    );
  }
);
List.displayName = "List";

type ListItemProps = HTMLAttributes<HTMLDivElement> & {
  icon?: string;
  iconBg?: string;
  iconColor?: string;
  title: string;
  description?: string;
  timestamp?: string;
  actions?: ReactNode;
  className?: string;
  /** Whether this item is active (for nav mode) */
  active?: boolean;
  /** Unique value for selection */
  value?: string;
};

const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      icon,
      iconBg = "bg-slate-100",
      iconColor = "text-slate-500",
      title,
      description,
      timestamp,
      actions,
      className,
      active = false,
      value,
      onClick,
      ...props
    },
    ref
  ) => {
    const { nav, density, selectable, selectedKey, onSelect } = useContext(ListContext);
    const isSelected = selectable && value !== undefined && selectedKey === value;
    const isActive = nav && active;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (selectable && value !== undefined) {
        onSelect?.(value);
      }
      onClick?.(e);
    };

    const interactiveProps = selectable
      ? {
          role: "option" as const,
          "aria-selected": isSelected,
          tabIndex: 0,
          onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
            if ((e.key === "Enter" || e.key === " ") && value !== undefined) {
              e.preventDefault();
              onSelect?.(value);
            }
          },
        }
      : {};

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start gap-3",
          densityPadding[density],
          (selectable || nav) && "cursor-pointer transition-colors",
          selectable && "hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
          isSelected && "bg-primary/10 text-primary",
          isActive && "bg-primary/10 text-primary border-l-2 border-primary font-medium",
          nav && !isActive && "hover:bg-slate-50",
          className
        )}
        onClick={handleClick}
        {...interactiveProps}
        {...props}
      >
        {icon && (
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
              iconBg
            )}
          >
            <Icon name={icon} size="sm" className={iconColor} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className={s.textPrimary}>{title}</p>
          {description && (
            <p className={cn(s.textMuted, "mt-0.5")}>{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {timestamp && (
            <span className="text-xs text-slate-400">{timestamp}</span>
          )}
          {actions}
        </div>
      </div>
    );
  }
);
ListItem.displayName = "ListItem";

export { List, ListItem };
export type { ListProps, ListItemProps, ListDensity };
