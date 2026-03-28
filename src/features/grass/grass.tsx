import { useLayoutEffect, useMemo, useRef } from 'react'
import { Sampler, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { Grass, MaterialRef } from '../../core/traits'
import { randomInRange } from '../../util/random'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'
import type { Entity, TraitRecord } from 'koota'
import type { RefObject } from 'react'
import type { InstancedMesh, Mesh, ShaderMaterial } from 'three'

interface GrassViewProps {
  entity: Entity
  grass: TraitRecord<typeof Grass>
  surfaceRef: RefObject<Mesh | null>
}

export function GrassView({ entity, grass, surfaceRef }: GrassViewProps) {
  const { bW, bH, joints, count } = grass
  const instances = useRef<InstancedMesh>(null!)
  const materialRef = useRef<ShaderMaterial>(null!)
  const entityRef = useRef(entity)
  entityRef.current = entity
  const alphaMap = useTexture('/assets/blade_a.jpg')

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

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(bW, bH, 2, joints)
    geo.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -bH / 2, 0))
    geo.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2))
    const verts = geo.attributes.position.array as Float32Array
    for (let i = 0; i < verts.length; i += 3) {
      if (verts[i + 0] === 0) verts[i + 1] = bW / 2
    }
    return geo
  }, [bW, bH, joints])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSway: { value: 1.0 },
      uWindSpeed: { value: 0.5 },
      uAlphaMap: { value: alphaMap },
      uColorA: { value: new THREE.Color('#d62a58') },
      uColorB: { value: new THREE.Color('#1c1a3d') },
      uEmissive: { value: new THREE.Color('#d1215e') },
      uEmissiveIntensity: { value: 0.28 },
      uFogNear: { value: 9.2 },
      uFogFar: { value: 25 },
    }),
    [alphaMap],
  )

  return (
    <>
      <instancedMesh ref={instances} args={[geometry, undefined, count]} receiveShadow>
        <shaderMaterial
          ref={materialRef}
          side={THREE.DoubleSide}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </instancedMesh>
      <Sampler
        mesh={surfaceRef as RefObject<Mesh>}
        instances={instances}
        count={count}
        transform={({ dummy, sampledMesh, position, normal }) => {
          const scale = randomInRange(0.65, 1)
          const rotation = randomInRange(0.01, 0.3)
          sampledMesh.localToWorld(position)
          dummy.position.copy(position)
          dummy.lookAt(normal.clone().add(position))
          dummy.scale.setScalar(scale)
          dummy.rotateOnAxis(normal, randomInRange(-rotation, rotation))
        }}
      />
    </>
  )
}
