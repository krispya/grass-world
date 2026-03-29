import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Stats } from '@react-three/drei';
import { PlanetRenderer } from './features/planet/planet';
import { MoonRenderer } from './features/moon/moon';
import { SpaceRenderer } from './features/space/space';
import { KeyboardCapture } from './features/keyboard-capture/keyboard-capture';
import { Frameloop } from './frameloop';
import { Startup } from './startup';
import './styles.css';

export function App() {
  return (
    <Canvas shadows camera={{ position: [0, 12, 0] }}>
      <Stats />
      <Suspense fallback={null}>
        <PlanetRenderer />
        <MoonRenderer />
        <SpaceRenderer />
      </Suspense>
      <ambientLight intensity={0.2} />
      <spotLight
        intensity={1.5 * Math.PI}
        position={[15, 15, -20]}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight intensity={0.85 * Math.PI} position={[-10, 15, 20]} />

      <Frameloop />
      <Startup />
      <KeyboardCapture />
    </Canvas>
  );
}
