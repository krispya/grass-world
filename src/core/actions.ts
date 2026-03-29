import { createActions, TraitRecord } from 'koota';
import {
  AngularVelocity,
  Grass,
  IsMoon,
  IsPlanet,
  Orbit,
  GrassRimLighting,
  RotationConfig,
  Space,
  Stars,
  Wind,
} from './traits';

export const actions = createActions((world) => ({
  spawnPlanet: () => {
    return world.spawn(IsPlanet, AngularVelocity, RotationConfig, Grass, Wind, GrassRimLighting);
  },

  spawnMoon: () => {
    return world.spawn(IsMoon, Orbit);
  },

  spawnSpace: (config?: Partial<TraitRecord<typeof Space>>) => {
    return world.spawn(Space(config), Stars);
  },
}));
