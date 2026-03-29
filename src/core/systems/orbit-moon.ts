import type { World } from 'koota';
import { rigidBody } from 'crashcat';
import { AngularVelocity, IsMoon, IsPlanet, Orbit, Physics, PhysicsBody } from '../traits';

const SPIN_COUPLING = 0.4;

export function orbitMoon(world: World) {
  const physics = world.get(Physics);
  if (!physics) return;

  const planetVel = world.queryFirst(IsPlanet, AngularVelocity)?.get(AngularVelocity);

  world.query(IsMoon, PhysicsBody, Orbit).updateEach(([body, orbit]) => {
    const [px, py, pz] = body.position;
    const dist = Math.sqrt(px * px + py * py + pz * pz);
    if (dist < 0.001) return;

    const mass = 1 / body.motionProperties.invMass;

    // Gravity that scales with distance: stronger the further the moon drifts.
    // At the target radius the centripetal term (ω²r) keeps the orbit stable.
    // Beyond it the force ramps up linearly so the moon always comes home.
    const baseGravity = mass * orbit.speed * orbit.speed * orbit.radius;
    const overshoot = Math.max(0, dist - orbit.radius);
    const pullback = mass * overshoot * 2.0;
    const gravity = (baseGravity + pullback) / dist;
    let fx = -px * gravity;
    let fy = -py * gravity;
    let fz = -pz * gravity;

    // planet spin → tangential boost in the direction of rotation
    if (planetVel && (planetVel.x !== 0 || planetVel.y !== 0)) {
      const boost = (mass * SPIN_COUPLING) / dist;
      // y-spin pushes moon tangentially in xz plane
      fx += -pz * planetVel.y * boost;
      fz += px * planetVel.y * boost;
      // x-spin pushes moon tangentially in yz plane
      fy += pz * planetVel.x * boost;
      fz += -py * planetVel.x * boost;
    }

    rigidBody.addForce(physics, body, [fx, fy, fz], true);
  });
}
