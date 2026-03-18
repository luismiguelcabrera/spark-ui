import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ImageGrid } from "../image-grid";
import type { ImageGridItem } from "../image-grid";

const sampleImages: ImageGridItem[] = [
  { src: "/img1.jpg", alt: "Image 1" },
  { src: "/img2.jpg", alt: "Image 2" },
  { src: "/img3.jpg", alt: "Image 3" },
];

describe("ImageGrid", () => {
  it("renders all images", () => {
    render(<ImageGrid images={sampleImages} />);
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
    expect(screen.getByAltText("Image 2")).toBeInTheDocument();
    expect(screen.getByAltText("Image 3")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<ImageGrid ref={ref} images={sampleImages} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(ImageGrid.displayName).toBe("ImageGrid");
  });

  it("merges className", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<ImageGrid ref={ref} images={sampleImages} className="custom-grid" />);
    expect(ref.current?.className).toContain("custom-grid");
    expect(ref.current?.className).toContain("grid");
  });

  it("renders grid layout by default", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<ImageGrid ref={ref} images={sampleImages} />);
    expect(ref.current?.className).toContain("grid");
    expect(ref.current?.className).toContain("grid-cols-3");
  });

  it.each([2, 3, 4, 5, 6] as const)(
    "renders cols=%d",
    (cols) => {
      const ref = { current: null as HTMLDivElement | null };
      render(<ImageGrid ref={ref} images={sampleImages} cols={cols} />);
      expect(ref.current?.className).toContain(`grid-cols-${cols}`);
    }
  );

  it("calls onImageClick when an image wrapper is clicked", () => {
    const onImageClick = vi.fn();
    render(<ImageGrid images={sampleImages} onImageClick={onImageClick} />);
    const img = screen.getByAltText("Image 1");
    // Click the wrapper div (parent of Image component)
    fireEvent.click(img.closest("[class*='cursor-pointer']")!);
    expect(onImageClick).toHaveBeenCalledWith(sampleImages[0], 0);
  });

  it("does not add cursor-pointer when onImageClick is not provided", () => {
    const { container } = render(<ImageGrid images={sampleImages} />);
    const cursorPointers = container.querySelectorAll(".cursor-pointer");
    expect(cursorPointers.length).toBe(0);
  });

  it("renders empty grid when no images provided", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<ImageGrid ref={ref} images={[]} />);
    expect(ref.current).toBeTruthy();
    expect(ref.current?.children.length).toBe(0);
  });

  it("renders masonry layout when layout=masonry", () => {
    const { container } = render(
      <ImageGrid images={sampleImages} layout="masonry" />
    );
    // Masonry doesn't use CSS grid class
    expect(container.firstElementChild).toBeTruthy();
    // All images should still render
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
    expect(screen.getByAltText("Image 2")).toBeInTheDocument();
    expect(screen.getByAltText("Image 3")).toBeInTheDocument();
  });
});
