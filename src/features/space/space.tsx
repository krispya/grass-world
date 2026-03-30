import { Environment } from '@react-three/drei';
import type { Entity } from 'koota';
import { useQueryFirst } from 'koota/react';
import type { ShaderMaterial } from 'three';
import * as THREE from 'three';
import { MaterialRef, Space } from '../../core/traits';
import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';
import { StarsView } from './stars';

function SkyView({ entity }: { entity: Entity }) {
  const uniforms = {
    uColorBase: { value: new THREE.Color('#312a49') },
    uColorA: { value: new THREE.Color('hotpink') },
    uColorB: { value: new THREE.Color('#447') },
    uAlpha: { value: 0.8 },
    uOrigin: { value: new THREE.Vector3(100, 100, 100) },
    uFar: { value: 300 },
  };

  const handleMaterialInit = (material: ShaderMaterial | null) => {
    if (!material || !entity.isAlive()) return;
    entity.add(MaterialRef(material));
    return () => entity.remove(MaterialRef);
  };

  return (
    <Environment frames={Infinity} background resolution={256}>
      <mesh scale={100}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          ref={handleMaterialInit}
          side={THREE.BackSide}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </Environment>
  );
}

function SpaceView({ entity }: { entity: Entity }) {
  return (
    <>
      <SkyView entity={entity} />
      <StarsView entity={entity} />
    </>
  );
}

export function SpaceRenderer() {
  const entity = useQueryFirst(Space);
  return entity ? <SpaceView entity={entity} /> : null;
}
