import type { IUniform } from 'three';
import type { World } from 'koota';
import { AnalyticHemisphereUniformsRef, Nebula, Space, Time } from '../traits';
import {
  computeHemisphereAlpha,
  createAnalyticHemisphereUniforms,
  syncAnalyticHemisphereUniforms,
} from '../../features/space/hemisphere/analytic-env';

export function updateSpaceUniforms(world: World) {
  const { elapsed } = world.get(Time)!;
  const spaceEntity = world.queryFirst(Space);
  const space = spaceEntity?.get(Space);
  if (!spaceEntity || !space) return;
  const nebula = spaceEntity.get(Nebula);

  world.query(AnalyticHemisphereUniformsRef).readEach(([uniforms]) => {
    const hemisphereUniforms = uniforms as ReturnType<typeof createAnalyticHemisphereUniforms>;
    syncAnalyticHemisphereUniforms(hemisphereUniforms, space);
    hemisphereUniforms.uHemisphereAlpha.value = computeHemisphereAlpha(elapsed, space);
    hemisphereUniforms.uTime.value = elapsed;
    const nebulaUniforms = uniforms as Record<string, IUniform | undefined>;
    if (nebulaUniforms.uNebulaEnabled) {
      nebulaUniforms.uNebulaEnabled.value = nebula?.enabled ? 1 : 0;
      nebulaUniforms.uNebulaOpacity!.value = nebula?.opacity ?? 0.28;
      nebulaUniforms.uNebulaDriftSpeed!.value = nebula?.driftSpeed ?? 0.0015;
      nebulaUniforms.uNebulaPulseMin!.value = nebula?.pulseMin ?? 0.75;
      nebulaUniforms.uNebulaPulseMax!.value = nebula?.pulseMax ?? 1.0;
      nebulaUniforms.uNebulaPulseSpeed!.value = nebula?.pulseSpeed ?? 0.07;
    }
  });
}
