import { useEffect } from 'react';
import { useActions } from 'koota/react';
import { actions } from './core/actions';
import { Wind } from './core/traits';

export function Startup() {
  const { spawnPlanet, spawnSpace } = useActions(actions);

  useEffect(() => {
    const planet = spawnPlanet();
    planet.set(Wind, { speed: 0.1 });

    const space = spawnSpace();

    return () => {
      planet.destroy();
      space.destroy();
    };
  }, [spawnPlanet, spawnSpace]);

  return null;
}
