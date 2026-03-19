// ── Individual icon components ──
export * from "./icons";

// ── Animated icon components ──
export * from "./animated-icons";

// ── Factory ──
export { createIcon } from "./create-icon";
export type { SvgIconProps } from "./create-icon";

// ── Provider ──
export { IconProvider, useIconResolver } from "./icon-provider";
export type { IconProviderProps, IconResolver, IconComponentProps } from "./icon-provider";

// ── Registry ──
export { builtInIcons } from "./registry";
