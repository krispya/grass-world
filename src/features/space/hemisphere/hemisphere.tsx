import type { Entity } from 'koota';
import { useMemo } from 'react';
import type { ShaderMaterial } from 'three';
import * as THREE from 'three';
import { AnalyticHemisphereUniformsRef, Nebula, Space } from '../../../core/traits';
import {
  createAnalyticHemisphereUniforms,
  syncAnalyticHemisphereUniforms,
} from './analytic-env';
import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';

export function HemisphereView({ entity }: { entity: Entity }) {
  const uniforms = useMemo(() => {
    const uniforms = {
      ...createAnalyticHemisphereUniforms(),
      uNebulaEnabled: { value: 1 },
      uNebulaOpacity: { value: 0.28 },
      uNebulaPulseMin: { value: 0.75 },
      uNebulaPulseMax: { value: 1.0 },
      uNebulaPulseSpeed: { value: 0.07 },
    };
    const space = entity.get(Space);
    const nebula = entity.get(Nebula);
    if (space) syncAnalyticHemisphereUniforms(uniforms, space);
    if (nebula) {
      uniforms.uNebulaEnabled.value = nebula.enabled ? 1 : 0;
      uniforms.uNebulaOpacity.value = nebula.opacity;
      uniforms.uNebulaPulseMin.value = nebula.pulseMin;
      uniforms.uNebulaPulseMax.value = nebula.pulseMax;
      uniforms.uNebulaPulseSpeed.value = nebula.pulseSpeed;
    }

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
