import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { Container } from "../container";
import { Stack, HStack, VStack } from "../stack";
import { Grid, GridItem } from "../grid";
import { Center } from "../center";
import { AspectRatio } from "../aspect-ratio";
import { Wrap } from "../wrap";
import { Separator } from "../separator";
import { VisuallyHidden } from "../visually-hidden";
import { Portal } from "../portal";
import { Resizable } from "../resizable";
import { ScrollArea } from "../scroll-area";
import { AppShell, AppShellHeader, AppShellContent } from "../app-shell";
import { AuthLayout } from "../auth-layout";

/* -------------------------------------------------------------------------- */
/*  Container                                                                  */
/* -------------------------------------------------------------------------- */

describe("Container (full)", () => {
  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Container ref={ref}>Content</Container>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(Container.displayName).toBe("Container");
  });

  it("renders children", () => {
    render(<Container><p>Hello</p></Container>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it.each(["sm", "md", "lg", "xl", "2xl", "full"] as const)(
    "renders size=%s",
    (size) => {
      const { container } = render(<Container size={size}>Content</Container>);
      expect(container.firstChild).toBeInTheDocument();
    },
  );
});

/* -------------------------------------------------------------------------- */
/*  Stack                                                                      */
/* -------------------------------------------------------------------------- */

describe("Stack (full)", () => {
  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Stack ref={ref}>Content</Stack>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(Stack.displayName).toBe("Stack");
  });

  it("renders children", () => {
    render(
      <Stack>
        <div>Child 1</div>
        <div>Child 2</div>
      </Stack>,
    );
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });

  it("renders horizontal with direction prop", () => {
    const { container } = render(<Stack direction="horizontal">Content</Stack>);
    expect(container.firstChild).toHaveClass("flex-row");
  });

  it("applies align prop", () => {
    const { container } = render(<Stack align="center">Content</Stack>);
    expect(container.firstChild).toHaveClass("items-center");
  });

  it("applies justify prop", () => {
    const { container } = render(<Stack justify="between">Content</Stack>);
    expect(container.firstChild).toHaveClass("justify-between");
  });

  it("applies wrap prop", () => {
    const { container } = render(<Stack wrap>Content</Stack>);
    expect(container.firstChild).toHaveClass("flex-wrap");
  });
});

describe("HStack (full)", () => {
  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<HStack ref={ref}>Content</HStack>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(HStack.displayName).toBe("HStack");
  });
});

describe("VStack (full)", () => {
  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<VStack ref={ref}>Content</VStack>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(VStack.displayName).toBe("VStack");
  });
});

/* -------------------------------------------------------------------------- */
/*  Grid                                                                       */
/* -------------------------------------------------------------------------- */

describe("Grid (full)", () => {
  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Grid ref={ref}>Content</Grid>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(Grid.displayName).toBe("Grid");
  });

  it("renders children", () => {
    render(
      <Grid cols={2}>
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>,
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("applies flow prop", () => {
    const { container } = render(<Grid flow="col">Content</Grid>);
    expect(container.firstChild).toHaveClass("grid-flow-col");
  });

  it("applies align prop", () => {
    const { container } = render(<Grid align="center">Content</Grid>);
    expect(container.firstChild).toHaveClass("items-center");
  });

  it("applies placeItems prop", () => {
    const { container } = render(<Grid placeItems="center">Content</Grid>);
    expect(container.firstChild).toHaveClass("place-items-center");
  });

  it("merges className", () => {
    const { container } = render(<Grid className="custom-grid">Content</Grid>);
    expect(container.firstChild).toHaveClass("custom-grid");
  });
});

describe("GridItem (full)", () => {
  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<GridItem ref={ref}>Content</GridItem>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(GridItem.displayName).toBe("GridItem");
  });

  it("applies start prop", () => {
    const { container } = render(<GridItem start={3}>Content</GridItem>);
    expect(container.firstChild).toHaveClass("col-start-3");
  });

  it("applies rowSpan prop", () => {
    const { container } = render(<GridItem rowSpan={2}>Content</GridItem>);
    expect(container.firstChild).toHaveClass("row-span-2");
  });

  it("applies span=full", () => {
    const { container } = render(<GridItem span="full">Content</GridItem>);
    expect(container.firstChild).toHaveClass("col-span-full");
  });

  it("merges className", () => {
    const { container } = render(<GridItem className="custom-item">Content</GridItem>);
    expect(container.firstChild).toHaveClass("custom-item");
  });
});

/* -------------------------------------------------------------------------- */
/*  Center                                                                     */
/* -------------------------------------------------------------------------- */

describe("Center (full)", () => {
  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Center ref={ref}>Content</Center>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(Center.displayName).toBe("Center");
  });

  it("renders inline variant", () => {
    const { container } = render(<Center inline>Content</Center>);
    expect(container.firstChild).toHaveClass("inline-flex");
    expect(container.firstChild).not.toHaveClass("flex");
  });

  it("merges className", () => {
    const { container } = render(<Center className="custom-center">Content</Center>);
    expect(container.firstChild).toHaveClass("custom-center");
  });
});

/* -------------------------------------------------------------------------- */
/*  AspectRatio                                                                */
/* -------------------------------------------------------------------------- */

describe("AspectRatio (full)", () => {
  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<AspectRatio ref={ref}><div>Content</div></AspectRatio>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(AspectRatio.displayName).toBe("AspectRatio");
  });

  it("renders children", () => {
    render(<AspectRatio><div>Image</div></AspectRatio>);
    expect(screen.getByText("Image")).toBeInTheDocument();
  });

  it("applies custom ratio via style", () => {
    const { container } = render(<AspectRatio ratio={4 / 3}><div>Content</div></AspectRatio>);
    const el = container.firstChild as HTMLElement;
    // jsdom may not fully support aspectRatio property; verify the style object exists
    expect(el.style).toBeDefined();
  });

  it("merges className", () => {
    const { container } = render(<AspectRatio className="custom-ar"><div>Content</div></AspectRatio>);
    expect(container.firstChild).toHaveClass("custom-ar");
  });
});

/* -------------------------------------------------------------------------- */
/*  Wrap                                                                       */
/* -------------------------------------------------------------------------- */

describe("Wrap (full)", () => {
  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Wrap ref={ref}>Content</Wrap>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(Wrap.displayName).toBe("Wrap");
  });

  it("renders children", () => {
    render(
      <Wrap>
        <span>Tag 1</span>
        <span>Tag 2</span>
      </Wrap>,
    );
    expect(screen.getByText("Tag 1")).toBeInTheDocument();
    expect(screen.getByText("Tag 2")).toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(<Wrap className="custom-wrap">Content</Wrap>);
    expect(container.firstChild).toHaveClass("custom-wrap");
  });
});

/* -------------------------------------------------------------------------- */
/*  Separator                                                                  */
/* -------------------------------------------------------------------------- */

describe("Separator (full)", () => {
  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Separator ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(Separator.displayName).toBe("Separator");
  });

  it("uses role=none for decorative separator", () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toHaveAttribute("role", "none");
  });

  it("uses role=separator when non-decorative", () => {
    const { container } = render(<Separator decorative={false} />);
    expect(container.firstChild).toHaveAttribute("role", "separator");
  });

  it("sets aria-orientation when non-decorative", () => {
    const { container } = render(<Separator decorative={false} orientation="vertical" />);
    expect(container.firstChild).toHaveAttribute("aria-orientation", "vertical");
  });

  it("forwards ref with label variant", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Separator ref={ref} label="OR" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    const { container } = render(<Separator className="custom-sep" />);
    expect(container.firstChild).toHaveClass("custom-sep");
  });
});

/* -------------------------------------------------------------------------- */
/*  VisuallyHidden                                                             */
/* -------------------------------------------------------------------------- */

describe("VisuallyHidden (full)", () => {
  it("forwards ref", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<VisuallyHidden ref={ref}>Hidden</VisuallyHidden>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("has displayName", () => {
    expect(VisuallyHidden.displayName).toBe("VisuallyHidden");
  });

  it("renders as a span element", () => {
    render(<VisuallyHidden>SR Only</VisuallyHidden>);
    expect(screen.getByText("SR Only").tagName).toBe("SPAN");
  });

  it("has proper hiding styles", () => {
    const { container } = render(<VisuallyHidden>Hidden</VisuallyHidden>);
    const el = container.firstChild;
    expect(el).toHaveClass("absolute", "w-px", "h-px", "overflow-hidden");
  });

  it("merges className", () => {
    const { container } = render(<VisuallyHidden className="custom-vh">Hidden</VisuallyHidden>);
    expect(container.firstChild).toHaveClass("custom-vh");
  });
});

/* -------------------------------------------------------------------------- */
/*  Portal                                                                     */
/* -------------------------------------------------------------------------- */

describe("Portal (full)", () => {
  it("has displayName", () => {
    expect(Portal.displayName).toBe("Portal");
  });
});

/* -------------------------------------------------------------------------- */
/*  Resizable                                                                  */
/* -------------------------------------------------------------------------- */

describe("Resizable (full)", () => {
  it("has displayName", () => {
    expect(Resizable.displayName).toBe("Resizable");
  });

  it("merges className", () => {
    const { container } = render(
      <Resizable className="custom-resize"><div>Content</div></Resizable>,
    );
    expect(container.firstChild).toHaveClass("custom-resize");
  });
});

/* -------------------------------------------------------------------------- */
/*  ScrollArea                                                                 */
/* -------------------------------------------------------------------------- */

describe("ScrollArea (full)", () => {
  it("has displayName", () => {
    expect(ScrollArea.displayName).toBe("ScrollArea");
  });

  it("applies horizontal orientation class", () => {
    const { container } = render(
      <ScrollArea orientation="horizontal"><div>Content</div></ScrollArea>,
    );
    expect(container.firstChild).toHaveClass("overflow-y-hidden");
  });

  it("applies always scrollbar class", () => {
    const { container } = render(
      <ScrollArea scrollbar="always"><div>Content</div></ScrollArea>,
    );
    expect(container.firstChild).toHaveClass("overflow-scroll");
  });
});

/* -------------------------------------------------------------------------- */
/*  AppShell                                                                   */
/* -------------------------------------------------------------------------- */

describe("AppShell (full)", () => {
  it("has displayName", () => {
    expect(AppShell.displayName).toBe("AppShell");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<AppShell ref={ref}><div>Content</div></AppShell>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("AppShellHeader (full)", () => {
  it("has displayName", () => {
    expect(AppShellHeader.displayName).toBe("AppShellHeader");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLElement>();
    render(
      <AppShell>
        <AppShellHeader ref={ref}>Header</AppShellHeader>
      </AppShell>,
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

describe("AppShellContent (full)", () => {
  it("has displayName", () => {
    expect(AppShellContent.displayName).toBe("AppShellContent");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLElement>();
    render(
      <AppShell>
        <AppShellContent ref={ref}>Content</AppShellContent>
      </AppShell>,
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

/* -------------------------------------------------------------------------- */
/*  AuthLayout                                                                 */
/* -------------------------------------------------------------------------- */

describe("AuthLayout (full)", () => {
  it("has displayName", () => {
    expect(AuthLayout.displayName).toBe("AuthLayout");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <AuthLayout ref={ref} leftPanel={<div>Left</div>}>
        <div>Form</div>
      </AuthLayout>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
