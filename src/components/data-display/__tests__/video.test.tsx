import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  Video,
  detectProvider,
  extractYouTubeId,
  extractVimeoId,
} from "../video";

/* -------------------------------------------------------------------------- */
/*  URL parsing helpers                                                        */
/* -------------------------------------------------------------------------- */

describe("detectProvider", () => {
  it.each([
    ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "youtube"],
    ["https://youtu.be/dQw4w9WgXcQ", "youtube"],
    ["https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ", "youtube"],
    ["https://youtube.com/shorts/dQw4w9WgXcQ", "youtube"],
    ["https://vimeo.com/123456789", "vimeo"],
    ["https://player.vimeo.com/video/123456789", "vimeo"],
    ["/video.mp4", "native"],
    ["https://example.com/clip.webm", "native"],
  ])("detects %s as %s", (url, expected) => {
    expect(detectProvider(url)).toBe(expected);
  });
});

describe("extractYouTubeId", () => {
  it.each([
    ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "dQw4w9WgXcQ"],
    ["https://youtu.be/dQw4w9WgXcQ", "dQw4w9WgXcQ"],
    ["https://www.youtube.com/embed/dQw4w9WgXcQ", "dQw4w9WgXcQ"],
    ["https://youtube.com/shorts/dQw4w9WgXcQ", "dQw4w9WgXcQ"],
    ["https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ", "dQw4w9WgXcQ"],
    ["https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10", "dQw4w9WgXcQ"],
  ])("extracts ID from %s", (url, expected) => {
    expect(extractYouTubeId(url)).toBe(expected);
  });

  it("returns null for invalid URL", () => {
    expect(extractYouTubeId("https://example.com")).toBeNull();
  });
});

describe("extractVimeoId", () => {
  it.each([
    ["https://vimeo.com/123456789", "123456789"],
    ["https://player.vimeo.com/video/123456789", "123456789"],
  ])("extracts ID from %s", (url, expected) => {
    expect(extractVimeoId(url)).toBe(expected);
  });

  it("returns null for invalid URL", () => {
    expect(extractVimeoId("https://example.com")).toBeNull();
  });
});

/* -------------------------------------------------------------------------- */
/*  Native video                                                               */
/* -------------------------------------------------------------------------- */

describe("Video (native)", () => {
  it("renders a native video element", () => {
    const { container } = render(<Video src="/test.mp4" />);
    expect(container.querySelector("video")).toBeInTheDocument();
  });

  it("has controls by default", () => {
    const { container } = render(<Video src="/test.mp4" />);
    const video = container.querySelector("video");
    expect(video).toHaveAttribute("controls");
  });

  it("passes src to video element", () => {
    const { container } = render(<Video src="/test.mp4" />);
    const video = container.querySelector("video");
    expect(video).toHaveAttribute("src", "/test.mp4");
  });

  it("passes poster to video element", () => {
    const { container } = render(
      <Video src="/test.mp4" poster="/poster.jpg" />,
    );
    const video = container.querySelector("video");
    expect(video).toHaveAttribute("poster", "/poster.jpg");
  });

  it("forwards ref to video element", () => {
    const ref = { current: null as HTMLVideoElement | null };
    render(<Video ref={ref} src="/test.mp4" />);
    expect(ref.current).toBeInstanceOf(HTMLVideoElement);
  });

  it("merges className on container", () => {
    const { container } = render(
      <Video src="/test.mp4" className="custom-video" />,
    );
    expect(container.firstChild).toHaveClass("custom-video");
  });

  it.each(["none", "sm", "md", "lg", "xl"] as const)(
    "applies rounded=%s",
    (r) => {
      const roundedClass = {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-lg",
        lg: "rounded-xl",
        xl: "rounded-2xl",
      }[r];
      const { container } = render(<Video src="/test.mp4" rounded={r} />);
      expect(container.firstChild).toHaveClass(roundedClass);
    },
  );

  it("applies default rounded (md)", () => {
    const { container } = render(<Video src="/test.mp4" />);
    expect(container.firstChild).toHaveClass("rounded-lg");
  });

  it("applies width as inline style", () => {
    const { container } = render(<Video src="/test.mp4" width={640} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe("640px");
  });

  it("applies string width", () => {
    const { container } = render(<Video src="/test.mp4" width="100%" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe("100%");
  });

  it("applies height as inline style", () => {
    const { container } = render(<Video src="/test.mp4" height={480} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.height).toBe("480px");
  });

  it("applies aspectRatio as inline style", () => {
    const { container } = render(
      <Video src="/test.mp4" aspectRatio={4 / 3} />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
  });

  it("passes additional video attributes through", () => {
    const { container } = render(
      <Video src="/test.mp4" autoPlay muted loop playsInline />,
    );
    const video = container.querySelector("video");
    expect(video).toHaveAttribute("autoplay");
    expect((video as HTMLVideoElement).loop).toBe(true);
  });

  it("has overflow-hidden on container", () => {
    const { container } = render(<Video src="/test.mp4" />);
    expect(container.firstChild).toHaveClass("overflow-hidden");
  });

  it("has bg-black on container", () => {
    const { container } = render(<Video src="/test.mp4" />);
    expect(container.firstChild).toHaveClass("bg-black");
  });
});

/* -------------------------------------------------------------------------- */
/*  YouTube embed                                                              */
/* -------------------------------------------------------------------------- */

describe("Video (YouTube)", () => {
  const ytUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  it("renders a lite placeholder instead of an iframe initially", () => {
    render(<Video src={ytUrl} width={640} />);
    expect(screen.queryByTitle("Video player")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Play video" }),
    ).toBeInTheDocument();
  });

  it("shows auto-fetched YouTube thumbnail", () => {
    const { container } = render(<Video src={ytUrl} width={640} />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute(
      "src",
      "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    );
  });

  it("uses custom poster over auto-thumbnail", () => {
    const { container } = render(
      <Video src={ytUrl} poster="/custom.jpg" width={640} />,
    );
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "/custom.jpg");
  });

  it("loads iframe on play click with autoplay", () => {
    render(<Video src={ytUrl} width={640} />);
    fireEvent.click(screen.getByRole("button", { name: "Play video" }));

    const iframe = screen.getByTitle("Video player");
    expect(iframe).toBeInTheDocument();
    expect(iframe.getAttribute("src")).toContain("youtube-nocookie.com");
    expect(iframe.getAttribute("src")).toContain("autoplay=1");
  });

  it("uses regular youtube.com when privacyMode is false", () => {
    render(<Video src={ytUrl} width={640} privacyMode={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Play video" }));

    const iframe = screen.getByTitle("Video player");
    expect(iframe.getAttribute("src")).toContain("www.youtube.com");
    expect(iframe.getAttribute("src")).not.toContain("nocookie");
  });

  it("uses custom iframeTitle", () => {
    render(
      <Video src={ytUrl} width={640} iframeTitle="My cool video" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Play video" }));
    expect(screen.getByTitle("My cool video")).toBeInTheDocument();
  });

  it("iframe has allowFullScreen", () => {
    render(<Video src={ytUrl} width={640} />);
    fireEvent.click(screen.getByRole("button", { name: "Play video" }));
    const iframe = screen.getByTitle("Video player") as HTMLIFrameElement;
    expect(iframe).toHaveAttribute("allowfullscreen");
  });

  it("supports youtu.be short URLs", () => {
    render(
      <Video src="https://youtu.be/dQw4w9WgXcQ" width={640} />,
    );
    const { container } = render(
      <Video src="https://youtu.be/dQw4w9WgXcQ" width={640} />,
    );
    const img = container.querySelector("img");
    expect(img).toHaveAttribute(
      "src",
      "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    );
  });

  it("applies rounded and className to container", () => {
    const { container } = render(
      <Video
        src={ytUrl}
        width={640}
        rounded="xl"
        className="my-yt"
      />,
    );
    expect(container.firstChild).toHaveClass("rounded-2xl", "my-yt");
  });

  it("warns in dev when video ID cannot be extracted", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Video src="https://youtube.com/invalid" width={640} />);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Could not extract video ID"),
    );
    warnSpy.mockRestore();
  });
});

/* -------------------------------------------------------------------------- */
/*  Vimeo embed                                                                */
/* -------------------------------------------------------------------------- */

describe("Video (Vimeo)", () => {
  const vimeoUrl = "https://vimeo.com/123456789";

  it("renders a lite placeholder initially", () => {
    render(<Video src={vimeoUrl} width={640} />);
    expect(screen.queryByTitle("Video player")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Play video" }),
    ).toBeInTheDocument();
  });

  it("does not render a thumbnail (no auto-fetch for Vimeo)", () => {
    const { container } = render(<Video src={vimeoUrl} width={640} />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  it("shows custom poster for Vimeo", () => {
    const { container } = render(
      <Video src={vimeoUrl} poster="/vimeo-poster.jpg" width={640} />,
    );
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "/vimeo-poster.jpg");
  });

  it("loads Vimeo iframe on play click", () => {
    render(<Video src={vimeoUrl} width={640} />);
    fireEvent.click(screen.getByRole("button", { name: "Play video" }));

    const iframe = screen.getByTitle("Video player");
    expect(iframe.getAttribute("src")).toContain("player.vimeo.com");
    expect(iframe.getAttribute("src")).toContain("123456789");
    expect(iframe.getAttribute("src")).toContain("autoplay=1");
  });
});
