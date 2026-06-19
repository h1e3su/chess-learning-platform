import { create } from 'zustand';

interface GameState {
  history: string[];
  setHistory: (history: string[]) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  history: [],
  setHistory: (history) => set({ history }),
  resetGame: () => set({ history: [] }),
}));
