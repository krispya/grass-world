import { useLayoutEffect, useRef } from 'react';
import { useQueryFirst, useTrait } from 'koota/react';
import { Sphere } from '@react-three/drei';
import { Grass, IsPlanet, Ref } from '../../core/traits';
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
  const entityRef = useRef(entity);
  entityRef.current = entity;
  const groupRef = useRef<Group>(null);
  const sphereRef = useRef<Mesh>(null);
  const grass = useTrait(entity, Grass);

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
      <Sphere ref={sphereRef} args={[RADIUS, 32, 32]} receiveShadow castShadow>
        <meshPhysicalMaterial
          color="#32194c"
          emissive="#b3292e"
          emissiveIntensity={0.3}
          roughness={0.8}
          envMapIntensity={2}
        />
      </Sphere>
      {grass && <GrassView entity={entity} grass={grass} surfaceRef={sphereRef} />}
    </group>
  );
}
