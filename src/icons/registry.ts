import type { ComponentType } from "react";
import type { IconComponentProps } from "./icon-provider";
import * as icons from "./icons";

/**
 * Maps string names to built-in SVG icon components.
 * Supports both spark-ui names (kebab-case) and Material Symbols names (snake_case).
 */
const builtInIcons: Record<string, ComponentType<IconComponentProps>> = {
  // ── Navigation ──
  "chevron-left": icons.ChevronLeftIcon,
  "chevron_left": icons.ChevronLeftIcon,
  "chevron-right": icons.ChevronRightIcon,
  "chevron_right": icons.ChevronRightIcon,
  "chevron-down": icons.ChevronDownIcon,
  "chevron_down": icons.ChevronDownIcon,
  "expand_more": icons.ChevronDownIcon,
  "chevron-up": icons.ChevronUpIcon,
  "chevron_up": icons.ChevronUpIcon,
  "chevrons-up-down": icons.ChevronsUpDownIcon,
  "chevrons_up_down": icons.ChevronsUpDownIcon,
  "unfold_more": icons.ChevronsUpDownIcon,
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
  "navigation": icons.NavigationIcon,

  // ── Actions ──
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
  "settings-gear": icons.SettingsGearIcon,
  "more-horizontal": icons.MoreHorizontalIcon,
  "more_horiz": icons.MoreHorizontalIcon,
  "more-vertical": icons.MoreVerticalIcon,
  "more_vert": icons.MoreVerticalIcon,
  "refresh": icons.RefreshCwIcon,
  "refresh-cw": icons.RefreshCwIcon,
  "rotate-ccw": icons.RotateCcwIcon,
  "save": icons.SaveIcon,
  "scissors": icons.ScissorsIcon,
  "crop": icons.CropIcon,

  // ── Status ──
  "check-circle": icons.CheckCircleIcon,
  "check_circle": icons.CheckCircleIcon,
  "alert-circle": icons.AlertCircleIcon,
  "error": icons.AlertCircleIcon,
  "alert-triangle": icons.AlertTriangleIcon,
  "warning": icons.AlertTriangleIcon,
  "info": icons.InfoIcon,
  "x-circle": icons.XCircleIcon,
  "help-circle": icons.HelpCircleIcon,
  "plus-circle": icons.PlusCircleIcon,
  "minus-circle": icons.MinusCircleIcon,
  "slash": icons.SlashIcon,

  // ── Communication ──
  "phone": icons.PhoneIcon,
  "phone-off": icons.PhoneOffIcon,
  "message-square": icons.MessageSquareIcon,
  "message-circle": icons.MessageCircleIcon,
  "send": icons.SendIcon,
  "inbox": icons.InboxIcon,
  "at-sign": icons.AtSignIcon,
  "mail": icons.MailIcon,

  // ── Media ──
  "play": icons.PlayIcon,
  "pause": icons.PauseIcon,
  "stop-circle": icons.StopCircleIcon,
  "skip-forward": icons.SkipForwardIcon,
  "skip-back": icons.SkipBackIcon,
  "volume": icons.VolumeIcon,
  "volume-1": icons.Volume1Icon,
  "volume-2": icons.Volume2Icon,
  "volume-x": icons.VolumeXIcon,
  "mic": icons.MicIcon,
  "mic-off": icons.MicOffIcon,
  "video": icons.VideoIcon,
  "camera": icons.CameraIcon,
  "music": icons.MusicIcon,
  "image": icons.ImageIcon,

  // ── Files ──
  "file": icons.FileIcon,
  "file-text": icons.FileTextIcon,
  "file-plus": icons.FilePlusIcon,
  "folder": icons.FolderIcon,
  "folder-open": icons.FolderOpenIcon,
  "clipboard": icons.ClipboardIcon,
  "archive": icons.ArchiveIcon,
  "paperclip": icons.PaperclipIcon,
  "link": icons.LinkIcon,

  // ── Layout ──
  "menu": icons.MenuIcon,
  "grid": icons.GridIcon,
  "list": icons.ListIcon,
  "columns": icons.ColumnsIcon,
  "sidebar": icons.SidebarIcon,
  "maximize": icons.MaximizeIcon,
  "minimize": icons.MinimizeIcon,
  "layers": icons.LayersIcon,

  // ── Commerce ──
  "shopping-cart": icons.ShoppingCartIcon,
  "shopping-bag": icons.ShoppingBagIcon,
  "credit-card": icons.CreditCardIcon,
  "dollar-sign": icons.DollarSignIcon,
  "gift": icons.GiftIcon,
  "percent": icons.PercentIcon,
  "tag": icons.TagIcon,

  // ── Maps ──
  "map-pin": icons.MapPinIcon,
  "map": icons.MapIcon,
  "compass": icons.CompassIcon,

  // ── Devices ──
  "smartphone": icons.SmartphoneIcon,
  "tablet": icons.TabletIcon,
  "monitor": icons.MonitorIcon,
  "laptop": icons.LaptopIcon,
  "printer": icons.PrinterIcon,

  // ── Security ──
  "lock": icons.LockIcon,
  "unlock": icons.UnlockIcon,
  "shield": icons.ShieldIcon,
  "shield-check": icons.ShieldCheckIcon,
  "key": icons.KeyIcon,
  "fingerprint": icons.FingerprintIcon,

  // ── Data ──
  "bar-chart": icons.BarChartIcon,
  "pie-chart": icons.PieChartIcon,
  "trending-up": icons.TrendingUpIcon,
  "trending-down": icons.TrendingDownIcon,
  "activity": icons.ActivityIcon,
  "database": icons.DatabaseIcon,
  "server": icons.ServerIcon,
  "hash": icons.HashIcon,

  // ── Formatting ──
  "bold": icons.BoldIcon,
  "italic": icons.ItalicIcon,
  "underline": icons.UnderlineIcon,
  "align-left": icons.AlignLeftIcon,
  "align-center": icons.AlignCenterIcon,
  "align-right": icons.AlignRightIcon,
  "type": icons.TypeIcon,

  // ── Social ──
  "share": icons.ShareIcon,
  "share-2": icons.Share2Icon,
  "thumbs-up": icons.ThumbsUpIcon,
  "thumbs-down": icons.ThumbsDownIcon,
  "bookmark": icons.BookmarkIcon,
  "flag": icons.FlagIcon,
  "award": icons.AwardIcon,

  // ── UI ──
  "calendar": icons.CalendarIcon,
  "calendar_today": icons.CalendarIcon,
  "eye": icons.EyeIcon,
  "visibility": icons.EyeIcon,
  "eye-off": icons.EyeOffIcon,
  "visibility_off": icons.EyeOffIcon,
  "home": icons.HomeIcon,
  "user": icons.UserIcon,
  "users": icons.UsersIcon,
  "user-plus": icons.UserPlusIcon,
  "user-minus": icons.UserMinusIcon,
  "user-check": icons.UserCheckIcon,
  "star": icons.StarIcon,
  "heart": icons.HeartIcon,
  "bell": icons.BellIcon,
  "notifications": icons.BellIcon,
  "loader": icons.LoaderIcon,
  "log-in": icons.LogInIcon,
  "log-out": icons.LogOutIcon,
  "logout": icons.LogOutIcon,
  "code": icons.CodeIcon,
  "terminal": icons.TerminalIcon,
  "target": icons.TargetIcon,
  "crosshair": icons.CrosshairIcon,
  "anchor": icons.AnchorIcon,
  "life-buoy": icons.LifeBuoyIcon,
  "sparkles": icons.SparklesIcon,

  // ── Weather ──
  "cloud": icons.CloudIcon,
  "cloud-rain": icons.CloudRainIcon,
  "thermometer": icons.ThermometerIcon,
  "wind": icons.WindIcon,
  "droplet": icons.DropletIcon,
  "sun": icons.SunIcon,
  "light_mode": icons.SunIcon,
  "moon": icons.MoonIcon,
  "dark_mode": icons.MoonIcon,

  // ── Time ──
  "clock": icons.ClockIcon,
  "watch": icons.WatchIcon,
  "timer": icons.TimerIcon,

  // ── Misc ──
  "zap": icons.ZapIcon,
  "battery": icons.BatteryIcon,
  "wifi": icons.WifiIcon,
  "bluetooth": icons.BluetoothIcon,
  "power": icons.PowerIcon,
  "globe": icons.GlobeIcon,
};

export { builtInIcons };
