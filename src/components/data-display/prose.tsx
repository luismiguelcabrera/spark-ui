import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ProseProps = HTMLAttributes<HTMLDivElement> & {
  /** Max width variant */
  size?: "sm" | "md" | "lg" | "xl" | "full";
};

const sizeMap = {
  sm: "max-w-prose-sm",
  md: "max-w-prose",
  lg: "max-w-prose-lg",
  xl: "max-w-prose-xl",
  full: "max-w-full",
};

const Prose = forwardRef<HTMLDivElement, ProseProps>(
  ({ className, size = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-navy-text leading-relaxed",
        "[&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-secondary [&>h1]:mt-8 [&>h1]:mb-4",
        "[&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-secondary [&>h2]:mt-8 [&>h2]:mb-3",
        "[&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-secondary [&>h3]:mt-6 [&>h3]:mb-3",
        "[&>h4]:text-lg [&>h4]:font-semibold [&>h4]:text-secondary [&>h4]:mt-4 [&>h4]:mb-2",
        "[&>p]:mb-4 [&>p]:leading-relaxed",
        "[&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul>li]:mb-1",
        "[&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>ol>li]:mb-1",
        "[&>blockquote]:border-l-4 [&>blockquote]:border-primary/30 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-muted-foreground [&>blockquote]:my-4",
        "[&>pre]:rounded-xl [&>pre]:bg-background-dark [&>pre]:p-4 [&>pre]:text-sm [&>pre]:text-white/90 [&>pre]:overflow-x-auto [&>pre]:my-4",
        "[&>code]:rounded-md [&>code]:bg-muted [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:text-sm [&>code]:text-navy-text",
        "[&>hr]:border-muted [&>hr]:my-8",
        "[&>a]:text-primary [&>a]:underline [&>a]:underline-offset-2 [&>a]:hover:text-primary-dark",
        "[&>strong]:font-semibold [&>strong]:text-secondary",
        "[&>img]:rounded-xl [&>img]:my-4",
        "[&>table]:w-full [&>table]:my-4 [&>table]:border-collapse",
        "[&>table>thead>tr>th]:border-b [&>table>thead>tr>th]:border-muted [&>table>thead>tr>th]:px-4 [&>table>thead>tr>th]:py-2 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:text-sm [&>table>thead>tr>th]:font-semibold",
        "[&>table>tbody>tr>td]:border-b [&>table>tbody>tr>td]:border-muted/50 [&>table>tbody>tr>td]:px-4 [&>table>tbody>tr>td]:py-2 [&>table>tbody>tr>td]:text-sm",
        size !== "full" && sizeMap[size],
        className
      )}
      {...props}
    />
  )
);
Prose.displayName = "Prose";

export { Prose };
export type { ProseProps };
