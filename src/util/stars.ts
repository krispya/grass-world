import type { TraitRecord } from 'koota';
import { Color, Spherical, Vector3 } from 'three';
import type { Stars } from '../core/traits';

const _spherical = new Spherical();
const _vec3 = new Vector3();
const _color = new Color();

function genStar(r: number): [number, number, number] {
  _spherical.set(r, Math.acos(1 - Math.random() * 2), Math.random() * 2 * Math.PI);
  _vec3.setFromSpherical(_spherical);
  return [_vec3.x, _vec3.y, _vec3.z];
}

export function buildStarBuffers(stars: TraitRecord<typeof Stars>) {
  const { count, radius, depth, factor, saturation, brightnessMin, brightnessMax, twinkleChance, tintMin, tintMax } =
    stars;
  const positions: number[] = [];
  const colors: number[] = [];
  const sizes = new Float32Array(count);
  const twinkles = new Float32Array(count);
  const tintAmounts = new Float32Array(count);

  let r = radius + depth;
  const increment = depth / count;
  const brightnessRange = brightnessMax - brightnessMin;
  const tintRange = tintMax - tintMin;

  for (let i = 0; i < count; i++) {
    r -= increment * Math.random();
    positions.push(...genStar(r));

    const lightness = brightnessMin + Math.random() * brightnessRange;
    _color.setHSL(i / count, saturation, lightness);
    colors.push(_color.r, _color.g, _color.b);

    sizes[i] = (0.5 + 0.5 * Math.random()) * factor;
    twinkles[i] = Math.random() < twinkleChance ? 0.5 + 0.5 * Math.random() : 0.0;
    tintAmounts[i] = tintMin + Math.random() * tintRange;
  }

  return {
    position: new Float32Array(positions),
    color: new Float32Array(colors),
    size: sizes,
    twinkle: twinkles,
    tintAmount: tintAmounts,
  };
}
