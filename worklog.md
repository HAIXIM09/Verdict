# Verdict App — Backend + Frontend Integration Worklog

## Summary
Connected the entire Verdict app to real PostgreSQL (Neon) backend. Replaced all mock data with real API calls across 15 files (8 frontend components, 1 page, 5 new backend files).

## Database
- **Schema**: Migrated from SQLite to PostgreSQL (Neon)
- **Models**: User (expanded), Battle, BattleMessage, Crew, CrewMember, AuraItem, UserAuraItem
- **Seed**: 12 aura items across 4 types (frame, title, badge, effect) and 4 rarities (common, rare, epic, legendary)

## API Routes Created (17 total)
| Route | Method | Purpose |
|---|---|---|
| `/api/auth/signup` | POST | User registration with bcrypt + JWT |
| `/api/auth/login` | POST | Login with JWT cookie |
| `/api/auth/logout` | POST | Clear JWT cookie |
| `/api/auth/me` | GET | Get current user from JWT |
| `/api/battles` | GET | List all battles (with category/status filters) |
| `/api/battles/create` | POST | Create battle, deduct aura stake |
| `/api/battles/[id]` | GET | Get single battle with messages |
| `/api/battles/[id]/join` | POST | Join open battle as opponent |
| `/api/battles/[id]/chat` | POST | Send debate message |
| `/api/battles/[id]/messages` | GET | Get battle messages |
| `/api/battles/[id]/judge` | POST | AI judge verdict (weighted random) |
| `/api/leaderboard` | GET | Top 20 users by aura |
| `/api/aura-items` | GET | All items with ownership status |
| `/api/aura-items/[id]/buy` | POST | Purchase item with coins |
| `/api/aura-items/[id]/equip` | POST | Equip item (unequip same type) |
| `/api/crews` | GET | List all crews with member count |
| `/api/crews/create` | POST | Create crew + add as leader |
| `/api/stats` | GET | Aggregate stats (users, battles, messages) |
| `/api/user/[username]` | GET | Public user profile |

## Frontend Components Modified (8)
- **page.tsx**: Real auth flow (login/logout/me), removed all mockCurrentUser references, session restore on mount, verdict data flow from battle room
- **battles-section.tsx**: Fetches battles from API, creates battles via POST, category filtering, loading states
- **battle-room.tsx**: Fetches battle + messages from API, real-time join/send/judge actions, participant detection
- **leaderboard-section.tsx**: Fetches from /api/leaderboard, current user highlighting
- **profile-section.tsx**: Fetches from /api/auth/me or /api/user/[username], real stats display
- **groups-section.tsx**: Fetches crews from API, create crew form with API call
- **aura-marketplace.tsx**: Fetches items with ownership, real buy/equip API calls, coin balance from auth
- **home-section.tsx**: Fetches stats from API for hero section, recent battles display
- **case-replays.tsx**: Fetches judged battles from API
- **verdict-screen.tsx**: Receives verdict data as props, no mock dependency
- **daily-quests.tsx**: Static 3 quests, no backend needed

## Files Cleaned
- **mock-data.ts**: Removed mockBattles, mockCurrentUser, mockUsers, mockGroups, mockQuests, mockMarketplaceItems. Kept only mockCategories (still used for category grid).

## Helper Created
- **src/lib/auth.ts**: `getAuthUser()` — JWT verification from cookie using `jose`