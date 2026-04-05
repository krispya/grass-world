import type { World } from 'koota';
import { Color } from 'three';
import { Stars, StarsMaterialRef, Time } from '../traits';

const _color = new Color();

export function updateStars(world: World) {
  const { elapsed } = world.get(Time)!;

  world.query(Stars, StarsMaterialRef).readEach(([stars, mat]) => {
    if (!mat) return;
    mat.uniforms.uTime.value = elapsed * stars.speed;
    mat.uniforms.uFade.value = stars.fade ? 1.0 : 0.0;
    mat.uniforms.uTwinkleAmplitude.value = stars.twinkleAmplitude;
    mat.uniforms.uColorShift.value = stars.colorShift;
    mat.uniforms.uOpacity.value = stars.opacity;
    mat.uniforms.uTint.value.copy(_color.set(stars.tint));
  });
}
