import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../components/data-display/icon";
import * as icons from "./icons";

const meta = {
  title: "Icons/Icon Gallery",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Helpers ──

const iconEntry = (Comp: React.ComponentType<{ size?: number }>, name: string) => ({ name, Comp });

const categoryMap: Record<string, string[]> = {
  "Navigation": [
    "ChevronLeft", "ChevronRight", "ChevronDown", "ChevronUp",
    "ChevronsLeft", "ChevronsRight", "ChevronsUpDown", "ChevronsDown", "ChevronsUp",
    "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
    "ArrowUpLeft", "ArrowUpRight", "ArrowDownLeft", "ArrowDownRight",
    "ArrowLeftRight", "ArrowUpDown",
    "ArrowBigUp", "ArrowBigDown", "ArrowBigLeft", "ArrowBigRight",
    "CornerDownLeft", "CornerDownRight", "CornerUpLeft", "CornerUpRight",
    "ExternalLink", "Navigation",
    "MoveHorizontal", "MoveVertical", "MoveDiagonal", "Move",
    "Repeat", "Repeat1",
  ],
  "Actions": [
    "Close", "Plus", "Minus", "Check", "Search", "Edit", "Trash", "Trash2",
    "Copy", "Paste", "Download", "Upload", "Filter", "Settings", "SettingsGear",
    "MoreHorizontal", "MoreVertical", "Save", "Scissors", "Crop",
    "Undo", "Redo", "ZoomIn", "ZoomOut", "RefreshCw", "RotateCcw",
    "ClipboardCheck", "ClipboardCopy", "ClipboardList", "ClipboardX",
    "ArchiveRestore", "Eraser", "Wand", "Pin", "PinOff",
    "SortAsc", "SortDesc", "ArrowDownAZ", "ArrowUpAZ",
    "ListOrdered", "ListFilter", "Cursor",
  ],
  "Status & Feedback": [
    "CheckCircle", "AlertCircle", "AlertTriangle", "Info", "XCircle",
    "HelpCircle", "PlusCircle", "MinusCircle", "Slash",
    "Ban", "CircleAlert", "CircleCheck", "OctagonAlert",
    "CheckCheck", "CircleDot", "CircleDashed", "BadgeCheck",
    "Sparkles",
  ],
  "Bell & Notifications": [
    "Bell", "BellOff", "BellRing", "BellDot", "BellPlus", "BellMinus",
  ],
  "Security": [
    "Lock", "Unlock", "Shield", "ShieldCheck", "ShieldAlert", "ShieldX",
    "Key", "Fingerprint",
  ],
  "Users": [
    "User", "Users", "UserPlus", "UserMinus", "UserCheck",
    "LogIn", "LogOut",
  ],
  "Communication": [
    "Phone", "PhoneOff", "MessageSquare", "MessageCircle",
    "Send", "Inbox", "AtSign", "Mail",
  ],
  "Media Controls": [
    "Play", "Pause", "StopCircle", "SkipForward", "SkipBack",
    "Volume", "Volume1", "Volume2", "VolumeX",
    "Mic", "MicOff", "Video", "Camera", "Music",
  ],
  "Files & Folders": [
    "File", "FileText", "FilePlus", "Folder", "FolderOpen",
    "Clipboard", "Archive", "Paperclip", "Link", "Image",
  ],
  "Layout & Panels": [
    "Menu", "GripVertical", "GripHorizontal", "Grid", "List", "Columns",
    "Sidebar", "Maximize", "Minimize", "Layers",
    "PanelLeft", "PanelLeftOpen", "PanelLeftClose",
    "PanelRight", "PanelRightOpen", "PanelRightClose",
    "PanelTop", "PanelBottom",
    "LayoutDashboard", "LayoutGrid", "LayoutList", "LayoutTemplate",
    "Kanban", "Table", "StickyNote",
    "SeparatorHorizontal", "SeparatorVertical",
    "Resize", "Split", "AppWindow", "PictureInPicture",
  ],
  "Form Controls": [
    "Eye", "EyeOff", "Calendar",
    "ToggleLeft", "ToggleRight",
    "SlidersHorizontal", "SlidersVertical",
    "TextCursor", "TextCursorInput",
    "SquareCheck",
  ],
  "Commerce": [
    "ShoppingCart", "ShoppingBag", "CreditCard", "DollarSign",
    "Gift", "Percent", "Tag",
  ],
  "Data & Charts": [
    "BarChart", "PieChart", "TrendingUp", "TrendingDown", "Activity",
    "Database", "Server", "Hash",
  ],
  "Maps & Location": [
    "MapPin", "Map", "Compass", "Globe",
  ],
  "Devices": [
    "Smartphone", "Tablet", "Monitor", "Laptop", "Printer",
  ],
  "Formatting": [
    "Bold", "Italic", "Underline", "AlignLeft", "AlignCenter", "AlignRight", "Type",
  ],
  "Social": [
    "Share", "Share2", "ThumbsUp", "ThumbsDown",
    "Bookmark", "Flag", "Award", "Heart", "Star",
  ],
  "Weather": [
    "Sun", "Moon", "Cloud", "CloudRain", "Thermometer", "Wind", "Droplet",
  ],
  "Time": [
    "Clock", "Watch", "Timer",
  ],
  "Misc": [
    "Zap", "Battery", "Wifi", "Bluetooth", "Power", "Home",
    "Loader", "Code", "Terminal", "Target", "Crosshair",
    "Anchor", "LifeBuoy", "Slash", "Crop",
  ],
};

const allIconMap = Object.fromEntries(
  Object.entries(icons)
    .filter(([key]) => key.endsWith("Icon"))
    .map(([key, Comp]) => [key.replace(/Icon$/, ""), Comp]),
) as Record<string, React.ComponentType<{ size?: number }>>;

const allIcons = Object.entries(allIconMap).map(([name, Comp]) => iconEntry(Comp, name));

const sizeToNumber = (s: string) =>
  s === "xs" ? 12 : s === "sm" ? 16 : s === "md" ? 20 : s === "lg" ? 24 : 32;

const IconTile = ({
  name,
  Comp,
  size,
}: {
  name: string;
  Comp: React.ComponentType<{ size?: number }>;
  size: number;
}) => (
  <div className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
    <Comp size={size} />
    <span className="text-[10px] text-slate-500 font-mono text-center leading-tight">{name}</span>
  </div>
);

// ── Stories ──

export const Default: Story = { args: { name: "check", size: "lg" } };

export const AllIcons: Story = {
  args: { name: "check", size: "lg" },
  render: (args) => (
    <div>
      <p className="text-sm text-slate-500 mb-4">{allIcons.length} icons total</p>
      <div className="grid grid-cols-8 gap-4">
        {allIcons.map(({ name, Comp }) => (
          <IconTile key={name} name={name} Comp={Comp} size={sizeToNumber(args.size ?? "lg")} />
        ))}
      </div>
    </div>
  ),
};

export const ByCategory: Story = {
  args: { name: "check", size: "lg" },
  render: (args) => {
    const sz = sizeToNumber(args.size ?? "lg");
    const categorized = new Set<string>();
    return (
      <div className="space-y-8">
        {Object.entries(categoryMap).map(([category, names]) => {
          const items = names
            .filter((n) => {
              if (allIconMap[n]) {
                categorized.add(n);
                return true;
              }
              return false;
            })
            .map((n) => iconEntry(allIconMap[n], n));
          if (items.length === 0) return null;
          return (
            <div key={category}>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 border-b pb-1">
                {category} <span className="text-slate-400 font-normal">({items.length})</span>
              </h3>
              <div className="grid grid-cols-8 gap-3">
                {items.map(({ name, Comp }) => (
                  <IconTile key={name} name={name} Comp={Comp} size={sz} />
                ))}
              </div>
            </div>
          );
        })}
        {/* Uncategorized */}
        {(() => {
          const uncategorized = allIcons.filter(({ name }) => !categorized.has(name));
          if (uncategorized.length === 0) return null;
          return (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 border-b pb-1">
                Other <span className="text-slate-400 font-normal">({uncategorized.length})</span>
              </h3>
              <div className="grid grid-cols-8 gap-3">
                {uncategorized.map(({ name, Comp }) => (
                  <IconTile key={name} name={name} Comp={Comp} size={sz} />
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    );
  },
};

export const Sizes: Story = {
  args: { name: "star" },
  render: () => (
    <div className="flex items-end gap-6">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
        <div key={s} className="flex flex-col items-center gap-2">
          <Icon name="star" size={s} />
          <span className="text-xs text-slate-500">{s}</span>
        </div>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  args: { name: "heart" },
  render: () => (
    <div className="flex items-center gap-4">
      <Icon name="heart" size="lg" className="text-red-500" />
      <Icon name="check-circle" size="lg" className="text-green-600" />
      <Icon name="info" size="lg" className="text-blue-500" />
      <Icon name="alert-triangle" size="lg" className="text-amber-500" />
      <Icon name="star" size="lg" className="text-yellow-400" />
    </div>
  ),
};

export const StringFallback: Story = {
  args: { name: "rocket_launch", size: "lg" },
};
