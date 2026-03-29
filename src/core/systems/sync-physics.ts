import type { World } from 'koota';
import { PhysicsBody, Ref } from '../traits';

export function syncPhysics(world: World) {
  world.query(PhysicsBody, Ref).updateEach(([body, ref]) => {
    const [px, py, pz] = body.position;
    ref.position.set(px, py, pz);

    const [qx, qy, qz, qw] = body.quaternion;
    ref.quaternion.set(qx, qy, qz, qw);
  });
}
