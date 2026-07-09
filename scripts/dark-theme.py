#!/usr/bin/env python3
"""
Comprehensive light→dark theme conversion for Verdict app.
Changes CSS variables in globals.css and inline Tailwind classes across all components.
"""

import re
import os

BASE = "/home/z/my-project/src"

# ─── 1. globals.css variable replacement ───────────────────────────
def update_globals_css():
    path = os.path.join(BASE, "app/globals.css")
    with open(path) as f:
        content = f.read()

    old_vars = """  --background: oklch(0.985 0.002 90);
  --foreground: oklch(0.2 0.02 50);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.2 0.02 50);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.2 0.02 50);
  --primary: oklch(0.6 0.2 45);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.95 0.01 90);
  --secondary-foreground: oklch(0.3 0.03 90);
  --muted: oklch(0.95 0.005 90);
  --muted-foreground: oklch(0.5 0.02 50);
  --accent: oklch(0.95 0.01 90);
  --accent-foreground: oklch(0.3 0.03 90);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.91 0.01 90);
  --input: oklch(0.91 0.01 90);
  --ring: oklch(0.6 0.2 45);
  --chart-1: oklch(0.6 0.2 45);
  --chart-2: oklch(0.5 0.15 145);
  --chart-3: oklch(0.7 0.15 80);
  --chart-4: oklch(0.55 0.1 30);
  --chart-5: oklch(0.45 0.12 145);
  --sidebar: oklch(0.97 0.005 45);
  --sidebar-foreground: oklch(0.2 0.02 50);
  --sidebar-primary: oklch(0.6 0.2 45);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.93 0.02 45);
  --sidebar-accent-foreground: oklch(0.2 0.02 50);
  --sidebar-border: oklch(0.91 0.01 45);
  --sidebar-ring: oklch(0.6 0.2 45);"""

    new_vars = """  --background: oklch(0.12 0.005 50);
  --foreground: oklch(0.93 0.005 50);
  --card: oklch(0.16 0.005 50);
  --card-foreground: oklch(0.93 0.005 50);
  --popover: oklch(0.16 0.005 50);
  --popover-foreground: oklch(0.93 0.005 50);
  --primary: oklch(0.65 0.22 45);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.22 0.005 50);
  --secondary-foreground: oklch(0.85 0.01 90);
  --muted: oklch(0.2 0.005 50);
  --muted-foreground: oklch(0.6 0.01 50);
  --accent: oklch(0.22 0.01 45);
  --accent-foreground: oklch(0.85 0.01 90);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.28 0.005 50);
  --input: oklch(0.22 0.005 50);
  --ring: oklch(0.65 0.22 45);
  --chart-1: oklch(0.65 0.22 45);
  --chart-2: oklch(0.55 0.15 145);
  --chart-3: oklch(0.75 0.15 80);
  --chart-4: oklch(0.6 0.1 30);
  --chart-5: oklch(0.5 0.12 145);
  --sidebar: oklch(0.11 0.005 45);
  --sidebar-foreground: oklch(0.9 0.005 50);
  --sidebar-primary: oklch(0.65 0.22 45);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.2 0.015 45);
  --sidebar-accent-foreground: oklch(0.9 0.005 50);
  --sidebar-border: oklch(0.25 0.005 45);
  --sidebar-ring: oklch(0.65 0.22 45);"""

    content = content.replace(old_vars, new_vars)
    with open(path, "w") as f:
        f.write(content)
    print(f"  Updated {path}")


# ─── 2. Inline Tailwind class replacements ────────────────────────
REPLACEMENTS = [
    # Backgrounds (most specific first)
    ("bg-stone-50/50", "bg-stone-800/50"),
    ("bg-orange-50/50", "bg-orange-950/30"),
    ("bg-orange-50", "bg-orange-950/30"),
    ("bg-red-50", "bg-red-950/30"),
    ("bg-green-50", "bg-green-950/30"),
    ("bg-yellow-50", "bg-yellow-950/30"),
    ("bg-amber-50", "bg-amber-950/30"),
    ("bg-[#4D7C0F]/5", "bg-[#4D7C0F]/10"),
    ("bg-[#4D7C0F]/10", "bg-[#4D7C0F]/20"),
    ("bg-red-500/10", "bg-red-500/15"),
    ("bg-white", "bg-stone-900"),
    ("bg-stone-50", "bg-stone-800"),
    ("bg-stone-100", "bg-stone-800"),

    # Borders
    ("border-white", "border-stone-800"),
    ("border-stone-100", "border-stone-700"),
    ("border-stone-200", "border-stone-700"),
    ("border-stone-300", "border-stone-600"),
    ("border-stone-400", "border-stone-500"),

    # Text (most specific first)
    ("text-stone-900", "text-stone-100"),
    ("text-stone-800", "text-stone-200"),
    ("text-stone-700", "text-stone-300"),
    ("text-stone-600", "text-stone-400"),
    ("text-stone-300", "text-stone-600"),

    # Hover states
    ("hover:bg-stone-50", "hover:bg-stone-800"),
    ("hover:bg-stone-100", "hover:bg-stone-700"),
    ("hover:bg-orange-50", "hover:bg-orange-950/30"),
    ("hover:bg-red-50", "hover:bg-red-950/30"),
    ("hover:text-stone-900", "hover:text-stone-100"),
    ("hover:text-stone-700", "hover:text-stone-300"),
    ("hover:text-stone-600", "hover:text-stone-300"),
    ("hover:text-stone-500", "hover:text-stone-300"),
    ("hover:border-stone-300", "hover:border-stone-500"),
    ("hover:border-orange-300", "hover:border-orange-500"),
    ("hover:shadow-sm", "hover:shadow-lg hover:shadow-black/20"),

    # Focus states
    ("focus-visible:ring-stone-200", "focus-visible:ring-stone-600"),

    # SVG strokes
    ('stroke="#f5f5f4"', 'stroke="#292524"'),
    ('stroke="#e7e5e4"', 'stroke="#44403c"'),

    # Ring offset
    ("ring-offset-1", "ring-offset-1 ring-offset-stone-900"),

    # Disabled
    ("disabled:bg-stone-200", "disabled:bg-stone-700"),
    ("disabled:text-stone-400", "disabled:text-stone-500"),
]

def apply_replacements(content: str) -> str:
    for old, new in REPLACEMENTS:
        content = content.replace(old, new)
    return content


COMPONENT_FILES = [
    "components/app-sidebar.tsx",
    "components/home-section.tsx",
    "components/battles-section.tsx",
    "components/battle-room.tsx",
    "components/leaderboard-section.tsx",
    "components/profile-section.tsx",
    "components/groups-section.tsx",
    "components/daily-quests.tsx",
    "components/case-replays.tsx",
    "components/aura-marketplace.tsx",
    "app/page.tsx",
]


def sidebar_extra(content: str) -> str:
    content = content.replace(
        "bg-stone-900 border-r border-stone-700",
        "bg-stone-950 border-r border-stone-800"
    )
    content = content.replace(
        "bg-orange-950/30 text-orange-500 border-l-2 border-orange-500",
        "bg-orange-600/10 text-orange-500 border-l-2 border-orange-500"
    )
    return content

def page_extra(content: str) -> str:
    content = content.replace(
        "min-h-screen bg-stone-800",
        "min-h-screen bg-stone-950"
    )
    content = content.replace(
        "sticky top-0 z-30 bg-stone-900 border-b border-stone-700",
        "sticky top-0 z-30 bg-stone-950 border-b border-stone-800"
    )
    content = content.replace(
        "bg-stone-950 border-t border-stone-700 safe-area-inset-bottom",
        "bg-stone-950 border-t border-stone-800 safe-area-inset-bottom"
    )
    content = content.replace(
        "absolute inset-0 bg-black/40",
        "absolute inset-0 bg-black/60"
    )
    return content

def battle_room_extra(content: str) -> str:
    content = content.replace(
        "bg-red-950/30 border border-red-100",
        "bg-red-950/30 border border-red-900/50"
    )
    content = content.replace(
        "bg-stone-800 border border-stone-700",
        "bg-stone-800/80 border border-stone-700"
    )
    content = content.replace(
        "bg-orange-950/30 border border-orange-100",
        "bg-orange-950/20 border border-orange-900/40"
    )
    content = content.replace(
        "border-t border-stone-100",
        "border-t border-stone-700"
    )
    content = content.replace(
        "bg-stone-800 border border-stone-700 rounded-full",
        "bg-stone-700 border border-stone-600 rounded-full"
    )
    content = content.replace(
        "hover:bg-stone-600 transition-colors",
        "hover:bg-stone-600 transition-colors"
    )
    content = content.replace(
        "bg-stone-800 border border-stone-700 rounded-lg",
        "bg-stone-800 border border-stone-700 rounded-lg"
    )
    return content

def leaderboard_extra(content: str) -> str:
    content = content.replace(
        'bg-stone-800 hover:bg-stone-800',
        'bg-stone-800/80 hover:bg-stone-800/80'
    )
    content = content.replace(
        "bg-stone-800/50",
        "bg-stone-800/30"
    )
    content = content.replace(
        "hover:bg-stone-700",
        "hover:bg-stone-800"
    )
    content = content.replace(
        "bg-orange-950/30",
        "bg-orange-950/20"
    )
    content = content.replace(
        "bg-stone-700 text-stone-200 border-none",
        "bg-stone-700 text-stone-200 border-none"
    )
    return content

def marketplace_extra(content: str) -> str:
    content = content.replace(
        "text-blue-400",
        "text-stone-500"
    )
    return content

def quests_extra(content: str) -> str:
    content = content.replace(
        "bg-orange-950/30 p-4",
        "bg-orange-950/20 p-4"
    )
    return content

def profile_extra(content: str) -> str:
    content = content.replace(
        "border-stone-700 bg-stone-800/50",
        "border-stone-700 bg-stone-800/50"
    )
    content = content.replace(
        "border-dashed border-stone-600 bg-stone-800",
        "border-dashed border-stone-600 bg-stone-800/50"
    )
    content = content.replace(
        "border border-stone-700 bg-stone-900 p-3",
        "border border-stone-700 bg-stone-800 p-3"
    )
    content = content.replace(
        "bg-green-950/30 border border-green-200",
        "bg-green-950/30 border border-green-800/50"
    )
    content = content.replace(
        "bg-red-950/30 border border-red-200",
        "bg-red-950/30 border border-red-800/50"
    )
    content = content.replace(
        "bg-orange-950/30 border-orange-200",
        "bg-orange-950/30 border-orange-800/50"
    )
    return content

EXTRA_FIXES = {
    "components/app-sidebar.tsx": sidebar_extra,
    "app/page.tsx": page_extra,
    "components/battle-room.tsx": battle_room_extra,
    "components/leaderboard-section.tsx": leaderboard_extra,
    "components/aura-marketplace.tsx": marketplace_extra,
    "components/daily-quests.tsx": quests_extra,
    "components/profile-section.tsx": profile_extra,
}


def process_file(rel_path: str):
    full_path = os.path.join(BASE, rel_path)
    with open(full_path) as f:
        content = f.read()

    original = content
    content = apply_replacements(content)

    extra_fn = EXTRA_FIXES.get(rel_path)
    if extra_fn:
        content = extra_fn(content)

    if content != original:
        with open(full_path, "w") as f:
            f.write(content)
        changed = sum(1 for a, _ in REPLACEMENTS if a in original)
        print(f"  Updated {rel_path} (~{changed} patterns matched)")
    else:
        print(f"  No changes: {rel_path}")


def main():
    print("Converting Verdict to dark theme...\n")
    print("Step 1: CSS Variables")
    update_globals_css()

    print("\nStep 2: Component Files")
    for f in COMPONENT_FILES:
        process_file(f)

    print("\nDark theme conversion complete!")


if __name__ == "__main__":
    main()