import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import type * as THREE from 'three';

const DEFAULT_FOV = 75;
const CAM_Y = 12;
const PLANET_RADIUS = 5;
const PLANET_MARGIN = 1.4;

export function ResponsiveCamera() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);

  useEffect(() => {
    const aspect = size.width / size.height;
    const neededHalfW = PLANET_RADIUS * PLANET_MARGIN;
    const neededVFov = 2 * Math.atan(neededHalfW / (CAM_Y * aspect)) * (180 / Math.PI);
    camera.fov = Math.max(DEFAULT_FOV, neededVFov);
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}
