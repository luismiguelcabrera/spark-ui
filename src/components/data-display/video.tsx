"use client";

import {
  forwardRef,
  useState,
  useCallback,
  useMemo,
  type VideoHTMLAttributes,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Variants                                                                   */
/* -------------------------------------------------------------------------- */

const videoVariants = cva("overflow-hidden bg-black", {
  variants: {
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-lg",
      lg: "rounded-xl",
      xl: "rounded-2xl",
    },
  },
  defaultVariants: {
    rounded: "md",
  },
});

/* -------------------------------------------------------------------------- */
/*  URL parsing helpers                                                        */
/* -------------------------------------------------------------------------- */

type VideoProvider = "native" | "youtube" | "vimeo";

function detectProvider(src: string): VideoProvider {
  if (
    /(?:youtube\.com|youtu\.be|youtube-nocookie\.com)/.test(src)
  ) {
    return "youtube";
  }
  if (/vimeo\.com/.test(src)) {
    return "vimeo";
  }
  return "native";
}

function extractYouTubeId(src: string): string | null {
  // youtube.com/watch?v=ID
  const watchMatch = src.match(
    /(?:youtube\.com|youtube-nocookie\.com)\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  );
  if (watchMatch) return watchMatch[1];

  // youtu.be/ID
  const shortMatch = src.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // youtube.com/embed/ID
  const embedMatch = src.match(
    /(?:youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9_-]{11})/,
  );
  if (embedMatch) return embedMatch[1];

  // youtube.com/shorts/ID
  const shortsMatch = src.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  return null;
}

function extractVimeoId(src: string): string | null {
  const match = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function getYouTubeEmbedUrl(
  videoId: string,
  privacyMode: boolean,
  autoplay: boolean,
): string {
  const domain = privacyMode
    ? "www.youtube-nocookie.com"
    : "www.youtube.com";
  const params = new URLSearchParams({ autoplay: autoplay ? "1" : "0" });
  return `https://${domain}/embed/${videoId}?${params.toString()}`;
}

function getVimeoEmbedUrl(videoId: string, autoplay: boolean): string {
  const params = new URLSearchParams({ autoplay: autoplay ? "1" : "0" });
  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}

/* -------------------------------------------------------------------------- */
/*  Play Button                                                                */
/* -------------------------------------------------------------------------- */

function PlayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Play video"
      onClick={onClick}
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        "bg-black/30 transition-colors hover:bg-black/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        "group/play cursor-pointer",
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center",
          "w-16 h-16 rounded-full bg-surface/90 shadow-lg",
          "transition-transform group-hover/play:scale-110",
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7 text-black ml-1"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type VideoRounded = "none" | "sm" | "md" | "lg" | "xl";

type VideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  "width" | "height"
> &
  VariantProps<typeof videoVariants> & {
    /** Video source URL — supports direct files, YouTube, and Vimeo URLs. */
    src: string;
    /** Aspect ratio (width / height). Default is 16/9. */
    aspectRatio?: number;
    /** Poster image URL. For YouTube, auto-fetched if not provided. */
    poster?: string;
    /** Width of the container (CSS value) */
    width?: number | string;
    /** Height of the container (CSS value) */
    height?: number | string;
    /**
     * Use privacy-enhanced mode for YouTube (youtube-nocookie.com).
     * @default true
     */
    privacyMode?: boolean;
    /**
     * Title for the embedded iframe (accessibility).
     * @default "Video player"
     */
    iframeTitle?: string;
  };

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

const Video = forwardRef<HTMLVideoElement, VideoProps>(
  (
    {
      className,
      rounded,
      aspectRatio = 16 / 9,
      poster,
      width,
      height,
      style,
      src,
      privacyMode = true,
      iframeTitle = "Video player",
      ...props
    },
    ref,
  ) => {
    const provider = useMemo(() => detectProvider(src), [src]);
    const [activated, setActivated] = useState(false);

    const videoId = useMemo(() => {
      if (provider === "youtube") return extractYouTubeId(src);
      if (provider === "vimeo") return extractVimeoId(src);
      return null;
    }, [provider, src]);

    const thumbnailUrl = useMemo(() => {
      if (poster) return poster;
      if (provider === "youtube" && videoId) {
        return getYouTubeThumbnail(videoId);
      }
      return undefined;
    }, [poster, provider, videoId]);

    const handleActivate = useCallback(() => {
      setActivated(true);
    }, []);

    const containerStyle: React.CSSProperties = {
      ...style,
      ...(width !== undefined
        ? { width: typeof width === "number" ? `${width}px` : width }
        : {}),
      ...(height !== undefined
        ? { height: typeof height === "number" ? `${height}px` : height }
        : {}),
      ...(aspectRatio !== undefined
        ? { aspectRatio: String(aspectRatio) }
        : {}),
    };

    /* -- Native <video> --------------------------------------------------- */
    if (provider === "native") {
      return (
        <div
          className={cn(videoVariants({ rounded }), className)}
          style={containerStyle}
        >
          <video
            ref={ref}
            controls
            poster={poster}
            src={src}
            className="w-full h-full object-contain"
            {...props}
          />
        </div>
      );
    }

    /* -- YouTube / Vimeo embed -------------------------------------------- */
    if (!videoId) {
      // Fallback: couldn't parse the URL, render nothing useful
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[Video] Could not extract video ID from URL: ${src}`,
        );
      }
      return (
        <div
          className={cn(videoVariants({ rounded }), className)}
          style={containerStyle}
        />
      );
    }

    const embedUrl =
      provider === "youtube"
        ? getYouTubeEmbedUrl(videoId, privacyMode, activated)
        : getVimeoEmbedUrl(videoId, activated);

    return (
      <div
        className={cn(
          videoVariants({ rounded }),
          "relative",
          className,
        )}
        style={containerStyle}
      >
        {activated ? (
          <iframe
            src={embedUrl}
            title={iframeTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <>
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
            )}
            <PlayButton onClick={handleActivate} />
          </>
        )}
      </div>
    );
  },
);
Video.displayName = "Video";

export { Video, videoVariants, detectProvider, extractYouTubeId, extractVimeoId };
export type { VideoProps, VideoRounded, VideoProvider };
