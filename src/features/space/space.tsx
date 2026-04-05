import type { Entity } from 'koota';
import { useQueryFirst } from 'koota/react';
import { Space } from '../../core/traits';
import { HemisphereView } from './hemisphere';
import { StarsView } from './stars';

function SpaceView({ entity }: { entity: Entity }) {
  return (
    <>
      <HemisphereView entity={entity} />
      <StarsView entity={entity} />
    </>
  );
}

export function SpaceRenderer() {
  const entity = useQueryFirst(Space);
  return entity ? <SpaceView entity={entity} /> : null;
}
