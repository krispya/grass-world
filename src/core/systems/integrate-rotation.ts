import type { World } from 'koota';
import { Quaternion, Vector3 } from 'three';
import { AngularVelocity, IsPlanet, Ref, RotationConfig, Time } from '../traits';

const _xAxis = new Vector3(1, 0, 0);
const _yAxis = new Vector3(0, 1, 0);
const _quat = new Quaternion();

export function integrateRotation(world: World) {
  const { delta } = world.get(Time)!;

  world.query(IsPlanet, Ref, AngularVelocity, RotationConfig).updateEach(([ref, vel, config]) => {
    const decay = Math.exp(-config.friction * delta);
    vel.x *= decay;
    vel.y *= decay;

    if (Math.abs(vel.x) < 0.001) vel.x = 0;
    if (Math.abs(vel.y) < 0.001) vel.y = 0;

    if (vel.x !== 0) {
      _quat.setFromAxisAngle(_xAxis, vel.x * delta);
      ref.quaternion.premultiply(_quat);
    }
    if (vel.y !== 0) {
      _quat.setFromAxisAngle(_yAxis, vel.y * delta);
      ref.quaternion.premultiply(_quat);
    }
  });
}
