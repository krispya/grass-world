import type { Entity } from 'koota';
import { useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import type { ShaderMaterial } from 'three';
import * as THREE from 'three';
import { AnalyticHemisphereUniformsRef, Nebula, Space } from '../../../core/traits';
import { createAnalyticHemisphereUniforms, syncAnalyticHemisphereUniforms } from './analytic-env';
import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';

const nebulaVariants = [
  `${import.meta.env.BASE_URL}assets/nebula-baked-1.png`,
  `${import.meta.env.BASE_URL}assets/nebula-baked-2.png`,
  `${import.meta.env.BASE_URL}assets/nebula-baked-3.png`,
  `${import.meta.env.BASE_URL}assets/nebula-baked-4.png`,
  `${import.meta.env.BASE_URL}assets/nebula-baked-5.png`,
];

export function HemisphereView({ entity }: { entity: Entity }) {
  const nebulaPath = useMemo(
    () => nebulaVariants[Math.floor(Math.random() * nebulaVariants.length)],
    []
  );

  const nebulaMap = useTexture(nebulaPath);
  nebulaMap.colorSpace = THREE.SRGBColorSpace;
  nebulaMap.wrapS = THREE.RepeatWrapping;
  nebulaMap.wrapT = THREE.ClampToEdgeWrapping;

  const uniforms = useMemo(() => {
    const uniforms = {
      ...createAnalyticHemisphereUniforms(),
      uNebulaEnabled: { value: 1 },
      uNebulaMap: { value: nebulaMap },
      uNebulaOpacity: { value: 0.28 },
      uNebulaDriftSpeed: { value: 0.0015 },
      uNebulaPulseMin: { value: 0.75 },
      uNebulaPulseMax: { value: 1.0 },
      uNebulaPulseSpeed: { value: 0.07 },
    };

    const space = entity.get(Space);
    if (space) syncAnalyticHemisphereUniforms(uniforms, space);

    const nebula = entity.get(Nebula);
    if (nebula) {
      uniforms.uNebulaEnabled.value = nebula.enabled ? 1 : 0;
      uniforms.uNebulaOpacity.value = nebula.opacity;
      uniforms.uNebulaDriftSpeed.value = nebula.driftSpeed;
      uniforms.uNebulaPulseMin.value = nebula.pulseMin;
      uniforms.uNebulaPulseMax.value = nebula.pulseMax;
      uniforms.uNebulaPulseSpeed.value = nebula.pulseSpeed;
    }

    return uniforms;
  }, [entity, nebulaMap]);

  const handleInit = (material: ShaderMaterial | null) => {
    if (!material || !entity.isAlive()) return;
    entity.add(AnalyticHemisphereUniformsRef(material.uniforms));
    return () => entity.remove(AnalyticHemisphereUniformsRef);
  };

  return (
    <mesh scale={100} frustumCulled={false} renderOrder={-1}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={handleInit}
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
