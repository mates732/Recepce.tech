"use client";

import { useRef, useCallback, useState } from "react";

interface CardTiltOptions {
  perspective?: number;
  maxRotateX?: number;
  maxRotateY?: number;
  translateZ?: number;
}

interface CardTiltState {
  rotateX: number;
  rotateY: number;
  translateZ: number;
  glareX: number;
  glareY: number;
  isHovering: boolean;
}

const DEFAULTS: CardTiltOptions = {
  perspective: 1200,
  maxRotateX: 2,
  maxRotateY: 2.5,
  translateZ: 6,
};

export function useCardTilt(options: CardTiltOptions = {}) {
  const opts = { ...DEFAULTS, ...options };
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CardTiltState>({
    rotateX: 0,
    rotateY: 0,
    translateZ: 0,
    glareX: 50,
    glareY: 50,
    isHovering: false,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);

      setState({
        rotateX: -y * opts.maxRotateX!,
        rotateY: x * opts.maxRotateY!,
        translateZ: opts.translateZ!,
        glareX: ((e.clientX - rect.left) / rect.width) * 100,
        glareY: ((e.clientY - rect.top) / rect.height) * 100,
        isHovering: true,
      });
    },
    [opts.maxRotateX, opts.maxRotateY, opts.translateZ],
  );

  const handleMouseLeave = useCallback(() => {
    setState((prev) => ({
      ...prev,
      rotateX: 0,
      rotateY: 0,
      translateZ: 0,
      isHovering: false,
    }));
  }, []);

  const transform = state.isHovering
    ? `perspective(${opts.perspective}px) rotateX(${state.rotateX}deg) rotateY(${state.rotateY}deg) translateZ(${state.translateZ}px)`
    : `perspective(${opts.perspective}px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;

  return {
    ref,
    style: {
      transform,
      transformStyle: "preserve-3d" as const,
      transition: "transform 250ms cubic-bezier(0.22,1,0.36,1)",
    },
    glareStyle: {
      position: "absolute" as const,
      inset: 0,
      borderRadius: "inherit",
      opacity: state.isHovering ? 0.1 : 0,
      background: `radial-gradient(circle at ${state.glareX}% ${state.glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
      transition: "opacity 250ms cubic-bezier(0.22,1,0.36,1)",
      pointerEvents: "none" as const,
    },
    handleMouseMove,
    handleMouseLeave,
  };
}
