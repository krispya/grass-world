import { useLayoutEffect, useRef } from 'react';
import { useQueryFirst } from 'koota/react';
import { Sphere } from '@react-three/drei';
import { IsMoon, Ref } from '../../core/traits';

import type { Entity } from 'koota';
import type { Group } from 'three';

const RADIUS = 0.8;

export function MoonRenderer() {
  const entity = useQueryFirst(IsMoon);
  if (!entity) return null;
  return <MoonView entity={entity} />;
}

function MoonView({ entity }: { entity: Entity }) {
  const entityRef = useRef(entity);
  entityRef.current = entity;
  const groupRef = useRef<Group>(null);

  useLayoutEffect(() => {
    const currentEntity = entityRef.current;
    const group = groupRef.current;
    if (!group || !currentEntity.isAlive()) return;

    if (!currentEntity.has(Ref) || currentEntity.get(Ref) !== group) {
      currentEntity.add(Ref(group));
    }

    return () => {
      if (currentEntity.isAlive() && currentEntity.has(Ref) && currentEntity.get(Ref) === group) {
        currentEntity.remove(Ref);
      }
    };
  }, []);

  return (
    <group ref={groupRef}>
      <Sphere args={[RADIUS, 32, 32]} castShadow>
        <meshPhysicalMaterial
          color="#8a8a9a"
          emissive="#d1215e"
          emissiveIntensity={0.15}
          roughness={0.9}
          metalness={0.1}
        />
      </Sphere>
    </group>
  );
}
