import { create } from "zustand";

interface GameState {
  score: number;
  ghostY: number;
  direction: "up" | "down" | null;
  gameState: "idle" | "playing" | "over"; 
  addScore: (n: number) => void;
  moveGhost: (dir: "up" | "down") => void;
  setGhostY: (y: number) => void;
  setDirection: (dir: "up" | "down" | null) => void;
  setGameState: (state: "idle" | "playing" | "over") => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  ghostY: 300,
  direction: null,
  gameState: "idle",
  addScore: (n) => set((s) => ({ score: s.score + n })),
  moveGhost: (dir) =>
    set((s) => ({
      ghostY: Math.max(
        0,
        Math.min(540, s.ghostY + (dir === "up" ? -30 : 30))
      ),
    })),
  setGhostY: (y) => set({ ghostY: Math.max(0, Math.min(540, y)) }),
  setDirection: (dir) => set({ direction: dir }),
  setGameState: (state) => set({ gameState: state }),
  reset: () =>
    set({ score: 0, ghostY: 300, direction: null, gameState: "playing" }),
}));

export default useGameStore;
