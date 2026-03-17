import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Container } from "../container";
import { Stack, HStack, VStack } from "../stack";
import { Grid, GridItem } from "../grid";
import { Center } from "../center";
import { AspectRatio } from "../aspect-ratio";
import { Wrap } from "../wrap";
import { Separator } from "../separator";
import { VisuallyHidden } from "../visually-hidden";

describe("Container", () => {
  it("renders with max width", () => {
    const { container } = render(<Container size="lg">Content</Container>);
    expect(container.firstChild).toHaveClass("max-w-screen-lg");
  });

  it("applies className", () => {
    const { container } = render(<Container className="custom">Content</Container>);
    expect(container.firstChild).toHaveClass("custom");
  });
});

describe("Stack", () => {
  it("renders vertical by default", () => {
    const { container } = render(<Stack>Content</Stack>);
    expect(container.firstChild).toHaveClass("flex-col");
  });

  it("renders horizontal with row prop", () => {
    const { container } = render(<Stack row>Content</Stack>);
    expect(container.firstChild).toHaveClass("flex-row");
  });
});

describe("HStack", () => {
  it("renders horizontal", () => {
    const { container } = render(<HStack>Content</HStack>);
    expect(container.firstChild).toHaveClass("flex-row");
  });
});

describe("VStack", () => {
  it("renders vertical", () => {
    const { container } = render(<VStack>Content</VStack>);
    expect(container.firstChild).toHaveClass("flex-col");
  });
});

describe("Grid", () => {
  it("renders with columns", () => {
    const { container } = render(<Grid cols={3}>Content</Grid>);
    expect(container.firstChild).toHaveClass("grid-cols-3");
  });
});

describe("GridItem", () => {
  it("renders with span", () => {
    const { container } = render(<GridItem span={2}>Content</GridItem>);
    expect(container.firstChild).toHaveClass("col-span-2");
  });
});

describe("Center", () => {
  it("renders with centering classes", () => {
    const { container } = render(<Center>Content</Center>);
    expect(container.firstChild).toHaveClass("flex", "items-center", "justify-center");
  });
});

describe("AspectRatio", () => {
  it("renders with aspect ratio style", () => {
    const { container } = render(<AspectRatio ratio={16/9}><div>Content</div></AspectRatio>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.aspectRatio).toBeDefined();
  });
});

describe("Wrap", () => {
  it("renders with flex-wrap", () => {
    const { container } = render(<Wrap>Content</Wrap>);
    expect(container.firstChild).toHaveClass("flex-wrap");
  });
});

describe("Separator", () => {
  it("renders horizontal by default", () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toHaveClass("h-px");
  });

  it("renders vertical", () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect(container.firstChild).toHaveClass("w-px");
  });

  it("renders with label", () => {
    render(<Separator label="OR" />);
    expect(screen.getByText("OR")).toBeInTheDocument();
  });
});

describe("VisuallyHidden", () => {
  it("renders content", () => {
    render(<VisuallyHidden>Hidden text</VisuallyHidden>);
    expect(screen.getByText("Hidden text")).toBeInTheDocument();
  });

  it("has clip styles for visual hiding", () => {
    const { container } = render(<VisuallyHidden>Hidden</VisuallyHidden>);
    expect(container.firstChild).toHaveClass("absolute", "overflow-hidden");
  });
});
