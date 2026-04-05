import type { World } from 'koota';
import { AnalyticHemisphereUniformsRef, Space, Time } from '../traits';
import {
  computeHemisphereAlpha,
  createAnalyticHemisphereUniforms,
  syncAnalyticHemisphereUniforms,
} from '../../features/space/hemisphere/analytic-env';

export function updateSpaceUniforms(world: World) {
  const { elapsed } = world.get(Time)!;
  const space = world.queryFirst(Space)?.get(Space);
  if (!space) return;

  world.query(AnalyticHemisphereUniformsRef).readEach(([uniforms]) => {
    const hemisphereUniforms = uniforms as ReturnType<typeof createAnalyticHemisphereUniforms>;
    syncAnalyticHemisphereUniforms(hemisphereUniforms, space);
    hemisphereUniforms.uHemisphereAlpha.value = computeHemisphereAlpha(elapsed, space);
    hemisphereUniforms.uTime.value = elapsed;
  });
}
