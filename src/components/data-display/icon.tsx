import { forwardRef, useMemo } from "react";
import { cn } from "../../lib/utils";
import { useIconResolver } from "../../icons/icon-provider";
import { builtInIcons } from "../../icons/registry";
import type { ComponentType } from "react";
import type { IconComponentProps } from "../../icons/icon-provider";

const sizePixels = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

type IconProps = {
  name: string;
  size?: keyof typeof sizePixels;
  filled?: boolean;
  className?: string;
};

/**
 * Renders a resolved icon component.
 * Extracted as a standalone component so the lint rule doesn't flag it
 * as "created during render".
 */
const ResolvedIconRenderer = forwardRef<
  SVGSVGElement,
  { component: ComponentType<IconComponentProps>; size: number; className?: string }
>(({ component: Comp, size, className }, ref) => {
  return <Comp ref={ref} size={size} className={cn("shrink-0", className)} />;
});
ResolvedIconRenderer.displayName = "ResolvedIconRenderer";

const Icon = forwardRef<SVGSVGElement | HTMLSpanElement, IconProps>(
  ({ name, size = "md", filled = false, className }, ref) => {
    const resolver = useIconResolver();
    const px = sizePixels[size];

    const IconComponent = useMemo(
      () => resolver?.(name) ?? builtInIcons[name] ?? null,
      [resolver, name],
    );

    if (IconComponent) {
      return (
        <ResolvedIconRenderer
          ref={ref as React.Ref<SVGSVGElement>}
          component={IconComponent}
          size={px}
          className={className}
        />
      );
    }

    // Fallback to Material Symbols font (legacy)
    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        className={cn(
          "material-symbols-outlined select-none leading-none",
          filled && "icon-filled",
          className,
        )}
        style={{ fontSize: px }}
      >
        {name}
      </span>
    );
  },
);
Icon.displayName = "Icon";

export { Icon };
export type { IconProps };
