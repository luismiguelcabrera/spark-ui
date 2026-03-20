"use client";

import {
  forwardRef,
  useRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";
import { useLocale } from "../../lib/locale";

type Point = { x: number; y: number };

type SignatureRef = {
  clear: () => void;
  undo: () => void;
  toDataURL: (format?: string) => string;
  isEmpty: () => boolean;
};

type SignatureProps = {
  /** Data URL of the current signature image (controlled mode) */
  value?: string;
  /** Called when the signature changes; receives a data URL or null when cleared */
  onChange?: (dataUrl: string | null) => void;
  /** Canvas width in CSS pixels (default 400) */
  width?: number;
  /** Canvas height in CSS pixels (default 200) */
  height?: number;
  /** Stroke color (default "#1e293b" — slate-800) */
  strokeColor?: string;
  /** Stroke width in pixels (default 2) */
  strokeWidth?: number;
  /** Canvas background color (default "transparent") */
  backgroundColor?: string;
  /** Label shown above the canvas */
  label?: string;
  /** Error message shown below the canvas */
  error?: string;
  /** Disables all interaction */
  disabled?: boolean;
  /** Prevents drawing but keeps undo/clear disabled */
  readOnly?: boolean;
  /** Additional CSS class for the root wrapper */
  className?: string;
};

const Signature = forwardRef<SignatureRef, SignatureProps>(
  (
    {
      value,
      onChange,
      width = 400,
      height = 200,
      strokeColor = "#1e293b",
      strokeWidth = 2,
      backgroundColor = "transparent",
      label,
      error,
      disabled = false,
      readOnly = false,
      className,
    },
    ref,
  ) => {
    const { t } = useLocale();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const strokesRef = useRef<Point[][]>([]);
    const currentStrokeRef = useRef<Point[]>([]);
    const isDrawingRef = useRef(false);
    const [empty, setEmpty] = useState(true);

    // ---------- helpers ----------

    const getContext = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      return canvas.getContext("2d");
    }, []);

    const redraw = useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = getContext();
      if (!canvas || !ctx) return;

      const dpr =
        typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const strokes = strokesRef.current;
      for (const stroke of strokes) {
        if (stroke.length < 2) continue;
        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth * dpr;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
      }
    }, [backgroundColor, strokeColor, strokeWidth, getContext]);

    // ---------- canvas init ----------

    const initCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr =
        typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    }, [width, height]);

    useEffect(() => {
      initCanvas();
      redraw();
    }, [initCanvas, redraw]);

    // ---------- load value prop (controlled / initial) ----------

    useEffect(() => {
      if (!value) return;
      const canvas = canvasRef.current;
      const ctx = getContext();
      if (!canvas || !ctx) return;

      const img = new Image();
      img.onload = () => {
        const dpr =
          typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (backgroundColor && backgroundColor !== "transparent") {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0, width * dpr, height * dpr);
        setEmpty(false);
      };
      img.src = value;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // ---------- pointer handlers ----------

    const getPointerPos = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>): Point => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const dpr =
          typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
        return {
          x: (e.clientX - rect.left) * dpr,
          y: (e.clientY - rect.top) * dpr,
        };
      },
      [],
    );

    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (disabled || readOnly) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.setPointerCapture(e.pointerId);
        isDrawingRef.current = true;
        const pos = getPointerPos(e);
        currentStrokeRef.current = [pos];
      },
      [disabled, readOnly, getPointerPos],
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawingRef.current) return;
        const ctx = getContext();
        if (!ctx) return;
        const dpr =
          typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
        const pos = getPointerPos(e);
        const prev =
          currentStrokeRef.current[currentStrokeRef.current.length - 1];

        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth * dpr;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        currentStrokeRef.current.push(pos);
      },
      [getContext, getPointerPos, strokeColor, strokeWidth],
    );

    const handlePointerUp = useCallback(() => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;

      if (currentStrokeRef.current.length > 0) {
        strokesRef.current = [
          ...strokesRef.current,
          currentStrokeRef.current,
        ];
        currentStrokeRef.current = [];
        setEmpty(false);

        const canvas = canvasRef.current;
        if (canvas) {
          onChange?.(canvas.toDataURL("image/png"));
        }
      }
    }, [onChange]);

    // ---------- imperative API ----------

    const clear = useCallback(() => {
      strokesRef.current = [];
      currentStrokeRef.current = [];
      setEmpty(true);
      initCanvas();
      redraw();
      onChange?.(null);
    }, [initCanvas, redraw, onChange]);

    const undo = useCallback(() => {
      if (strokesRef.current.length === 0) return;
      strokesRef.current = strokesRef.current.slice(0, -1);
      const nowEmpty = strokesRef.current.length === 0;
      setEmpty(nowEmpty);
      initCanvas();
      redraw();
      if (nowEmpty) {
        onChange?.(null);
      } else {
        const canvas = canvasRef.current;
        if (canvas) {
          onChange?.(canvas.toDataURL("image/png"));
        }
      }
    }, [initCanvas, redraw, onChange]);

    useImperativeHandle(
      ref,
      () => ({
        clear,
        undo,
        isEmpty: () => strokesRef.current.length === 0,
        toDataURL: (format?: string) =>
          canvasRef.current?.toDataURL(format || "image/png") ?? "",
      }),
      [clear, undo],
    );

    // ---------- render ----------

    const btnClasses =
      "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground border border-muted rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {label && (
          <label className="text-sm font-medium text-navy-text">{label}</label>
        )}
        <div className="relative inline-block">
          <canvas
            ref={canvasRef}
            className={cn(
              "rounded-xl border border-muted bg-surface cursor-crosshair touch-none",
              disabled && "opacity-50 cursor-not-allowed pointer-events-none",
              error && "border-destructive/50",
            )}
            style={{ width: `${width}px`, height: `${height}px` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
          {empty && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-muted-foreground text-sm"
              aria-hidden="true"
            >
              {t("signature.signHere", "Sign here")}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={btnClasses}
            onClick={undo}
            disabled={disabled || readOnly}
            aria-label={t("signature.undo", "Undo")}
          >
            <Icon name="undo" size="sm" /> {t("signature.undo", "Undo")}
          </button>
          <button
            type="button"
            className={btnClasses}
            onClick={clear}
            disabled={disabled || readOnly}
            aria-label={t("signature.clearSignature", "Clear signature")}
          >
            <Icon name="delete" size="sm" /> {t("signature.clear", "Clear")}
          </button>
        </div>
        {error && (
          <p className="text-xs text-destructive font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Signature.displayName = "Signature";

export { Signature };
export type { SignatureProps, SignatureRef };
