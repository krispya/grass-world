import { Entity } from 'koota';
import { useTrait } from 'koota/react';
import * as THREE from 'three';
import { ShaderMaterial } from 'three';
import { Stars, StarsMaterialRef } from '../../../core/traits';
import { buildStarBuffers } from '../../../util/stars';
import starsFragmentShader from './shaders/stars-fragment.glsl';
import starsVertexShader from './shaders/stars-vertex.glsl';

export function StarsView({ entity }: { entity: Entity }) {
  const stars = useTrait(entity, Stars);
  if (!stars) return null;

  const buffers = buildStarBuffers(stars);

  // Initial values only — the updateStars system drives these uniforms each frame.
  const uniforms = {
    uTime: { value: 0 },
    uFade: { value: 1.0 },
    uTwinkleAmplitude: { value: 0.4 },
    uColorShift: { value: 0 },
    uOpacity: { value: 1.0 },
    uTint: { value: new THREE.Color('#ffffff') },
  };

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
