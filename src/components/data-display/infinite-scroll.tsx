"use client";

import { forwardRef, useRef, useEffect, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Spinner } from "../feedback/spinner";

type InfiniteScrollProps = HTMLAttributes<HTMLDivElement> & {
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Loading state */
  loading: boolean;
  /** Callback to load more items */
  onLoadMore: () => void;
  /** Distance from bottom to trigger load (px) */
  threshold?: number;
  /** Custom loading indicator */
  loader?: ReactNode;
  /** Content to show when there are no more items */
  endMessage?: ReactNode;
  /** Whether to use window scroll or container scroll */
  useWindow?: boolean;
};

const InfiniteScroll = forwardRef<HTMLDivElement, InfiniteScrollProps>(
  (
    {
      className,
      hasMore,
      loading,
      onLoadMore,
      threshold = 200,
      loader,
      endMessage,
      useWindow: _useWindow = false,
      children,
      ...props
    },
    ref
  ) => {
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const sentinel = sentinelRef.current;
      if (!sentinel || !hasMore || loading) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            onLoadMore();
          }
        },
        {
          rootMargin: `0px 0px ${threshold}px 0px`,
        }
      );

      observer.observe(sentinel);
      return () => observer.disconnect();
    }, [hasMore, loading, onLoadMore, threshold]);

    return (
      <div ref={ref} className={cn(className)} {...props}>
        {children}

        {/* Sentinel element for intersection observer */}
        <div ref={sentinelRef} className="h-px" />

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center justify-center py-4">
            {loader ?? <Spinner size="md" color="primary" />}
          </div>
        )}

        {/* End message */}
        {!hasMore && !loading && endMessage && (
          <div className="flex items-center justify-center py-4 text-sm text-slate-400">
            {endMessage}
          </div>
        )}
      </div>
    );
  }
);
InfiniteScroll.displayName = "InfiniteScroll";

export { InfiniteScroll };
export type { InfiniteScrollProps };
