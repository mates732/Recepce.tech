'use client';

import { useCallback, useRef } from 'react';
import { useStore } from '@/store/useStore';

type SoundType = 'hover' | 'click' | 'transition' | 'ambient';

export function useSound() {
  const audioEnabled = useStore((s) => s.audioEnabled);
  const audioContextRef = useRef<AudioContext | null>(null);  const getContext = useCallback((): AudioContext | null => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext ||
        (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
      }
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = 'sine') => {
      if (!audioEnabled) return;
      const ctx = getContext();
      if (!ctx) return;
      try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
      } catch {
        // Audio not available
      }
    },
    [audioEnabled, getContext]
  );

  const play = useCallback(
    (sound: SoundType) => {
      switch (sound) {
        case 'hover':
          playTone(800, 0.1, 'sine');
          break;
        case 'click':
          playTone(600, 0.15, 'square');
          break;
        case 'transition':
          playTone(440, 0.3, 'sawtooth');
          setTimeout(() => playTone(660, 0.3, 'sawtooth'), 150);
          break;
        case 'ambient':
          // Ambient handled separately
          break;
      }
    },
    [playTone]
  );

  return { play, audioEnabled };
}
