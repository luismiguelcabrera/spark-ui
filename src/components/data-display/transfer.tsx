"use client";

import {
  forwardRef,
  useState,
  useMemo,
  useCallback,
  type HTMLAttributes,
  type DragEvent,
} from "react";
import { cn } from "../../lib/utils";
import { Icon } from "./icon";
import { useControllable } from "../../hooks/use-controllable";

type TransferItem = {
  key: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

type TransferProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  /** All items available for transfer */
  dataSource: TransferItem[];
  /** Keys of items currently in the target list (controlled) */
  targetKeys?: string[];
  /** Default target keys (uncontrolled) */
  defaultTargetKeys?: string[];
  /** Called when items are moved */
  onChange?: (
    targetKeys: string[],
    direction: "left" | "right",
    moveKeys: string[]
  ) => void;
  /** Panel titles [source, target] */
  titles?: [string, string];
  /** Show search input in each panel */
  searchable?: boolean;
  /** Show select-all checkbox in each panel */
  showSelectAll?: boolean;
  /** Disable the entire component */
  disabled?: boolean;
  /** Height of each list panel in px */
  listHeight?: number;
  /** Enable drag and drop to move items between panels */
  draggable?: boolean;
};

const Transfer = forwardRef<HTMLDivElement, TransferProps>(
  (
    {
      className,
      dataSource,
      targetKeys: targetKeysProp,
      defaultTargetKeys = [],
      onChange,
      titles = ["Source", "Target"],
      searchable = false,
      showSelectAll = true,
      disabled = false,
      listHeight = 300,
      draggable: draggableProp = false,
      ...props
    },
    ref
  ) => {
    const [currentTargetKeys, setCurrentTargetKeys] = useControllable<string[]>(
      {
        value: targetKeysProp,
        defaultValue: defaultTargetKeys,
        onChange: undefined,
      }
    );

    const [sourceSelected, setSourceSelected] = useState<Set<string>>(
      new Set()
    );
    const [targetSelected, setTargetSelected] = useState<Set<string>>(
      new Set()
    );
    const [sourceSearch, setSourceSearch] = useState("");
    const [targetSearch, setTargetSearch] = useState("");

    const targetKeySet = useMemo(
      () => new Set(currentTargetKeys),
      [currentTargetKeys]
    );

    const sourceItems = useMemo(
      () => dataSource.filter((item) => !targetKeySet.has(item.key)),
      [dataSource, targetKeySet]
    );

    const targetItems = useMemo(
      () => dataSource.filter((item) => targetKeySet.has(item.key)),
      [dataSource, targetKeySet]
    );

    const filterItems = useCallback(
      (items: TransferItem[], search: string) => {
        if (!search.trim()) return items;
        const q = search.toLowerCase();
        return items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            (item.description && item.description.toLowerCase().includes(q))
        );
      },
      []
    );

    const filteredSourceItems = useMemo(
      () => filterItems(sourceItems, sourceSearch),
      [sourceItems, sourceSearch, filterItems]
    );

    const filteredTargetItems = useMemo(
      () => filterItems(targetItems, targetSearch),
      [targetItems, targetSearch, filterItems]
    );

    const moveRight = useCallback(() => {
      const moveKeys = Array.from(sourceSelected);
      if (moveKeys.length === 0) return;
      const newTargetKeys = [...currentTargetKeys, ...moveKeys];
      setCurrentTargetKeys(newTargetKeys);
      setSourceSelected(new Set());
      onChange?.(newTargetKeys, "right", moveKeys);
    }, [sourceSelected, currentTargetKeys, setCurrentTargetKeys, onChange]);

    const moveLeft = useCallback(() => {
      const moveKeys = Array.from(targetSelected);
      if (moveKeys.length === 0) return;
      const newTargetKeys = currentTargetKeys.filter(
        (k) => !targetSelected.has(k)
      );
      setCurrentTargetKeys(newTargetKeys);
      setTargetSelected(new Set());
      onChange?.(newTargetKeys, "left", moveKeys);
    }, [targetSelected, currentTargetKeys, setCurrentTargetKeys, onChange]);

    const toggleItem = useCallback(
      (
        key: string,
        selected: Set<string>,
        setSelected: React.Dispatch<React.SetStateAction<Set<string>>>
      ) => {
        const next = new Set(selected);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        setSelected(next);
      },
      []
    );

    const toggleSelectAll = useCallback(
      (
        items: TransferItem[],
        selected: Set<string>,
        setSelected: React.Dispatch<React.SetStateAction<Set<string>>>
      ) => {
        const selectableItems = items.filter((item) => !item.disabled);
        const allSelected = selectableItems.every((item) =>
          selected.has(item.key)
        );
        if (allSelected) {
          setSelected(new Set());
        } else {
          setSelected(new Set(selectableItems.map((item) => item.key)));
        }
      },
      []
    );

    // --- Drag and Drop ---
    const [dragOverPanel, setDragOverPanel] = useState<
      "source" | "target" | null
    >(null);
    const [draggingKeys, setDraggingKeys] = useState<Set<string>>(new Set());

    const handleDragStart = useCallback(
      (
        e: DragEvent<HTMLLIElement>,
        item: TransferItem,
        panelId: "source" | "target",
        selected: Set<string>
      ) => {
        if (disabled || item.disabled) {
          e.preventDefault();
          return;
        }

        // If the dragged item is already selected, drag all selected items.
        // Otherwise drag just this single item.
        let keys: string[];
        if (selected.has(item.key)) {
          keys = Array.from(selected);
        } else {
          keys = [item.key];
        }

        e.dataTransfer.setData(
          "application/spark-transfer",
          JSON.stringify({ keys, from: panelId })
        );
        e.dataTransfer.effectAllowed = "move";

        setDraggingKeys(new Set(keys));
      },
      [disabled]
    );

    const handleDragOver = useCallback(
      (e: DragEvent<HTMLDivElement>, panelId: "source" | "target") => {
        if (!draggableProp) return;
        // Only accept our own transfer data
        if (e.dataTransfer.types.includes("application/spark-transfer")) {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          setDragOverPanel(panelId);
        }
      },
      [draggableProp]
    );

    const handleDragLeave = useCallback(
      (e: DragEvent<HTMLDivElement>, panelId: "source" | "target") => {
        // Only clear if actually leaving the panel (not entering a child)
        const related = e.relatedTarget as Node | null;
        if (!related || !e.currentTarget.contains(related)) {
          if (dragOverPanel === panelId) {
            setDragOverPanel(null);
          }
        }
      },
      [dragOverPanel]
    );

    const handleDrop = useCallback(
      (e: DragEvent<HTMLDivElement>, panelId: "source" | "target") => {
        e.preventDefault();
        setDragOverPanel(null);
        setDraggingKeys(new Set());

        const raw = e.dataTransfer.getData("application/spark-transfer");
        if (!raw) return;

        let data: { keys: string[]; from: string };
        try {
          data = JSON.parse(raw);
        } catch {
          return;
        }

        // Don't drop on the same panel
        if (data.from === panelId) return;

        const moveKeys = data.keys;
        if (moveKeys.length === 0) return;

        if (panelId === "target") {
          // Source → Target
          const newTargetKeys = [...currentTargetKeys, ...moveKeys];
          setCurrentTargetKeys(newTargetKeys);
          setSourceSelected(new Set());
          onChange?.(newTargetKeys, "right", moveKeys);
        } else {
          // Target → Source
          const moveKeySet = new Set(moveKeys);
          const newTargetKeys = currentTargetKeys.filter(
            (k) => !moveKeySet.has(k)
          );
          setCurrentTargetKeys(newTargetKeys);
          setTargetSelected(new Set());
          onChange?.(newTargetKeys, "left", moveKeys);
        }
      },
      [currentTargetKeys, setCurrentTargetKeys, onChange]
    );

    const handleDragEnd = useCallback(() => {
      setDragOverPanel(null);
      setDraggingKeys(new Set());
    }, []);

    const renderPanel = (
      title: string,
      items: TransferItem[],
      filteredItems: TransferItem[],
      selected: Set<string>,
      setSelected: React.Dispatch<React.SetStateAction<Set<string>>>,
      search: string,
      setSearch: React.Dispatch<React.SetStateAction<string>>,
      panelId: "source" | "target"
    ) => {
      const selectableItems = filteredItems.filter((item) => !item.disabled);
      const allSelected =
        selectableItems.length > 0 &&
        selectableItems.every((item) => selected.has(item.key));
      const someSelected =
        selectableItems.some((item) => selected.has(item.key)) && !allSelected;
      const selectedCount = items.filter((item) => selected.has(item.key)).length;
      const isDragOver = draggableProp && dragOverPanel === panelId;

      return (
        <div
          className={cn(
            "flex flex-col border border-muted rounded-xl overflow-hidden bg-surface flex-1 min-w-0 transition-colors",
            isDragOver && "border-primary bg-primary/5 ring-2 ring-primary/20"
          )}
          role="group"
          aria-label={title}
          {...(draggableProp
            ? {
                onDragOver: (e: DragEvent<HTMLDivElement>) =>
                  handleDragOver(e, panelId),
                onDragLeave: (e: DragEvent<HTMLDivElement>) =>
                  handleDragLeave(e, panelId),
                onDrop: (e: DragEvent<HTMLDivElement>) =>
                  handleDrop(e, panelId),
                "aria-dropeffect": "move" as const,
              }
            : {})}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-muted/50 bg-muted/30">
            {showSelectAll && (
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={() =>
                  toggleSelectAll(filteredItems, selected, setSelected)
                }
                disabled={disabled || selectableItems.length === 0}
                className="h-4 w-4 rounded border-muted text-primary focus:ring-2 focus:ring-primary focus:ring-offset-1"
                aria-label={`Select all ${title.toLowerCase()} items`}
              />
            )}
            <span className="text-sm font-semibold text-navy-text flex-1">
              {title}
            </span>
            <span className="text-xs text-muted-foreground">
              {selectedCount > 0 && `${selectedCount}/`}
              {items.length}
            </span>
          </div>

          {/* Search */}
          {searchable && (
            <div className="px-3 py-2 border-b border-muted/50">
              <div className="relative">
                <Icon
                  name="search"
                  size="sm"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={disabled}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-muted rounded-lg bg-surface placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                  aria-label={`Search ${title.toLowerCase()}`}
                />
              </div>
            </div>
          )}

          {/* Items */}
          <ul
            className="overflow-y-auto"
            style={{ height: `${listHeight}px` }}
            aria-label={`${title} items`}
            tabIndex={0}
          >
            {filteredItems.length === 0 ? (
              <li className="flex items-center justify-center h-full text-sm text-muted-foreground list-none">
                No items
              </li>
            ) : (
              filteredItems.map((item) => {
                const itemDraggable =
                  draggableProp && !disabled && !item.disabled;
                const isDragging = draggingKeys.has(item.key);

                return (
                  <li
                    key={item.key}
                    className="list-none"
                    aria-disabled={item.disabled || disabled || undefined}
                    draggable={itemDraggable || undefined}
                    onDragStart={
                      itemDraggable
                        ? (e) =>
                            handleDragStart(e, item, panelId, selected)
                        : undefined
                    }
                    onDragEnd={itemDraggable ? handleDragEnd : undefined}
                    {...(itemDraggable
                      ? { "aria-grabbed": isDragging }
                      : {})}
                  >
                    <label
                      className={cn(
                        "flex items-start gap-2.5 px-3 py-2 cursor-pointer transition-colors hover:bg-muted/30",
                        selected.has(item.key) && "bg-primary/5",
                        (item.disabled || disabled) &&
                          "opacity-50 cursor-not-allowed pointer-events-none",
                        itemDraggable && "cursor-grab active:cursor-grabbing",
                        isDragging && "opacity-40"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(item.key)}
                        onChange={() =>
                          toggleItem(item.key, selected, setSelected)
                        }
                        disabled={item.disabled || disabled}
                        tabIndex={0}
                        className="h-4 w-4 mt-0.5 rounded border-muted text-primary focus:ring-2 focus:ring-primary focus:ring-offset-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-navy-text truncate">
                          {item.label}
                        </div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </label>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-stretch gap-3", className)}
        {...props}
      >
        {/* Source Panel */}
        {renderPanel(
          titles[0],
          sourceItems,
          filteredSourceItems,
          sourceSelected,
          setSourceSelected,
          sourceSearch,
          setSourceSearch,
          "source"
        )}

        {/* Transfer Buttons */}
        <div className="flex flex-col items-center justify-center gap-2 px-1">
          <button
            type="button"
            onClick={moveRight}
            disabled={disabled || sourceSelected.size === 0}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg border border-muted bg-surface shadow-sm transition-all",
              "hover:bg-primary hover:text-white hover:border-primary",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:text-muted-foreground disabled:hover:border-muted"
            )}
            aria-label="Move selected items to target"
          >
            <Icon name="chevron_right" size="sm" />
          </button>
          <button
            type="button"
            onClick={moveLeft}
            disabled={disabled || targetSelected.size === 0}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg border border-muted bg-surface shadow-sm transition-all",
              "hover:bg-primary hover:text-white hover:border-primary",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:text-muted-foreground disabled:hover:border-muted"
            )}
            aria-label="Move selected items to source"
          >
            <Icon name="chevron_left" size="sm" />
          </button>
        </div>

        {/* Target Panel */}
        {renderPanel(
          titles[1],
          targetItems,
          filteredTargetItems,
          targetSelected,
          setTargetSelected,
          targetSearch,
          setTargetSearch,
          "target"
        )}
      </div>
    );
  }
);
Transfer.displayName = "Transfer";

export { Transfer };
export type { TransferProps, TransferItem };
