import type { ComponentType } from "react";
import type { IconComponentProps } from "./icon-provider";
import * as icons from "./icons";

/**
 * Maps string names to built-in SVG icon components.
 * Supports both spark-ui names (kebab-case) and Material Symbols names (snake_case).
 */
const builtInIcons: Record<string, ComponentType<IconComponentProps>> = {
  // Navigation
  "chevron-left": icons.ChevronLeftIcon,
  "chevron_left": icons.ChevronLeftIcon,
  "chevron-right": icons.ChevronRightIcon,
  "chevron_right": icons.ChevronRightIcon,
  "chevron-down": icons.ChevronDownIcon,
  "chevron_down": icons.ChevronDownIcon,
  "expand_more": icons.ChevronDownIcon,
  "chevron-up": icons.ChevronUpIcon,
  "chevron_up": icons.ChevronUpIcon,
  "arrow-left": icons.ArrowLeftIcon,
  "arrow_left": icons.ArrowLeftIcon,
  "arrow-right": icons.ArrowRightIcon,
  "arrow_right": icons.ArrowRightIcon,
  "arrow_forward": icons.ArrowRightIcon,
  "arrow-up": icons.ArrowUpIcon,
  "arrow_up": icons.ArrowUpIcon,
  "arrow-down": icons.ArrowDownIcon,
  "arrow_down": icons.ArrowDownIcon,
  "external-link": icons.ExternalLinkIcon,

  // Actions
  "close": icons.CloseIcon,
  "x": icons.CloseIcon,
  "plus": icons.PlusIcon,
  "add": icons.PlusIcon,
  "minus": icons.MinusIcon,
  "check": icons.CheckIcon,
  "search": icons.SearchIcon,
  "edit": icons.EditIcon,
  "trash": icons.TrashIcon,
  "delete": icons.TrashIcon,
  "copy": icons.CopyIcon,
  "download": icons.DownloadIcon,
  "upload": icons.UploadIcon,
  "cloud_upload": icons.UploadIcon,
  "filter": icons.FilterIcon,
  "tune": icons.FilterIcon,
  "settings": icons.SettingsIcon,
  "more-horizontal": icons.MoreHorizontalIcon,
  "more_horiz": icons.MoreHorizontalIcon,
  "more-vertical": icons.MoreVerticalIcon,
  "more_vert": icons.MoreVerticalIcon,

  // Status
  "check-circle": icons.CheckCircleIcon,
  "check_circle": icons.CheckCircleIcon,
  "alert-circle": icons.AlertCircleIcon,
  "error": icons.AlertCircleIcon,
  "alert-triangle": icons.AlertTriangleIcon,
  "warning": icons.AlertTriangleIcon,
  "info": icons.InfoIcon,
  "x-circle": icons.XCircleIcon,

  // UI
  "menu": icons.MenuIcon,
  "calendar": icons.CalendarIcon,
  "calendar_today": icons.CalendarIcon,
  "eye": icons.EyeIcon,
  "visibility": icons.EyeIcon,
  "eye-off": icons.EyeOffIcon,
  "visibility_off": icons.EyeOffIcon,
  "home": icons.HomeIcon,
  "user": icons.UserIcon,
  "users": icons.UsersIcon,
  "star": icons.StarIcon,
  "heart": icons.HeartIcon,
  "bell": icons.BellIcon,
  "notifications": icons.BellIcon,
  "mail": icons.MailIcon,
  "loader": icons.LoaderIcon,

  // Media
  "image": icons.ImageIcon,
  "file": icons.FileIcon,
  "link": icons.LinkIcon,

  // Social / Misc
  "globe": icons.GlobeIcon,
  "log-out": icons.LogOutIcon,
  "logout": icons.LogOutIcon,
  "sun": icons.SunIcon,
  "light_mode": icons.SunIcon,
  "moon": icons.MoonIcon,
  "dark_mode": icons.MoonIcon,
};

export { builtInIcons };
