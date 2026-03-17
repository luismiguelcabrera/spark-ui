import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Carousel } from "../carousel";

describe("Carousel", () => {
  it("renders slides", () => {
    render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>
    );
    expect(screen.getByText("Slide 1")).toBeInTheDocument();
    expect(screen.getByText("Slide 2")).toBeInTheDocument();
  });

  it("has carousel role", () => {
    render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    );
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("renders navigation dots", () => {
    render(
      <Carousel showDots>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>
    );
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("renders navigation arrows", () => {
    render(
      <Carousel showArrows>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    );
    expect(screen.getByLabelText("Previous slide")).toBeInTheDocument();
    expect(screen.getByLabelText("Next slide")).toBeInTheDocument();
  });
});
