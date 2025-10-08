import { create } from "zustand";

interface GameState {
  score: number;
  ghostY: number;
  addScore: (n: number) => void;
  moveGhost: (dir: "up" | "down") => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  ghostY: 300,
  addScore: (n) => set((s) => ({ score: s.score + n })),
  moveGhost: (dir) =>
    set((s) => ({
      ghostY: Math.max(
        0,
        Math.min(540, s.ghostY + (dir === "up" ? -30 : 30))
      ),
    })),
  reset: () => set({ score: 0, ghostY: 300 }),
}));

export default useGameStore;
