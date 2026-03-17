import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type WatermarkProps = HTMLAttributes<HTMLDivElement> & {
  text: string;
  fontSize?: number;
  color?: string;
  opacity?: number;
  rotate?: number;
  gap?: number;
};

const Watermark = forwardRef<HTMLDivElement, WatermarkProps>(
  (
    { className, text, fontSize = 16, color = "#000", opacity = 0.05, rotate = -22, gap = 100, children, ...props },
    ref
  ) => {
    const svgText = `<svg xmlns="http://www.w3.org/2000/svg" width="${gap * 2}" height="${gap}"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${fontSize}" fill="${color}" opacity="${opacity}" transform="rotate(${rotate}, ${gap}, ${gap / 2})">${text}</text></svg>`;
    const encoded = `url("data:image/svg+xml,${encodeURIComponent(svgText)}")`;

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {children}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          style={{ backgroundImage: encoded, backgroundRepeat: "repeat" }}
          aria-hidden="true"
        />
      </div>
    );
  }
);
Watermark.displayName = "Watermark";

export { Watermark };
export type { WatermarkProps };
