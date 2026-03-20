import { forwardRef, type AnchorHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const linkVariants = cva(
  "inline-flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm",
  {
    variants: {
      variant: {
        default: "text-primary hover:text-primary-dark underline underline-offset-4",
        subtle: "text-muted-foreground hover:text-navy-text no-underline hover:underline underline-offset-4",
        muted: "text-muted-foreground hover:text-navy-text",
        nav: "text-muted-foreground hover:text-navy-text font-medium no-underline",
        unstyled: "",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof linkVariants> & {
    /** Open in new tab */
    external?: boolean;
  };

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, size, external, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(linkVariants({ variant, size }), className)}
      {...(external && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
      {...props}
    >
      {children}
    </a>
  )
);
Link.displayName = "Link";

export { Link, linkVariants };
export type { LinkProps };
