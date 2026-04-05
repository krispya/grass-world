import type { World } from 'koota';
import { Grass, MaterialRef, GrassRimLighting, Time } from '../traits';

export function updateGrassRimLighting(world: World) {
  const { elapsed } = world.get(Time)!;

  world.query(GrassRimLighting, MaterialRef, Grass).readEach(([rim, mat]) => {
    if (!mat?.uniforms.uRimDirection) return;

    const dir = mat.uniforms.uRimDirection.value;
    dir.set(Math.cos(elapsed * rim.orbitSpeed), 1, Math.sin(elapsed * rim.orbitSpeed));

    const iRange = (rim.pulseMax - rim.pulseMin) / 2;
    const iMid = (rim.pulseMax + rim.pulseMin) / 2;
    mat.uniforms.uRimIntensity.value = Math.sin(elapsed * rim.pulseSpeed) * iRange + iMid;

    const pRange = (rim.powerMax - rim.powerMin) / 2;
    const pMid = (rim.powerMax + rim.powerMin) / 2;
    mat.uniforms.uRimPower.value = Math.sin(elapsed * rim.powerPulseSpeed) * pRange + pMid;
  });
}
