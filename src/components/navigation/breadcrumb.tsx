import Link from "next/link";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center gap-2 text-sm", className)}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && (
            <span className={cn("material-symbols-outlined text-[16px]", s.textSubtle)}>
              chevron_right
            </span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className={cn(s.textMuted, "text-sm hover:text-primary transition-colors")}
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export { Breadcrumb };
export type { BreadcrumbProps, BreadcrumbItem };
