import { Matrix4, Vector3, type Camera } from 'three';
import { GrassCulling, IsPlanet, Ref } from '../traits';

import type { World } from 'koota';

const _cameraLocal = new Vector3();
const _inverseWorld = new Matrix4();

export function updateVisibleGrass(world: World, camera: Camera) {
  world.query(IsPlanet, Ref, GrassCulling).updateEach(([ref, grass]) => {
    grass.frame += 1;
    if (grass.frame % grass.updateInterval !== 0) return;

    _inverseWorld.copy(ref.matrixWorld).invert();
    _cameraLocal.copy(camera.position).applyMatrix4(_inverseWorld);

    const cx = _cameraLocal.x;
    const cy = _cameraLocal.y;
    const cz = _cameraLocal.z;
    const { visibilityThreshold, normals, matrices } = grass;
    const instanceMatrix = grass.mesh.instanceMatrix.array as Float32Array;

    let visibleCount = 0;
    for (let i = 0; i < grass.totalCount; i += 1) {
      const i3 = i * 3;
      const facing = normals[i3] * cx + normals[i3 + 1] * cy + normals[i3 + 2] * cz;
      if (facing <= visibilityThreshold) continue;

      const src = i * 16;
      const dst = visibleCount * 16;
      for (let j = 0; j < 16; j += 1) {
        instanceMatrix[dst + j] = matrices[src + j];
      }
      visibleCount += 1;
    }

    grass.mesh.count = visibleCount;
    grass.mesh.instanceMatrix.needsUpdate = true;
  });
}
