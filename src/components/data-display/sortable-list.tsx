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
  renderItem?: (item: T, dragHandle: ReactNode, index: number) => ReactNode;
  /** Key to use as the label when `renderItem` is not provided. Defaults to `"id"`. */
  labelKey?: keyof T & string;
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
    labelKey,
    showHandle = true,
    className,
  }: SortableListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const resolvedRenderItem = renderItem ?? ((item: T, dragHandle: ReactNode) => (
    <div className="flex items-center gap-3 p-3 flex-1">
      {dragHandle}
      <span className="text-sm font-medium text-slate-700">
        {String(item[labelKey ?? "id"])}
      </span>
    </div>
  ));

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

  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Start drag (shared logic for immediate + long-press) ──
  const startDrag = useCallback(
    (index: number, startY: number) => {
      if (!containerRef.current) return;

      const listItems = containerRef.current.querySelectorAll("[data-sortable-item]");
      const draggedEl = listItems[index] as HTMLElement;
      if (!draggedEl) return;

      const rect = draggedEl.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const offsetY = startY - rect.top;

      dragItemIndex.current = index;
      overIndexRef.current = index;
      setActiveIndex(index);
      setOverIndex(index);

      // Prevent page scroll during touch drag
      const preventScroll = (te: TouchEvent) => te.preventDefault();
      document.addEventListener("touchmove", preventScroll, { passive: false });

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

      const CANCEL_MARGIN = 50;

      // Declare cleanup ahead so handlePointerMove can reference it
      let cleanupFn: (() => void) | null = null;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (dragItemIndex.current === null || !containerRef.current) return;

        // Cancel if pointer moves far outside the list bounds
        const currentContainerRect = containerRef.current.getBoundingClientRect();
        if (
          moveEvent.clientX < currentContainerRect.left - CANCEL_MARGIN ||
          moveEvent.clientX > currentContainerRect.right + CANCEL_MARGIN ||
          moveEvent.clientY < currentContainerRect.top - CANCEL_MARGIN ||
          moveEvent.clientY > currentContainerRect.bottom + CANCEL_MARGIN
        ) {
          cleanupFn?.();
          return;
        }

        const newTop = moveEvent.clientY - containerRect.top - offsetY;
        setGhostStyle((prev) => ({
          ...prev,
          top: newTop,
        }));

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

      const handlePointerUp = () => {
        const from = dragItemIndex.current;
        const to = overIndexRef.current;

        if (from !== null && to !== null && from !== to) {
          const newItems = reorder(itemsRef.current, from, to);
          onReorder(newItems);
        }

        cleanupFn?.();
      };

      const handleKeyCancel = (ke: globalThis.KeyboardEvent) => {
        if (ke.key === "Escape") {
          ke.preventDefault();
          cleanupFn?.();
        }
      };

      cleanupFn = () => {
        dragItemIndex.current = null;
        overIndexRef.current = null;
        setActiveIndex(null);
        setOverIndex(null);
        setGhostStyle({});
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
        document.removeEventListener("keydown", handleKeyCancel);
        document.removeEventListener("touchmove", preventScroll);
      };

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
      document.addEventListener("keydown", handleKeyCancel);
    },
    [onReorder],
  );

  // ── Pointer down handler ──────────────────────────────
  const handlePointerDown = useCallback(
    (index: number, e: React.PointerEvent) => {
      const isTouch = e.pointerType === "touch";
      const startY = e.clientY;

      if (!isTouch) {
        // Mouse: start drag immediately
        e.preventDefault();
        startDrag(index, startY);
        return;
      }

      // Touch: require long-press (300ms) before starting drag
      const LONG_PRESS_MS = 300;
      const MOVE_THRESHOLD = 10;

      // Show visual hint that long-press is in progress
      setActiveIndex(index);

      const cancelLongPress = () => {
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
        setActiveIndex(null);
        document.removeEventListener("pointermove", onMoveBeforeActivation);
        document.removeEventListener("pointerup", onUpBeforeActivation);
        document.removeEventListener("pointercancel", onUpBeforeActivation);
      };

      const onMoveBeforeActivation = (moveEvent: PointerEvent) => {
        // If finger moves too much, cancel long-press (user is scrolling)
        const dy = Math.abs(moveEvent.clientY - startY);
        const dx = Math.abs(moveEvent.clientX - e.clientX);
        if (dy > MOVE_THRESHOLD || dx > MOVE_THRESHOLD) {
          cancelLongPress();
        }
      };

      const onUpBeforeActivation = () => {
        cancelLongPress();
      };

      longPressTimerRef.current = setTimeout(() => {
        longPressTimerRef.current = null;
        document.removeEventListener("pointermove", onMoveBeforeActivation);
        document.removeEventListener("pointerup", onUpBeforeActivation);
        document.removeEventListener("pointercancel", onUpBeforeActivation);
        startDrag(index, startY);
      }, LONG_PRESS_MS);

      document.addEventListener("pointermove", onMoveBeforeActivation);
      document.addEventListener("pointerup", onUpBeforeActivation);
      document.addEventListener("pointercancel", onUpBeforeActivation);
    },
    [startDrag],
  );

  // Cleanup long-press timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

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

        // When no handle, make the whole row the drag target
        const rowDragProps = !showHandle
          ? {
              onPointerDown: (e: React.PointerEvent) => handlePointerDown(index, e),
              onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(index, e as unknown as KeyboardEvent),
              tabIndex: 0,
              "aria-roledescription": "sortable" as const,
              "aria-label": "Drag to reorder",
            }
          : {};

        return (
          <li
            key={item.id}
            data-sortable-item
            aria-grabbed={isKeyboardActive ? true : undefined}
            className={cn(
              "flex items-center gap-2 rounded-lg transition-transform duration-200",
              isActive && isDragging && "opacity-0",
              isKeyboardActive && "bg-primary/5 ring-2 ring-primary/30 shadow-md z-10",
              !showHandle && "cursor-grab touch-none",
              !showHandle && isActive && isDragging && "cursor-grabbing",
              shiftClass,
            )}
            {...rowDragProps}
          >
            {resolvedRenderItem(item, handle, index)}
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
          {resolvedRenderItem(items[activeIndex], showHandle ? <DragHandle isDragging /> : null, activeIndex)}
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
