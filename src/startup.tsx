import { useEffect } from 'react';
import { useActions } from 'koota/react';
import { actions } from './core/actions';
import { Wind } from './core/traits';

export function Startup() {
  const { spawnPlanet, spawnMoon, spawnSpace } = useActions(actions);

  useEffect(() => {
    const planet = spawnPlanet();
    planet.set(Wind, { speed: 0.1 });

    const moon = spawnMoon();
    const space = spawnSpace({ colorSpeed: 0.3, alphaMin: 0.2, alphaMax: 0.8 });

    return () => {
      planet.destroy();
      moon.destroy();
      space.destroy();
    };
  }, [spawnPlanet, spawnMoon, spawnSpace]);

  return null;
}
