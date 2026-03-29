import type { World } from 'koota';
import { updateWorld } from 'crashcat';
import { Physics, Time } from '../traits';

export function stepPhysics(world: World) {
  const physics = world.get(Physics);
  if (!physics) return;

  const { delta } = world.get(Time)!;
  updateWorld(physics, undefined, delta);
}
