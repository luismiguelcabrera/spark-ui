"use client";

import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "./icon";

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

function TreeNodeComponent({
  node,
  level,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
  showLines,
  size,
}: TreeNodeComponentProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  return (
    <div>
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
        style={{ paddingLeft: `${level * indentMap[size] + 8}px` }}
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
      ...props
    },
    ref
  ) => {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(
      new Set(defaultExpandedIds)
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

    return (
      <div ref={ref} role="tree" className={cn("w-full", className)} {...props}>
        {nodes.map((node) => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            level={0}
            selectedId={selectedId}
            expandedIds={expandedIds}
            onSelect={onSelect}
            onToggle={handleToggle}
            showLines={showLines}
            size={size}
          />
        ))}
      </div>
    );
  }
);
TreeView.displayName = "TreeView";

export { TreeView };
export type { TreeViewProps, TreeNode };
