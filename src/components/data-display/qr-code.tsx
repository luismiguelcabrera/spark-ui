import { cn } from "../../lib/utils";

export interface QrCodeProps {
  dataUrl: string;
  alt?: string;
  size?: number;
  className?: string;
}

export function QrCode({
  dataUrl,
  alt = "QR Code",
  size = 200,
  className,
}: QrCodeProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl p-4 inline-flex items-center justify-center",
        className,
      )}
    >
      <img src={dataUrl} alt={alt} width={size} height={size} />
    </div>
  );
}
