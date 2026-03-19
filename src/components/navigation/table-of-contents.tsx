"use client";

import { forwardRef, useRef, useEffect, useCallback } from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";

// ── Types ───────────────────────────────────────────────

type TocItem = {
  id: string;
  label: string;
  level?: number;
  children?: TocItem[];
};

type TableOfContentsVariant = "default" | "minimal" | "bordered";

type TableOfContentsProps = {
  items: TocItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  offset?: number;
  smooth?: boolean;
  variant?: TableOfContentsVariant;
  className?: string;
  /** Accessible label for the navigation landmark */
  "aria-label"?: string;
};

// ── Helpers ─────────────────────────────────────────────

/** Flatten nested TocItems into a single array of ids */
function flattenItems(items: TocItem[]): string[] {
  const result: string[] = [];
  for (const item of items) {
    result.push(item.id);
    if (item.children) {
      result.push(...flattenItems(item.children));
    }
  }
  return result;
}

// ── Component ───────────────────────────────────────────

const TableOfContents = forwardRef<HTMLElement, TableOfContentsProps>(
  (
    {
      items,
      activeId,
      defaultActiveId,
      onActiveChange,
      offset = 80,
      smooth = true,
      variant = "default",
      className,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const [currentActive, setCurrentActive] = useControllable({
      value: activeId,
      defaultValue: defaultActiveId ?? "",
      onChange: onActiveChange,
    });

    const observerRef = useRef<IntersectionObserver | null>(null);
    const isControlled = activeId !== undefined;

    // Scroll-spy with IntersectionObserver (SSR-safe)
    useEffect(() => {
      if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
      if (isControlled) return; // Don't spy when fully controlled

      const ids = flattenItems(items);
      const elements = ids
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];

      if (elements.length === 0) return;

      // Track visible sections
      const visibleSet = new Set<string>();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              visibleSet.add(entry.target.id);
            } else {
              visibleSet.delete(entry.target.id);
            }
          }

          // Find the first visible item in document order
          for (const id of ids) {
            if (visibleSet.has(id)) {
              setCurrentActive(id);
              return;
            }
          }
        },
        {
          rootMargin: `-${offset}px 0px -40% 0px`,
          threshold: 0,
        }
      );

      for (const el of elements) {
        observerRef.current.observe(el);
      }

      return () => {
        observerRef.current?.disconnect();
      };
    }, [items, offset, isControlled, setCurrentActive]);

    const handleClick = useCallback(
      (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        setCurrentActive(id);

        if (typeof window === "undefined") return;

        const target = document.getElementById(id);
        if (target) {
          const top =
            target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({
            top,
            behavior: smooth ? "smooth" : "auto",
          });
          target.focus({ preventScroll: true });
        }
      },
      [offset, smooth, setCurrentActive]
    );

    const variantStyles = {
      default: "border-l-2 border-slate-200",
      minimal: "",
      bordered:
        "border border-slate-200 rounded-xl p-4 bg-white shadow-sm",
    };

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel ?? "Table of contents"}
        className={cn(variantStyles[variant], className)}
      >
        <TocList
          items={items}
          activeId={currentActive}
          onClick={handleClick}
          variant={variant}
          depth={0}
        />
      </nav>
    );
  }
);

TableOfContents.displayName = "TableOfContents";

// ── Recursive list renderer ─────────────────────────────

function TocList({
  items,
  activeId,
  onClick,
  variant,
  depth,
}: {
  items: TocItem[];
  activeId: string;
  onClick: (e: React.MouseEvent, id: string) => void;
  variant: TableOfContentsVariant;
  depth: number;
}) {
  return (
    <ul className={cn("space-y-0.5", depth > 0 && "mt-0.5")} role="list">
      {items.map((item) => {
        const isActive = activeId === item.id;
        const level = item.level ?? depth;
        const indentPx = variant === "bordered" ? level * 12 : level * 16;

        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={isActive ? "location" : undefined}
              onClick={(e) => onClick(e, item.id)}
              className={cn(
                "block py-1.5 text-sm transition-colors rounded-md",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                // Indent
                variant !== "bordered" && "pl-4 -ml-px",
                variant === "bordered" && "px-3",
                // Active state
                isActive && variant === "default" && [
                  "text-primary font-medium",
                  "border-l-2 border-primary -ml-[2px]",
                ],
                isActive && variant === "minimal" && "text-primary font-medium",
                isActive &&
                  variant === "bordered" &&
                  "text-primary font-medium bg-primary/5 rounded-lg",
                // Inactive state
                !isActive &&
                  "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
              style={{ paddingLeft: indentPx > 0 ? `${indentPx + (variant === "bordered" ? 12 : 16)}px` : undefined }}
            >
              {item.label}
            </a>
            {item.children && item.children.length > 0 && (
              <TocList
                items={item.children}
                activeId={activeId}
                onClick={onClick}
                variant={variant}
                depth={depth + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export { TableOfContents };
export type {
  TableOfContentsProps,
  TableOfContentsVariant,
  TocItem,
};
