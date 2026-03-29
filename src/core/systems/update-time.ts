import type { World } from 'koota';
import type { RootState } from '@react-three/fiber';
import { Time } from '../traits';

const MAX_DELTA = 1 / 30;

export function updateTime(world: World, state: RootState, delta: number) {
  world.set(Time, { delta: Math.min(delta, MAX_DELTA), elapsed: state.clock.elapsedTime });
}
