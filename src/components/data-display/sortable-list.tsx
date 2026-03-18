"use client";

import {
  forwardRef,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { cn } from "../../lib/utils";
import { Icon } from "./icon";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type SortableItem = {
  id: string;
  [key: string]: unknown;
};

type SortableListProps<T extends SortableItem> = {
  /** Items to render. Each must have a unique `id`. */
  items: T[];
  /** Called with the reordered array after a move completes. */
  onReorder: (items: T[]) => void;
  /** Render function for each item. Receives the item and drag handle. */
  renderItem: (item: T, dragHandle: ReactNode, index: number) => ReactNode;
  /** Show the built-in drag handle. Set to false if you render your own. */
  showHandle?: boolean;
  /** Additional class names for the list container */
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*  DragHandle                                                                 */
/* -------------------------------------------------------------------------- */

type DragHandleProps = {
  /** Whether this item is currently being dragged */
  isDragging?: boolean;
  className?: string;
};

const DragHandle = forwardRef<HTMLButtonElement, DragHandleProps>(
  ({ isDragging, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label="Drag to reorder"
      aria-roledescription="sortable"
      className={cn(
        "touch-none cursor-grab shrink-0 text-slate-300 hover:text-slate-500 transition-colors p-1.5 rounded-md",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        "hover:bg-slate-100",
        isDragging && "cursor-grabbing text-primary",
        className,
      )}
      {...props}
    >
      <Icon name="grip-vertical" size="md" />
    </button>
  ),
);
DragHandle.displayName = "DragHandle";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function reorder<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...list];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/* -------------------------------------------------------------------------- */
/*  SortableList                                                               */
/* -------------------------------------------------------------------------- */

function SortableListInner<T extends SortableItem>(
  {
    items,
    onReorder,
    renderItem,
    showHandle = true,
    className,
  }: SortableListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [grabbed, setGrabbed] = useState(false);
  const [ghostStyle, setGhostStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const dragItemIndex = useRef<number | null>(null);
  const overIndexRef = useRef<number | null>(null);
  const itemsRef = useRef(items);

  // Keep refs in sync
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    overIndexRef.current = overIndex;
  }, [overIndex]);

  // ── Keyboard reorder ─────────────────────────────────
  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!grabbed) {
          setGrabbed(true);
          setActiveIndex(index);
        } else {
          setGrabbed(false);
          setActiveIndex(null);
        }
        return;
      }

      if (!grabbed) return;

      if (e.key === "ArrowUp" && index > 0) {
        e.preventDefault();
        const newItems = reorder(items, index, index - 1);
        onReorder(newItems);
        setActiveIndex(index - 1);
      } else if (e.key === "ArrowDown" && index < items.length - 1) {
        e.preventDefault();
        const newItems = reorder(items, index, index + 1);
        onReorder(newItems);
        setActiveIndex(index + 1);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setGrabbed(false);
        setActiveIndex(null);
      }
    },
    [grabbed, items, onReorder],
  );

  // ── Pointer drag ──────────────────────────────────────
  const handlePointerDown = useCallback(
    (index: number, e: React.PointerEvent) => {
      e.preventDefault();
      if (!containerRef.current) return;

      const listItems = containerRef.current.querySelectorAll("[data-sortable-item]");
      const draggedEl = listItems[index] as HTMLElement;
      if (!draggedEl) return;

      const rect = draggedEl.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const offsetY = e.clientY - rect.top;

      dragItemIndex.current = index;
      overIndexRef.current = index;
      setActiveIndex(index);
      setOverIndex(index);

      // Initial ghost position
      setGhostStyle({
        position: "absolute",
        top: rect.top - containerRect.top,
        left: 0,
        right: 0,
        height: rect.height,
        zIndex: 50,
        pointerEvents: "none",
        opacity: 0.9,
        transform: "scale(1.02)",
        boxShadow: "0 8px 25px -5px rgba(0,0,0,0.15), 0 4px 10px -6px rgba(0,0,0,0.1)",
        transition: "box-shadow 0.2s, transform 0.2s",
      });

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (dragItemIndex.current === null || !containerRef.current) return;

        // Update ghost position
        const newTop = moveEvent.clientY - containerRect.top - offsetY;
        setGhostStyle((prev) => ({
          ...prev,
          top: newTop,
        }));

        // Find target index
        const currentItems = containerRef.current.querySelectorAll("[data-sortable-item]");
        let targetIndex = dragItemIndex.current;

        for (let i = 0; i < currentItems.length; i++) {
          const itemRect = currentItems[i].getBoundingClientRect();
          const midY = itemRect.top + itemRect.height / 2;
          if (moveEvent.clientY < midY) {
            targetIndex = i;
            break;
          }
          targetIndex = i;
        }

        overIndexRef.current = targetIndex;
        setOverIndex(targetIndex);
      };

      const cleanup = () => {
        dragItemIndex.current = null;
        overIndexRef.current = null;
        setActiveIndex(null);
        setOverIndex(null);
        setGhostStyle({});
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
        document.removeEventListener("keydown", handleKeyCancel);
      };

      const handlePointerUp = () => {
        const from = dragItemIndex.current;
        const to = overIndexRef.current;

        if (from !== null && to !== null && from !== to) {
          const newItems = reorder(itemsRef.current, from, to);
          onReorder(newItems);
        }

        cleanup();
      };

      const handleKeyCancel = (ke: globalThis.KeyboardEvent) => {
        if (ke.key === "Escape") {
          ke.preventDefault();
          cleanup();
        }
      };

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
      document.addEventListener("keydown", handleKeyCancel);
    },
    [onReorder],
  );

  const isDragging = activeIndex !== null && !grabbed;

  return (
    <ul
      ref={(el) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el as unknown as HTMLDivElement;
        if (typeof ref === "function") ref(el as unknown as HTMLDivElement);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el as unknown as HTMLDivElement;
      }}
      aria-label="Sortable list"
      className={cn("relative flex flex-col list-none m-0 p-0", className)}
    >
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        const isKeyboardActive = isActive && grabbed;

        // Determine if this item should shift to make room
        let shiftClass = "";
        if (isDragging && activeIndex !== null && overIndex !== null) {
          if (index === activeIndex) {
            // The dragged item — keep it in place but invisible
          } else if (activeIndex < overIndex) {
            // Dragging down: items between active+1..over shift up
            if (index > activeIndex && index <= overIndex) {
              shiftClass = "-translate-y-full";
            }
          } else if (activeIndex > overIndex) {
            // Dragging up: items between over..active-1 shift down
            if (index >= overIndex && index < activeIndex) {
              shiftClass = "translate-y-full";
            }
          }
        }

        const handle = showHandle ? (
          <DragHandle
            isDragging={isActive}
            onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => handleKeyDown(index, e as unknown as KeyboardEvent)}
            onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) => handlePointerDown(index, e)}
          />
        ) : null;

        return (
          <li
            key={item.id}
            data-sortable-item
            aria-grabbed={isKeyboardActive ? true : undefined}
            className={cn(
              "flex items-center gap-2 rounded-lg transition-transform duration-200",
              isActive && isDragging && "opacity-0",
              isKeyboardActive && "bg-primary/5 ring-2 ring-primary/30 shadow-md z-10",
              shiftClass,
            )}
          >
            {renderItem(item, handle, index)}
          </li>
        );
      })}

      {/* Drop indicator line */}
      {isDragging && overIndex !== null && overIndex !== activeIndex && (
        <DropIndicator containerRef={containerRef} overIndex={overIndex} />
      )}

      {/* Floating ghost clone */}
      {isDragging && activeIndex !== null && ghostStyle.position && (
        <li
          aria-hidden
          className="flex items-center gap-2 rounded-xl bg-white ring-2 ring-primary/40 list-none"
          style={ghostStyle}
        >
          {renderItem(items[activeIndex], showHandle ? <DragHandle isDragging /> : null, activeIndex)}
        </li>
      )}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/*  Drop indicator                                                             */
/* -------------------------------------------------------------------------- */

function DropIndicator({
  containerRef,
  overIndex,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  overIndex: number;
}) {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll("[data-sortable-item]");
    const containerRect = containerRef.current.getBoundingClientRect();

    if (items[overIndex]) {
      const rect = items[overIndex].getBoundingClientRect();
      setStyle({
        position: "absolute",
        top: rect.top - containerRect.top - 1,
        left: 8,
        right: 8,
        height: 2,
      });
    }
  }, [containerRef, overIndex]);

  return (
    <div
      className="bg-primary rounded-full pointer-events-none z-40"
      style={style}
    >
      <div className="absolute -left-1 -top-[3px] w-2 h-2 bg-primary rounded-full" />
      <div className="absolute -right-1 -top-[3px] w-2 h-2 bg-primary rounded-full" />
    </div>
  );
}

const SortableList = forwardRef(SortableListInner) as <T extends SortableItem>(
  props: SortableListProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

(SortableList as { displayName?: string }).displayName = "SortableList";

export { SortableList, DragHandle };
export type { SortableListProps, SortableItem, DragHandleProps };
