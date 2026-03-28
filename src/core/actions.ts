import { createActions } from 'koota';
import { AngularVelocity, Grass, IsPlanet, IsSpace, RotationConfig } from './traits';

export const actions = createActions((world) => ({
  spawnPlanetGroup: () => {
    return world.spawn(IsPlanet, AngularVelocity, RotationConfig, Grass);
  },

  spawnSpaceShader: () => {
    return world.spawn(IsSpace);
  },
}));
