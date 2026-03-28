import { createActions } from 'koota';
import { AngularVelocity, Grass, IsMoon, IsPlanet, IsSpace, Orbit, RotationConfig, Wind } from './traits';

export const actions = createActions((world) => ({
  spawnPlanet: () => {
    return world.spawn(IsPlanet, AngularVelocity, RotationConfig, Grass, Wind);
  },

  spawnMoon: () => {
    return world.spawn(IsMoon, Orbit);
  },

  spawnSpace: () => {
    return world.spawn(IsSpace);
  },
}));
