"use client";

import {
  forwardRef,
  useState,
  useRef,
  useCallback,
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
        "touch-none cursor-grab shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
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
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragItemIndex = useRef<number | null>(null);

  // ── Keyboard reorder ─────────────────────────────────
  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!grabbed) {
          // Pick up
          setGrabbed(true);
          setActiveIndex(index);
        } else {
          // Drop
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
      dragItemIndex.current = index;
      dragStartY.current = e.clientY;
      setActiveIndex(index);
      setOverIndex(index);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (dragItemIndex.current === null || !containerRef.current) return;

        const listItems = containerRef.current.querySelectorAll("[data-sortable-item]");
        let targetIndex = dragItemIndex.current;

        for (let i = 0; i < listItems.length; i++) {
          const rect = listItems[i].getBoundingClientRect();
          const midY = rect.top + rect.height / 2;
          if (moveEvent.clientY < midY) {
            targetIndex = i;
            break;
          }
          targetIndex = i;
        }

        setOverIndex(targetIndex);
      };

      const handlePointerUp = () => {
        if (dragItemIndex.current !== null && overIndex !== null && dragItemIndex.current !== overIndex) {
          // Use the latest overIndex by reading from a fresh calculation
          const listItems = containerRef.current?.querySelectorAll("[data-sortable-item]");
          if (listItems) {
            // Just use whatever overIndex state we have
          }
        }

        // Perform reorder
        const from = dragItemIndex.current;
        if (from !== null) {
          // We need to get the final overIndex, but since this is a closure,
          // we use setOverIndex's callback form
          setOverIndex((currentOver) => {
            if (currentOver !== null && from !== currentOver) {
              const newItems = reorder(items, from, currentOver);
              onReorder(newItems);
            }
            return null;
          });
        }

        dragItemIndex.current = null;
        setActiveIndex(null);
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      };

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    },
    [items, onReorder, overIndex],
  );

  return (
    <ul
      ref={(el) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el as unknown as HTMLDivElement;
        if (typeof ref === "function") ref(el as unknown as HTMLDivElement);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el as unknown as HTMLDivElement;
      }}
      aria-label="Sortable list"
      className={cn("flex flex-col list-none m-0 p-0", className)}
    >
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        const isOver = overIndex === index && activeIndex !== null && activeIndex !== index;

        const handle = showHandle ? (
          <DragHandle
            isDragging={isActive && grabbed}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPointerDown={(e) => handlePointerDown(index, e)}
          />
        ) : null;

        return (
          <li
            key={item.id}
            data-sortable-item
            aria-grabbed={grabbed && isActive ? true : undefined}
            className={cn(
              "flex items-center gap-2 rounded-lg transition-all",
              isActive && "bg-primary/5 ring-1 ring-primary/20",
              isOver && "border-t-2 border-primary",
              !isActive && !isOver && "border-t-2 border-transparent",
            )}
          >
            {renderItem(item, handle, index)}
          </li>
        );
      })}
    </ul>
  );
}

const SortableList = forwardRef(SortableListInner) as <T extends SortableItem>(
  props: SortableListProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

(SortableList as { displayName?: string }).displayName = "SortableList";

export { SortableList, DragHandle };
export type { SortableListProps, SortableItem, DragHandleProps };
