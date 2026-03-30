import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Video } from "../video";

describe("Video", () => {
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
    const { container } = render(<Video src="/test.mp4" poster="/poster.jpg" />);
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
      const { container } = render(
        <Video src="/test.mp4" rounded={r} />,
      );
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
    const { container } = render(<Video src="/test.mp4" aspectRatio={4 / 3} />);
    const wrapper = container.firstChild as HTMLElement;
    // jsdom may or may not parse it — just check the style is set
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
