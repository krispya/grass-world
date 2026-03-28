import type { World } from 'koota';
import { IsMoon, Orbit, Ref, Time } from '../traits';

export function orbitMoon(world: World) {
  const { elapsed } = world.get(Time)!;

  world.query(IsMoon, Ref, Orbit).updateEach(([ref, orbit]) => {
    orbit.angle = elapsed * orbit.speed;
    ref.position.x = Math.cos(orbit.angle) * orbit.radius;
    ref.position.z = Math.sin(orbit.angle) * orbit.radius;
    ref.position.y = Math.sin(orbit.angle * 0.7) * orbit.radius * Math.sin(orbit.tilt);
  });
}
