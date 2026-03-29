import type { World } from 'koota';
import { Grass, IsPlanet, MaterialRef, Time } from '../traits';

export function updateGrassUniforms(world: World) {
  const { elapsed } = world.get(Time)!;

  world.query(IsPlanet, Grass, MaterialRef).updateEach(([, mat]) => {
    if (!mat) return;
    mat.uniforms.uTime.value = elapsed;
    mat.uniforms.uEmissiveIntensity.value = Math.cos(elapsed * 0.1) * 0.09 + 0.4;
  });
}
