import {
  forwardRef,
  useRef,
  useState,
  useCallback,
  useEffect,
  type HTMLAttributes,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { cn } from "../../lib/utils";

type DockItem = {
  id: string;
  icon: string | ReactNode;
  label: string;
  onClick?: () => void;
  badge?: number | string;
  active?: boolean;
};

type DockPosition = "bottom" | "left" | "right";

type DockProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  items: DockItem[];
  position?: DockPosition;
  magnification?: boolean;
  className?: string;
};

const positionClasses: Record<DockPosition, string> = {
  bottom: "flex-row",
  left: "flex-col",
  right: "flex-col",
};

const containerPositionClasses: Record<DockPosition, string> = {
  bottom: "px-3 py-2",
  left: "py-3 px-2",
  right: "py-3 px-2",
};

const Dock = forwardRef<HTMLDivElement, DockProps>(
  (
    {
      items,
      position = "bottom",
      magnification = true,
      className,
      ...props
    },
    ref
  ) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // SSR-safe reduced motion check
    useEffect(() => {
      if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mql.matches); // eslint-disable-line react-hooks/set-state-in-effect -- intentional: sync reduced-motion preference on mount
      const handler = (e: MediaQueryListEvent) =>
        setPrefersReducedMotion(e.matches);
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }, []);

    const getScale = useCallback(
      (index: number): number => {
        if (!magnification || prefersReducedMotion || hoveredIndex === null)
          return 1;
        const distance = Math.abs(index - hoveredIndex);
        if (distance === 0) return 1.4;
        if (distance === 1) return 1.2;
        if (distance === 2) return 1.05;
        return 1;
      },
      [magnification, prefersReducedMotion, hoveredIndex]
    );

    const isHorizontal = position === "bottom";

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
        const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
        const current = focusedIndex ?? 0;

        if (e.key === nextKey) {
          e.preventDefault();
          const next = (current + 1) % items.length;
          setFocusedIndex(next);
          itemRefs.current[next]?.focus();
        } else if (e.key === prevKey) {
          e.preventDefault();
          const prev = (current - 1 + items.length) % items.length;
          setFocusedIndex(prev);
          itemRefs.current[prev]?.focus();
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          items[current]?.onClick?.();
        }
      },
      [isHorizontal, focusedIndex, items]
    );

    const shouldAnimate = magnification && !prefersReducedMotion;

    return (
      <div
        ref={ref}
        role="toolbar"
        aria-label="Dock"
        aria-orientation={isHorizontal ? "horizontal" : "vertical"}
        className={cn(
          "inline-flex items-end gap-1 rounded-2xl",
          "bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl",
          "border border-white/20 dark:border-slate-700/50",
          "shadow-lg shadow-black/10",
          containerPositionClasses[position],
          positionClasses[position],
          className
        )}
        onKeyDown={handleKeyDown}
        onMouseLeave={() => setHoveredIndex(null)}
        {...props}
      >
        {items.map((item, index) => {
          const scale = getScale(index);
          const isActive = item.active ?? false;

          return (
            <div
              key={item.id}
              className="flex flex-col items-center gap-1"
              onMouseEnter={() => setHoveredIndex(index)}
            >
              <button
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                aria-label={item.label}
                tabIndex={focusedIndex === index || (focusedIndex === null && index === 0) ? 0 : -1}
                onClick={item.onClick}
                onFocus={() => setFocusedIndex(index)}
                className={cn(
                  "relative flex items-center justify-center",
                  "w-12 h-12 rounded-xl",
                  "bg-white dark:bg-slate-700",
                  "shadow-md hover:shadow-lg",
                  "border border-slate-200/50 dark:border-slate-600/50",
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
                  shouldAnimate && "transition-transform duration-200 ease-out",
                  !shouldAnimate && "transition-none"
                )}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: position === "bottom" ? "bottom" : position === "left" ? "left" : "right",
                }}
              >
                {/* Icon */}
                <span className="text-2xl leading-none select-none" aria-hidden="true">
                  {typeof item.icon === "string" ? (
                    <span className="material-symbols-outlined text-slate-700 dark:text-slate-200">
                      {item.icon}
                    </span>
                  ) : (
                    item.icon
                  )}
                </span>

                {/* Badge */}
                {item.badge != null && (
                  <span
                    className={cn(
                      "absolute -top-1 -right-1 min-w-[18px] h-[18px]",
                      "flex items-center justify-center",
                      "bg-red-600 text-white text-[10px] font-bold",
                      "rounded-full px-1 leading-none"
                    )}
                    aria-label={`${item.label}: ${item.badge}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Active indicator */}
              {isActive && (
                <span
                  className="w-1 h-1 rounded-full bg-slate-600 dark:bg-slate-300"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
);
Dock.displayName = "Dock";

export { Dock };
export type { DockProps, DockItem, DockPosition };
