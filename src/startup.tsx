import { useEffect } from 'react';
import { useActions, useWorld } from 'koota/react';
import { actions } from './core/actions';
import { GrassRimLighting, Physics, Stars, Wind } from './core/traits';
import { createPhysicsWorld } from './core/physics';

export function Startup() {
  const world = useWorld();
  const { spawnPlanet, spawnMoon, spawnSpace } = useActions(actions);

  useEffect(() => {
    const physicsWorld = createPhysicsWorld();
    world.add(Physics(physicsWorld));

    const planet = spawnPlanet();
    planet.set(Wind, { speed: 0.1 });
    planet.set(GrassRimLighting, {
      orbitSpeed: 0.2,
      pulseSpeed: 0.4,
      pulseMin: 0.1,
      pulseMax: 1,
      powerPulseSpeed: 0.1,
      powerMin: 1.0,
      powerMax: 6.0,
    });

    const moon = spawnMoon();
    const space = spawnSpace({ colorSpeed: 0.3, alphaMin: 0.2, alphaMax: 0.8 });
    space.set(Stars, {
      count: 6000,
      radius: 150,
      saturation: 0.15,
      speed: 0.4,
      twinkleAmplitude: 0.8,
      twinkleChance: 0.25,
      colorShift: 0.4,
      brightnessMin: 0.5,
      brightnessMax: 0.8,
      tint: '#d1215e',
      tintMin: 0.65,
      tintMax: 0.9,
    });

    return () => {
      planet.destroy();
      moon.destroy();
      space.destroy();
      world.remove(Physics);
    };
  }, [world, spawnPlanet, spawnMoon, spawnSpace]);

  return null;
}
