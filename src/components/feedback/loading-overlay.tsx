import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Spinner } from "./spinner";

type LoadingOverlayProps = HTMLAttributes<HTMLDivElement> & {
  visible: boolean;
  label?: string;
  spinner?: ReactNode;
  blur?: boolean;
  fullScreen?: boolean;
  zIndex?: number;
};

const LoadingOverlay = forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ className, visible, label, spinner, blur = true, fullScreen = false, zIndex = 50, children, ...props }, ref) => {
    if (!visible) return <>{children}</>;

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {children}
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-3",
            fullScreen ? "fixed inset-0" : "absolute inset-0",
            blur ? "bg-surface/60 backdrop-blur-sm" : "bg-surface/80",
            "rounded-[inherit]"
          )}
          style={{ zIndex }}
          role="status"
          aria-label={label ?? "Loading"}
        >
          {spinner ?? <Spinner size="lg" color="primary" />}
          {label && <p className="text-sm font-medium text-muted-foreground">{label}</p>}
        </div>
      </div>
    );
  }
);
LoadingOverlay.displayName = "LoadingOverlay";

export { LoadingOverlay };
export type { LoadingOverlayProps };
