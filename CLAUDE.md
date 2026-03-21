# Spark UI — Component Library

React UI component library built with TypeScript, Tailwind CSS, and CVA.

## Commands

```bash
pnpm build          # Build library (tsup → dist/)
pnpm dev            # Build in watch mode
pnpm test           # Run tests (vitest)
pnpm test:watch     # Watch mode
pnpm lint           # ESLint
pnpm typecheck      # TypeScript type checking
pnpm storybook      # Dev server on :6006
pnpm build-storybook # Static build
```

## Project Structure

```
src/
├── components/
│   ├── forms/         # Button, Input, Select, Checkbox, Toggle, Slider, NumberInput, TagInput, Switch, ToggleGroup, ColorPicker, DateRangePicker, TimePicker, PinInput, CopyButton, Toolbar, Form (compound), PhoneInput, Autocomplete, CurrencyInput, CodeInput, JsonInput, CronInput, Signature, ImageCrop, etc. (60+ components)
│   ├── feedback/      # Spinner, Modal, Toast, Drawer, AlertDialog, Sheet, ContextMenu, HoverCard, Snackbar, CircularProgress, SpeedDial, etc. (22 components)
│   ├── data-display/  # Badge, Card, Avatar, Icon, Heading, Text, Code, Kbd, Timeline, TreeView, Carousel, Countdown, Table, Chip, etc. (34 components)
│   ├── navigation/    # Tabs, Accordion, Pagination, Navbar, BottomNav, Menubar, NavigationMenu, Link, SkipNav, etc. (11 components)
│   └── layout/        # ThemeProvider, AppShell, Sidebar, Container, Stack, Grid, Center, AspectRatio, Wrap, Separator, ScrollArea, Resizable, Portal, VisuallyHidden, etc. (17 components)
├── icons/
│   ├── icons.tsx      # 160+ SVG icon components (createIcon factory)
│   ├── registry.ts    # String name → component map (kebab + snake_case)
│   ├── icon-provider.tsx  # IconProvider context for custom icon sets
│   ├── create-icon.tsx    # createIcon() factory for new icons
│   └── index.ts       # Barrel export
├── hooks/             # 27 hooks: useControllable, useMediaQuery, useDebounce, useClickOutside, useClipboard, useDisclosure, useLocalStorage, useIntersectionObserver, useKeyboardShortcut, usePrefersReducedMotion, useToggle, useFocusTrap, useScrollLock, useBreakpoint, useIsomorphicId, useToast, usePrevious, useThrottle, useWindowSize, useHover, useForm, useFieldArray, useWatch, useFormGuard, useAutosave, useElevation
├── lib/               # cn(), Slot, theme-tokens, styles
├── test/              # Test setup, a11y tests
└── theme.css          # Default CSS variables + keyframes
```

## Component Standards

Every component in this library MUST follow these rules. They were derived from the production-grade Button and Spinner components.

### 1. Separate Style from Color

Never mix visual style and color palette in a single prop. Use orthogonal dimensions:

- **`variant`** — controls fill/style (solid, outline, ghost, soft, link)
- **`color`** — controls palette (primary, secondary, destructive, success, warning, accent)

This gives N×M combinations from two props instead of N*M flat variants.

When defining the color matrix, use a `Record<Color, Record<Variant, string>>` map:

```tsx
const colorMap: Record<Color, Record<string, string>> = {
  primary: { solid: "bg-primary text-white ...", outline: "border text-primary ...", ... },
  ...
};
```

### 2. Size Scale

Use a consistent size scale across all components: `xs`, `sm`, `md`, `lg`, `xl`.

- Default to `md`
- Child elements (icons, spinners) should scale with the parent size via a size map
- Export the size type from the component

### 3. WCAG AA Color Contrast

All text/background combinations MUST pass WCAG AA (≥ 4.5:1 contrast ratio).

- Light backgrounds (amber, yellow) use dark text (`text-amber-950`), not white
- Verify with a contrast checker before shipping
- Run `jest-axe` tests against all component stories

### 4. Accessibility

- **Interactive elements**: Use semantic HTML (`<button>`, `<input>`, not `<div onClick>`)
- **`type="button"`**: Default on all `<button>` elements to prevent form submission
- **ARIA**: `role`, `aria-label`, `aria-expanded`, `aria-checked`, `aria-busy`, `aria-selected` where applicable
- **Focus**: `focus-visible:ring-2 focus-visible:ring-offset-2` on all interactive components, ring color matches the component's color
- **Disabled**: `disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none`
- **Dev warnings**: `console.warn` in dev mode for common mistakes (e.g., icon-only buttons without `aria-label`)
- **`prefers-reduced-motion`**: Animated components must respect this. Keyframes live in `theme.css` with a global reduced-motion rule

### 5. forwardRef + displayName

All components that render a native element must use `forwardRef` and set `displayName`:

```tsx
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => { ... });
Button.displayName = "Button";
```

### 6. className Merging

Always accept `className` and merge with `cn()` (clsx + tailwind-merge). Place `className` LAST so consumer overrides win:

```tsx
className={cn(baseClasses, variantClasses, className)}
```

### 7. asChild (Polymorphism)

Interactive components should support `asChild` via the `Slot` utility (`src/lib/slot.tsx`):

```tsx
<Button asChild><a href="/page">Link</a></Button>
```

### 8. Controlled + Uncontrolled

Use `useControllable` hook for components with toggleable state:

```tsx
const [value, setValue] = useControllable({ value: prop, defaultValue, onChange });
```

### 9. Loading State

Components with async actions should support:

- `loading` — shows spinner, disables interaction, sets `aria-busy`
- `loadingText` — replaces children text
- `loadingPlacement` — `"start"` | `"end"`

### 10. Theme Integration

- Use CSS variable colors for **all** colors — brand (`bg-primary`, `text-secondary`) and semantic (`bg-success`, `text-destructive`, `bg-muted`, `text-muted-foreground`)
- `theme.css` ships `--color-success`, `--color-warning`, `--color-destructive`, `--color-muted`, `--color-muted-foreground` with light/dark defaults under `.dark`
- Use `bg-surface` / `ring-surface` for elements that must match the page background in both light and dark mode
- For color tints, use opacity modifier: `bg-success/15 text-success` (15% opacity background + full text)
- **Do not hardcode Tailwind colors** (e.g., `bg-red-100`, `text-gray-600`) for anything that should adapt to dark mode — use the CSS variables instead
- **`--color-secondary` inverts between modes** (dark navy in light, light in dark) — do NOT use it for backgrounds, progress bars, or UI chrome. Use `muted-foreground` for neutral interactive elements instead. `secondary` is only suitable for heading/text color.
- **Storybook `@theme` registration**: When adding a new CSS variable to `theme.css`, you MUST also register it in `.storybook/storybook.css` `@theme` block. Without this, Tailwind v4 cannot generate the utility class (e.g., `bg-muted` won't work unless `--color-muted` is in `@theme`).
- Consumers override any color via CSS: `:root { --color-success: #22c55e; }` / `.dark { --color-success: #4ade80; }`
- Custom keyframes go in `theme.css`, not injected at runtime

### 11. Exports

Each component category has a barrel `index.ts`. Export:

- The component function
- The CVA variants (if applicable): `buttonVariants`
- The props type: `ButtonProps`
- Any sub-types: `ButtonColor`, `SpinnerType`

### 12. Testing

Each component needs:

1. **Unit tests** in `__tests__/` next to the component
2. **axe a11y test** in `src/test/a11y.test.tsx`
3. **Storybook stories** colocated with the component

Test coverage expectations:
- Every variant/size/color renders without error
- Interactive behavior (click, toggle, keyboard)
- ARIA attributes are correct
- Ref forwarding works
- Edge cases (disabled, loading, empty)
- Use `it.each` for variant/size/color matrix tests

### 13. Stories

- Use `satisfies Meta<typeof Component>`
- Set `tags: ["autodocs"]`
- Use `argTypes` with `control: "select"` for enum props
- Gallery stories should pass `args` through: `render: (args) => ...` so controls work
- Include combination stories showing real-world usage

### 14. Icon System

The library ships its own SVG icon set (160+ icons) with a 3-tier resolution system:

1. **Consumer's `IconProvider` resolver** — global override for any icon set (Lucide, Heroicons, etc.)
2. **Built-in SVG icons** — tree-shakeable, zero dependencies
3. **Material Symbols font fallback** — for unknown icon names (legacy)

Rules for icons:
- All SVG icons use `createIcon()` factory from `src/icons/create-icon.tsx`
- Icons use `currentColor` for stroke/fill — inheriting color from parent
- Icons are `aria-hidden="true"` by default (decorative). When used standalone, the parent must provide `aria-label`
- The registry (`src/icons/registry.ts`) maps both kebab-case (`chevron-left`) and Material Symbols snake_case (`chevron_left`) to the same component
- New icons go in `src/icons/icons.tsx`, then register in `src/icons/registry.ts`
- Consumers create custom icons with `createIcon("MyIcon", <path d="..." />)`

When a component uses `<Icon name="...">` internally (Button, Pagination, Modal close, etc.), it resolves through the same 3-tier system. This means consumers can swap the entire icon set globally via `<IconProvider resolver={...}>`.

### 15. File Organization

- Component: `src/components/{category}/{name}.tsx`
- Tests: `src/components/{category}/__tests__/{name}.test.tsx`
- Stories: `src/components/{category}/{name}.stories.tsx`
- Compound components (e.g., ButtonGroup): separate file, same directory
- Icons: `src/icons/icons.tsx` (all SVGs), `src/icons/registry.ts` (name mappings)
- Icon stories: `src/icons/icons.stories.tsx`
- Icon tests: `src/icons/__tests__/icons.test.tsx`

### 16. Compound Form System

The library ships a compound `Form` component with auto-binding, validation, multi-step, and field arrays.

**Compound components** (`Form.*`):
- `Form.Field` — auto-binds value/onChange/onBlur via cloneElement or render prop. Supports shorthand `rules`, `hideError`, `validateOn`, `deps`, `showCounter`, `showSuccess`, `transform`
- `Form.FieldArray` — dynamic repeatable rows via `useFieldArray` with item-level error tracking
- `Form.Submit` — auto-loading submit button with `disableWhenInvalid`
- `Form.Reset` — reset button with optional `confirm` dialog
- `Form.Error` — form-level error (plain text default, render prop for custom)
- `Form.ErrorSummary` — WCAG aria-live error list with anchor links to fields
- `Form.Message` — field-level error rendered anywhere in the tree
- `Form.Watch` — render prop for reactive field observation (memoized with shallow equality)
- `Form.If` — conditional rendering based on field value (`is`, `oneOf`, `when`)
- `Form.Group` — semantic `<fieldset>` + `<legend>` for related fields
- `Form.Steps` / `Form.Step` — multi-step wizard with async validation
- `Form.Debug` — dev-only form state overlay

**Hooks:**
- `useForm` — form state management with `persist`, `transform`, `resolver`, nested dot-notation paths
- `useFieldArray` — dynamic arrays with stable IDs, append/remove/move/swap, item-level errors
- `useWatch` — read specific field values from form
- `useFormSteps` — multi-step navigation within Form.Steps
- `useFormGuard` — dirty navigation guard (beforeunload)
- `useAutosave` — debounced autosave on form changes
- `useFormField` — context-based field binding (alternative to cloneElement)
- `useFormContext` / `useFormContextSafe` — access form context (throwing vs null-returning)

**Resolvers** (`src/lib/resolvers.ts`):
- `zodResolver(schema)` — zero-dependency, duck-types zod's `safeParse`
- `yupResolver(schema)` — zero-dependency, duck-types yup's `validateSync`

**Architecture notes:**
- Form component delegates to `form.validateAsync()` for all validation (no duplication)
- `formError` state lives in useForm, Form component reads it via context (single source of truth)
- FormFieldContext includes `value`/`onChange`/`onBlur` for context-based binding via `useFormField()`
- `useFormContextSafe()` returns null instead of throwing (used by FormField for standalone mode)
- Shorthand `rules` are resolved to full `ValidationRule` using `useLocale().t()` for locale-aware messages
- Form.* locale keys are in `default-messages.ts` and all 8 locale packs (en, es, fr, de, pt, ar, ja, zh)
- Nested dot-notation paths (e.g., `address.city`) work in register, setFieldValue, getFieldState via `getByPath`/`setByPath` helpers
