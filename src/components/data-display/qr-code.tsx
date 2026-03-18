import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type QrCodeProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  dataUrl: string;
  alt?: string;
  size?: number;
};

const QrCode = forwardRef<HTMLDivElement, QrCodeProps>(
  ({ dataUrl, alt = "QR Code", size = 200, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-xl p-4 inline-flex items-center justify-center",
          className,
        )}
        {...props}
      >
        <img src={dataUrl} alt={alt} width={size} height={size} />
      </div>
    );
  }
);
QrCode.displayName = "QrCode";

export { QrCode };
export type { QrCodeProps };
