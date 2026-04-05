import type { World } from 'koota';
import { AngularVelocity, IsPlanet, MaterialRef, Wind } from '../traits';

export function applyRotationWind(world: World) {
  world.query(IsPlanet, AngularVelocity, Wind, MaterialRef).readEach(([vel, wind, mat]) => {
    if (!mat) return;
    mat.uniforms.uAngularVelocity?.value.set(vel.x, vel.y, 0);
    mat.uniforms.uRotWindStrength.value = wind.rotStrength;
    mat.uniforms.uRotSwayAtten.value = wind.rotSwayAtten;
  });
}
