import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Image } from "../image";

describe("Image", () => {
  it("renders with src and alt", () => {
    render(<Image src="/photo.jpg" alt="A photo" />);
    expect(screen.getByAltText("A photo")).toBeInTheDocument();
  });

  it("has loading='lazy' by default", () => {
    render(<Image src="/photo.jpg" alt="test" />);
    expect(screen.getByAltText("test")).toHaveAttribute("loading", "lazy");
  });

  it("shows skeleton while loading", () => {
    const { container } = render(<Image src="/photo.jpg" alt="test" />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("hides skeleton and shows image after load", () => {
    const { container } = render(<Image src="/photo.jpg" alt="test" />);
    const img = screen.getByAltText("test");
    fireEvent.load(img);
    expect(container.querySelector(".animate-pulse")).not.toBeInTheDocument();
    expect(img).toHaveClass("opacity-100");
  });

  it("shows fallback on error", () => {
    const { container } = render(<Image src="/bad.jpg" alt="test" />);
    const img = screen.getByAltText("test");
    fireEvent.error(img);
    // Fallback should be visible (the icon fallback container)
    expect(container.querySelector(".bg-slate-100")).toBeInTheDocument();
    // Image should be gone
    expect(screen.queryByAltText("test")).not.toBeInTheDocument();
  });

  it("shows custom fallback on error", () => {
    render(
      <Image src="/bad.jpg" alt="test" fallback={<span data-testid="custom">Oops</span>} />,
    );
    fireEvent.error(screen.getByAltText("test"));
    expect(screen.getByTestId("custom")).toHaveTextContent("Oops");
  });

  it("shows fallback when no src provided", () => {
    const { container } = render(<Image alt="empty" />);
    expect(container.querySelector(".bg-slate-100")).toBeInTheDocument();
  });

  it("calls onLoad prop", () => {
    const onLoad = vi.fn();
    render(<Image src="/photo.jpg" alt="test" onLoad={onLoad} />);
    fireEvent.load(screen.getByAltText("test"));
    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it("calls onError prop", () => {
    const onError = vi.fn();
    render(<Image src="/bad.jpg" alt="test" onError={onError} />);
    fireEvent.error(screen.getByAltText("test"));
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("forwards ref to the img element", () => {
    const ref = { current: null as HTMLImageElement | null };
    render(<Image ref={ref} src="/photo.jpg" alt="test" />);
    expect(ref.current).toBeInstanceOf(HTMLImageElement);
  });

  it("merges className on container", () => {
    const { container } = render(
      <Image src="/photo.jpg" alt="test" className="custom-cls" />,
    );
    expect(container.firstChild).toHaveClass("custom-cls");
  });

  it.each(["none", "sm", "md", "lg", "xl", "full"] as const)(
    "applies radius %s",
    (r) => {
      const radiusClass = {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-lg",
        lg: "rounded-xl",
        xl: "rounded-2xl",
        full: "rounded-full",
      }[r];
      const { container } = render(
        <Image src="/photo.jpg" alt="test" radius={r} />,
      );
      expect(container.firstChild).toHaveClass(radiusClass);
    },
  );

  it("applies width and height as inline styles", () => {
    const { container } = render(
      <Image src="/photo.jpg" alt="test" width={300} height={200} />,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("300px");
    expect(el.style.height).toBe("200px");
  });

  it("applies string width/height", () => {
    const { container } = render(
      <Image src="/photo.jpg" alt="test" width="100%" height="auto" />,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("100%");
    expect(el.style.height).toBe("auto");
  });

  it("accepts aspectRatio prop without error", () => {
    const { container } = render(
      <Image src="/photo.jpg" alt="test" aspectRatio={16 / 9} />,
    );
    // jsdom doesn't support aspectRatio CSS property, just verify it renders
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByAltText("test")).toBeInTheDocument();
  });

  it.each(["cover", "contain", "fill", "none", "scale-down"] as const)(
    "applies objectFit %s",
    (fit) => {
      render(<Image src="/photo.jpg" alt="test" objectFit={fit} />);
      const img = screen.getByAltText("test");
      const expected = `object-${fit}`;
      expect(img.className).toContain(expected);
    },
  );

  it("passes additional img attributes through", () => {
    render(
      <Image
        src="/photo.jpg"
        alt="test"
        crossOrigin="anonymous"
        decoding="async"
      />,
    );
    const img = screen.getByAltText("test");
    expect(img).toHaveAttribute("crossorigin", "anonymous");
    expect(img).toHaveAttribute("decoding", "async");
  });
});
