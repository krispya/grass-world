import { useWorld } from 'koota/react';
import { useFrame } from '@react-three/fiber';
import { updateTime } from './core/systems/update-time';
import { updateKeyboardRotation } from './core/systems/update-keyboard-rotation';
import { integrateRotation } from './core/systems/integrate-rotation';
import { updateGrassUniforms } from './core/systems/update-grass-uniforms';
import { applyWind } from './core/systems/apply-wind';
import { applyRotationWind } from './core/systems/apply-rotation-wind';
import { updateStars } from './core/systems/update-stars';
import { updateGrassRimLighting } from './core/systems/update-rim-lighting';
import { updateVisibleGrass } from './core/systems/update-visible-grass';
import { orbitMoon } from './core/systems/orbit-moon';
import { stepPhysics } from './core/systems/step-physics';
import { syncPhysics } from './core/systems/sync-physics';
import { updateSpaceUniforms } from './core/systems/update-space-uniforms';

export function Frameloop() {
  const world = useWorld();

  useFrame((state, delta) => {
    updateTime(world, state, delta);
    updateKeyboardRotation(world);
    integrateRotation(world);
    orbitMoon(world);
    stepPhysics(world);
    syncPhysics(world);
    updateGrassUniforms(world);
    applyWind(world);
    applyRotationWind(world);
    updateGrassRimLighting(world);
    updateSpaceUniforms(world);
    updateVisibleGrass(world, state.camera);
    updateStars(world);
  });

  return null;
}
