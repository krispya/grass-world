import { memo, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Sampler } from '@react-three/drei'
import { randomInRange } from './util/random.js'
import type { InstancedMesh, Mesh } from 'three'

interface ForestProps {
  count?: number
  meshRef: React.RefObject<Mesh | null>
}

export const Forest = memo(function Forest({ count = 5000, meshRef }: ForestProps) {
  const instances = useRef<InstancedMesh>(null!)

  const geometry = useMemo(() => {
    // Stylized pine: a cone rotated to point along +Z so Sampler's lookAt orients it outward
    const cone = new THREE.ConeGeometry(0.4, 1.2, 6)
    cone.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2))
    return cone
  }, [])

  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#2a0a1a', roughness: 1 }),
    [],
  )

  return (
    <>
      <instancedMesh ref={instances} args={[geometry, material, count]} receiveShadow castShadow />
      <Sampler
        mesh={meshRef}
        instances={instances}
        count={count}
        transform={({ dummy, sampledMesh, position, normal }) => {
          const scale = randomInRange(0.15, 0.35)
          const rotation = randomInRange(-Math.PI / 3, Math.PI / 3)
          sampledMesh.localToWorld(position)
          dummy.position.copy(position)
          dummy.lookAt(normal.clone().add(position))
          dummy.scale.setScalar(scale)
          dummy.rotateZ(rotation)
        }}
      />
    </>
  )
})
