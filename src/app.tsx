import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Stats } from '@react-three/drei'
import { World } from './world.js'
import { Space } from './space.js'
import { WorldControls } from './world-controls.js'
import './styles.css'

export function App() {
  return (
    <Canvas shadows camera={{ position: [0, 12, 0] }}>
      <Stats />
      <Suspense fallback={null}>
        <WorldControls angularSpeed={12}>
          <World />
        </WorldControls>
        <Space />
      </Suspense>
      <ambientLight intensity={0.2} />
      <spotLight
        intensity={1.5}
        position={[15, 15, -20]}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight intensity={0.85} position={[-10, 15, 20]} />
    </Canvas>
  )
}
