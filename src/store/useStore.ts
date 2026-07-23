'use client';

import { create } from 'zustand';

export type SectionId = 0 | 1 | 2 | 3 | 4;

export type CursorVariant = 'default' | 'pointer' | 'text' | 'hidden';

interface StoreState {
  // Section tracking
  activeSection: SectionId;
  sectionProgress: number; // 0-1 within current section
  scrollProgress: number; // 0-1 overall

  // Audio
  audioEnabled: boolean;

  // Cursor
  cursorVariant: CursorVariant;

  // Mouse
  mousePosition: { x: number; y: number };
  mouseNormalized: { x: number; y: number }; // -1 to 1

  // Command palette
  isCommandPaletteOpen: boolean;

  // Easter eggs
  easterEggsFound: string[];

  // Actions
  setActiveSection: (section: SectionId) => void;
  setSectionProgress: (progress: number) => void;
  setScrollProgress: (progress: number) => void;
  toggleAudio: () => void;
  setCursorVariant: (variant: CursorVariant) => void;
  setMousePosition: (pos: { x: number; y: number }) => void;
  setMouseNormalized: (pos: { x: number; y: number }) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  addEasterEgg: (egg: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  activeSection: 0,
  sectionProgress: 0,
  scrollProgress: 0,

  audioEnabled: false,
  cursorVariant: 'default',

  mousePosition: { x: 0, y: 0 },
  mouseNormalized: { x: 0, y: 0 },

  isCommandPaletteOpen: false,
  easterEggsFound: [],

  setActiveSection: (section) => set({ activeSection: section }),
  setSectionProgress: (progress) => set({ sectionProgress: progress }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
  setMousePosition: (pos) => set({ mousePosition: pos }),
  setMouseNormalized: (pos) => set({ mouseNormalized: pos }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  addEasterEgg: (egg) =>
    set((state) => ({
      easterEggsFound: state.easterEggsFound.includes(egg)
        ? state.easterEggsFound
        : [...state.easterEggsFound, egg],
    })),
}));
