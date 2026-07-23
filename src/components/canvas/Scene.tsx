'use client';

import { Canvas } from '@react-three/fiber';

import { Environment } from '@react-three/drei';
import CameraController from './CameraController';
import NeuronCore from './NeuronCore';

function SceneContent() {
  return (
    <>
      <color attach="background" args={['#07070d']} />
      <fog attach="fog" args={['#07070d', 10, 25]} />

      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#00d4ff" />
      <pointLight position={[0, 0, 0]} intensity={8} color="#00d4ff" distance={6} />
      <pointLight
        position={[-3, -2, -3]}
        intensity={3}
        color="#8b5cf6"
        distance={8}
      />

      <CameraController />
      <NeuronCore />

      <Environment preset="city" />
    </>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{
          position: [0, 0, 6],
          fov: 60,
          near: 0.1,
          far: 50,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        performance={{ min: 0.5 }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
