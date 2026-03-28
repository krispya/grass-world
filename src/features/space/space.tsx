import { useLayoutEffect, useMemo, useRef } from 'react'
import { useQueryFirst } from 'koota/react'
import { Environment, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { IsSpace, MaterialRef } from '../../core/traits'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'
import type { Entity } from 'koota'
import type { ShaderMaterial } from 'three'

export function SpaceRenderer() {
  const entity = useQueryFirst(IsSpace)
  if (!entity) return null
  return <SpaceView entity={entity} />
}

function SpaceView({ entity }: { entity: Entity }) {
  const entityRef = useRef(entity)
  entityRef.current = entity
  const materialRef = useRef<ShaderMaterial>(null!)

  useLayoutEffect(() => {
    const currentEntity = entityRef.current
    const material = materialRef.current
    if (!material || !currentEntity.isAlive()) return

    if (!currentEntity.has(MaterialRef) || currentEntity.get(MaterialRef) !== material) {
      currentEntity.add(MaterialRef(material))
    }

    return () => {
      if (currentEntity.isAlive() && currentEntity.has(MaterialRef) && currentEntity.get(MaterialRef) === material) {
        currentEntity.remove(MaterialRef)
      }
    }
  }, [])

  const uniforms = useMemo(
    () => ({
      uColorBase: { value: new THREE.Color('#312a49') },
      uColorA: { value: new THREE.Color('hotpink') },
      uColorB: { value: new THREE.Color('#447') },
      uAlpha: { value: 0.8 },
      uOrigin: { value: new THREE.Vector3(100, 100, 100) },
      uFar: { value: 300 },
    }),
    [],
  )

  return (
    <>
      <Environment frames={Infinity} background resolution={256}>
        <mesh scale={100}>
          <sphereGeometry args={[1, 64, 64]} />
          <shaderMaterial
            ref={materialRef}
            side={THREE.BackSide}
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
          />
        </mesh>
      </Environment>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
    </>
  )
}
