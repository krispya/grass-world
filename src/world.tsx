import { useRef } from 'react';
import { Sphere } from '@react-three/drei';
import { Forest } from './forest.js';
import { Grass } from './grass.js';
import type { ThreeElements } from '@react-three/fiber';
import type { Mesh } from 'three';

const RADIUS = 5;

export function World(props: ThreeElements['group']) {
  const worldRef = useRef<Mesh>(null!);

  return (
    <group {...props}>
      <Sphere ref={worldRef} args={[RADIUS, 32, 32]} receiveShadow castShadow>
        <meshPhysicalMaterial
          color="#32194c"
          emissive="#b3292e"
          emissiveIntensity={0.3}
          roughness={0.8}
          envMapIntensity={2}
        />
      </Sphere>
      {/* <Forest count={100} meshRef={worldRef} /> */}
      <Grass bH={0.5} bW={0.065} sway={0.5} count={60000} meshRef={worldRef} />
    </group>
  );
}
