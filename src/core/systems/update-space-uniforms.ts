import type { World } from 'koota';
import { MaterialRef, Space, Time } from '../traits';

export function updateSpaceUniforms(world: World) {
  const { elapsed } = world.get(Time)!;

  world.query(Space, MaterialRef).updateEach(([space, mat]) => {
    if (!mat) return;
    const range = (space.alphaMax - space.alphaMin) / 2;
    const mid = (space.alphaMax + space.alphaMin) / 2;
    mat.uniforms.uAlpha.value = Math.sin(elapsed * space.colorSpeed) * range + mid;
  });
}
