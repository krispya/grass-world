import { Environment } from '@react-three/drei';
import type { Entity, TraitRecord } from 'koota';
import { useQueryFirst, useTrait } from 'koota/react';
import { useMemo } from 'react';
import type { ShaderMaterial } from 'three';
import * as THREE from 'three';
import { MaterialRef, Space, Stars, StarsMaterialRef } from '../../core/traits';
import { buildStarBuffers } from '../../util/stars';
import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';
import starsVertexShader from './shaders/stars-vertex.glsl';
import starsFragmentShader from './shaders/stars-fragment.glsl';

function StarsView({ entity }: { entity: Entity }) {
  const stars = useTrait(entity, Stars);
  if (!stars) return null;

  const {
    count,
    radius,
    depth,
    factor,
    saturation,
    brightnessMin,
    brightnessMax,
    twinkleChance,
    tintMin,
    tintMax,
  } = stars;

  const buffers = useMemo(
    () =>
      buildStarBuffers({
        count,
        radius,
        depth,
        factor,
        saturation,
        brightnessMin,
        brightnessMax,
        twinkleChance,
        tintMin,
        tintMax,
      } as TraitRecord<typeof Stars>),
    [
      count,
      radius,
      depth,
      factor,
      saturation,
      brightnessMin,
      brightnessMax,
      twinkleChance,
      tintMin,
      tintMax,
    ]
  );

  // Initial values only — the updateStars system drives these uniforms each frame.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFade: { value: 1.0 },
      uTwinkleAmplitude: { value: 0.4 },
      uColorShift: { value: 0 },
      uOpacity: { value: 1.0 },
      uTint: { value: new THREE.Color('#ffffff') },
    }),
    []
  );

  const handleMaterial = (mat: ShaderMaterial | null) => {
    if (!mat || !entity.isAlive()) return;
    entity.add(StarsMaterialRef(mat));
    return () => entity.remove(StarsMaterialRef);
  };

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[buffers.position, 3]} />
        <bufferAttribute attach="attributes-color" args={[buffers.color, 3]} />
        <bufferAttribute attach="attributes-size" args={[buffers.size, 1]} />
        <bufferAttribute attach="attributes-twinkle" args={[buffers.twinkle, 1]} />
        <bufferAttribute attach="attributes-tintAmount" args={[buffers.tintAmount, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={handleMaterial}
        uniforms={uniforms}
        vertexShader={starsVertexShader}
        fragmentShader={starsFragmentShader}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
        vertexColors
      />
    </points>
  );
}

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
