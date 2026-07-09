// ============================================================
// Verdict — Mock Data Layer
// ============================================================

export interface User {
  id: string;
  username: string;
  avatar: string;
  aura: number;
  wins: number;
  losses: number;
  winRate: number;
  rank: string;
  rankColor: string;
  streak: number;
  coins: number;
  badges: string[];
  joinDate: string;
  ownedItemIds: string[];
  equippedItemIds: string[];
}

export interface BattleCase {
  id: string;
  sideA: string;
  sideB: string;
  category: string;
  difficulty: "Bronze" | "Silver" | "Gold" | "Platinum";
  difficultyColor: string;
  teamA: (User | null)[];
  teamB: (User | null)[];
  spectators: User[];
  maxSpectators: number;
  status: "waiting" | "live" | "verdict" | "finished";
  timer: number;
  totalTimer: number;
  chatMessages: ChatMessage[];
  aiVerdict: AiVerdict | null;
  auraStake: number;
  viewers: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
  isAi: boolean;
  type: "argument" | "ai_kick" | "ai_warning" | "spectator_reaction" | "system";
  reaction?: string;
}

export interface AiVerdict {
  winner: "A" | "B";
  scoreA: number;
  scoreB: number;
  bestArgument: { userId: string; username: string; text: string };
  mostRoasted: { userId: string; username: string; roastCount: number };
  summary: string;
  coinsAwarded: number;
  auraChange: { gained: number; lost: number };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  battleCount: number;
  color: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: { coins: number; aura: number };
  completed: boolean;
  claimed: boolean;
}

export interface MarketplaceItem {
  id: string;
  name: string;
  type: "frame" | "title" | "badge" | "effect";
  cost: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  rarityColor: string;
  owned: boolean;
  equipped: boolean;
  previewType: "border" | "text" | "icon" | "description";
  description: string;
}

export interface GroupInfo {
  id: string;
  name: string;
  members: number;
  description: string;
  category: string;
  isJoined: boolean;
}

// ============================================================
// Users — for leaderboard only (no fake battle participants)
// ============================================================

export const mockCurrentUser: User = {
  id: "u-me",
  username: "You",
  avatar: "YO",
  aura: 1250,
  wins: 18,
  losses: 12,
  winRate: 60,
  rank: "Hot Take",
  rankColor: "text-pink-400",
  streak: 3,
  coins: 850,
  badges: ["Streak King", "Wordsmith"],
  joinDate: "2025-01-15",
  ownedItemIds: ["mp-1", "mp-3", "mp-5"],
  equippedItemIds: ["mp-3"],
};

export const mockUsers: User[] = [
  {
    id: "u-1", username: "DK", avatar: "DK",
    aura: 5200, wins: 94, losses: 21, winRate: 82,
    rank: "Goat", rankColor: "text-pink-400", streak: 12,
    coins: 12400, badges: ["Top 10", "Streak King", "Wordsmith", "Unstoppable"],
    joinDate: "2024-06-10", ownedItemIds: [], equippedItemIds: [],
  },
  {
    id: "u-2", username: "AR", avatar: "AR",
    aura: 3850, wins: 67, losses: 28, winRate: 71,
    rank: "Elite", rankColor: "text-violet-400", streak: 5,
    coins: 8200, badges: ["Top 10", "Wordsmith"],
    joinDate: "2024-08-22", ownedItemIds: [], equippedItemIds: [],
  },
  {
    id: "u-3", username: "PS", avatar: "PS",
    aura: 2940, wins: 52, losses: 30, winRate: 63,
    rank: "Rising", rankColor: "text-cyan-400", streak: 2,
    coins: 5600, badges: ["Wordsmith"],
    joinDate: "2024-09-05", ownedItemIds: [], equippedItemIds: [],
  },
  {
    id: "u-4", username: "VK", avatar: "VK",
    aura: 2100, wins: 41, losses: 22, winRate: 65,
    rank: "Rising", rankColor: "text-cyan-400", streak: 4,
    coins: 4300, badges: ["Streak King"],
    joinDate: "2024-10-12", ownedItemIds: [], equippedItemIds: [],
  },
  {
    id: "u-5", username: "RM", avatar: "RM",
    aura: 1750, wins: 35, losses: 20, winRate: 64,
    rank: "Hot Take", rankColor: "text-pink-400", streak: 1,
    coins: 3200, badges: [],
    joinDate: "2024-11-01", ownedItemIds: [], equippedItemIds: [],
  },
  {
    id: "u-6", username: "NK", avatar: "NK",
    aura: 1320, wins: 28, losses: 18, winRate: 61,
    rank: "Hot Take", rankColor: "text-pink-400", streak: 3,
    coins: 2100, badges: ["Wordsmith"],
    joinDate: "2024-11-20", ownedItemIds: [], equippedItemIds: [],
  },
  {
    id: "u-7", username: "SP", avatar: "SP",
    aura: 980, wins: 19, losses: 16, winRate: 54,
    rank: "New Blood", rankColor: "text-zinc-500", streak: 0,
    coins: 1400, badges: [],
    joinDate: "2024-12-05", ownedItemIds: [], equippedItemIds: [],
  },
  {
    id: "u-8", username: "AJ", avatar: "AJ",
    aura: 640, wins: 12, losses: 14, winRate: 46,
    rank: "New Blood", rankColor: "text-zinc-500", streak: 1,
    coins: 800, badges: [],
    joinDate: "2025-01-08", ownedItemIds: [], equippedItemIds: [],
  },
  {
    id: "u-9", username: "BT", avatar: "BT",
    aura: 420, wins: 8, losses: 11, winRate: 42,
    rank: "New Blood", rankColor: "text-zinc-500", streak: 0,
    coins: 500, badges: [],
    joinDate: "2025-02-14", ownedItemIds: [], equippedItemIds: [],
  },
  {
    id: "u-10", username: "MR", avatar: "MR",
    aura: 210, wins: 4, losses: 9, winRate: 31,
    rank: "New Blood", rankColor: "text-zinc-500", streak: 0,
    coins: 250, badges: [],
    joinDate: "2025-03-01", ownedItemIds: [], equippedItemIds: [],
  },
  mockCurrentUser,
];

// ============================================================
// Battles — EMPTY. No fake battles.
// Real battles will be created by users through the UI.
// ============================================================

export const mockBattles: BattleCase[] = [];

// ============================================================
// Categories
// ============================================================

export const mockCategories: Category[] = [
  { id: "c-1", name: "Anime", icon: "Sparkles", battleCount: 0, color: "bg-pink-500/15 text-pink-400" },
  { id: "c-2", name: "Movies", icon: "Film", battleCount: 0, color: "bg-violet-500/15 text-violet-400" },
  { id: "c-3", name: "Games", icon: "Gamepad2", battleCount: 0, color: "bg-cyan-500/15 text-cyan-400" },
  { id: "c-4", name: "Cartoons", icon: "Tv", battleCount: 0, color: "bg-amber-500/15 text-amber-400" },
  { id: "c-5", name: "Music", icon: "Music", battleCount: 0, color: "bg-pink-500/15 text-pink-400" },
  { id: "c-6", name: "Sports", icon: "Trophy", battleCount: 0, color: "bg-violet-500/15 text-violet-400" },
  { id: "c-7", name: "Food", icon: "UtensilsCrossed", battleCount: 0, color: "bg-cyan-500/15 text-cyan-400" },
  { id: "c-8", name: "Tech", icon: "Cpu", battleCount: 0, color: "bg-pink-500/15 text-pink-400" },
];

// ============================================================
// Quests
// ============================================================

export const mockQuests: Quest[] = [
  {
    id: "q-1",
    title: "Win 1 Battle",
    description: "Drop into an arena and come out on top",
    progress: 0, target: 1,
    reward: { coins: 50, aura: 100 },
    completed: false, claimed: false,
  },
  {
    id: "q-2",
    title: "Send 5 Arguments",
    description: "Let your voice be heard in battle chat",
    progress: 0, target: 5,
    reward: { coins: 75, aura: 150 },
    completed: false, claimed: false,
  },
  {
    id: "q-3",
    title: "Watch 3 Replays",
    description: "Study the best roasters to level up your game",
    progress: 0, target: 3,
    reward: { coins: 40, aura: 80 },
    completed: false, claimed: false,
  },
  {
    id: "q-4",
    title: "Reach 3 Win Streak",
    description: "Three in a row? That's aura multiplier territory",
    progress: 0, target: 3,
    reward: { coins: 150, aura: 300 },
    completed: false, claimed: false,
  },
  {
    id: "q-5",
    title: "Spectate 2 Battles",
    description: "Watch others compete and learn from the chaos",
    progress: 0, target: 2,
    reward: { coins: 30, aura: 60 },
    completed: false, claimed: false,
  },
];

// ============================================================
// Marketplace
// ============================================================

export const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: "mp-1", name: "Neon Frame", type: "frame", cost: 200,
    rarity: "common", rarityColor: "text-zinc-400",
    owned: true, equipped: false, previewType: "border",
    description: "Clean pink neon glow around your avatar",
  },
  {
    id: "mp-2", name: "Void Walker", type: "frame", cost: 500,
    rarity: "rare", rarityColor: "text-violet-400",
    owned: false, equipped: false, previewType: "border",
    description: "Deep violet void energy wraps your profile pic",
  },
  {
    id: "mp-3", name: "Certified Menace", type: "title", cost: 300,
    rarity: "rare", rarityColor: "text-violet-400",
    owned: true, equipped: true, previewType: "text",
    description: "Let them know before they even start",
  },
  {
    id: "mp-4", name: "Aura Lord", type: "title", cost: 800,
    rarity: "epic", rarityColor: "text-amber-400",
    owned: false, equipped: false, previewType: "text",
    description: "For those who've made it to the top",
  },
  {
    id: "mp-5", name: "Spark Badge", type: "badge", cost: 150,
    rarity: "common", rarityColor: "text-zinc-400",
    owned: true, equipped: false, previewType: "icon",
    description: "A simple spark to show you're in the game",
  },
  {
    id: "mp-6", name: "Flame Crown", type: "badge", cost: 1200,
    rarity: "legendary", rarityColor: "text-pink-400",
    owned: false, equipped: false, previewType: "icon",
    description: "Only the most feared roasters wear this",
  },
  {
    id: "mp-7", name: "Glitch Effect", type: "effect", cost: 600,
    rarity: "epic", rarityColor: "text-amber-400",
    owned: false, equipped: false, previewType: "description",
    description: "Your messages glitch and distort when sent",
  },
  {
    id: "mp-8", name: "Halo Aura", type: "effect", cost: 1500,
    rarity: "legendary", rarityColor: "text-pink-400",
    owned: false, equipped: false, previewType: "description",
    description: "A floating halo follows your every move",
  },
  {
    id: "mp-9", name: "Pixel Frame", type: "frame", cost: 100,
    rarity: "common", rarityColor: "text-zinc-400",
    owned: false, equipped: false, previewType: "border",
    description: "Retro pixel art border for the old heads",
  },
  {
    id: "mp-10", name: "Zenith Title", type: "title", cost: 2000,
    rarity: "legendary", rarityColor: "text-pink-400",
    owned: false, equipped: false, previewType: "text",
    description: "The rarest title. Only 1% of roasters have this.",
  },
  {
    id: "mp-11", name: "Target Lock", type: "badge", cost: 400,
    rarity: "rare", rarityColor: "text-violet-400",
    owned: false, equipped: false, previewType: "icon",
    description: "Crosshair badge — you never miss",
  },
  {
    id: "mp-12", name: "Shockwave Effect", type: "effect", cost: 350,
    rarity: "rare", rarityColor: "text-violet-400",
    owned: false, equipped: false, previewType: "description",
    description: "A shockwave ripples from your avatar on wins",
  },
];

// ============================================================
// Groups
// ============================================================

export const mockGroups: GroupInfo[] = [
  {
    id: "g-1", name: "Anime Discourse",
    members: 12400, category: "Anime",
    description: "Debating the best arcs, fights, and power systems since day one",
    isJoined: true,
  },
  {
    id: "g-2", name: "Cinema Critics",
    members: 8900, category: "Movies",
    description: "Marvel vs DC, Nolan vs Villeneuve — we settle it here",
    isJoined: true,
  },
  {
    id: "g-3", name: "GG No Re",
    members: 6200, category: "Games",
    description: "From JRPGs to competitive shooters, we argue about it all",
    isJoined: false,
  },
  {
    id: "g-4", name: "Chart Wars",
    members: 4500, category: "Music",
    description: "Who's actually the GOAT? This crew decides",
    isJoined: false,
  },
  {
    id: "g-5", name: "Toon Squad",
    members: 3100, category: "Cartoons",
    description: "90s vs modern cartoons. The debate never ends",
    isJoined: false,
  },
  {
    id: "g-6", name: "Final Whistle",
    members: 2800, category: "Sports",
    description: "Messi vs Ronaldo, LeBron vs Jordan — pick your side",
    isJoined: false,
  },
];