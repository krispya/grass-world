import { createActions, type TraitRecord } from 'koota';
import { rigidBody, box, sphere, MotionType } from 'crashcat';
import {
  AngularVelocity,
  Grass,
  IsMoon,
  IsPlanet,
  Nebula,
  Orbit,
  Physics,
  PhysicsBody,
  GrassRimLighting,
  RotationConfig,
  Space,
  Stars,
  Wind,
} from './traits';
import { objectLayers } from './physics';

export const actions = createActions((world) => ({
  spawnPlanet: () => {
    const physics = world.get(Physics)!;
    const body = rigidBody.create(physics, {
      shape: sphere.create({ radius: 5 }),
      motionType: MotionType.STATIC,
      objectLayer: objectLayers.fixed,
      restitution: 0.8,
    });
    return world.spawn(
      IsPlanet,
      AngularVelocity,
      RotationConfig,
      Grass,
      Wind,
      GrassRimLighting,
      PhysicsBody(body)
    );
  },

  spawnMoon: () => {
    const physics = world.get(Physics)!;
    const orbit = { radius: 9, speed: 0.3 };
    const tangentialSpeed = orbit.speed * orbit.radius;

    const body = rigidBody.create(physics, {
      shape: box.create({ halfExtents: [1.5, 0.4, 0.2] }),
      motionType: MotionType.DYNAMIC,
      objectLayer: objectLayers.moving,
      position: [0, 0, -orbit.radius],
      quaternion: [-0.5, 0, 0, 0.866],
      gravityFactor: 0,
      linearDamping: 0,
      angularDamping: 0.3,
      restitution: 0.8,
      allowSleeping: false,
    });

    rigidBody.setLinearVelocity(physics, body, [tangentialSpeed * 0.45, tangentialSpeed * 0.89, 0]);
    rigidBody.setAngularVelocity(physics, body, [0, 0.15, 0.05]);

    return world.spawn(IsMoon, Orbit, PhysicsBody(body));
  },

  spawnSpace: () => {
    return world.spawn(Space, Nebula, Stars);
  },
}));
