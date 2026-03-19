"use client";

import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";
import { Spinner } from "../feedback/spinner";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type SplitButtonAction = {
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
};

type SplitButtonVariant = "solid" | "outline" | "ghost";
type SplitButtonColor =
  | "primary"
  | "secondary"
  | "destructive"
  | "success"
  | "warning";
type SplitButtonSize = "sm" | "md" | "lg";

type SplitButtonProps = {
  /** Primary button label */
  children: ReactNode;
  /** Dropdown actions */
  actions: SplitButtonAction[];
  /** Called when a dropdown action is selected */
  onAction?: (value: string) => void;
  /** Called when the primary button is clicked */
  onClick?: () => void;
  /** Button style variant */
  variant?: SplitButtonVariant;
  /** Color palette */
  color?: SplitButtonColor;
  /** Size */
  size?: SplitButtonSize;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Additional class names */
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*  Color × Variant matrix                                                     */
/* -------------------------------------------------------------------------- */

const colorMap: Record<
  SplitButtonColor,
  Record<SplitButtonVariant, { button: string; divider: string; dropdown: string }>
> = {
  primary: {
    solid: {
      button:
        "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 focus-visible:ring-primary",
      divider: "border-white/20",
      dropdown: "bg-primary hover:bg-primary-dark text-white focus-visible:ring-primary",
    },
    outline: {
      button:
        "border border-primary/30 text-primary hover:bg-primary/5 focus-visible:ring-primary",
      divider: "border-primary/30",
      dropdown:
        "border border-primary/30 text-primary hover:bg-primary/5 focus-visible:ring-primary border-l-0",
    },
    ghost: {
      button:
        "text-primary hover:bg-primary/10 focus-visible:ring-primary",
      divider: "border-primary/20",
      dropdown:
        "text-primary hover:bg-primary/10 focus-visible:ring-primary",
    },
  },
  secondary: {
    solid: {
      button:
        "bg-secondary hover:bg-secondary-light text-white focus-visible:ring-secondary",
      divider: "border-white/20",
      dropdown:
        "bg-secondary hover:bg-secondary-light text-white focus-visible:ring-secondary",
    },
    outline: {
      button:
        "border border-secondary/30 text-secondary hover:bg-secondary/5 focus-visible:ring-secondary",
      divider: "border-secondary/30",
      dropdown:
        "border border-secondary/30 text-secondary hover:bg-secondary/5 focus-visible:ring-secondary border-l-0",
    },
    ghost: {
      button:
        "text-secondary hover:bg-secondary/10 focus-visible:ring-secondary",
      divider: "border-secondary/20",
      dropdown:
        "text-secondary hover:bg-secondary/10 focus-visible:ring-secondary",
    },
  },
  destructive: {
    solid: {
      button:
        "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 focus-visible:ring-red-600",
      divider: "border-white/20",
      dropdown:
        "bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-600",
    },
    outline: {
      button:
        "border border-red-300 text-red-600 hover:bg-red-50 focus-visible:ring-red-600",
      divider: "border-red-300",
      dropdown:
        "border border-red-300 text-red-600 hover:bg-red-50 focus-visible:ring-red-600 border-l-0",
    },
    ghost: {
      button:
        "text-red-600 hover:bg-red-50 focus-visible:ring-red-600",
      divider: "border-red-200",
      dropdown:
        "text-red-600 hover:bg-red-50 focus-visible:ring-red-600",
    },
  },
  success: {
    solid: {
      button:
        "bg-green-700 hover:bg-green-800 text-white shadow-lg shadow-green-700/20 focus-visible:ring-green-700",
      divider: "border-white/20",
      dropdown:
        "bg-green-700 hover:bg-green-800 text-white focus-visible:ring-green-700",
    },
    outline: {
      button:
        "border border-green-300 text-green-700 hover:bg-green-50 focus-visible:ring-green-700",
      divider: "border-green-300",
      dropdown:
        "border border-green-300 text-green-700 hover:bg-green-50 focus-visible:ring-green-700 border-l-0",
    },
    ghost: {
      button:
        "text-green-700 hover:bg-green-50 focus-visible:ring-green-700",
      divider: "border-green-200",
      dropdown:
        "text-green-700 hover:bg-green-50 focus-visible:ring-green-700",
    },
  },
  warning: {
    solid: {
      button:
        "bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-lg shadow-amber-500/20 focus-visible:ring-amber-500",
      divider: "border-amber-950/20",
      dropdown:
        "bg-amber-500 hover:bg-amber-600 text-amber-950 focus-visible:ring-amber-500",
    },
    outline: {
      button:
        "border border-amber-300 text-amber-700 hover:bg-amber-50 focus-visible:ring-amber-500",
      divider: "border-amber-300",
      dropdown:
        "border border-amber-300 text-amber-700 hover:bg-amber-50 focus-visible:ring-amber-500 border-l-0",
    },
    ghost: {
      button:
        "text-amber-700 hover:bg-amber-50 focus-visible:ring-amber-500",
      divider: "border-amber-200",
      dropdown:
        "text-amber-700 hover:bg-amber-50 focus-visible:ring-amber-500",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Size maps                                                                  */
/* -------------------------------------------------------------------------- */

const sizeMap: Record<SplitButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

const dropdownTriggerSize: Record<SplitButtonSize, string> = {
  sm: "h-9 w-8",
  md: "h-11 w-10",
  lg: "h-12 w-11",
};

const menuItemSize: Record<SplitButtonSize, string> = {
  sm: "text-xs py-2 px-3",
  md: "text-sm py-2.5 px-4",
  lg: "text-base py-3 px-4",
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(
  (
    {
      children,
      actions,
      onAction,
      onClick,
      variant = "solid",
      color = "primary",
      size = "md",
      disabled = false,
      loading = false,
      className,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);

    const isDisabled = disabled || loading;
    const colors = colorMap[color][variant];

    // Close on outside click
    useEffect(() => {
      if (!isOpen) return;
      const handler = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    // Scroll highlighted into view
    useEffect(() => {
      if (highlightedIndex < 0 || !menuRef.current) return;
      const items = menuRef.current.querySelectorAll('[role="menuitem"]');
      const el = items[highlightedIndex];
      if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ block: "nearest" });
      }
    }, [highlightedIndex]);

    const handleDropdownKeyDown = (e: KeyboardEvent) => {
      if (isDisabled) return;

      switch (e.key) {
        case "Enter":
        case " ": {
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setHighlightedIndex(0);
          } else if (highlightedIndex >= 0 && actions[highlightedIndex]) {
            if (!actions[highlightedIndex].disabled) {
              onAction?.(actions[highlightedIndex].value);
              setIsOpen(false);
              setHighlightedIndex(-1);
            }
          }
          break;
        }
        case "ArrowDown": {
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setHighlightedIndex(0);
          } else {
            setHighlightedIndex((prev) =>
              prev < actions.length - 1 ? prev + 1 : 0,
            );
          }
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          if (isOpen) {
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : actions.length - 1,
            );
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
        }
      }
    };

    const darkTextSolids = new Set<SplitButtonColor>(["warning"]);
    const useWhiteSpinner =
      variant === "solid" && !darkTextSolids.has(color);

    return (
      <div
        ref={ref}
        className={cn("inline-flex relative", className)}
      >
        <div ref={containerRef} className="inline-flex">
          {/* Primary button */}
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
              "rounded-l-xl",
              sizeMap[size],
              colors.button,
            )}
            disabled={isDisabled}
            onClick={onClick}
            aria-busy={loading || undefined}
          >
            {loading && (
              <Spinner
                size="sm"
                color={useWhiteSpinner ? "white" : "primary"}
              />
            )}
            {children}
          </button>

          {/* Divider */}
          <div
            className={cn(
              "w-px self-stretch",
              colors.divider,
              variant === "solid" ? "bg-white/20" : "",
              variant !== "solid" ? "border-l" : "",
            )}
            aria-hidden="true"
          />

          {/* Dropdown trigger */}
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center transition-all duration-200 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
              "rounded-r-xl",
              dropdownTriggerSize[size],
              colors.dropdown,
            )}
            disabled={isDisabled}
            onClick={() => {
              setIsOpen(!isOpen);
              if (!isOpen) setHighlightedIndex(-1);
            }}
            onKeyDown={handleDropdownKeyDown}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-label="More actions"
          >
            <Icon
              name="expand_more"
              size="sm"
              className={cn(
                "transition-transform",
                isOpen && "rotate-180",
              )}
            />
          </button>

          {/* Dropdown menu */}
          {isOpen && !isDisabled && (
            <ul
              ref={menuRef}
              role="menu"
              className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-xl border border-slate-200 bg-white py-1 shadow-lg overflow-hidden"
            >
              {actions.map((action, index) => (
                <li
                  key={action.value}
                  role="menuitem"
                  aria-disabled={action.disabled}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer transition-colors",
                    menuItemSize[size],
                    index === highlightedIndex && "bg-slate-50",
                    action.disabled && "opacity-50 cursor-not-allowed",
                    !action.disabled &&
                      index !== highlightedIndex &&
                      "hover:bg-slate-50",
                  )}
                  onClick={() => {
                    if (action.disabled) return;
                    onAction?.(action.value);
                    setIsOpen(false);
                    setHighlightedIndex(-1);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {action.icon && (
                    <Icon
                      name={action.icon}
                      size="sm"
                      className="text-slate-600"
                    />
                  )}
                  <span className="text-slate-700">{action.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  },
);
SplitButton.displayName = "SplitButton";

export { SplitButton };
export type {
  SplitButtonProps,
  SplitButtonAction,
  SplitButtonVariant,
  SplitButtonColor,
  SplitButtonSize,
};
