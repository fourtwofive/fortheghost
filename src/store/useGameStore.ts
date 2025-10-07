import { create } from "zustand";

interface GameState {
  score: number;
  addScore: (n: number) => void;
}

const useGameStore = create<GameState>((set) => ({
  score: 0,
  addScore: (n) => set((s) => ({ score: s.score + n })),
}));

export default useGameStore;

