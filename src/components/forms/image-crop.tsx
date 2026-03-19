"use client";

import {
  forwardRef,
  useRef,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";
import { useLocale } from "../../lib/locale";

// ── Types ──────────────────────────────────────────────────────────────────

type CropArea = {
  /** Left offset in % (0-100) */
  x: number;
  /** Top offset in % (0-100) */
  y: number;
  /** Width in % (0-100) */
  width: number;
  /** Height in % (0-100) */
  height: number;
};

type ImageCropRef = {
  /** Create an off-screen canvas with the cropped portion of the image */
  getCroppedCanvas: () => HTMLCanvasElement | null;
  /** Return the current crop area as percentages */
  getCropArea: () => CropArea;
  /** Reset crop to default centered position and zoom to 1 */
  reset: () => void;
};

type ImageCropProps = {
  /** Image URL or data URL */
  src: string;
  /** Called on every crop change */
  onCrop?: (area: CropArea) => void;
  /** Fixed aspect ratio for the crop area (e.g., 1 for square, 16/9) */
  aspectRatio?: number;
  /** Minimum crop width in px (default 50) */
  minWidth?: number;
  /** Minimum crop height in px (default 50) */
  minHeight?: number;
  /** Crop shape: "rect" or "round" (default "rect") */
  shape?: "rect" | "round";
  /** Enable zoom slider (default true) */
  zoom?: boolean;
  /** Label shown above the crop area */
  label?: string;
  /** Error message shown below */
  error?: string;
  /** Disables all interaction */
  disabled?: boolean;
  /** Additional CSS class for the root wrapper */
  className?: string;
};

// ── Helpers ────────────────────────────────────────────────────────────────

const DEFAULT_CROP: CropArea = { x: 10, y: 10, width: 80, height: 80 };

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

function getDefaultCrop(aspectRatio?: number): CropArea {
  if (!aspectRatio) return DEFAULT_CROP;

  // Fit the crop within 80% of the image, respecting aspect ratio
  let w = 80;
  let h = 80;
  if (aspectRatio > 1) {
    // wider than tall
    h = w / aspectRatio;
    if (h > 80) {
      h = 80;
      w = h * aspectRatio;
    }
  } else {
    // taller than wide
    w = h * aspectRatio;
    if (w > 80) {
      w = 80;
      h = w / aspectRatio;
    }
  }
  return {
    x: (100 - w) / 2,
    y: (100 - h) / 2,
    width: w,
    height: h,
  };
}

// ── Component ──────────────────────────────────────────────────────────────

type DragMode = "move" | "nw" | "ne" | "sw" | "se" | null;

const ImageCrop = forwardRef<HTMLDivElement, ImageCropProps>(
  (
    {
      src,
      onCrop,
      aspectRatio,
      minWidth = 50,
      minHeight = 50,
      shape = "rect",
      zoom: zoomEnabled = true,
      label,
      error,
      disabled = false,
      className,
    },
    ref
  ) => {
    const { t } = useLocale();
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const imgObjRef = useRef<HTMLImageElement | null>(null);

    const [crop, setCrop] = useState<CropArea>(() => getDefaultCrop(aspectRatio));
    const [zoomLevel, setZoomLevel] = useState(1);
    const [imageLoaded, setImageLoaded] = useState(false);
    const dragModeRef = useRef<DragMode>(null);
    const dragStartRef = useRef<{ x: number; y: number; crop: CropArea }>({
      x: 0,
      y: 0,
      crop: crop,
    });

    // Load image object for getCroppedCanvas
    useEffect(() => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imgObjRef.current = img;
        setImageLoaded(true);
      };
      img.src = src;
    }, [src]);

    // Notify onCrop when crop changes
    useEffect(() => {
      onCrop?.(crop);
      // eslint-disable-next-line react-hooks/exhaustive-deps -- only fire when crop changes
    }, [crop.x, crop.y, crop.width, crop.height]);

    // Convert pixel coords to percentages relative to the container
    const pxToPercent = useCallback(
      (pxX: number, pxY: number): { x: number; y: number } => {
        const container = containerRef.current;
        if (!container) return { x: 0, y: 0 };
        const rect = container.getBoundingClientRect();
        return {
          x: ((pxX - rect.left) / rect.width) * 100,
          y: ((pxY - rect.top) / rect.height) * 100,
        };
      },
      []
    );

    // Constrain crop to bounds and enforce min size / aspect ratio
    const constrainCrop = useCallback(
      (c: CropArea, containerEl?: HTMLDivElement | null): CropArea => {
        let { x, y, width, height } = c;
        const el = containerEl ?? containerRef.current;

        // Enforce pixel minimums as percentage of container
        if (el) {
          const rect = el.getBoundingClientRect();
          const minWPct = (minWidth / rect.width) * 100;
          const minHPct = (minHeight / rect.height) * 100;
          width = Math.max(width, minWPct);
          height = Math.max(height, minHPct);
        }

        // Enforce aspect ratio
        if (aspectRatio) {
          const el2 = el;
          if (el2) {
            const rect = el2.getBoundingClientRect();
            const containerAspect = rect.width / rect.height;
            // height in % corresponding to width in % with given aspect ratio
            const desiredHeightPct = (width / 100) * rect.width / aspectRatio / rect.height * 100;
            if (desiredHeightPct <= 100) {
              height = desiredHeightPct;
            } else {
              height = 100;
              width = (height / 100) * rect.height * aspectRatio / rect.width * 100;
            }
            // Re-enforce using containerAspect to keep it clean
            void containerAspect;
          }
        }

        // Clamp to container bounds
        width = clamp(width, 1, 100);
        height = clamp(height, 1, 100);
        x = clamp(x, 0, 100 - width);
        y = clamp(y, 0, 100 - height);

        return { x, y, width, height };
      },
      [aspectRatio, minWidth, minHeight]
    );

    // ── Pointer handlers ─────────────────────────────────────────────────

    const handlePointerDown = useCallback(
      (e: ReactPointerEvent<HTMLDivElement>, mode: DragMode) => {
        if (disabled || !mode) return;
        e.preventDefault();
        e.stopPropagation();
        dragModeRef.current = mode;
        dragStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          crop: { ...crop },
        };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      },
      [disabled, crop]
    );

    const handlePointerMove = useCallback(
      (e: ReactPointerEvent<HTMLDivElement>) => {
        if (!dragModeRef.current || disabled) return;
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const dx = ((e.clientX - dragStartRef.current.x) / rect.width) * 100;
        const dy = ((e.clientY - dragStartRef.current.y) / rect.height) * 100;
        const start = dragStartRef.current.crop;

        let newCrop: CropArea;

        switch (dragModeRef.current) {
          case "move": {
            newCrop = {
              ...start,
              x: start.x + dx,
              y: start.y + dy,
            };
            break;
          }
          case "nw": {
            newCrop = {
              x: start.x + dx,
              y: start.y + dy,
              width: start.width - dx,
              height: start.height - dy,
            };
            break;
          }
          case "ne": {
            newCrop = {
              x: start.x,
              y: start.y + dy,
              width: start.width + dx,
              height: start.height - dy,
            };
            break;
          }
          case "sw": {
            newCrop = {
              x: start.x + dx,
              y: start.y,
              width: start.width - dx,
              height: start.height + dy,
            };
            break;
          }
          case "se": {
            newCrop = {
              x: start.x,
              y: start.y,
              width: start.width + dx,
              height: start.height + dy,
            };
            break;
          }
          default:
            return;
        }

        setCrop(constrainCrop(newCrop));
      },
      [disabled, constrainCrop]
    );

    const handlePointerUp = useCallback(() => {
      dragModeRef.current = null;
    }, []);

    // ── Imperative handle ────────────────────────────────────────────────

    useImperativeHandle(
      ref as React.Ref<ImageCropRef>,
      () => ({
        getCroppedCanvas: () => {
          const img = imgObjRef.current;
          if (!img) return null;

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return null;

          // Convert crop percentages to pixel values on the natural image
          const sx = (crop.x / 100) * img.naturalWidth;
          const sy = (crop.y / 100) * img.naturalHeight;
          const sw = (crop.width / 100) * img.naturalWidth;
          const sh = (crop.height / 100) * img.naturalHeight;

          canvas.width = Math.round(sw);
          canvas.height = Math.round(sh);
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
          return canvas;
        },
        getCropArea: () => ({ ...crop }),
        reset: () => {
          setCrop(getDefaultCrop(aspectRatio));
          setZoomLevel(1);
        },
      }),
      [crop, aspectRatio]
    );

    // ── Render ───────────────────────────────────────────────────────────

    // Corner handle positions
    const handles: { position: string; mode: DragMode; style: React.CSSProperties }[] = [
      {
        position: "top-left",
        mode: "nw",
        style: { top: -6, left: -6, cursor: "nw-resize" },
      },
      {
        position: "top-right",
        mode: "ne",
        style: { top: -6, right: -6, cursor: "ne-resize" },
      },
      {
        position: "bottom-left",
        mode: "sw",
        style: { bottom: -6, left: -6, cursor: "sw-resize" },
      },
      {
        position: "bottom-right",
        mode: "se",
        style: { bottom: -6, right: -6, cursor: "se-resize" },
      },
    ];

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-3",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
      >
        {label && (
          <label className="text-sm font-medium text-slate-700">{label}</label>
        )}

        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-xl bg-slate-100 select-none"
          style={{ maxWidth: "100%", aspectRatio: "auto" }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Image */}
          <img
            ref={imgRef}
            src={src}
            alt=""
            className="block w-full"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "center center",
            }}
            draggable={false}
          />

          {/* Dark overlay — 4 divs around the crop cutout */}
          {imageLoaded && (
            <>
              {/* Top overlay */}
              <div
                className="absolute left-0 right-0 top-0 bg-black/50 pointer-events-none"
                style={{ height: `${crop.y}%` }}
              />
              {/* Bottom overlay */}
              <div
                className="absolute left-0 right-0 bottom-0 bg-black/50 pointer-events-none"
                style={{ height: `${100 - crop.y - crop.height}%` }}
              />
              {/* Left overlay */}
              <div
                className="absolute left-0 bg-black/50 pointer-events-none"
                style={{
                  top: `${crop.y}%`,
                  height: `${crop.height}%`,
                  width: `${crop.x}%`,
                }}
              />
              {/* Right overlay */}
              <div
                className="absolute right-0 bg-black/50 pointer-events-none"
                style={{
                  top: `${crop.y}%`,
                  height: `${crop.height}%`,
                  width: `${100 - crop.x - crop.width}%`,
                }}
              />
            </>
          )}

          {/* Crop overlay */}
          <div
            data-testid="crop-overlay"
            className={cn(
              "absolute border-2 border-white cursor-move",
              shape === "round" && "rounded-full"
            )}
            style={{
              left: `${crop.x}%`,
              top: `${crop.y}%`,
              width: `${crop.width}%`,
              height: `${crop.height}%`,
            }}
            onPointerDown={(e) => handlePointerDown(e, "move")}
          >
            {/* Corner drag handles */}
            {handles.map((h) => (
              <div
                key={h.position}
                data-testid={`handle-${h.position}`}
                className="absolute w-3 h-3 bg-white border border-slate-400 rounded-sm"
                style={h.style}
                onPointerDown={(e) => handlePointerDown(e, h.mode)}
              />
            ))}
          </div>
        </div>

        {/* Zoom slider */}
        {zoomEnabled && (
          <div className="flex items-center gap-3">
            <Icon name="zoom_out" size="sm" className="text-slate-500" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
              className="flex-1 accent-primary"
              aria-label={t("imagecrop.zoom", "Zoom")}
              disabled={disabled}
            />
            <Icon name="zoom_in" size="sm" className="text-slate-500" />
          </div>
        )}

        {error && (
          <p className="text-xs text-red-600 font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
ImageCrop.displayName = "ImageCrop";

export { ImageCrop };
export type { ImageCropProps, ImageCropRef, CropArea };
