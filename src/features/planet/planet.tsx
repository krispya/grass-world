import { Sphere } from '@react-three/drei';
import { useQueryFirst, useTrait } from 'koota/react';
import { useRef } from 'react';
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
  const sphereRef = useRef<Mesh>(null);
  const grass = useTrait(entity, Grass);

  const handleInit = (group: Group | null) => {
    if (!group || !entity.isAlive()) return;
    entity.add(Ref(group));
    return () => entity.remove(Ref);
  };

  return (
    <group ref={handleInit}>
      <Sphere ref={sphereRef} args={[RADIUS, 32, 32]} receiveShadow castShadow>
        <meshStandardMaterial
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
