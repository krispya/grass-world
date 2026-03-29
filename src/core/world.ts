import { createWorld } from 'koota';
import { Time, Keyboard, InputDirection } from './traits';

export const world = createWorld(Time, Keyboard, InputDirection);
