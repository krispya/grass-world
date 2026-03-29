import type { World } from 'koota';
import { rigidBody } from 'crashcat';
import { AngularVelocity, IsMoon, IsPlanet, Orbit, Physics, PhysicsBody } from '../traits';

const DRAG_STRENGTH = 0.4;

export function orbitMoon(world: World) {
  const physics = world.get(Physics);
  if (!physics) return;

  const planetVel = world.queryFirst(IsPlanet, AngularVelocity)?.get(AngularVelocity);

  world.query(IsMoon, PhysicsBody, Orbit).updateEach(([body, orbit]) => {
    const [px, py, pz] = body.position;
    const dist = Math.sqrt(px * px + py * py + pz * pz);
    if (dist < 0.001) return;

    const mass = 1 / body.motionProperties.invMass;

    // centripetal gravity: F = m * ω²r toward origin
    const gravity = (mass * orbit.speed * orbit.speed * orbit.radius) / dist;
    let fx = -px * gravity;
    let fy = -py * gravity;
    let fz = -pz * gravity;

    // planet spin drag: F = m * drag * (ω × r)
    if (planetVel && (planetVel.x !== 0 || planetVel.y !== 0)) {
      const drag = mass * DRAG_STRENGTH;
      fx += (planetVel.y * pz) * drag;
      fy += (-planetVel.x * pz) * drag;
      fz += (planetVel.x * py - planetVel.y * px) * drag;
    }

    rigidBody.addForce(physics, body, [fx, fy, fz], true);
  });
}
