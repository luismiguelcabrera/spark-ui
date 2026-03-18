"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Avatar } from "./avatar";

type OrgNode = {
  /** Unique identifier */
  id: string;
  /** Display name / label */
  label: string;
  /** Child nodes */
  children?: OrgNode[];
  /** Avatar image URL */
  avatar?: string;
  /** Job title or role */
  title?: string;
};

type OrganizationChartDirection = "vertical" | "horizontal";

type OrganizationChartProps = {
  /** Root node of the organization tree */
  data: OrgNode;
  /** Layout direction */
  direction?: OrganizationChartDirection;
  /** Additional class names for the root container */
  className?: string;
  /** Additional class names applied to each node card */
  nodeClassName?: string;
  /** Connector line color (Tailwind border class) */
  lineColor?: string;
  /** Callback when a node is clicked */
  onNodeClick?: (node: OrgNode) => void;
  /** Custom node renderer — overrides the default card */
  renderNode?: (node: OrgNode) => ReactNode;
};

/* ------------------------------------------------------------------ */
/* Default node card                                                   */
/* ------------------------------------------------------------------ */

function DefaultNodeCard({
  node,
  nodeClassName,
  onClick,
}: {
  node: OrgNode;
  nodeClassName?: string;
  onClick?: (node: OrgNode) => void;
}) {
  const isClickable = !!onClick;

  return (
    <div
      aria-label={node.label}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? () => onClick(node) : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(node);
              }
            }
          : undefined
      }
      className={cn(
        "inline-flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm",
        "dark:border-slate-700 dark:bg-slate-900",
        isClickable &&
          "cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        nodeClassName,
      )}
    >
      {node.avatar && (
        <Avatar src={node.avatar} alt={node.label} size="md" />
      )}
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        {node.label}
      </span>
      {node.title && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {node.title}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Vertical (top-down) subtree                                         */
/* ------------------------------------------------------------------ */

function VerticalSubtree({
  node,
  lineColor,
  nodeClassName,
  onNodeClick,
  renderNode,
  isRoot,
}: {
  node: OrgNode;
  lineColor: string;
  nodeClassName?: string;
  onNodeClick?: (node: OrgNode) => void;
  renderNode?: (node: OrgNode) => ReactNode;
  isRoot: boolean;
}) {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <li
      className="flex flex-col items-center"
    >
      {/* Vertical line from parent connector to this node */}
      {!isRoot && (
        <div
          aria-hidden="true"
          className={cn("h-5 w-px", `bg-${lineColor}`, "border-l", `border-${lineColor}`)}
          style={{ minHeight: 20 }}
        />
      )}

      {/* Node card */}
      {renderNode ? (
        <div role="treeitem" aria-label={node.label}>
          {renderNode(node)}
        </div>
      ) : (
        <DefaultNodeCard
          node={node}
          nodeClassName={nodeClassName}
          onClick={onNodeClick}
        />
      )}

      {/* Children */}
      {hasChildren && (
        <>
          {/* Vertical line down from node */}
          <div
            aria-hidden="true"
            className={cn("h-5 w-px border-l", `border-${lineColor}`)}
            style={{ minHeight: 20 }}
          />

          {/* Horizontal connector bar */}
          {node.children!.length > 1 && (
            <div
              aria-hidden="true"
              className={cn(
                "self-stretch border-t",
                `border-${lineColor}`,
              )}
              style={{
                marginLeft: "calc(50% / " + node.children!.length + " + 0%)",
                marginRight: "calc(50% / " + node.children!.length + " + 0%)",
                /* We approximate the bar to connect first-child center to last-child center */
              }}
            />
          )}

          <ul className="flex gap-0">
            {node.children!.map((child) => (
              <VerticalSubtree
                key={child.id}
                node={child}
                lineColor={lineColor}
                nodeClassName={nodeClassName}
                onNodeClick={onNodeClick}
                renderNode={renderNode}
                isRoot={false}
              />
            ))}
          </ul>
        </>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Horizontal (left-right) subtree                                     */
/* ------------------------------------------------------------------ */

function HorizontalSubtree({
  node,
  lineColor,
  nodeClassName,
  onNodeClick,
  renderNode,
  isRoot,
}: {
  node: OrgNode;
  lineColor: string;
  nodeClassName?: string;
  onNodeClick?: (node: OrgNode) => void;
  renderNode?: (node: OrgNode) => ReactNode;
  isRoot: boolean;
}) {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <li
      className="flex items-center"
    >
      {/* Horizontal line from parent connector to this node */}
      {!isRoot && (
        <div
          aria-hidden="true"
          className={cn("w-5 border-t", `border-${lineColor}`)}
          style={{ minWidth: 20 }}
        />
      )}

      {/* Node card */}
      {renderNode ? (
        <div role="treeitem" aria-label={node.label}>
          {renderNode(node)}
        </div>
      ) : (
        <DefaultNodeCard
          node={node}
          nodeClassName={nodeClassName}
          onClick={onNodeClick}
        />
      )}

      {/* Children */}
      {hasChildren && (
        <div className="flex items-center">
          {/* Horizontal line from node to vertical bar */}
          <div
            aria-hidden="true"
            className={cn("w-5 border-t", `border-${lineColor}`)}
            style={{ minWidth: 20 }}
          />

          {/* Vertical connector bar + children stack */}
          <ul
            className={cn(
              "flex flex-col gap-0",
              node.children!.length > 1 && cn("border-l", `border-${lineColor}`),
            )}
          >
            {node.children!.map((child) => (
              <HorizontalSubtree
                key={child.id}
                node={child}
                lineColor={lineColor}
                nodeClassName={nodeClassName}
                onNodeClick={onNodeClick}
                renderNode={renderNode}
                isRoot={false}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Root component                                                      */
/* ------------------------------------------------------------------ */

const OrganizationChart = forwardRef<HTMLDivElement, OrganizationChartProps>(
  (
    {
      data,
      direction = "vertical",
      className,
      nodeClassName,
      lineColor = "slate-300",
      onNodeClick,
      renderNode,
    },
    ref,
  ) => {
    const SubtreeComponent =
      direction === "vertical" ? VerticalSubtree : HorizontalSubtree;

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex",
          direction === "vertical" ? "flex-col items-center" : "flex-row items-center",
          className,
        )}
        role="figure"
        aria-label="Organization chart"
      >
        <ul
          className={cn(
            "flex list-none p-0 m-0",
            direction === "vertical" ? "flex-col items-center" : "flex-row items-center",
          )}
        >
          <SubtreeComponent
            node={data}
            lineColor={lineColor}
            nodeClassName={nodeClassName}
            onNodeClick={onNodeClick}
            renderNode={renderNode}
            isRoot={true}
          />
        </ul>
      </div>
    );
  },
);
OrganizationChart.displayName = "OrganizationChart";

export { OrganizationChart };
export type { OrganizationChartProps, OrgNode, OrganizationChartDirection };
