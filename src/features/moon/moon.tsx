import { Center, Text3D } from '@react-three/drei';
import { useQueryFirst, useWorld } from 'koota/react';
import { rigidBody } from 'crashcat';
import { IsMoon, Physics, PhysicsBody, Ref } from '../../core/traits';

import type { ThreeEvent } from '@react-three/fiber';
import type { Entity } from 'koota';
import type { Group } from 'three';

const PUSH_STRENGTH = 3;

export function MoonRenderer() {
  const entity = useQueryFirst(IsMoon);
  if (!entity) return null;
  return <MoonView entity={entity} />;
}

function MoonView({ entity }: { entity: Entity }) {
  const world = useWorld();

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
    rigidBody.addImpulseAtPosition(
      physics,
      body,
      [dir.x * PUSH_STRENGTH, dir.y * PUSH_STRENGTH, dir.z * PUSH_STRENGTH],
      [point.x, point.y, point.z]
    );
  };

  return (
    <group ref={handleInit} onPointerDown={handlePointerDown}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.7}
          height={0.35}
          bevelEnabled
          bevelSize={0.02}
          bevelThickness={0.01}
          curveSegments={6}
        >
          CCNYC
          <meshPhysicalMaterial
            color="#8a8a9a"
            emissive="#d1215e"
            emissiveIntensity={0.15}
            roughness={0.9}
            metalness={0.1}
          />
        </Text3D>
      </Center>
    </group>
  );
}
