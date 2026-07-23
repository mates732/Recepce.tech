'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/store/useStore';
import * as THREE from 'three';

const BRANCH_COUNT = 120;
const BRANCH_RADIUS = 3.5;

const branchData = (() => {
  const thetas = new Float32Array(BRANCH_COUNT);
  const phis = new Float32Array(BRANCH_COUNT);
  const radii = new Float32Array(BRANCH_COUNT);
  const colorScalars = new Float32Array(BRANCH_COUNT);

  for (let i = 0; i < BRANCH_COUNT; i++) {
    thetas[i] = Math.random() * Math.PI * 2;
    phis[i] = Math.acos(2 * Math.random() - 1);
    radii[i] = BRANCH_RADIUS * (0.3 + Math.random() * 0.7);
    colorScalars[i] = 0.3 + Math.random() * 0.7;
  }

  return { thetas, phis, radii, colorScalars };
})();

function NeuralBranches() {
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, colors } = useMemo(() => {
    const pos: number[] = [];
    const col: number[] = [];
    const colorBase = new THREE.Color('#00d4ff');

    for (let i = 0; i < BRANCH_COUNT; i++) {
      const r = branchData.radii[i];
      const theta = branchData.thetas[i];
      const phi = branchData.phis[i];

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos.push(0, 0, 0);
      pos.push(x, y, z);

      const c = colorBase.clone().multiplyScalar(branchData.colorScalars[i]);
      col.push(c.r, c.g, c.b);
      col.push(c.r, c.g, c.b);
    }

    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col),
    };
  }, []);

  useFrame((state) => {
    if (!linesRef.current) return;
    const time = state.clock.elapsedTime;
    const positions = linesRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < BRANCH_COUNT; i++) {
      const idx = i * 6;
      const theta = (i / BRANCH_COUNT) * Math.PI * 2 + time * 0.1;
      const phi = Math.acos(2 * ((i % 37) / 37) - 1);
      const pulse = 1 + Math.sin(time * 0.5 + i * 0.1) * 0.15;
      const r = BRANCH_RADIUS * (0.3 + (i % 10) / 10) * pulse;

      positions[idx + 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[idx + 4] = r * Math.sin(phi) * Math.sin(theta);
      positions[idx + 5] = r * Math.cos(phi);
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.4}
        linewidth={1}
      />
    </lineSegments>
  );
}

function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return;

    const time = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(time * 0.8) * 0.05;

    meshRef.current.scale.setScalar(pulse);
    meshRef.current.rotation.x = time * 0.1;
    meshRef.current.rotation.y = time * 0.15;

    glowRef.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.1);
    (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
      0.15 + Math.sin(time * 0.5) * 0.05;
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.8, 2]} />
        <meshPhysicalMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.95}
        />
      </mesh>

      <mesh ref={glowRef}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.015, 16, 64]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} />
      </mesh>

      <mesh rotation={[0, Math.PI / 3, Math.PI / 4]}>
        <torusGeometry args={[1.6, 0.01, 8, 64]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

const PARTICLE_COUNT = 600;

const particleData = (() => {
  const radii = new Float32Array(PARTICLE_COUNT);
  const thetas = new Float32Array(PARTICLE_COUNT);
  const phis = new Float32Array(PARTICLE_COUNT);
  const speeds = new Float32Array(PARTICLE_COUNT);
  const sizes = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    radii[i] = 2 + Math.random() * 6;
    thetas[i] = Math.random() * Math.PI * 2;
    phis[i] = Math.acos(2 * Math.random() - 1);
    speeds[i] = 0.02 + (i % 7) * 0.005;
    sizes[i] = 0.02 + Math.random() * 0.04;
  }

  return { radii, thetas, phis, speeds, sizes };
})();

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  const particleOrbits = useMemo(() => {
    const count = PARTICLE_COUNT;
    const data = {
      positions: new Float32Array(count * 3),
      sizes: new Float32Array(count),
      speeds: particleData.speeds,
      thetas: particleData.thetas,
      phis: particleData.phis,
      radii: particleData.radii,
    };

    for (let i = 0; i < count; i++) {
      const r = data.radii[i];
      const theta = data.thetas[i];
      const phi = data.phis[i];

      data.positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      data.positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      data.positions[i * 3 + 2] = r * Math.cos(phi);

      data.sizes[i] = particleData.sizes[i];
    }

    return data;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const theta = particleOrbits.thetas[i] + time * particleOrbits.speeds[i] * 0.3;
      const phi = particleOrbits.phis[i] + time * particleOrbits.speeds[i] * 0.1;
      const r = particleOrbits.radii[i] + Math.sin(time * 0.3 + i * 0.01) * 0.02;

      const sinPhi = Math.sin(phi);
      positions[i3] = r * sinPhi * Math.cos(theta);
      positions[i3 + 1] = r * sinPhi * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particleOrbits.positions, 3]}
          count={PARTICLE_COUNT}
          array={particleOrbits.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[particleOrbits.sizes, 1]}
          count={PARTICLE_COUNT}
          array={particleOrbits.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#00d4ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function NeuronCore() {
  const groupRef = useRef<THREE.Group>(null);
  const activeSection = useStore((s) => s.activeSection);
  const sectionProgress = useStore((s) => s.sectionProgress);
  const mouseNormalized = useStore((s) => s.mouseNormalized);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    groupRef.current.position.y = Math.sin(time * 0.2) * 0.15;
    groupRef.current.rotation.x = mouseNormalized.y * 0.05;
    groupRef.current.rotation.y = mouseNormalized.x * 0.05;

    const scale = activeSection === 4 ? 0.3 + sectionProgress * 2 : 1;
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
      <CoreSphere />
      <NeuralBranches />
      <ParticleField />
    </group>
  );
}
