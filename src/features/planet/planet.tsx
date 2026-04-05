import { Sphere } from '@react-three/drei';
import { useQueryFirst, useTrait } from 'koota/react';
import { useEffect, useRef } from 'react';
import { AnalyticHemisphereUniformsRef, Grass, IsPlanet, Ref, Space } from '../../core/traits';
import {
  type AnalyticEnvShader,
  createAnalyticHemisphereUniforms,
  syncAnalyticHemisphereUniforms,
  extendStandardMaterialWithAnalyticEnv,
} from '../space/hemisphere/analytic-env';
import { GrassView } from '../grass/grass';

import type { Entity } from 'koota';
import type { Group, Mesh } from 'three';

const RADIUS = 5;

export function PlanetRenderer() {
  const entity = useQueryFirst(IsPlanet);
  if (!entity) return null;
  return <PlanetView entity={entity} />;
}

function PlanetView({ entity }: { entity: Entity }) {
  const sphereRef = useRef<Mesh>(null);
  const grass = useTrait(entity, Grass);
  const spaceEntity = useQueryFirst(Space);
  const space = spaceEntity?.get(Space);
  const analyticEnvUniforms = useRef({
    ...createAnalyticHemisphereUniforms(),
    uAnalyticEnvIntensity: { value: 2.0 },
  }).current;

  useEffect(() => {
    if (!entity.isAlive()) return;
    entity.add(AnalyticHemisphereUniformsRef(analyticEnvUniforms));
    return () => {
      if (entity.isAlive()) entity.remove(AnalyticHemisphereUniformsRef);
    };
  }, [analyticEnvUniforms, entity]);

  useEffect(() => {
    if (space) syncAnalyticHemisphereUniforms(analyticEnvUniforms, space);
  }, [analyticEnvUniforms, space]);

  const handleInit = (group: Group | null) => {
    if (!group || !entity.isAlive()) return;
    entity.add(Ref(group));
    return () => entity.remove(Ref);
  };

  const handleMaterialCompile = (shader: AnalyticEnvShader) => {
    if (analyticEnvUniforms) extendStandardMaterialWithAnalyticEnv(shader, analyticEnvUniforms);
  };

  return (
    <group ref={handleInit}>
      <Sphere ref={sphereRef} args={[RADIUS, 32, 32]} receiveShadow castShadow>
        <meshStandardMaterial
          onBeforeCompile={handleMaterialCompile}
          color="#32194c"
          emissive="#b3292e"
          emissiveIntensity={0.3}
          metalness={0.18}
          roughness={0.68}
          envMapIntensity={2}
        />
      </Sphere>
      {grass && <GrassView entity={entity} grass={grass} surfaceRef={sphereRef} />}
    </group>
  );
}
