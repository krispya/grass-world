import {
  registerAll,
  createWorldSettings,
  createWorld,
  addBroadphaseLayer,
  addObjectLayer,
  enableCollision,
} from 'crashcat';

registerAll();

export const objectLayers = { moving: -1, fixed: -1 };

export function createPhysicsWorld() {
  const settings = createWorldSettings();
  settings.gravity = [0, 0, 0];

  const blMoving = addBroadphaseLayer(settings);
  const blFixed = addBroadphaseLayer(settings);

  objectLayers.moving = addObjectLayer(settings, blMoving);
  objectLayers.fixed = addObjectLayer(settings, blFixed);

  enableCollision(settings, objectLayers.moving, objectLayers.moving);
  enableCollision(settings, objectLayers.moving, objectLayers.fixed);

  return createWorld(settings);
}
