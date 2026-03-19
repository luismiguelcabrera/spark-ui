"use client";

import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  type KeyboardEvent,
} from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";
import { Icon } from "../data-display/icon";
import { useLocale } from "../../lib/locale";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type TreeSelectNode = {
  label: string;
  value: string;
  children?: TreeSelectNode[];
  disabled?: boolean;
  icon?: string;
};

type TreeSelectSize = "sm" | "md" | "lg";

type TreeSelectProps = {
  /** Tree data */
  data: TreeSelectNode[];
  /** Controlled selected value(s) */
  value?: string | string[];
  /** Default selected value(s) (uncontrolled) */
  defaultValue?: string | string[];
  /** Called when selection changes */
  onChange?: (value: string | string[]) => void;
  /** Allow multiple selection */
  multiple?: boolean;
  /** Show checkboxes for multiple selection */
  checkable?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: TreeSelectSize;
  /** Enable search/filter */
  searchable?: boolean;
  /** Expand all nodes by default */
  expandAll?: boolean;
  /** Show "Parent > Child" path in selection display */
  showPath?: boolean;
  /** Accessible label for the combobox */
  "aria-label"?: string;
  /** Additional class names */
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*  Size maps                                                                  */
/* -------------------------------------------------------------------------- */

const sizeMap: Record<TreeSelectSize, string> = {
  sm: "min-h-9 text-xs px-3",
  md: "min-h-12 text-sm px-4",
  lg: "min-h-14 text-base px-4",
};

const chipSizeMap: Record<TreeSelectSize, string> = {
  sm: "text-[10px] px-1.5 py-0.5 gap-0.5",
  md: "text-xs px-2 py-1 gap-1",
  lg: "text-sm px-2.5 py-1 gap-1",
};

const dropdownTextSize: Record<TreeSelectSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Collect all expanded node values for expandAll */
function collectExpandableValues(nodes: TreeSelectNode[]): string[] {
  const result: string[] = [];
  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      result.push(node.value);
      result.push(...collectExpandableValues(node.children));
    }
  }
  return result;
}

/** Get all non-disabled descendant values (including branches) */
function getAllChildValues(node: TreeSelectNode): string[] {
  const result: string[] = [];
  if (!node.disabled) result.push(node.value);
  if (node.children) {
    for (const child of node.children) {
      result.push(...getAllChildValues(child));
    }
  }
  return result;
}

/** Check state of a node: 'checked' | 'indeterminate' | 'unchecked' */
function getCheckState(
  node: TreeSelectNode,
  selected: Set<string>,
): "checked" | "indeterminate" | "unchecked" {
  if (!node.children || node.children.length === 0) {
    return selected.has(node.value) ? "checked" : "unchecked";
  }
  const childStates = node.children.map((c) => getCheckState(c, selected));
  if (childStates.every((s) => s === "checked")) return "checked";
  if (childStates.some((s) => s === "checked" || s === "indeterminate"))
    return "indeterminate";
  return "unchecked";
}

/** Flatten visible nodes for keyboard navigation */
function flattenVisible(
  nodes: TreeSelectNode[],
  expanded: Set<string>,
  depth = 0,
): { node: TreeSelectNode; depth: number }[] {
  const result: { node: TreeSelectNode; depth: number }[] = [];
  for (const node of nodes) {
    result.push({ node, depth });
    if (node.children && expanded.has(node.value)) {
      result.push(...flattenVisible(node.children, expanded, depth + 1));
    }
  }
  return result;
}

/** Get path labels for a node value */
function getPathLabels(
  nodes: TreeSelectNode[],
  targetValue: string,
  parentLabels: string[] = [],
): string[] | null {
  for (const node of nodes) {
    const currentPath = [...parentLabels, node.label];
    if (node.value === targetValue) return currentPath;
    if (node.children) {
      const found = getPathLabels(node.children, targetValue, currentPath);
      if (found) return found;
    }
  }
  return null;
}

/** Find a node by value in the tree */
function findNode(
  nodes: TreeSelectNode[],
  value: string,
): TreeSelectNode | null {
  for (const node of nodes) {
    if (node.value === value) return node;
    if (node.children) {
      const found = findNode(node.children, value);
      if (found) return found;
    }
  }
  return null;
}

/** Filter tree keeping parents of matching nodes */
function filterTree(
  nodes: TreeSelectNode[],
  query: string,
): TreeSelectNode[] {
  const q = query.toLowerCase();
  const result: TreeSelectNode[] = [];
  for (const node of nodes) {
    const matches = node.label.toLowerCase().includes(q);
    const filteredChildren = node.children
      ? filterTree(node.children, query)
      : [];
    if (matches || filteredChildren.length > 0) {
      result.push({
        ...node,
        children:
          filteredChildren.length > 0 ? filteredChildren : node.children,
      });
    }
  }
  return result;
}

/* -------------------------------------------------------------------------- */
/*  Tree Node (recursive renderer)                                             */
/* -------------------------------------------------------------------------- */

function TreeNodeItem({
  node,
  depth,
  expanded,
  onToggleExpand,
  selected,
  onSelect,
  checkable,
  multiple,
  focusedValue,
  size,
  data,
  showPath,
}: {
  node: TreeSelectNode;
  depth: number;
  expanded: Set<string>;
  onToggleExpand: (value: string) => void;
  selected: Set<string>;
  onSelect: (node: TreeSelectNode) => void;
  checkable: boolean;
  multiple: boolean;
  focusedValue: string | null;
  size: TreeSelectSize;
  data: TreeSelectNode[];
  showPath: boolean;
}) {
  const { t } = useLocale();
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded.has(node.value);
  const isFocused = focusedValue === node.value;
  const checkState = checkable ? getCheckState(node, selected) : "unchecked";
  const isSelected = selected.has(node.value);

  return (
    <>
      <li
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected || checkState === "checked"}
        aria-disabled={node.disabled}
        data-value={node.value}
        className={cn(
          "flex items-center gap-1.5 py-1.5 cursor-pointer transition-colors rounded-md mx-1",
          dropdownTextSize[size],
          isFocused && "bg-slate-100",
          !isFocused && "hover:bg-slate-50",
          node.disabled && "opacity-50 cursor-not-allowed",
        )}
        style={{ paddingLeft: `${depth * 20 + 8}px`, paddingRight: 8 }}
        onClick={(e) => {
          e.stopPropagation();
          if (node.disabled) return;
          onSelect(node);
        }}
      >
        {/* Expand/collapse chevron */}
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.value);
            }}
            className="shrink-0 text-slate-500 hover:text-slate-600 transition-colors"
            tabIndex={-1}
            aria-label={isExpanded ? t("treeselect.collapse", "Collapse") : t("treeselect.expand", "Expand")}
          >
            <Icon
              name={isExpanded ? "expand_more" : "chevron_right"}
              size="sm"
            />
          </button>
        ) : (
          <span className="w-[16px] shrink-0" />
        )}

        {/* Checkbox for checkable mode */}
        {checkable && (
          <span
            className={cn(
              "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
              checkState === "checked"
                ? "bg-primary border-primary text-white"
                : checkState === "indeterminate"
                  ? "bg-primary border-primary text-white"
                  : "border-slate-300",
            )}
          >
            {checkState === "checked" && <Icon name="check" size="sm" />}
            {checkState === "indeterminate" && (
              <span className="w-2 h-0.5 bg-white rounded-full" />
            )}
          </span>
        )}

        {/* Optional icon */}
        {node.icon && (
          <Icon name={node.icon} size="sm" className="text-slate-500 shrink-0" />
        )}

        {/* Label */}
        <span className={cn("truncate", isSelected && !checkable && "text-primary font-medium")}>
          {node.label}
        </span>

        {/* Check indicator for non-checkable single select */}
        {!checkable && isSelected && (
          <Icon name="check" size="sm" className="ml-auto text-primary shrink-0" />
        )}
      </li>

      {/* Render children if expanded */}
      {hasChildren && isExpanded && (
        <ul role="group">
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.value}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggleExpand={onToggleExpand}
              selected={selected}
              onSelect={onSelect}
              checkable={checkable}
              multiple={multiple}
              focusedValue={focusedValue}
              size={size}
              data={data}
              showPath={showPath}
            />
          ))}
        </ul>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

const TreeSelect = forwardRef<HTMLDivElement, TreeSelectProps>(
  (
    {
      data,
      value: valueProp,
      defaultValue,
      onChange,
      multiple = false,
      checkable = false,
      placeholder,
      disabled = false,
      size = "md",
      searchable = false,
      expandAll = false,
      showPath = false,
      "aria-label": ariaLabel,
      className,
    },
    ref,
  ) => {
    const { t } = useLocale();
    const resolvedPlaceholder = placeholder ?? t("treeselect.placeholder", "Select...");

    // Normalize value to always be string[] internally
    const normalizeValue = useCallback(
      (val?: string | string[]): string[] => {
        if (val === undefined) return [];
        return Array.isArray(val) ? val : [val];
      },
      [],
    );

    const [selectedArray, setSelectedArray] = useControllable<string[]>({
      value: valueProp !== undefined ? normalizeValue(valueProp) : undefined,
      defaultValue: normalizeValue(defaultValue),
      onChange: (val: string[]) => {
        if (multiple || checkable) {
          onChange?.(val);
        } else {
          onChange?.(val[0] ?? "");
        }
      },
    });

    const selectedSet = useMemo(() => new Set(selectedArray), [selectedArray]);

    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [expandedValues, setExpandedValues] = useState<Set<string>>(
      () => new Set(expandAll ? collectExpandableValues(data) : []),
    );
    const [focusedValue, setFocusedValue] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close on outside click
    useEffect(() => {
      if (!isOpen) return;
      const handler = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
          setQuery("");
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    // Filtered data when searching
    const displayData = useMemo(() => {
      if (!query) return data;
      return filterTree(data, query);
    }, [data, query]);

    // Expand all when searching
    const effectiveExpanded = useMemo(() => {
      if (query) return new Set(collectExpandableValues(displayData));
      return expandedValues;
    }, [query, displayData, expandedValues]);

    // Flatten visible nodes for keyboard nav
    const visibleNodes = useMemo(
      () => flattenVisible(displayData, effectiveExpanded),
      [displayData, effectiveExpanded],
    );

    const toggleExpand = useCallback(
      (value: string) => {
        setExpandedValues((prev) => {
          const next = new Set(prev);
          if (next.has(value)) {
            next.delete(value);
          } else {
            next.add(value);
          }
          return next;
        });
      },
      [],
    );

    const handleNodeSelect = useCallback(
      (node: TreeSelectNode) => {
        if (node.disabled) return;

        if (checkable) {
          // Checkable mode — toggle node and all its children
          const allValues = getAllChildValues(node);
          const checkState = getCheckState(node, selectedSet);

          if (checkState === "checked") {
            // Uncheck all
            setSelectedArray(
              selectedArray.filter((v) => !allValues.includes(v)),
            );
          } else {
            // Check all
            const newSelected = new Set(selectedArray);
            allValues.forEach((v) => newSelected.add(v));
            setSelectedArray(Array.from(newSelected));
          }
        } else if (multiple) {
          // Multiple without checkable — toggle single value
          if (selectedSet.has(node.value)) {
            setSelectedArray(selectedArray.filter((v) => v !== node.value));
          } else {
            setSelectedArray([...selectedArray, node.value]);
          }
        } else {
          // Single select
          if (node.children && node.children.length > 0) {
            // Branch node in single select — just toggle expand
            toggleExpand(node.value);
            return;
          }
          setSelectedArray([node.value]);
          setIsOpen(false);
          setQuery("");
        }
      },
      [checkable, multiple, selectedArray, selectedSet, setSelectedArray, toggleExpand],
    );

    const removeValue = useCallback(
      (val: string) => {
        if (disabled) return;
        setSelectedArray(selectedArray.filter((v) => v !== val));
      },
      [disabled, selectedArray, setSelectedArray],
    );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;

      if (!isOpen) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setIsOpen(true);
          if (visibleNodes.length > 0) {
            setFocusedValue(visibleNodes[0].node.value);
          }
          return;
        }
        return;
      }

      const currentIndex = visibleNodes.findIndex(
        (n) => n.node.value === focusedValue,
      );

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const next =
            currentIndex < visibleNodes.length - 1 ? currentIndex + 1 : 0;
          setFocusedValue(visibleNodes[next]?.node.value ?? null);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prev =
            currentIndex > 0 ? currentIndex - 1 : visibleNodes.length - 1;
          setFocusedValue(visibleNodes[prev]?.node.value ?? null);
          break;
        }
        case "ArrowRight": {
          e.preventDefault();
          if (focusedValue) {
            const node = findNode(data, focusedValue);
            if (node?.children && node.children.length > 0) {
              if (!effectiveExpanded.has(focusedValue)) {
                toggleExpand(focusedValue);
              }
            }
          }
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          if (focusedValue) {
            const node = findNode(data, focusedValue);
            if (
              node?.children &&
              node.children.length > 0 &&
              effectiveExpanded.has(focusedValue)
            ) {
              toggleExpand(focusedValue);
            }
          }
          break;
        }
        case " ": {
          e.preventDefault();
          if (focusedValue) {
            const node = findNode(data, focusedValue);
            if (node) handleNodeSelect(node);
          }
          break;
        }
        case "Enter": {
          e.preventDefault();
          if (focusedValue) {
            const node = findNode(data, focusedValue);
            if (node) handleNodeSelect(node);
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          setIsOpen(false);
          setQuery("");
          break;
        }
      }
    };

    // Get display label for a value
    const getDisplayLabel = useCallback(
      (val: string): string => {
        if (showPath) {
          const path = getPathLabels(data, val);
          return path ? path.join(" > ") : val;
        }
        const node = findNode(data, val);
        return node?.label ?? val;
      },
      [data, showPath],
    );

    const isMultiMode = multiple || checkable;

    // Display labels for selected values (filter out parent nodes in checkable mode)
    const displayValues = useMemo(() => {
      if (!isMultiMode) {
        return selectedArray.length > 0 ? [selectedArray[0]] : [];
      }
      // In checkable mode, show leaf nodes or nodes where user explicitly selected
      return selectedArray.filter((v) => {
        const node = findNode(data, v);
        return node && (!node.children || node.children.length === 0);
      });
    }, [selectedArray, isMultiMode, data]);

    return (
      <div ref={ref} className={cn("relative", className)}>
        <div ref={containerRef} className="relative">
          {/* Trigger */}
          <div
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="tree"
            aria-disabled={disabled}
            aria-label={ariaLabel ?? resolvedPlaceholder}
            tabIndex={disabled ? -1 : 0}
            className={cn(
              "flex flex-wrap items-center gap-1.5 rounded-xl border bg-slate-50 py-2 transition-colors cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "border-slate-200",
              disabled && "opacity-50 cursor-not-allowed",
              sizeMap[size],
            )}
            onClick={() => {
              if (!disabled) {
                setIsOpen(!isOpen);
                if (!isOpen && visibleNodes.length > 0) {
                  setFocusedValue(visibleNodes[0].node.value);
                }
                setTimeout(() => inputRef.current?.focus(), 0);
              }
            }}
            onKeyDown={handleKeyDown}
          >
            {/* Selected chips (multi mode) */}
            {isMultiMode &&
              displayValues.map((val) => (
                <span
                  key={val}
                  className={cn(
                    "inline-flex items-center rounded-md border font-medium bg-primary/10 text-primary border-primary/20",
                    chipSizeMap[size],
                  )}
                >
                  {getDisplayLabel(val)}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeValue(val);
                      }}
                      className="hover:text-red-500 transition-colors"
                      aria-label={`${t("treeselect.remove", "Remove")} ${getDisplayLabel(val)}`}
                    >
                      <Icon name="close" size="sm" />
                    </button>
                  )}
                </span>
              ))}

            {/* Search input or display text */}
            {searchable && isOpen ? (
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                placeholder={
                  displayValues.length > 0
                    ? t("treeselect.search", "Search...")
                    : resolvedPlaceholder
                }
                className="flex-1 bg-transparent outline-none placeholder:text-slate-500 text-inherit min-w-[80px]"
                aria-label={t("treeselect.searchTree", "Search tree")}
                onClick={(e) => e.stopPropagation()}
              />
            ) : !isMultiMode || displayValues.length === 0 ? (
              <span
                className={cn(
                  "flex-1 truncate",
                  displayValues.length === 0 && "text-slate-600",
                )}
              >
                {!isMultiMode && displayValues.length > 0
                  ? getDisplayLabel(displayValues[0])
                  : displayValues.length === 0
                    ? resolvedPlaceholder
                    : null}
              </span>
            ) : null}

            {/* Chevron */}
            <Icon
              name="expand_more"
              size="sm"
              className={cn(
                "text-slate-500 transition-transform shrink-0 ml-auto",
                isOpen && "rotate-180",
              )}
            />
          </div>

          {/* Dropdown */}
          {isOpen && !disabled && (
            <div
              className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
              role="tree"
            >
              {visibleNodes.length === 0 && (
                <p
                  className={cn(
                    "px-4 py-3 text-slate-600",
                    dropdownTextSize[size],
                  )}
                >
                  {query ? t("treeselect.noResults", "No results found.") : t("treeselect.noOptions", "No options available.")}
                </p>
              )}
              <ul role="group">
                {displayData.map((node) => (
                  <TreeNodeItem
                    key={node.value}
                    node={node}
                    depth={0}
                    expanded={effectiveExpanded}
                    onToggleExpand={toggleExpand}
                    selected={selectedSet}
                    onSelect={handleNodeSelect}
                    checkable={checkable}
                    multiple={isMultiMode}
                    focusedValue={focusedValue}
                    size={size}
                    data={data}
                    showPath={showPath}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  },
);
TreeSelect.displayName = "TreeSelect";

export { TreeSelect };
export type { TreeSelectProps, TreeSelectNode, TreeSelectSize };
