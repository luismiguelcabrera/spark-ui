"use client";

import {
  forwardRef,
  useState,
  useMemo,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { Icon } from "./icon";
import { useControllable } from "../../hooks/use-controllable";

type TreeNode = {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon name */
  icon?: string;
  /** Custom icon element */
  iconElement?: ReactNode;
  /** Child nodes */
  children?: TreeNode[];
  /** Whether this node is disabled */
  disabled?: boolean;
  /** Additional data attached to this node */
  data?: unknown;
};

type TreeViewProps = HTMLAttributes<HTMLDivElement> & {
  /** Tree data */
  nodes: TreeNode[];
  /** Currently selected node ID */
  selectedId?: string;
  /** Default expanded node IDs */
  defaultExpandedIds?: string[];
  /** Callback when a node is selected */
  onSelect?: (node: TreeNode) => void;
  /** Callback when a node is expanded/collapsed */
  onToggle?: (nodeId: string, expanded: boolean) => void;
  /** Whether to show connecting lines */
  showLines?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Enable checkbox selection on nodes */
  selectable?: boolean;
  /** Controlled selected IDs for checkbox selection */
  selectedIds?: string[];
  /** Callback when checkbox selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Expand all nodes by default */
  expandAll?: boolean;
  /** Enable search filtering */
  searchable?: boolean;
  /** Controlled search value */
  searchValue?: string;
  /** Callback when search value changes */
  onSearchChange?: (value: string) => void;
};

type TreeNodeComponentProps = {
  node: TreeNode;
  level: number;
  selectedId?: string;
  expandedIds: Set<string>;
  onSelect?: (node: TreeNode) => void;
  onToggle: (nodeId: string) => void;
  showLines: boolean;
  size: "sm" | "md" | "lg";
  selectable: boolean;
  selectedIds: Set<string>;
  onCheckToggle: (nodeId: string) => void;
};

const sizeMap = {
  sm: "py-1 px-2 text-xs",
  md: "py-1.5 px-2 text-sm",
  lg: "py-2 px-3 text-sm",
};

const indentMap = {
  sm: 16,
  md: 20,
  lg: 24,
};

/** Collect all node IDs from a tree (for expandAll) */
function collectAllIds(nodes: TreeNode[]): string[] {
  const ids: string[] = [];
  function walk(list: TreeNode[]) {
    for (const node of list) {
      ids.push(node.id);
      if (node.children) walk(node.children);
    }
  }
  walk(nodes);
  return ids;
}

/** Check if a node or any descendant matches the search query */
function nodeMatchesSearch(node: TreeNode, query: string): boolean {
  const lower = query.toLowerCase();
  if (node.label.toLowerCase().includes(lower)) return true;
  if (node.children) {
    return node.children.some((child) => nodeMatchesSearch(child, lower));
  }
  return false;
}

/** Filter tree nodes by search query, keeping parent nodes whose children match */
function filterNodes(nodes: TreeNode[], query: string): TreeNode[] {
  if (!query) return nodes;
  return nodes
    .filter((node) => nodeMatchesSearch(node, query))
    .map((node) => {
      if (!node.children) return node;
      const filteredChildren = filterNodes(node.children, query);
      return { ...node, children: filteredChildren };
    });
}

/** Collect IDs of nodes that have matching descendants (for auto-expanding during search) */
function collectMatchingParentIds(nodes: TreeNode[], query: string): string[] {
  const ids: string[] = [];
  function walk(list: TreeNode[]): boolean {
    let anyMatch = false;
    for (const node of list) {
      const lower = query.toLowerCase();
      const selfMatch = node.label.toLowerCase().includes(lower);
      let childMatch = false;
      if (node.children && node.children.length > 0) {
        childMatch = walk(node.children);
        if (selfMatch || childMatch) {
          ids.push(node.id);
        }
      }
      if (selfMatch || childMatch) anyMatch = true;
    }
    return anyMatch;
  }
  walk(nodes);
  return ids;
}

function TreeNodeComponent({
  node,
  level,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
  showLines,
  size,
  selectable,
  selectedIds,
  onCheckToggle,
}: TreeNodeComponentProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isChecked = selectedIds.has(node.id);

  return (
    <div>
      <div className="flex items-center">
        {selectable && (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => onCheckToggle(node.id)}
            disabled={node.disabled}
            className={cn(
              "ml-1 mr-1 h-4 w-4 rounded border-slate-300 text-primary",
              "focus:ring-2 focus:ring-primary focus:ring-offset-1"
            )}
            aria-label={`Select ${node.label}`}
            style={{ marginLeft: `${level * indentMap[size] + 4}px` }}
          />
        )}
        <button
          type="button"
          disabled={node.disabled}
          onClick={() => {
            if (hasChildren) onToggle(node.id);
            onSelect?.(node);
          }}
          className={cn(
            "flex items-center gap-1.5 w-full rounded-lg transition-colors",
            "hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            sizeMap[size],
            isSelected && "bg-primary/10 text-primary font-medium"
          )}
          style={selectable ? undefined : { paddingLeft: `${level * indentMap[size] + 8}px` }}
          role="treeitem"
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={isSelected}
        >
          {/* Expand/collapse chevron */}
          {hasChildren ? (
            <Icon
              name="chevron-right"
              size="sm"
              className={cn(
                "shrink-0 transition-transform text-slate-400",
                isExpanded && "rotate-90"
              )}
            />
          ) : (
            <span className="w-4 shrink-0" />
          )}

          {/* Icon */}
          {node.iconElement ?? (node.icon && (
            <Icon name={node.icon} size="sm" className="shrink-0 text-slate-500" />
          ))}

          {/* Label */}
          <span className="truncate">{node.label}</span>
        </button>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div
          role="group"
          className={cn(showLines && "border-l border-slate-200")}
          style={showLines ? { marginLeft: `${level * indentMap[size] + 16}px` } : undefined}
        >
          {node.children!.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={showLines ? 0 : level + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggle={onToggle}
              showLines={showLines}
              size={size}
              selectable={selectable}
              selectedIds={selectedIds}
              onCheckToggle={onCheckToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const TreeView = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      className,
      nodes,
      selectedId,
      defaultExpandedIds = [],
      onSelect,
      onToggle,
      showLines = false,
      size = "md",
      selectable = false,
      selectedIds: selectedIdsProp,
      onSelectionChange,
      expandAll = false,
      searchable = false,
      searchValue: searchValueProp,
      onSearchChange,
      ...props
    },
    ref
  ) => {
    // Compute default expanded IDs — expandAll takes precedence
    const defaultExpanded = useMemo(() => {
      if (expandAll) return collectAllIds(nodes);
      return defaultExpandedIds;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expandAll]);

    const [expandedIds, setExpandedIds] = useState<Set<string>>(
      new Set(defaultExpanded)
    );

    // Controlled/uncontrolled selection IDs
    const [checkedIds, setCheckedIds] = useControllable<string[]>({
      value: selectedIdsProp,
      defaultValue: [],
      onChange: onSelectionChange,
    });

    // Controlled/uncontrolled search
    const [searchValue, setSearchValue] = useControllable<string>({
      value: searchValueProp,
      defaultValue: "",
      onChange: onSearchChange,
    });

    const checkedSet = useMemo(() => new Set(checkedIds), [checkedIds]);

    const handleCheckToggle = useCallback(
      (nodeId: string) => {
        const next = checkedIds.includes(nodeId)
          ? checkedIds.filter((id) => id !== nodeId)
          : [...checkedIds, nodeId];
        setCheckedIds(next);
      },
      [checkedIds, setCheckedIds]
    );

    const handleToggle = (nodeId: string) => {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        const isExpanding = !next.has(nodeId);
        if (isExpanding) {
          next.add(nodeId);
        } else {
          next.delete(nodeId);
        }
        onToggle?.(nodeId, isExpanding);
        return next;
      });
    };

    // Filter nodes by search, and auto-expand matching parents
    const filteredNodes = useMemo(() => {
      if (!searchValue) return nodes;
      return filterNodes(nodes, searchValue);
    }, [nodes, searchValue]);

    const searchExpandedIds = useMemo(() => {
      if (!searchValue) return expandedIds;
      const parentIds = collectMatchingParentIds(nodes, searchValue);
      return new Set([...expandedIds, ...parentIds]);
    }, [nodes, searchValue, expandedIds]);

    return (
      <div ref={ref} role="tree" className={cn("w-full", className)} {...props}>
        {/* Search input */}
        {searchable && (
          <div className="mb-2 px-1">
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
              className={cn(
                "w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200",
                "bg-white placeholder:text-slate-400",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              )}
              aria-label="Search tree"
            />
          </div>
        )}

        {filteredNodes.map((node) => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            level={0}
            selectedId={selectedId}
            expandedIds={searchExpandedIds}
            onSelect={onSelect}
            onToggle={handleToggle}
            showLines={showLines}
            size={size}
            selectable={selectable}
            selectedIds={checkedSet}
            onCheckToggle={handleCheckToggle}
          />
        ))}

        {searchValue && filteredNodes.length === 0 && (
          <p className="px-2 py-4 text-sm text-slate-400 text-center">No results found</p>
        )}
      </div>
    );
  }
);
TreeView.displayName = "TreeView";

export { TreeView };
export type { TreeViewProps, TreeNode };
