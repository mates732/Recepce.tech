'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore, type SectionId } from '@/store/useStore';

interface CameraKeyframe {
  position: [number, number, number];
  target: [number, number, number];
}

const CAMERA_KEYFRAMES: Record<SectionId, CameraKeyframe> = {
  0: {
    position: [0, 0, 6],
    target: [0, 0, 0],
  },
  1: {
    position: [0, 1, 8],
    target: [0, -0.5, 0],
  },
  2: {
    position: [3, 0, 7],
    target: [0, 0, 0],
  },
  3: {
    position: [0, -1, 7],
    target: [0, 1, 0],
  },
  4: {
    position: [0, 0, 3],
    target: [0, 0, 0],
  },
};

function lerpVec3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

export default function CameraController() {
  const { camera } = useThree();
  const activeSection = useStore((s) => s.activeSection);
  const sectionProgress = useStore((s) => s.sectionProgress);

  // Smoothed values
  const smooth = useRef({ pos: [0, 0, 6] as [number, number, number] });

  useFrame((_, delta) => {
    const currentKeyframe = CAMERA_KEYFRAMES[activeSection];

    // Determine the next keyframe for smooth transitions
    const nextSection = Math.min(activeSection + 1, 4) as SectionId;
    const nextKeyframe = CAMERA_KEYFRAMES[nextSection];

    // Interpolate between current and next based on section progress
    const targetPos = lerpVec3(
      currentKeyframe.position,
      nextKeyframe.position,
      sectionProgress
    );
    const targetTarget = lerpVec3(
      currentKeyframe.target,
      nextKeyframe.target,
      sectionProgress
    );

    // Smooth lerp for camera movement
    const lerpFactor = 1 - Math.exp(-6 * delta);

    smooth.current.pos[0] += (targetPos[0] - smooth.current.pos[0]) * lerpFactor;
    smooth.current.pos[1] += (targetPos[1] - smooth.current.pos[1]) * lerpFactor;
    smooth.current.pos[2] += (targetPos[2] - smooth.current.pos[2]) * lerpFactor;

    camera.position.set(
      smooth.current.pos[0],
      smooth.current.pos[1],
      smooth.current.pos[2]
    );

    camera.lookAt(targetTarget[0], targetTarget[1], targetTarget[2]);
  });

  return null;
}
