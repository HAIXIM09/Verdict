#!/usr/bin/env python3
"""Bulk transform all Verdict component files for the Roast Arena rebrand."""
import re, glob, os

BASE = '/home/z/my-project/src/components'

files = glob.glob(f'{BASE}/*.tsx') + glob.glob(f'{BASE}/ui/*.tsx')

replacements = [
    # Color system: stone → zinc
    ('bg-stone-950', 'bg-[#09090b]'),
    ('bg-stone-900', 'bg-zinc-900'),
    ('bg-stone-800', 'bg-zinc-800'),
    ('bg-stone-700', 'bg-zinc-800'),
    ('border-stone-800', 'border-zinc-800'),
    ('border-stone-700', 'border-zinc-800'),
    ('border-stone-600', 'border-zinc-700'),
    ('border-stone-500', 'border-zinc-700'),
    ('text-stone-100', 'text-zinc-100'),
    ('text-stone-200', 'text-zinc-200'),
    ('text-stone-300', 'text-zinc-300'),
    ('text-stone-400', 'text-zinc-400'),
    ('text-stone-500', 'text-zinc-500'),
    ('text-stone-600', 'text-zinc-600'),
    ('text-stone-700', 'text-zinc-700'),
    ('hover:bg-stone-800', 'hover:bg-zinc-800'),
    ('hover:bg-stone-700', 'hover:bg-zinc-700'),
    ('hover:text-stone-100', 'hover:text-zinc-100'),
    ('hover:text-stone-200', 'hover:text-zinc-200'),
    ('hover:text-stone-300', 'hover:text-zinc-300'),
    ('hover:text-stone-400', 'hover:text-zinc-400'),
    ('hover:border-stone-600', 'hover:border-zinc-700'),
    ('hover:border-orange-500', 'hover:border-red-500'),
    ('bg-stone-800/80', 'bg-zinc-800/80'),
    ('bg-stone-800/50', 'bg-zinc-800/50'),
    ('bg-stone-800/30', 'bg-zinc-800/30'),
    ('bg-orange-950/30', 'bg-red-950/30'),
    ('bg-orange-950/20', 'bg-red-950/20'),
    ('bg-red-950/30', 'bg-red-950/30'),  # already red, keep
    # Primary: orange-600 → red-600
    ('bg-orange-600', 'bg-red-600'),
    ('hover:bg-orange-700', 'hover:bg-red-700'),
    ('text-orange-600', 'text-red-500'),
    ('text-orange-500', 'text-red-400'),
    ('text-orange-400', 'text-red-400'),
    ('text-orange-700', 'text-red-500'),
    ('border-orange-700/50', 'border-red-700/50'),
    ('border-orange-800/50', 'border-red-800/50'),
    ('border-orange-900/40', 'border-red-900/40'),
    ('border-orange-600', 'border-red-600'),
    ('border-orange-300', 'border-red-400'),
    ('bg-orange-600/15', 'bg-red-600/15'),
    ('border-l-orange-600', 'border-l-red-600'),
    ('border-l-orange-500', 'border-l-red-500'),
    ('ring-orange-600', 'ring-red-600'),
    ('ring-orange-500', 'ring-red-500'),
    ('ring-offset-stone-900', 'ring-offset-zinc-900'),
    ('shadow-orange-600/20', 'shadow-red-600/20'),
    ('shadow-orange-600/30', 'shadow-red-600/30'),
    ('focus:ring-orange-600/20', 'focus:ring-red-600/20'),
    ('focus:ring-orange-600/30', 'focus:ring-red-600/30'),
    ('focus:ring-orange-600/40', 'focus:ring-red-600/40'),
    ('focus:ring-offset-stone-900', 'focus:ring-offset-zinc-900'),
    ('focus:border-orange-600/50', 'focus:border-red-600/50'),
    ('hover:text-orange-700', 'hover:text-red-400'),
    ('hover:text-orange-600', 'hover:text-red-500'),
    ('hover:text-orange-300', 'hover:text-red-300'),
    ('hover:bg-orange-950/30', 'hover:bg-red-950/30'),
    ('bg-orange-600/15', 'bg-red-600/15'),
    # Green accent: #4D7C0F → #10B981 (emerald)
    ('text-[#4D7C0F]', 'text-emerald-400'),
    ('bg-[#4D7C0F]/20', 'bg-emerald-500/15'),
    ('border-[#4D7C0F]/20', 'border-emerald-500/20'),
    ('border-[#4D7C0F]/30', 'border-emerald-500/20'),
    ('border-[#4D7C0F]', 'border-emerald-500'),
    ('hover:bg-[#4D7C0F]/20', 'hover:bg-emerald-500/20'),
    ('hover:text-[#4D7C0F]', 'hover:text-emerald-300'),
    ('hover:border-[#4D7C0F]', 'hover:border-emerald-500'),
    ('bg-[#4D7C0F]/20', 'bg-emerald-500/15'),
    # Branding text changes
    ("Verdict", "Roast Arena"),
    ("verdict", "roast"),
    ("Verdict's", "Roast Arena's"),
    ("the internet's court", "where opinions get burned"),
    ("The Internet's Court", "Where Opinions Get Burned"),
    ("verdict warriors", "roast lords"),
    ("AI Judge", "AI Roastmaster"),
    ("Battle Arena", "Roast Arena"),
    ("Battle Chat", "Roast Chat"),
    ("Submit a New Case", "Start a New Roast"),
    ("Submit a Case for Voting", "Start a New Roast"),
    ("Submit a Case for", "Start a Roast for"),
    ("Submit for Voting", "Submit Roast"),
    ("Verdict of the Day", "Roast of the Day"),
    ("View Full Replay", "Watch Full Roast"),
    ("Watch Roast", "Watch Roast"),
    ("View Verdict", "View Result"),
    ("Continue to Verdict", "See Result"),
    ("Appeal Verdict", "Appeal Result"),
    ("Claim Loot", "Claim Rewards"),
    ("Case Replays", "Roast Replays"),
    ("Aura Marketplace", "Burn Shop"),
    ("Battle", "Roast"),
    ("battle", "roast"),
    ("battles", "roasts"),
    ("Find a Roast", "Find a Roast"),
    ("Spectate", "Watch"),
    ("View All Quests", "All Quests"),
    ("Back to Profile", "Back"),
    # Sidebar labels
    ("Leaderboard", "Rankings"),
    ("My Groups", "My Crews"),
    ("Discover Groups", "Find Crews"),
    ("Verdict Groups", "Roast Crews"),
    # Rankings
    ("Champions", "Roast Kings"),
    ("Fighter", "Roaster"),
    ("#1 CHAMPION", "#1 INFERNO"),
    ("#2 ELITE", "#2 BLAZE"),
    ("#3 VETERAN", "#3 EMBER"),
    # Profile
    ("Total Battles", "Total Roasts"),
    ("Recent Battles", "Recent Roasts"),
    ("View Full History", "View All Roasts"),
    # Badges/Quests
    ("Hot Streak", "Flame Streak"),
    ("Case Master", "Roast Master"),
    ("Unstoppable", "Unstoppable"),
    ("Crowd Favorite", "Crowd Legend"),
    ("Perfect Argument", "Perfect Burn"),
    ("Win 2 Roast Battles", "Win 2 Roast Matches"),
    ("Roast Across 3 Categories", "Roast in 3 Categories"),
    ("Roast Connoisseur", "Roast Scholar"),
]

count = 0
for fpath in files:
    with open(fpath, 'r') as f:
        content = f.read()
    
    original = content
    for old, new in replacements:
        content = content.replace(old, new)
    
    if content != original:
        with open(fpath, 'w') as f:
            f.write(content)
        count += 1
        print(f'  Updated: {os.path.basename(fpath)}')

print(f'\nDone! Updated {count} files.')