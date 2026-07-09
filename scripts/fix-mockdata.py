#!/usr/bin/env python3
"""Fix mock-data.ts specifically — ranks, colors, remaining branded text."""
import re

fpath = '/home/z/my-project/src/lib/mock-data.ts'
with open(fpath, 'r') as f:
    c = f.read()

# Rank replacements (old → new)
ranks = {
    '"Citizen"': '"Spark"',
    '"Lawyer"': '"Flame Thrower"',
    '"Judge"': '"Blaze Lord"',
    '"Supreme Court"': '"Inferno"',
    '"Legend"': '"Dragon"',
}

for old, new in ranks.items():
    c = c.replace(old, new)

# Rank colors
c = c.replace('"text-orange-600"', '"text-red-500"')
c = c.replace('"text-stone-300"', '"text-zinc-300"')
c = c.replace('"text-stone-400"', '"text-zinc-500"')
c = c.replace('"text-[#4D7C0F]"', '"text-amber-400"')

# Badge names
c = c.replace('"Hot Streak"', '"Flame Streak"')
c = c.replace('"Case Master"', '"Roast Master"')
c = c.replace('"Crowd Favorite"', '"Crowd Legend"')
c = c.replace('"Perfect Argument"', '"Perfect Burn"')

# Fix remaining category colors
c = c.replace('bg-purple-600/15 text-purple-400', 'bg-red-600/15 text-red-400')
c = c.replace('bg-pink-600/15 text-pink-400', 'bg-amber-600/15 text-amber-400')
c = c.replace('bg-cyan-600/15 text-cyan-400', 'bg-emerald-600/15 text-emerald-400')

# Fix remaining orange references in mock data
c = c.replace('text-orange-500 border-orange-700/50 bg-orange-950/30', 'text-red-400 border-red-700/50 bg-red-950/30')
c = c.replace('text-stone-400 border-stone-500 bg-stone-800', 'text-zinc-400 border-zinc-600 bg-zinc-800')
c = c.replace('text-amber-500 border-amber-700/50 bg-amber-950/30', 'text-amber-400 border-amber-700/50 bg-amber-950/30')
c = c.replace('text-orange-700 border-orange-800/50 bg-orange-950/20', 'text-red-400 border-red-800/50 bg-red-950/20')

# Fix rarity colors in marketplace
c = c.replace('rarityColor: "text-[#4D7C0F]"', 'rarityColor: "text-emerald-400"')
c = c.replace('rarityColor: "text-amber-400"', 'rarityColor: "text-amber-400"')
c = c.replace('rarityColor: "text-orange-600"', 'rarityColor: "text-red-400"')
c = c.replace('rarityColor: "text-stone-500"', 'rarityColor: "text-zinc-500"')

# Fix difficultyColor fields
c = c.replace('difficultyColor: "text-red-400 border-red-700/50 bg-red-950/30"', 'difficultyColor: "text-red-400"')
c = c.replace('difficultyColor: "text-zinc-400 border-zinc-600 bg-zinc-800"', 'difficultyColor: "text-zinc-400"')
c = c.replace('difficultyColor: "text-amber-400 border-amber-700/50 bg-amber-950/30"', 'difficultyColor: "text-amber-400"')
c = c.replace('difficultyColor: "text-red-400 border-red-800/50 bg-red-950/20"', 'difficultyColor: "text-red-400"')

# "AI Judge" text in chat messages
c = c.replace('"AI Judge"', '"AI Roastmaster"')
c = c.replace('[AI]', '[Roastmaster]')

with open(fpath, 'w') as f:
    f.write(c)

print('mock-data.ts updated with new ranks and colors.')