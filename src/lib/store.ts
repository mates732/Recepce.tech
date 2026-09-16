import { create } from 'zustand';

interface AppStore {
  introPlayed: boolean;
  setIntroPlayed: (v: boolean) => void;
}

export const useStore = create<AppStore>((set) => ({
  introPlayed: false,
  setIntroPlayed: (v) => set({ introPlayed: v }),
}));
