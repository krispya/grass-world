import type { World } from 'koota';
import { MaterialRef, Wind } from '../traits';

export function applyWind(world: World) {
  world.query(Wind, MaterialRef).readEach(([wind, mat]) => {
    if (!mat) return;
    mat.uniforms.uWindSpeed.value = wind.speed;
  });
}
