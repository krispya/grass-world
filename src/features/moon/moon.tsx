import { Sphere } from '@react-three/drei';
import { useQueryFirst } from 'koota/react';
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
  const handleInit = (group: Group | null) => {
    if (!group || !entity.isAlive()) return;
    entity.add(Ref(group));
    return () => entity.remove(Ref);
  };

  return (
    <group ref={handleInit}>
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
