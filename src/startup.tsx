import { useEffect } from 'react';
import { useActions, useWorld } from 'koota/react';
import { actions } from './core/actions';
import { Grass, GrassRimLighting, Nebula, Physics, Space, Stars, Wind } from './core/traits';
import { createPhysicsWorld } from './core/physics';
import { useMobile } from './hooks/use-mobile';

export function Startup() {
  const world = useWorld();
  const { spawnPlanet, spawnMoon, spawnSpace } = useActions(actions);
  const isMobile = useMobile();

  useEffect(() => {
    const physicsWorld = createPhysicsWorld();
    world.add(Physics(physicsWorld));

    const planet = spawnPlanet();
    planet.set(Grass, { joints: 3, count: isMobile ? 40000 : 60000 });
    planet.set(Wind, { speed: 0.1, rotStrength: 0.2 });
    planet.set(GrassRimLighting, {
      orbitSpeed: 0.2,
      pulseSpeed: 0.5,
      pulseMin: 0.1,
      pulseMax: 0.9,
      powerPulseSpeed: 0.45,
      powerMin: 3.0,
      powerMax: 6.0,
    });

    const moon = spawnMoon();

    const space = spawnSpace();
    space.set(Space, {
      colorBase: '#312a49',
      colorA: 'hotpink',
      colorB: '#447',
      originX: 100,
      originY: 35,
      originZ: 100,
      far: 300,
      colorSpeed: 0.1,
      alphaMin: 0.2,
      alphaMax: 0.8,
    });

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

    space.set(Nebula, {
      enabled: true,
      opacity: 0.28,
      scale: 99.5,
      pulseMin: 0.75,
      pulseMax: 1.0,
      pulseSpeed: 0.07,
      driftSpeed: 0.0015,
    });

    return () => {
      planet.destroy();
      moon.destroy();
      space.destroy();
      world.remove(Physics);
    };
  }, [isMobile, world, spawnPlanet, spawnMoon, spawnSpace]);

  return null;
}
