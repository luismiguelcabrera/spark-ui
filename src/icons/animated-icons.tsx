"use client";

/**
 * Animated icon SVG registry.
 *
 * Maps icon names to JSX with named CSS classes on child elements.
 * Used by the Icon component when `animated` prop is set.
 * Each entry produces unique per-part animation (bell clapper swings, heart fills, etc.)
 *
 * For icons NOT in this map, the Icon component applies a smart default
 * animation based on the icon's category.
 */

import type { ReactNode } from "react";

type AnimatedSvgEntry = {
  children: ReactNode;
};

export const animatedSvgRegistry: Record<string, AnimatedSvgEntry> = {
  // ── Bell — clapper swings ──
  "bell": {
    children: (
      <>
        <path className="spark-anim-bell-body" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path className="spark-anim-bell-clapper" d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
  },

  // ── Heart — fills up ──
  "heart": {
    children: (
      <path className="spark-anim-heart-fill" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
  },

  // ── Mail — flap opens ──
  "mail": {
    children: (
      <>
        <rect className="spark-anim-mail-body" x="2" y="4" width="20" height="16" rx="2" />
        <path className="spark-anim-mail-flap" d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </>
    ),
  },

  // ── Check Circle — check draws in ──
  "check-circle": {
    children: (
      <>
        <circle className="spark-anim-check-circle" cx="12" cy="12" r="10" />
        <path className="spark-anim-check-mark" d="m9 12 2 2 4-4" />
      </>
    ),
  },

  // ── Star — pops and fills ──
  "star": {
    children: (
      <polygon className="spark-anim-star-shape" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    ),
  },

  // ── Eye — blinks ──
  "eye": {
    children: (
      <>
        <path className="spark-anim-eye-outline" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle className="spark-anim-eye-pupil" cx="12" cy="12" r="3" />
      </>
    ),
  },

  // ── Lock — shackle lifts ──
  "lock": {
    children: (
      <>
        <rect className="spark-anim-lock-body" x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path className="spark-anim-lock-shackle" d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
  },

  // ── Trash — lid lifts ──
  "trash": {
    children: (
      <>
        <path className="spark-anim-trash-can" d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path className="spark-anim-trash-lid" d="M3 6h18" />
        <path className="spark-anim-trash-handle" d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line className="spark-anim-trash-line" x1="10" y1="11" x2="10" y2="17" />
        <line className="spark-anim-trash-line" x1="14" y1="11" x2="14" y2="17" />
      </>
    ),
  },

  // ── Download — arrow pulses down ──
  "download": {
    children: (
      <>
        <path className="spark-anim-dl-tray" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <g className="spark-anim-dl-arrow">
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </g>
      </>
    ),
  },

  // ── Upload — arrow pulses up ──
  "upload": {
    children: (
      <>
        <path className="spark-anim-ul-tray" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <g className="spark-anim-ul-arrow">
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </g>
      </>
    ),
  },

  // ── Settings — gear rotates ──
  "settings": {
    children: (
      <g className="spark-anim-gear">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </g>
    ),
  },

  // ── Rocket — lifts off ──
  "rocket": {
    children: (
      <g className="spark-anim-rocket-body">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </g>
    ),
  },

  // ── Wifi — arcs pulse in sequence ──
  "wifi": {
    children: (
      <>
        <path className="spark-anim-wifi-3" d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path className="spark-anim-wifi-2" d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path className="spark-anim-wifi-1" d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line className="spark-anim-wifi-dot" x1="12" y1="20" x2="12.01" y2="20" />
      </>
    ),
  },

  // ── Volume — waves pulse ──
  "volume-2": {
    children: (
      <>
        <polygon className="spark-anim-vol-speaker" points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path className="spark-anim-vol-wave-1" d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path className="spark-anim-vol-wave-2" d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </>
    ),
  },

  // ── Sun — rays rotate ──
  "sun": {
    children: (
      <>
        <circle className="spark-anim-sun-core" cx="12" cy="12" r="5" />
        <g className="spark-anim-sun-rays">
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>
      </>
    ),
  },

  // ── Search — lens zooms ──
  "search": {
    children: (
      <g className="spark-anim-search-lens">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </g>
    ),
  },

  // ── Copy — pages shift ──
  "copy": {
    children: (
      <>
        <rect className="spark-anim-copy-front" x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path className="spark-anim-copy-back" d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    ),
  },

  // ── Bookmark — fills in ──
  "bookmark": {
    children: (
      <path className="spark-anim-bookmark-shape" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    ),
  },

  // ── Sparkles — twinkle staggered ──
  "sparkles": {
    children: (
      <>
        <path className="spark-anim-sparkle-1" d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
        <path className="spark-anim-sparkle-2" d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13z" />
        <path className="spark-anim-sparkle-3" d="M6 17l.5 1.5L8 19l-1.5.5L6 21l-.5-1.5L4 19l1.5-.5L6 17z" />
      </>
    ),
  },

  // ── Send — plane flies ──
  "send": {
    children: (
      <g className="spark-anim-send-plane">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </g>
    ),
  },
};

/**
 * 15 animation pattern templates mapped to every icon by semantic category.
 *
 * Patterns: jello, heartbeat, typewriter, swing, wobble, flicker,
 * zoom-pulse, tick, nod, sway, slide-shift, pop, attention, roll, flash
 *
 * Each icon is mapped to the pattern that best fits its real-world behavior.
 */

/** Explicit per-icon → pattern mapping. Every icon accounted for. */
const iconPatternMap: Record<string, string> = {
  // ── Heartbeat: double-pump (hearts, medical, likes) ──
  "heart": "heartbeat", "heart-pulse": "heartbeat", "heart-crack": "heartbeat",
  "thumbs-up": "heartbeat", "thumbs-down": "heartbeat",
  "activity": "heartbeat", "stethoscope": "heartbeat", "pill": "heartbeat",
  "syringe": "heartbeat", "bandage": "heartbeat", "brain": "heartbeat",
  "ambulance": "heartbeat", "hospital": "heartbeat",

  // ── Swing: pendulum from top (bells, keys, anchors, pendants) ──
  "bell": "swing", "bell-dot": "swing", "bell-minus": "swing", "bell-off": "swing",
  "bell-plus": "swing", "bell-ring": "swing", "megaphone": "swing",
  "key": "swing", "anchor": "swing", "feather": "swing", "tag": "swing",
  "paperclip": "swing", "link": "swing", "link-break": "swing", "unlink": "swing",

  // ── Attention: scale+rotate for celebrations & rewards ──
  "star": "attention", "star-half": "attention", "sparkles": "attention",
  "crown": "attention", "gem": "attention", "trophy": "attention",
  "award": "attention", "medal": "attention", "gift": "attention",
  "rocket": "attention", "wand": "attention", "zap": "attention",
  "badge-check": "attention", "party-popper": "attention",

  // ── Flash: opacity blink for alerts & warnings ──
  "alert-circle": "flash", "alert-triangle": "flash", "circle-alert": "flash",
  "octagon-alert": "flash", "shield-alert": "flash", "shield-x": "flash",
  "ban": "flash", "x-circle": "flash", "flame": "flash",
  "cloud-lightning": "flash", "lightning": "flash",

  // ── Roll: continuous rotation for loaders & settings ──
  "loader": "roll", "refresh-cw": "roll", "rotate-cw": "roll", "rotate-ccw": "roll",
  "settings": "roll", "settings-gear": "roll", "compass": "roll",
  "gauge": "roll", "recycle": "roll",

  // ── Wobble: vehicle vibration for transport ──
  "car": "wobble", "truck": "wobble", "bike": "wobble", "ship": "wobble",
  "plane": "wobble", "fuel": "wobble", "bus": "wobble", "train": "wobble",
  "gamepad": "wobble", "dumbbell": "wobble",
  "hammer": "wobble", "wrench": "wobble", "shuffle": "wobble",

  // ── Jello: elastic fun for food, emoji, playful icons ──
  "pizza": "jello", "cake": "jello", "coffee": "jello", "wine": "jello",
  "utensils": "jello", "smile": "jello", "frown": "jello", "meh": "jello",
  "baby": "jello", "paw-print": "jello", "bug": "jello", "puzzle": "jello",
  "piggy-bank": "jello", "cookie": "jello",

  // ── Sway: gentle drift for nature & weather ──
  "cloud": "sway", "cloud-rain": "sway", "cloud-snow": "sway",
  "cloud-sun": "sway", "cloud-off": "sway",
  "leaf": "sway", "tree-pine": "sway", "flower": "sway",
  "bird": "sway", "mountain": "sway", "wind": "sway",
  "rainbow": "sway", "snowflake": "sway", "umbrella": "sway",
  "waves": "sway", "droplet": "sway", "tornado": "sway",
  "sun": "sway", "moon": "sway", "sunrise": "sway", "sunset": "sway",
  "thermometer": "sway", "tent": "sway",

  // ── Zoom-pulse: focus/scan/search magnification ──
  "search": "zoom-pulse", "zoom-in": "zoom-pulse", "zoom-out": "zoom-pulse",
  "focus": "zoom-pulse", "scan": "zoom-pulse", "locate": "zoom-pulse",
  "crosshair": "zoom-pulse", "target": "zoom-pulse",
  "eye": "zoom-pulse", "eye-off": "zoom-pulse", "eye-dropper": "zoom-pulse",
  "binoculars": "zoom-pulse", "qr-code": "zoom-pulse",
  "globe": "zoom-pulse", "map": "zoom-pulse", "map-pin": "zoom-pulse",

  // ── Tick: clock hand rotation for time icons ──
  "clock": "tick", "watch": "tick", "timer": "tick", "alarm-clock": "tick",
  "hourglass": "tick", "history": "tick",
  "calendar": "tick", "calendar-check": "tick", "calendar-days": "tick",
  "calendar-plus": "tick", "calendar-x": "tick",

  // ── Nod: subtle head-nod for people & social ──
  "user": "nod", "users": "nod", "user-plus": "nod", "user-minus": "nod",
  "user-check": "nod", "user-x": "nod", "user-cog": "nod",
  "accessibility": "nod", "hand": "nod", "handshake": "nod",
  "graduation-cap": "nod", "briefcase": "nod",
  "log-in": "nod", "log-out": "nod",
  "bookmark": "nod", "flag": "nod",

  // ── Typewriter: horizontal micro-shift for text/formatting ──
  "bold": "typewriter", "italic": "typewriter", "underline": "typewriter",
  "strikethrough": "typewriter", "type": "typewriter",
  "heading-1": "typewriter", "heading-2": "typewriter", "heading-3": "typewriter",
  "align-left": "typewriter", "align-center": "typewriter",
  "align-right": "typewriter", "align-justify": "typewriter",
  "indent": "typewriter", "outdent": "typewriter",
  "quote": "typewriter", "subscript": "typewriter", "superscript": "typewriter",
  "highlighter": "typewriter", "wrap-text": "typewriter",
  "remove-formatting": "typewriter", "list": "typewriter",
  "list-ordered": "typewriter", "list-filter": "typewriter",
  "pencil": "typewriter", "pen": "typewriter", "pen-tool": "typewriter",
  "paintbrush": "typewriter", "palette": "typewriter", "ruler": "typewriter",
  "text-cursor": "typewriter", "text-cursor-input": "typewriter",
  "at-sign": "typewriter", "hash": "typewriter", "code": "typewriter",
  "terminal": "typewriter", "variable": "typewriter", "braces": "typewriter",
  "brackets": "typewriter", "binary": "typewriter",

  // ── Slide-shift: panels & layout elements slide ──
  "panel-left": "slide-shift", "panel-left-open": "slide-shift",
  "panel-left-close": "slide-shift", "panel-right": "slide-shift",
  "panel-right-open": "slide-shift", "panel-right-close": "slide-shift",
  "panel-top": "slide-shift", "panel-bottom": "slide-shift",
  "sidebar": "slide-shift", "menu": "slide-shift", "columns": "slide-shift",
  "layout-dashboard": "slide-shift", "layout-grid": "slide-shift",
  "layout-list": "slide-shift", "layout-template": "slide-shift",
  "kanban": "slide-shift", "table": "slide-shift",
  "app-window": "slide-shift", "picture-in-picture": "slide-shift",
  "split": "slide-shift", "resize": "slide-shift",
  "grid": "slide-shift", "grip-horizontal": "slide-shift",
  "grip-vertical": "slide-shift", "separator-horizontal": "slide-shift",
  "separator-vertical": "slide-shift",
  "maximize": "slide-shift", "minimize": "slide-shift",
  "expand": "slide-shift", "shrink": "slide-shift",
  "layers": "slide-shift", "sticky-note": "slide-shift",

  // ── Pop: spring scale-in for shapes, checks, dots ──
  "circle": "pop", "square": "pop", "triangle": "pop",
  "diamond": "pop", "hexagon": "pop", "octagon": "pop", "pentagon": "pop",
  "check": "pop", "check-check": "pop", "check-circle": "pop",
  "circle-check": "pop", "square-check": "pop",
  "plus": "pop", "minus": "pop", "close": "pop",
  "plus-circle": "pop", "minus-circle": "pop",
  "help-circle": "pop", "info": "pop",
  "circle-dot": "pop", "circle-dashed": "pop",
  "slash": "pop", "percent": "pop",
  "infinity": "pop", "divide": "pop", "equal": "pop",
  "sigma": "pop", "pi": "pop", "square-root": "pop",
  "calculator": "pop",

  // ── Flicker: rapid flash for fire, power, energy ──
  "power": "flicker", "battery": "flicker", "plug": "flicker",
  "usb": "flicker", "bluetooth": "flicker", "lightbulb": "flicker",
  "lightbulb-off": "flicker", "signal": "flicker",

  // ── Specific overrides for common actions ──
  "download": "nod", "upload": "nod",
  "copy": "slide-shift", "paste": "slide-shift",
  "clipboard": "slide-shift", "clipboard-check": "slide-shift",
  "clipboard-copy": "slide-shift", "clipboard-list": "slide-shift",
  "clipboard-x": "slide-shift",
  "save": "pop", "edit": "typewriter", "eraser": "typewriter",
  "undo": "roll", "redo": "roll",
  "scissors": "wobble", "crop": "zoom-pulse",
  "filter": "slide-shift", "sort-asc": "slide-shift", "sort-desc": "slide-shift",
  "arrow-down-az": "slide-shift", "arrow-up-az": "slide-shift",
  "more-horizontal": "pop", "more-vertical": "pop", "cursor": "nod",
  "pin": "swing", "pin-off": "swing",
  "archive": "slide-shift", "archive-restore": "slide-shift",
  "trash": "wobble", "trash-2": "wobble",

  // ── Files & folders ──
  "file": "slide-shift", "file-text": "slide-shift", "file-plus": "slide-shift",
  "file-code": "slide-shift", "file-image": "slide-shift", "file-video": "slide-shift",
  "file-archive": "slide-shift", "file-check": "slide-shift", "file-x": "slide-shift",
  "folder": "slide-shift", "folder-open": "slide-shift", "folder-closed": "slide-shift",
  "folder-plus": "slide-shift", "folder-minus": "slide-shift", "folder-tree": "slide-shift",
  "newspaper": "slide-shift", "notebook": "slide-shift", "book": "slide-shift",
  "book-open": "slide-shift", "receipt": "slide-shift", "package": "slide-shift",
  "backpack": "jello",

  // ── Communication ──
  "mail": "swing", "mail-open": "swing", "mail-check": "swing",
  "mail-plus": "swing", "mail-x": "swing",
  "phone": "wobble", "phone-call": "wobble", "phone-incoming": "wobble",
  "phone-off": "wobble", "phone-outgoing": "wobble",
  "message-circle": "pop", "message-square": "pop",
  "send": "attention", "inbox": "slide-shift",
  "share": "attention", "share-2": "attention",

  // ── Devices ──
  "monitor": "zoom-pulse", "laptop": "zoom-pulse", "smartphone": "zoom-pulse",
  "tablet": "zoom-pulse", "tv": "zoom-pulse", "printer": "slide-shift",
  "keyboard": "typewriter", "mouse": "nod", "cpu": "flicker",
  "hard-drive": "flicker", "server": "flicker", "database": "flicker",

  // ── Media ──
  "play": "pop", "pause": "pop", "stop-circle": "pop",
  "skip-forward": "slide-shift", "skip-back": "slide-shift",
  "volume": "zoom-pulse", "volume-2": "zoom-pulse", "volume-x": "flash",
  "mic": "zoom-pulse", "mic-off": "flash",
  "video": "zoom-pulse", "camera": "zoom-pulse",
  "music": "sway", "headphones": "nod", "speaker": "wobble",
  "radio": "flicker", "podcast": "flicker", "rss": "flicker",

  // ── Commerce ──
  "shopping-cart": "wobble", "shopping-bag": "wobble",
  "credit-card": "slide-shift", "dollar-sign": "attention",
  "wallet": "slide-shift", "coins": "jello", "banknote": "slide-shift",
  "store": "pop", "ticket": "slide-shift", "barcode": "slide-shift",
  "scale": "tick",

  // ── Connectivity ──
  "wifi": "flicker", "wifi-off": "flash",
  "cast": "zoom-pulse", "screen-share": "zoom-pulse",
  "router": "flicker",

  // ── Git & dev ──
  "git-branch": "pop", "git-commit": "pop", "git-merge": "pop",
  "git-pull-request": "pop", "git-fork": "pop",
  "webhook": "flicker",

  // ── Buildings ──
  "home": "pop", "building": "pop", "school": "pop",
  "factory": "pop", "warehouse": "pop", "landmark": "pop",
  "hotel": "pop", "library": "pop", "church": "pop",

  // ── Security ──
  "lock": "wobble", "unlock": "wobble",
  "shield": "pop", "shield-check": "pop",
  "fingerprint": "zoom-pulse",

  // ── Navigation arrows ──
  "arrow-left": "slide-shift", "arrow-right": "slide-shift",
  "arrow-up": "slide-shift", "arrow-down": "slide-shift",
  "arrow-up-left": "slide-shift", "arrow-up-right": "slide-shift",
  "arrow-down-left": "slide-shift", "arrow-down-right": "slide-shift",
  "arrow-left-right": "slide-shift", "arrow-up-down": "slide-shift",
  "arrow-big-up": "slide-shift", "arrow-big-down": "slide-shift",
  "arrow-big-left": "slide-shift", "arrow-big-right": "slide-shift",
  "chevron-left": "slide-shift", "chevron-right": "slide-shift",
  "chevron-up": "slide-shift", "chevron-down": "slide-shift",
  "chevrons-left": "slide-shift", "chevrons-right": "slide-shift",
  "chevrons-up": "slide-shift", "chevrons-down": "slide-shift",
  "chevrons-up-down": "slide-shift",
  "corner-down-left": "slide-shift", "corner-down-right": "slide-shift",
  "corner-up-left": "slide-shift", "corner-up-right": "slide-shift",
  "external-link": "slide-shift", "navigation": "slide-shift",
  "move": "slide-shift", "move-horizontal": "slide-shift",
  "move-vertical": "slide-shift", "move-diagonal": "slide-shift",
  "repeat": "roll", "repeat-1": "roll",
  "trending-up": "attention", "trending-down": "flash",

  // ── Toggles & form ──
  "toggle-left": "slide-shift", "toggle-right": "slide-shift",
  "sliders-horizontal": "slide-shift", "sliders-vertical": "slide-shift",

  // ── Misc ──
  "life-buoy": "roll", "languages": "nod",
  "image": "zoom-pulse", "road": "slide-shift", "route": "slide-shift",
  "signpost": "swing", "area-chart": "pop", "line-chart": "pop",
  "bar-chart": "pop", "pie-chart": "roll", "presentation": "slide-shift",
};

/** Resolve the animation pattern class for any icon name. */
export function getDefaultIconAnimation(name: string): string {
  const pattern = iconPatternMap[name];
  if (pattern) return `spark-pat-${pattern}`;
  // Fallback: pop for unknown icons
  return "spark-pat-pop";
}

/** Resolve the hover-triggered animation pattern class. */
export function getHoverIconAnimation(name: string): string {
  const pattern = iconPatternMap[name];
  if (pattern) return `spark-pat-hover-${pattern}`;
  return "spark-pat-hover-pop";
}

/** Resolve the group-hover-triggered animation pattern class. */
export function getGroupHoverIconAnimation(name: string): string {
  const pattern = iconPatternMap[name];
  if (pattern) return `spark-pat-group-hover-${pattern}`;
  return "spark-pat-group-hover-pop";
}
