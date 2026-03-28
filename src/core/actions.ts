import { createActions } from 'koota';
import { AngularVelocity, Grass, IsPlanet, IsSpace, RotationConfig, Wind } from './traits';

export const actions = createActions((world) => ({
  spawnPlanet: () => {
    return world.spawn(IsPlanet, AngularVelocity, RotationConfig, Grass, Wind);
  },

  spawnSpace: () => {
    return world.spawn(IsSpace);
  },
}));
