import type { Meta } from "@storybook/react-vite";
import { Container } from "./container";
import { Stack, HStack, VStack } from "./stack";
import { Grid, GridItem } from "./grid";
import { Center } from "./center";
import { AspectRatio } from "./aspect-ratio";
import { Wrap } from "./wrap";
import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";
import { Badge } from "../data-display/badge";

export default {
  title: "Layout/Primitives",
  tags: ["autodocs"],
} as Meta;

const Box = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm font-medium text-primary text-center ${className}`}
  >
    {children}
  </div>
);

// --- Stack ---

export const StackVertical = {
  render: () => (
    <Stack gap="4">
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const StackHorizontal = {
  render: () => (
    <HStack gap="4" align="center">
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </HStack>
  ),
};

export const StackWithJustify = {
  render: () => (
    <HStack gap="4" justify="between" align="center" className="w-full">
      <Box>Left</Box>
      <Box>Center</Box>
      <Box>Right</Box>
    </HStack>
  ),
};

export const VStackDemo = {
  render: () => (
    <VStack gap="3" align="center">
      <Box className="w-32">First</Box>
      <Box className="w-48">Second</Box>
      <Box className="w-24">Third</Box>
    </VStack>
  ),
};

// --- Grid ---

export const GridLayout = {
  render: () => (
    <Grid cols={3} gap="4">
      <Box>1</Box>
      <Box>2</Box>
      <Box>3</Box>
      <GridItem span={2}>
        <Box>Spans 2 columns</Box>
      </GridItem>
      <Box>5</Box>
    </Grid>
  ),
};

export const GridResponsive = {
  render: () => (
    <Grid cols={4} gap="4" rowGap="6">
      {Array.from({ length: 8 }, (_, i) => (
        <Box key={i}>Cell {i + 1}</Box>
      ))}
    </Grid>
  ),
};

export const GridSpanning = {
  render: () => (
    <Grid cols={4} gap="4">
      <GridItem span={2} rowSpan={2}>
        <Box className="h-full">2x2 Feature</Box>
      </GridItem>
      <Box>A</Box>
      <Box>B</Box>
      <Box>C</Box>
      <Box>D</Box>
    </Grid>
  ),
};

// --- Center ---

export const CenterContent = {
  render: () => (
    <Center className="h-48 bg-slate-50 rounded-xl border border-dashed border-slate-300">
      <div className="text-sm text-slate-500">Centered content</div>
    </Center>
  ),
};

export const CenterInline = {
  render: () => (
    <div className="space-y-2">
      <p className="text-sm text-slate-600">
        Text with an inline centered element:
        <Center inline className="mx-2 h-8 w-8 rounded-full bg-primary text-white text-xs font-bold">
          42
        </Center>
        embedded in a paragraph.
      </p>
    </div>
  ),
};

// --- AspectRatio ---

export const AspectRatioDemo = {
  render: () => (
    <div className="max-w-sm">
      <AspectRatio ratio={16 / 9}>
        <div className="w-full h-full bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold">
          16:9
        </div>
      </AspectRatio>
    </div>
  ),
};

export const AspectRatioVariants = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {[
        { ratio: 1, label: "1:1" },
        { ratio: 4 / 3, label: "4:3" },
        { ratio: 16 / 9, label: "16:9" },
      ].map(({ ratio, label }) => (
        <AspectRatio key={label} ratio={ratio}>
          <div className="w-full h-full bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-sm font-mono text-slate-500">
            {label}
          </div>
        </AspectRatio>
      ))}
    </div>
  ),
};

// --- Wrap ---

export const WrapLayout = {
  render: () => (
    <Wrap gap="2">
      {[
        "React",
        "TypeScript",
        "Tailwind",
        "Storybook",
        "Vitest",
        "ESLint",
        "Prettier",
      ].map((tag) => (
        <Badge key={tag} variant="primary">
          {tag}
        </Badge>
      ))}
    </Wrap>
  ),
};

export const WrapWithGap = {
  render: () => (
    <div className="space-y-6">
      {(["1", "2", "4", "6"] as const).map((gap) => (
        <div key={gap}>
          <p className="text-xs text-slate-400 mb-2 font-mono">gap=&quot;{gap}&quot;</p>
          <Wrap gap={gap}>
            {Array.from({ length: 8 }, (_, i) => (
              <Box key={i} className="px-4">
                Item {i + 1}
              </Box>
            ))}
          </Wrap>
        </div>
      ))}
    </div>
  ),
};

// --- Separator ---

export const SeparatorDemo = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <p className="text-sm text-slate-600">Content above</p>
      <Separator />
      <p className="text-sm text-slate-600">Content below</p>
      <Separator label="OR" />
      <p className="text-sm text-slate-600">Alternative content</p>
    </div>
  ),
};

export const SeparatorVertical = {
  render: () => (
    <div className="flex items-center gap-4 h-8">
      <span className="text-sm text-slate-600">Home</span>
      <Separator orientation="vertical" />
      <span className="text-sm text-slate-600">Settings</span>
      <Separator orientation="vertical" />
      <span className="text-sm text-slate-600">Profile</span>
    </div>
  ),
};

// --- ScrollArea ---

export const ScrollAreaDemo = {
  render: () => (
    <ScrollArea maxHeight={200} className="border rounded-xl p-4">
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className="py-2 border-b border-slate-100 last:border-0 text-sm text-slate-600"
        >
          Item {i + 1}
        </div>
      ))}
    </ScrollArea>
  ),
};

export const ScrollAreaHidden = {
  render: () => (
    <ScrollArea maxHeight={160} scrollbar="hidden" className="border rounded-xl p-4">
      {Array.from({ length: 15 }, (_, i) => (
        <div
          key={i}
          className="py-2 border-b border-slate-100 last:border-0 text-sm text-slate-600"
        >
          Scrollable item {i + 1} (hidden scrollbar)
        </div>
      ))}
    </ScrollArea>
  ),
};

// --- Container ---

export const ContainerSizes = {
  render: () => (
    <div className="space-y-4">
      {(["sm", "md", "lg", "xl", "2xl"] as const).map((size) => (
        <Container key={size} size={size} className="bg-slate-50 p-2 rounded-lg">
          <div className="bg-white p-3 rounded text-xs text-center font-mono border">
            {size}
          </div>
        </Container>
      ))}
    </div>
  ),
};
