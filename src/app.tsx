import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { GrassDebug } from './features/grass/grass-debug';
import { PlanetRenderer } from './features/planet/planet';
import { MoonRenderer } from './features/moon/moon';
import { SpaceRenderer } from './features/space/space';
import { KeyboardCapture } from './features/keyboard-capture/keyboard-capture';
import { ResponsiveCamera } from './features/responsive-camera/responsive-camera';
import { Poster } from './features/poster/poster';
import { TouchControls } from './features/touch-controls/touch-controls';
import { Frameloop } from './frameloop';
import { Startup } from './startup';
import './styles.css';

export function App() {
  return (
    <>
      <Poster />
      <TouchControls />
      <GrassDebug />

      <Canvas shadows camera={{ position: [0, 12, 0] }}>
        <Suspense fallback={null}>
          <PlanetRenderer />
          <MoonRenderer />
          <SpaceRenderer />
          <Lights />
          <ResponsiveCamera />
        </Suspense>

        <Frameloop />
        <Startup />
        <KeyboardCapture />
      </Canvas>
    </>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <spotLight
        intensity={1.5 * Math.PI}
        position={[15, 15, -20]}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight intensity={0.85 * Math.PI} position={[-10, 15, 20]} />
    </>
  );
}
