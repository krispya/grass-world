import { useRef } from 'react';
import { Sampler, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Grass, MaterialRef } from '../../core/traits';
import { randomInRange } from '../../util/random';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import type { Entity, TraitRecord } from 'koota';
import type { RefObject } from 'react';
import type { InstancedMesh, Mesh, ShaderMaterial } from 'three';

interface GrassViewProps {
  entity: Entity;
  grass: TraitRecord<typeof Grass>;
  surfaceRef: RefObject<Mesh | null>;
}

function createBladeGeometry(bW: number, bH: number, joints: number) {
  const geo = new THREE.PlaneGeometry(bW, bH, 2, joints);
  geo.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -bH / 2, 0));
  geo.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  const verts = geo.attributes.position.array as Float32Array;
  for (let i = 0; i < verts.length; i += 3) {
    if (verts[i + 0] === 0) verts[i + 1] = bW / 2;
  }
  return geo;
}

export function GrassView({ entity, grass, surfaceRef }: GrassViewProps) {
  const { bW, bH, joints, count } = grass;
  const instances = useRef<InstancedMesh>(null!);
  const alphaMap = useTexture('assets/blade_a.jpg');

  const handleInit = (material: ShaderMaterial | null) => {
    if (!material || !entity.isAlive()) return;
    entity.add(MaterialRef(material));
    return () => {
      if (entity.isAlive()) entity.remove(MaterialRef);
    };
  };

  const geometry = createBladeGeometry(bW, bH, joints);

  const uniforms = {
    uTime: { value: 0 },
    uSway: { value: 1.0 },
    uWindSpeed: { value: 0.5 },
    uAngularVelocity: { value: new THREE.Vector3() },
    uRotWindStrength: { value: 0.2 },
    uRotSwayAtten: { value: 1.5 },
    uAlphaMap: { value: alphaMap },
    uColorA: { value: new THREE.Color('#d62a58') },
    uColorB: { value: new THREE.Color('#1c1a3d') },
    uEmissive: { value: new THREE.Color('#d1215e') },
    uEmissiveIntensity: { value: 0.28 },
    uFogNear: { value: 9.2 },
    uFogFar: { value: 25 },
    uEnvMap: { value: null },
    uEnvMapIntensity: { value: 0.5 },
    uRimColor: { value: new THREE.Color('#f06926') },
    uRimIntensity: { value: 0 },
    uRimPower: { value: 5 },
    uRimDirection: { value: new THREE.Vector3(-1, 1, -0.5) },
  };

  const scene = useThree((state) => state.scene);
  useFrame(() => {
    const mat = entity?.get(MaterialRef);
    if (mat && scene.environment) {
      mat.uniforms.uEnvMap.value = scene.environment;
    }
  });

  return (
    <>
      <instancedMesh ref={instances} args={[geometry, undefined, count]} receiveShadow>
        <shaderMaterial
          ref={handleInit}
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
          const scale = randomInRange(0.65, 1);
          const rotation = randomInRange(0.01, 0.3);
          sampledMesh.localToWorld(position);
          dummy.position.copy(position);
          dummy.lookAt(normal.clone().add(position));
          dummy.scale.setScalar(scale);
          dummy.rotateOnAxis(normal, randomInRange(-rotation, rotation));
        }}
      />
    </>
  );
}
