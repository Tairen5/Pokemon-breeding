import { create } from 'zustand';
import type { PokemonInstance } from '../types';

interface StoreState {
  inventory: PokemonInstance[];
  addPokemon: (pokemon: PokemonInstance) => void;
  removePokemon: (id: string) => void;
  updatePokemon: (id: string, updates: Partial<PokemonInstance>) => void;
  target: PokemonInstance | null;
  setTarget: (target: PokemonInstance | null) => void;
  reset: () => void;
}

export const useStore = create<StoreState>((set) => ({
  inventory: [],
  target: null,
  addPokemon: (pokemon) =>
    set((state) => ({ inventory: [...state.inventory, pokemon] })),
  removePokemon: (id) =>
    set((state) => ({ inventory: state.inventory.filter((p) => p.id !== id) })),
  updatePokemon: (id, updates) =>
    set((state) => ({
      inventory: state.inventory.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  setTarget: (target) => set({ target }),
  reset: () => set({ inventory: [], target: null }),
}));
