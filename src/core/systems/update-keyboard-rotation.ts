import type { World } from 'koota';
import { MathUtils } from 'three';
import { AngularVelocity, InputDirection, IsPlanet, Keyboard, RotationConfig, Time } from '../traits';

export function updateKeyboardRotation(world: World) {
  const { keys } = world.get(Keyboard)!;
  const input = world.get(InputDirection)!;
  const { delta } = world.get(Time)!;

  world.query(IsPlanet, AngularVelocity, RotationConfig).updateEach(([vel, config]) => {
    let dx = input.x;
    let dy = input.y;

    if (keys.has('ArrowUp') || keys.has('KeyW')) dy += 1;
    if (keys.has('ArrowDown') || keys.has('KeyS')) dy -= 1;
    if (keys.has('ArrowLeft') || keys.has('KeyA')) dx -= 1;
    if (keys.has('ArrowRight') || keys.has('KeyD')) dx += 1;

    dx = MathUtils.clamp(dx, -1, 1);
    dy = MathUtils.clamp(dy, -1, 1);

    vel.x += dy * config.acceleration * delta;
    vel.y += dx * config.acceleration * delta;

    vel.x = MathUtils.clamp(vel.x, -config.maxSpeed, config.maxSpeed);
    vel.y = MathUtils.clamp(vel.y, -config.maxSpeed, config.maxSpeed);
  });
}
