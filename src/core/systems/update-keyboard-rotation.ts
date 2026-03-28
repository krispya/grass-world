import type { World } from 'koota';
import { MathUtils } from 'three';
import { AngularVelocity, IsPlanet, Keyboard, RotationConfig, Time } from '../traits';

export function updateKeyboardRotation(world: World) {
  const { keys } = world.get(Keyboard)!;
  const { delta } = world.get(Time)!;

  world.query(IsPlanet, AngularVelocity, RotationConfig).updateEach(([vel, config]) => {
    const up = keys.has('ArrowUp') || keys.has('KeyW');
    const down = keys.has('ArrowDown') || keys.has('KeyS');
    const left = keys.has('ArrowLeft') || keys.has('KeyA');
    const right = keys.has('ArrowRight') || keys.has('KeyD');

    if (up) vel.x += config.acceleration * delta;
    if (down) vel.x -= config.acceleration * delta;
    if (left) vel.y -= config.acceleration * delta;
    if (right) vel.y += config.acceleration * delta;

    vel.x = MathUtils.clamp(vel.x, -config.maxSpeed, config.maxSpeed);
    vel.y = MathUtils.clamp(vel.y, -config.maxSpeed, config.maxSpeed);
  });
}
