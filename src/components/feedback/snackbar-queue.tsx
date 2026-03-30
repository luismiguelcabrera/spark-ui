"use client";

import { useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type SnackbarQueueVariant = "default" | "success" | "error" | "warning" | "info";

type SnackbarQueueItem = {
  /** Unique id (auto-generated if not provided) */
  id?: string;
  /** Message text */
  message: string;
  /** Severity variant */
  variant?: SnackbarQueueVariant;
  /** Auto-dismiss duration in ms (default 5000, 0 to disable) */
  duration?: number;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
  };
};

type InternalSnackbarItem = SnackbarQueueItem & { id: string };

type UseSnackbarQueueReturn = {
  /** Add a snackbar to the queue */
  enqueue: (item: SnackbarQueueItem) => string;
  /** The component to render in your JSX */
  SnackbarQueueElement: ReactNode;
};

/* -------------------------------------------------------------------------- */
/*  Style maps (matching existing Snackbar patterns)                           */
/* -------------------------------------------------------------------------- */

const variantStyles: Record<
  SnackbarQueueVariant,
  { bg: string; icon: string; iconColor: string }
> = {
  default: { bg: "bg-slate-900 text-white", icon: "", iconColor: "" },
  success: {
    bg: "bg-green-600 text-white",
    icon: "check-circle",
    iconColor: "text-green-200",
  },
  error: {
    bg: "bg-red-600 text-white",
    icon: "alert-circle",
    iconColor: "text-red-200",
  },
  warning: {
    bg: "bg-amber-500 text-amber-950",
    icon: "alert-triangle",
    iconColor: "text-amber-800",
  },
  info: {
    bg: "bg-blue-600 text-white",
    icon: "info",
    iconColor: "text-blue-200",
  },
};

/* -------------------------------------------------------------------------- */
/*  SnackbarQueueToast — internal rendered snackbar                            */
/* -------------------------------------------------------------------------- */

function SnackbarQueueToast({
  item,
  onDismiss,
}: {
  item: InternalSnackbarItem;
  onDismiss: (id: string) => void;
}) {
  const variant = item.variant ?? "default";
  const styles = variantStyles[variant];
  const duration = item.duration ?? 5000;

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => onDismiss(item.id), duration);
    return () => clearTimeout(timer);
  }, [duration, item.id, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl shadow-float min-w-[300px] max-w-md",
        styles.bg,
      )}
    >
      {styles.icon && (
        <Icon
          name={styles.icon}
          size="md"
          className={cn("shrink-0", styles.iconColor)}
        />
      )}
      <p className="flex-1 min-w-0 text-sm font-semibold">{item.message}</p>
      {item.action && (
        <button
          type="button"
          onClick={item.action.onClick}
          className="shrink-0 text-sm font-bold underline underline-offset-2 hover:no-underline"
        >
          {item.action.label}
        </button>
      )}
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        className="shrink-0 p-0.5 rounded-md hover:bg-white/10 transition-colors"
        aria-label="Dismiss"
      >
        <Icon name="close" size="sm" />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  useSnackbarQueue hook                                                      */
/* -------------------------------------------------------------------------- */

let idCounter = 0;

function useSnackbarQueue(): UseSnackbarQueueReturn {
  const [queue, setQueue] = useState<InternalSnackbarItem[]>([]);
  const queueRef = useRef(queue);
  queueRef.current = queue;

  const dismiss = useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const enqueue = useCallback((item: SnackbarQueueItem): string => {
    const id = item.id ?? `snackbar-queue-${++idCounter}`;
    const internalItem: InternalSnackbarItem = { ...item, id };
    setQueue((prev) => [...prev, internalItem]);
    return id;
  }, []);

  // Show only the first item in the queue
  const current = queue[0] ?? null;

  const SnackbarQueueElement = current ? (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60]">
      <SnackbarQueueToast item={current} onDismiss={dismiss} />
    </div>
  ) : null;

  return { enqueue, SnackbarQueueElement };
}

/* -------------------------------------------------------------------------- */
/*  Exports                                                                    */
/* -------------------------------------------------------------------------- */

export { useSnackbarQueue };
export type { SnackbarQueueItem, SnackbarQueueVariant, UseSnackbarQueueReturn };
