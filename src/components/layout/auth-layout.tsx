import { forwardRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

type AuthLayoutProps = {
  leftPanel: ReactNode;
  topAction?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

const AuthLayout = forwardRef<HTMLDivElement, AuthLayoutProps>(
  ({ leftPanel, topAction, children, footer, className }, ref) => {
    return (
      <div ref={ref} className={cn(s.authLayout, className)}>
        {/* Left Panel */}
        <div className={s.authLeftPanel}>{leftPanel}</div>

        {/* Right Panel */}
        <div className={s.authRightPanel}>
          {topAction && (
            <div className="flex justify-end mb-12">{topAction}</div>
          )}

          <div className={s.authFormContainer}>
            {children}
          </div>

          {footer}
        </div>
      </div>
    );
  }
);
AuthLayout.displayName = "AuthLayout";

export { AuthLayout };
export type { AuthLayoutProps };
