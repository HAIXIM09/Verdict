---
Task ID: 1
Agent: Main Agent
Task: Remove fake battles, redesign theme for Gen-Z, apply own design thinking

Work Log:
- Ran initial build verification — clean compile
- Read all 15+ source files to understand full codebase state
- Rewrote globals.css: new oklch color vars (pink/violet/cyan), renamed utility classes (btn-primary, card-hover, badge-glow, etc.), removed fire-specific animations (scanline, flicker), updated gradient-mesh to pink/violet/cyan orbs
- Rewrote mock-data.ts: emptied mockBattles array (no fake data), kept interfaces + users (leaderboard) + categories + quests + marketplace + groups, updated rank names and badge names
- Rewrote home-section.tsx: removed "Scorch of the Day", "Inferno Live", "Rising Flames" sections, replaced with clean empty state CTA, updated hero copy + colors
- Updated battles-section.tsx: new empty state for no battles, updated terminology, removed "Finished" filter
- Updated battle-room.tsx: handles empty battles gracefully, new colors + copy
- Updated verdict-screen.tsx: handles no verdict state, new colors + terminology
- Updated app-sidebar.tsx: Feed/Arenas/Ranks/Crews/Profile labels, new colors
- Updated page.tsx: matching mobile nav labels, new colors
- Updated leaderboard-section.tsx: new labels + colors
- Updated profile-section.tsx: new badge names, updated terminology
- Updated daily-quests.tsx: "Daily Missions", new colors
- Updated groups-section.tsx: "Crews", new colors
- Updated case-replays.tsx: "Replays", empty state for no data
- Updated aura-marketplace.tsx: "Shop", new rarity colors
- Updated gaming-login.tsx: removed scanline, new orb colors, updated tagline
- Updated particle-text-effect.tsx: new words (VERDICT, DEBATE, AURA, WIT, RANKS)
- Updated layout.tsx: new metadata
- Final build verification: clean compile

Stage Summary:
- All fake battles/chat/verdicts removed — app shows clean empty states
- Theme completely overhauled from red/fire to pink (#EC4899) / violet (#8B5CF6) / cyan (#06B6D4) Gen-Z palette
- All forced "fire/roast/burn" language replaced with natural Gen-Z terminology
- Sidebar: Feed → Arenas → Ranks → Crews → Profile
- Build compiles cleanly with zero errors