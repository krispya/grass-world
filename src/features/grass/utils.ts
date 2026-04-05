import * as THREE from 'three';
import { GrassCulling } from '../../core/traits';
import { randomInRange } from '../../util/random';

import type { TraitRecord } from 'koota';
import type { InstancedMesh } from 'three';

const CULL_UPDATE_INTERVAL = 1;
const HORIZON_PADDING = 0.35;
const _lookTarget = new THREE.Vector3();
const _dummy = new THREE.Object3D();

export function createBladeGeometry(bW: number, bH: number, joints: number) {
  const geo = new THREE.PlaneGeometry(bW, bH, 2, joints);
  geo.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -bH / 2, 0));
  geo.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  const verts = geo.attributes.position.array as Float32Array;
  for (let i = 0; i < verts.length; i += 3) {
    if (verts[i + 0] === 0) verts[i + 1] = bW / 2;
  }
  return geo;
}

function sampleSphereSurface(radius: number) {
  const z = randomInRange(-1, 1);
  const theta = randomInRange(0, Math.PI * 2);
  const radial = Math.sqrt(1 - z * z);
  return new THREE.Vector3(radial * Math.cos(theta), radial * Math.sin(theta), z).multiplyScalar(
    radius
  );
}

export function createGrassCulling(
  mesh: InstancedMesh,
  count: number,
  radius: number
): TraitRecord<typeof GrassCulling> {
  const normals = new Float32Array(count * 3);
  const matrices = new Float32Array(count * 16);
  for (let i = 0; i < count; i += 1) {
    const position = sampleSphereSurface(radius);
    const normal = position.clone().normalize();
    const rotationRange = randomInRange(0.01, 0.3);
    const rotation = randomInRange(-rotationRange, rotationRange);

    _dummy.position.copy(position);
    _lookTarget.copy(position).add(normal);
    _dummy.lookAt(_lookTarget);
    _dummy.scale.setScalar(randomInRange(0.65, 1));
    _dummy.rotateOnAxis(normal, rotation);
    _dummy.updateMatrix();

    const i3 = i * 3;
    normals[i3] = normal.x;
    normals[i3 + 1] = normal.y;
    normals[i3 + 2] = normal.z;
    matrices.set(_dummy.matrix.elements, i * 16);
  }

  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.count = 0;

  return {
    mesh,
    totalCount: count,
    normals,
    matrices,
    visibilityThreshold: radius - HORIZON_PADDING,
    updateInterval: CULL_UPDATE_INTERVAL,
    frame: 0,
  };
}
