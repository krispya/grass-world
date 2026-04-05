import type { Entity, TraitRecord } from 'koota';
import { useQueryFirst } from 'koota/react';
import type { RefObject } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import type { InstancedMesh, Mesh, ShaderMaterial } from 'three';
import * as THREE from 'three';
import { AnalyticHemisphereUniformsRef, Grass, GrassCulling, MaterialRef, Space } from '../../core/traits';
import {
  createAnalyticHemisphereUniforms,
  syncAnalyticHemisphereUniforms,
} from '../space/hemisphere/analytic-env';
import { createBladeGeometry, createGrassCulling } from './utils';
import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';

interface GrassViewProps {
  entity: Entity;
  grass: TraitRecord<typeof Grass>;
  surfaceRef: RefObject<Mesh | null>;
}

export function GrassView({ entity, grass, surfaceRef }: GrassViewProps) {
  const { bW, bH, joints, count } = grass;
  const instances = useRef<InstancedMesh>(null!);
  const spaceEntity = useQueryFirst(Space);
  const space = spaceEntity?.get(Space);

  const handleInit = (material: ShaderMaterial | null) => {
    if (!material || !entity.isAlive()) return;
    entity.add(MaterialRef(material));
    return () => {
      if (entity.isAlive()) entity.remove(MaterialRef);
    };
  };

  const geometry = useMemo(() => createBladeGeometry(bW, bH, joints), [bW, bH, joints]);
  const uniforms = useRef({
    ...createAnalyticHemisphereUniforms(),
    uTime: { value: 0 },
    uSway: { value: 1.0 },
    uWindSpeed: { value: 0.5 },
    uAngularVelocity: { value: new THREE.Vector3() },
    uRotWindStrength: { value: 0.2 },
    uRotSwayAtten: { value: 1.5 },
    uColorA: { value: new THREE.Color('#d62a58') },
    uColorB: { value: new THREE.Color('#1c1a3d') },
    uEmissive: { value: new THREE.Color('#d1215e') },
    uEmissiveIntensity: { value: 0.28 },
    uFogNear: { value: 9.2 },
    uFogFar: { value: 25 },
    uEnvMapIntensity: { value: 0.5 },
    uRimColor: { value: new THREE.Color('#f06926') },
    uRimIntensity: { value: 0 },
    uRimPower: { value: 5 },
    uRimDirection: { value: new THREE.Vector3(-1, 1, -0.5) },
  }).current;

  useEffect(() => {
    if (!entity.isAlive()) return;
    entity.add(AnalyticHemisphereUniformsRef(uniforms));
    return () => {
      if (entity.isAlive()) entity.remove(AnalyticHemisphereUniformsRef);
    };
  }, [entity, uniforms]);

  useEffect(() => {
    if (space) syncAnalyticHemisphereUniforms(uniforms, space);
  }, [space, uniforms]);

  useEffect(() => {
    const mesh = instances.current;
    const surface = surfaceRef.current;
    if (!mesh || !surface || !entity.isAlive()) return;

    if (!surface.geometry.boundingSphere) surface.geometry.computeBoundingSphere();
    const radius = surface.geometry.boundingSphere?.radius;
    if (!radius) return;

    const culling = createGrassCulling(mesh, count, radius);
    entity.add(GrassCulling(culling));

    return () => {
      if (entity.isAlive()) entity.remove(GrassCulling);
    };
  }, [count, entity, surfaceRef]);

  if (!space) return null;

  return (
    <instancedMesh ref={instances} args={[geometry, undefined, count]} receiveShadow>
      <shaderMaterial
        ref={handleInit}
        side={THREE.DoubleSide}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </instancedMesh>
  );
}
