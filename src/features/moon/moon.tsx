import { type ThreeEvent } from '@react-three/fiber';
import { Center, Text3D } from '@react-three/drei';
import { useQueryFirst, useWorld } from 'koota/react';
import { rigidBody } from 'crashcat';
import { useEffect, useRef } from 'react';
import { AnalyticHemisphereUniformsRef, IsMoon, Physics, PhysicsBody, Ref, Space } from '../../core/traits';
import {
  type AnalyticEnvShader,
  createAnalyticHemisphereUniforms,
  syncAnalyticHemisphereUniforms,
  extendStandardMaterialWithAnalyticEnv,
} from '../space/hemisphere/analytic-env';

import type { Entity } from 'koota';
import type { Group } from 'three';

const PUSH_SPEED = 3;

export function MoonRenderer() {
  const entity = useQueryFirst(IsMoon);
  if (!entity) return null;
  return <MoonView entity={entity} />;
}

function MoonView({ entity }: { entity: Entity }) {
  const world = useWorld();
  const spaceEntity = useQueryFirst(Space);
  const space = spaceEntity?.get(Space);
  const analyticEnvUniforms = useRef({
    ...createAnalyticHemisphereUniforms(),
    uAnalyticEnvIntensity: { value: 2.5 },
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

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const physics = world.get(Physics);
    const body = entity.get(PhysicsBody);
    if (!physics || !body) return;

    const dir = e.ray.direction;
    const point = e.point;
    const impulse = PUSH_SPEED / body.motionProperties.invMass;
    rigidBody.addImpulseAtPosition(
      physics,
      body,
      [dir.x * impulse, dir.y * impulse, dir.z * impulse],
      [point.x, point.y, point.z]
    );
  };

  const handleMaterialCompile = (shader: AnalyticEnvShader) => {
    if (analyticEnvUniforms) extendStandardMaterialWithAnalyticEnv(shader, analyticEnvUniforms);
  };

  return (
    <group ref={handleInit} onPointerDown={handlePointerDown}>
      <Center>
        <Text3D
          font="fonts/helvetiker_bold.typeface.json"
          size={0.9}
          height={0.5}
          bevelEnabled
          bevelSize={0.03}
          bevelThickness={0.02}
          curveSegments={8}
        >
          CCNYC
          <meshStandardMaterial
            onBeforeCompile={handleMaterialCompile}
            color="#21c2d1"
            emissive="#c0b0d8"
            emissiveIntensity={0.2}
            metalness={0.92}
            roughness={0.05}
            envMapIntensity={2.5}
          />
        </Text3D>
      </Center>
    </group>
  );
}
