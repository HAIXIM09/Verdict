// ============================================================
// Verdict — Static Data Layer
// ============================================================

// Types still used by components
export interface Category {
  id: string;
  name: string;
  icon: string;
  battleCount: number;
  color: string;
}

// ============================================================
// Categories — still used for the arena category grid
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