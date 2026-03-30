/**
 * Shared style presets for the SpeakUp design system.
 *
 * Usage:
 *   import { s } from "@/lib/styles";
 *   import { cn } from "@/lib/utils";
 *   <div className={cn(s.page, "py-16 px-6")}>
 *
 * Presets define visual identity (colors, borders, shadows, typography).
 * Contextual layout (margins, padding, grid) stays inline in the consumer.
 */

export const s = {
  // ---- Layouts ----
  page: "min-h-screen bg-background-subtle",
  pageContent: "mx-auto max-w-3xl",
  shell: "flex h-screen bg-light",
  shellPanel: "flex-1 flex flex-col overflow-hidden",
  shellHeader:
    "flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100",
  shellContent: "flex-1 overflow-y-auto custom-scrollbar px-4 py-4 md:p-8",

  // ---- Typography ----
  title: "font-bold text-secondary tracking-tight",
  titleDisplay:
    "font-black text-secondary dark:text-white leading-[1.1] tracking-tight",
  sectionLabel:
    "text-xs font-bold text-gray-400 uppercase tracking-wider",
  navLabel: "text-sm font-medium",
  textPrimary: "text-sm font-semibold text-gray-800",
  textSecondary: "text-xs text-text-secondary",
  textMuted: "text-xs text-gray-400",
  textSubtle: "text-gray-300",
  textBody: "text-sm text-slate-600 font-medium",
  textLabel: "text-sm font-medium text-gray-700",
  cardTitle: "text-lg font-bold text-secondary",
  statValue: "text-3xl font-bold text-navy-text",
  statLabel: "text-sm font-medium text-slate-500",

  // ---- Cards ----
  cardBase: "bg-surface border border-gray-100 shadow-soft rounded-2xl",
  cardInteractive:
    "bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group",
  cardGlass: "glass-panel shadow-glass rounded-2xl",
  cardElevated: "bg-surface shadow-float rounded-2xl",
  cardOutline: "bg-surface border border-gray-200 rounded-2xl",
  cardSection:
    "glass-card flex flex-col rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-colors",

  // ---- Icon boxes ----
  iconBrand:
    "rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white shadow-lg shadow-primary/20",
  iconBox:
    "flex items-center justify-center rounded-xl",
  iconInteractive:
    "rounded-lg bg-gray-50 group-hover:bg-primary/10 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors",

  // ---- Inputs ----
  inputBase:
    "w-full px-4 h-12 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 transition-colors",
  inputFocus:
    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
  inputDisabled: "disabled:opacity-50 disabled:cursor-not-allowed",
  searchInputField:
    "block w-full pl-11 pr-4 py-2.5 border-none rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary/20 text-[15px] shadow-sm transition-all",

  // ---- Interactive / Hover ----
  hoverPrimary: "group-hover:text-primary transition-colors",
  hoverElevate: "hover:shadow-md hover:-translate-y-0.5 transition-all",
  hoverScale: "group-hover:scale-110 transition-transform",
  interactive: "transition-all cursor-pointer",
  disabled: "disabled:opacity-50 disabled:cursor-not-allowed",

  // ---- Navigation ----
  navItem:
    "flex items-center gap-3 px-3 py-3 rounded-r-xl transition-all group",
  navItemActive: "nav-item-active",
  navItemInactive: "nav-item-inactive",
  navIcon: "group-hover:scale-110 transition-transform",

  // ---- Sidebar ----
  sidebar: "w-[260px] h-full sidebar-light flex flex-col shrink-0",
  sidebarLogo: "px-5 pt-6 pb-4",
  sidebarNav: "flex-1 overflow-y-auto custom-scrollbar px-3 py-2",
  sidebarFooter: "px-5 py-4 border-t border-gray-100",

  // ---- Auth ----
  authLayout: "flex min-h-screen",
  authLeftPanel: "hidden md:flex md:w-1/2",
  authRightPanel:
    "w-full md:w-1/2 bg-white dark:bg-background-dark flex flex-col p-8 lg:p-12",
  authFormContainer:
    "flex-1 flex flex-col justify-center max-w-[400px] mx-auto w-full",

  // ---- Badges (inline, non-CVA) ----
  badgeInline:
    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
  badgeCount:
    "px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[11px] font-bold shadow-sm",

  // ---- Tables ----
  tableHeader:
    "border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold bg-slate-50/50 dark:bg-slate-900",
  tableRow:
    "group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors",
  tableCell: "px-4 py-3",

  // ---- Decorative ----
  blurCircle: "rounded-full blur-3xl pointer-events-none absolute",
  glassOverlay: "glass-panel shadow-glass",
  notifDot:
    "absolute w-2 h-2 bg-primary rounded-full ring-2 ring-white",
  dividerLine: "border-0 h-px bg-gray-200",

  // ---- Buttons (non-CVA inline patterns) ----
  googleButton:
    "w-full flex items-center justify-center gap-3 h-12 border border-slate-200 rounded-xl px-4 text-slate-700 font-semibold hover:bg-slate-50 transition-colors",

  // ---- Segmented control ----
  segmentActive:
    "bg-white text-slate-900 shadow-sm ring-1 ring-black/5 font-semibold",
  segmentInactive:
    "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 font-medium",

  // ---- Tabs ----
  tabBase: "px-4 py-2.5 text-sm font-medium transition-colors -mb-px border-b-2",
  tabActive: "border-primary text-primary",
  tabInactive:
    "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",

  // ---- Pagination ----
  paginationButton:
    "px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 text-slate-600 transition-colors bg-white shadow-sm",

  // ---- Spinner ----
  spinnerBase: "inline-block rounded-full border-2 border-current border-t-transparent animate-spin",

  // ---- Skeleton ----
  skeletonBase: "bg-slate-200 animate-pulse rounded-lg",
  skeletonCircle: "bg-slate-200 animate-pulse rounded-full",
  skeletonWave: "bg-slate-200 rounded-lg relative overflow-hidden [&::after]:absolute [&::after]:inset-0 [&::after]:bg-gradient-to-r [&::after]:from-transparent [&::after]:via-white/40 [&::after]:to-transparent [&::after]:animate-[spark-skeleton-shimmer_1.5s_infinite]",
  skeletonWaveCircle: "bg-slate-200 rounded-full relative overflow-hidden [&::after]:absolute [&::after]:inset-0 [&::after]:bg-gradient-to-r [&::after]:from-transparent [&::after]:via-white/40 [&::after]:to-transparent [&::after]:animate-[spark-skeleton-shimmer_1.5s_infinite]",
  skeletonStatic: "bg-slate-200 rounded-lg",
  skeletonStaticCircle: "bg-slate-200 rounded-full",

  // ---- Empty State ----
  emptyStateContainer: "flex flex-col items-center justify-center text-center",
  emptyStateIcon: "flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400",
  emptyStateTitle: "text-lg font-bold text-secondary",
  emptyStateDescription: "text-sm text-slate-500 max-w-sm",

  // ---- Toast ----
  toastBase: "flex items-start gap-3 rounded-xl p-4 border shadow-float",

  // ---- Notification Item ----
  notificationBase: "flex items-start gap-3 rounded-xl p-4 transition-colors",
  notificationUnread: "bg-primary/5 border border-primary/10",
  notificationRead: "bg-white border border-gray-100",
  notificationDot: "w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5",
  notificationTime: "text-[11px] text-gray-400 whitespace-nowrap",

  // ---- Chat Bubble ----
  chatBubbleSent: "bg-primary text-white rounded-2xl rounded-br-md",
  chatBubbleReceived: "bg-slate-100 text-slate-800 rounded-2xl rounded-bl-md",

  // ---- Rating ----
  ratingStar: "transition-colors",
  ratingStarActive: "text-amber-400",
  ratingStarInactive: "text-slate-200",

  // ---- Radio Group ----
  radioBase: "flex items-center gap-3 cursor-pointer",
  radioOuter: "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
  radioOuterSelected: "border-primary",
  radioOuterUnselected: "border-slate-300",
  radioInner: "w-2.5 h-2.5 rounded-full bg-primary",
  radioCard: "rounded-xl border p-4 cursor-pointer transition-all",
  radioCardSelected: "border-primary bg-primary/5 shadow-sm",
  radioCardUnselected: "border-slate-200 hover:border-slate-300",

  // ---- Accordion ----
  accordionItem: "border-b border-slate-100 last:border-b-0",
  accordionTrigger: "flex items-center justify-between w-full py-4 text-left text-sm font-semibold text-secondary hover:text-primary transition-colors",
  accordionContent: "pb-4 text-sm text-slate-600",
  accordionBordered: "border border-slate-200 rounded-xl overflow-hidden",

  // ---- Stepper ----
  stepperConnector: "flex-1 h-0.5 transition-colors",
  stepperConnectorComplete: "bg-primary",
  stepperConnectorIncomplete: "bg-slate-200",
  stepperCircle: "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
  stepperCircleComplete: "bg-primary text-white",
  stepperCircleActive: "bg-primary/10 text-primary border-2 border-primary",
  stepperCircleUpcoming: "bg-slate-100 text-slate-400",
  stepperLabel: "text-xs font-medium mt-2",

  // ---- Filter Bar ----
  filterChip: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer",
  filterChipActive: "bg-primary/10 border-primary/30 text-primary",
  filterChipInactive: "bg-white border-slate-200 text-slate-600 hover:border-slate-300",

  // ---- Tooltip ----
  tooltipTrigger: "relative inline-flex group",
  tooltipContent: "absolute z-50 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
  tooltipDark: "bg-slate-900 text-white",
  tooltipLight: "bg-white text-slate-700 border border-slate-200 shadow-sm",

  // ---- Dropdown Menu ----
  dropdownOverlay: "absolute z-50 min-w-[200px] bg-white border border-slate-200 rounded-xl shadow-float py-1 overflow-hidden",
  dropdownItem: "flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors",
  dropdownItemDanger: "text-red-600 hover:bg-red-50",
  dropdownDivider: "my-1 h-px bg-slate-100",

  // ---- Modal ----
  modalOverlay: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm",
  modalContent: "bg-white rounded-2xl shadow-float flex flex-col overflow-hidden",
  modalHeader: "flex items-center justify-between px-6 py-4 border-b border-slate-100",
  modalBody: "px-6 py-4 flex-1 overflow-y-auto",
  modalFooter: "flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100",

  // ---- Command Palette ----
  commandContainer: "w-full max-w-xl bg-white rounded-2xl shadow-float overflow-hidden",
  commandGroup: "px-2 py-2",
  commandGroupLabel: "px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider",
  commandItem: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors",
  commandShortcut: "ml-auto text-[11px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded",

  // ---- Data Table ----
  dataTableWrapper: "bg-white border border-slate-100 rounded-2xl overflow-hidden w-full shadow-soft",
  dataTableHeader: "grid items-center gap-x-4 border-b border-slate-100 bg-slate-50/50 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400",
  dataTableRow: "grid items-center gap-x-4 px-4 py-3 border-b border-slate-50 last:border-b-0 hover:bg-slate-50/80 transition-colors",

  // ---- File Upload ----
  uploadZone: "border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center transition-colors hover:border-primary/40 hover:bg-primary/5 cursor-pointer",
  uploadZoneActive: "border-primary bg-primary/5",
  uploadItem: "flex items-center gap-3 rounded-xl border border-slate-200 p-3",
  uploadItemIcon: "flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-500",

  // ---- Audio Player ----
  audioContainer: "flex items-center gap-3 rounded-2xl bg-white border border-slate-200 shadow-sm",
  audioPlayButton: "flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white shrink-0 hover:bg-primary/90 transition-colors",
  audioTime: "text-xs font-mono text-slate-500 tabular-nums",
  audioWaveform: "flex items-end gap-px h-8",

  // ---- Calendar ----
  calendarContainer: "bg-white border border-slate-200 rounded-2xl overflow-hidden",
  calendarHeader: "flex items-center justify-between px-4 py-3",
  calendarGrid: "grid grid-cols-7 text-center",
  calendarDayLabel: "py-2 text-[11px] font-semibold text-slate-400 uppercase",
  calendarDay: "relative flex items-center justify-center h-10 text-sm font-medium rounded-lg transition-colors cursor-pointer hover:bg-slate-50",
  calendarDayToday: "bg-primary text-white hover:bg-primary/90",
  calendarDaySelected: "bg-primary text-white font-bold hover:bg-primary/90",
  calendarDayMuted: "text-slate-300",
  calendarDayEvent: "after:absolute after:bottom-1 after:w-1 after:h-1 after:rounded-full after:bg-primary",
} as const;
