import type { Entity } from 'koota';
import { useMemo } from 'react';
import type { ShaderMaterial } from 'three';
import * as THREE from 'three';
import { AnalyticHemisphereUniformsRef, Space } from '../../../core/traits';
import {
  createAnalyticHemisphereUniforms,
  syncAnalyticHemisphereUniforms,
} from './analytic-env';
import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';

export function HemisphereView({ entity }: { entity: Entity }) {
  const uniforms = useMemo(() => {
    const uniforms = createAnalyticHemisphereUniforms();
    const space = entity.get(Space);
    if (space) syncAnalyticHemisphereUniforms(uniforms, space);

    return uniforms;
  }, [entity]);

  const onInit = (material: ShaderMaterial | null) => {
    if (!material || !entity.isAlive()) return;
    entity.add(AnalyticHemisphereUniformsRef(material.uniforms));
    return () => entity.remove(AnalyticHemisphereUniformsRef);
  };

  return (
    <mesh scale={100} frustumCulled={false} renderOrder={-1}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={onInit}
        side={THREE.BackSide}
        depthWrite={false}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        onUpdate={(self) => {
          if (!self.uniforms) self.uniforms = {};
          Object.assign(self.uniforms, uniforms);
          self.needsUpdate = true;
        }}
      />
    </mesh>
  );
}
