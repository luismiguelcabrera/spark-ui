import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Galleria, type GalleriaImage } from "../galleria";

const images: GalleriaImage[] = [
  { src: "/img1.jpg", alt: "Image 1", caption: "First image", thumbnail: "/img1-thumb.jpg" },
  { src: "/img2.jpg", alt: "Image 2", caption: "Second image", thumbnail: "/img2-thumb.jpg" },
  { src: "/img3.jpg", alt: "Image 3", caption: "Third image", thumbnail: "/img3-thumb.jpg" },
  { src: "/img4.jpg", alt: "Image 4", caption: "Fourth image" },
];

// Helper to get the main (non-thumbnail) image by alt text
function getMainImage(altText: string) {
  // Main images have object-contain class, thumbnails have role="presentation"
  const allImages = screen.getAllByRole("img", { hidden: true });
  // Also try direct query — main image will be the one with object-contain
  return screen.getByAltText(altText);
}

describe("Galleria", () => {
  it("renders without error", () => {
    render(<Galleria images={images} />);
    // Main image alt text should be present
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });

  it("renders empty state when no images", () => {
    render(<Galleria images={[]} />);
    expect(screen.getByText("No images")).toBeInTheDocument();
  });

  it("shows the first image by default", () => {
    render(<Galleria images={images} />);
    const img = screen.getByAltText("Image 1") as HTMLImageElement;
    expect(img.src).toContain("/img1.jpg");
  });

  it("shows the image at defaultValue index", () => {
    render(<Galleria images={images} defaultValue={2} />);
    const img = screen.getByAltText("Image 3") as HTMLImageElement;
    expect(img.src).toContain("/img3.jpg");
  });

  describe("navigation", () => {
    it("navigates to next image on next button click", async () => {
      const user = userEvent.setup();
      render(<Galleria images={images} />);
      await user.click(screen.getByLabelText("Next image"));
      expect(screen.getByAltText("Image 2")).toBeInTheDocument();
    });

    it("navigates to previous image on prev button click", async () => {
      const user = userEvent.setup();
      render(<Galleria images={images} defaultValue={2} />);
      await user.click(screen.getByLabelText("Previous image"));
      expect(screen.getByAltText("Image 2")).toBeInTheDocument();
    });

    it("disables prev button at first image (non-circular)", () => {
      render(<Galleria images={images} />);
      expect(screen.getByLabelText("Previous image")).toBeDisabled();
    });

    it("disables next button at last image (non-circular)", () => {
      render(<Galleria images={images} defaultValue={3} />);
      expect(screen.getByLabelText("Next image")).toBeDisabled();
    });

    it("wraps around in circular mode", async () => {
      const user = userEvent.setup();
      render(<Galleria images={images} defaultValue={3} circular />);
      await user.click(screen.getByLabelText("Next image"));
      expect(screen.getByAltText("Image 1")).toBeInTheDocument();
    });

    it("wraps around backward in circular mode", async () => {
      const user = userEvent.setup();
      render(<Galleria images={images} circular />);
      await user.click(screen.getByLabelText("Previous image"));
      expect(screen.getByAltText("Image 4")).toBeInTheDocument();
    });

    it("hides navigation when showNavigation=false", () => {
      render(<Galleria images={images} showNavigation={false} />);
      expect(screen.queryByLabelText("Previous image")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Next image")).not.toBeInTheDocument();
    });
  });

  describe("thumbnails", () => {
    it("renders thumbnails by default", () => {
      render(<Galleria images={images} />);
      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(4);
    });

    it("highlights active thumbnail", () => {
      render(<Galleria images={images} defaultValue={1} />);
      const tabs = screen.getAllByRole("tab");
      expect(tabs[1]).toHaveAttribute("aria-selected", "true");
      expect(tabs[0]).toHaveAttribute("aria-selected", "false");
    });

    it("navigates on thumbnail click", async () => {
      const user = userEvent.setup();
      render(<Galleria images={images} />);
      const tabs = screen.getAllByRole("tab");
      await user.click(tabs[2]);
      expect(screen.getByAltText("Image 3")).toBeInTheDocument();
    });

    it("hides thumbnails when showThumbnails=false", () => {
      render(<Galleria images={images} showThumbnails={false} />);
      expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    });

    it("uses thumbnail src when provided", () => {
      render(<Galleria images={images} />);
      // Thumbnail images have role="presentation" and empty alt
      const tabs = screen.getAllByRole("tab");
      const thumbImg = tabs[0].querySelector("img") as HTMLImageElement;
      expect(thumbImg.src).toContain("/img1-thumb.jpg");
    });

    it("falls back to main src when no thumbnail", () => {
      render(<Galleria images={images} />);
      const tabs = screen.getAllByRole("tab");
      const thumbImg = tabs[3].querySelector("img") as HTMLImageElement;
      expect(thumbImg.src).toContain("/img4.jpg");
    });
  });

  describe("indicators", () => {
    it("shows dot indicators when showIndicators=true", () => {
      render(<Galleria images={images} showIndicators />);
      const dots = screen.getAllByLabelText(/Go to image/);
      expect(dots).toHaveLength(4);
    });

    it("navigates on indicator click", async () => {
      const user = userEvent.setup();
      render(<Galleria images={images} showIndicators />);
      await user.click(screen.getByLabelText("Go to image 3"));
      expect(screen.getByAltText("Image 3")).toBeInTheDocument();
    });

    it("does not show indicators by default", () => {
      render(<Galleria images={images} />);
      expect(screen.queryByLabelText("Go to image 1")).not.toBeInTheDocument();
    });
  });

  describe("caption", () => {
    it("shows caption when showCaption=true", () => {
      render(<Galleria images={images} showCaption />);
      expect(screen.getByText("First image")).toBeInTheDocument();
    });

    it("does not show caption by default", () => {
      render(<Galleria images={images} />);
      expect(screen.queryByText("First image")).not.toBeInTheDocument();
    });
  });

  describe("autoplay", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("auto-advances images when autoplay=true", () => {
      render(<Galleria images={images} autoplay autoplayInterval={1000} />);
      expect(screen.getByAltText("Image 1")).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByAltText("Image 2")).toBeInTheDocument();
    });

    it("uses default interval of 3000ms", () => {
      render(<Galleria images={images} autoplay />);
      expect(screen.getByAltText("Image 1")).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(2999);
      });
      expect(screen.getByAltText("Image 1")).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.getByAltText("Image 2")).toBeInTheDocument();
    });
  });

  describe("keyboard navigation", () => {
    it("navigates with arrow keys", () => {
      render(<Galleria images={images} />);
      const gallery = screen.getByRole("region");
      gallery.focus();

      // Find the inner container that has the keydown listener
      const innerContainer = gallery.firstElementChild as HTMLElement;

      fireEvent.keyDown(innerContainer, { key: "ArrowRight" });
      expect(screen.getByAltText("Image 2")).toBeInTheDocument();

      fireEvent.keyDown(innerContainer, { key: "ArrowLeft" });
      expect(screen.getByAltText("Image 1")).toBeInTheDocument();
    });
  });

  describe("fullscreen", () => {
    it("renders fullscreen when fullscreen=true", () => {
      render(<Galleria images={images} fullscreen />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
    });

    it("shows exit fullscreen button in fullscreen mode", () => {
      render(<Galleria images={images} fullscreen />);
      expect(screen.getByLabelText("Exit fullscreen")).toBeInTheDocument();
    });

    it("shows image counter in fullscreen", () => {
      render(<Galleria images={images} fullscreen />);
      expect(screen.getByText("1 / 4")).toBeInTheDocument();
    });
  });

  describe("controlled mode", () => {
    it("uses value prop for active index", () => {
      render(<Galleria images={images} value={2} />);
      expect(screen.getByAltText("Image 3")).toBeInTheDocument();
    });

    it("calls onChange when navigating", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Galleria images={images} value={0} onChange={onChange} />);
      await user.click(screen.getByLabelText("Next image"));
      expect(onChange).toHaveBeenCalledWith(1);
    });
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Galleria ref={ref} images={images} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Galleria ref={ref} images={images} className="custom-gallery" />);
    expect(ref.current).toHaveClass("custom-gallery");
  });

  it("has aria-live region for announcements", () => {
    const { container } = render(<Galleria images={images} />);
    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();
  });

  it("renders single image without navigation", () => {
    render(<Galleria images={[images[0]]} />);
    expect(screen.queryByLabelText("Previous image")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Next image")).not.toBeInTheDocument();
  });
});
