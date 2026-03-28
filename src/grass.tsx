import { memo, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Sampler, useTexture } from '@react-three/drei'
import { randomInRange } from './util/random.js'
import { noise3D } from './shaders/noise.js'
import type { InstancedMesh, Mesh, ShaderMaterial } from 'three'

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSway;
  varying vec2 vUv;
  varying float vHeight;
  varying vec4 vWorldPos;

  ${noise3D}

  void main() {
    vUv = uv;

    vec3 pos = position;
    vec3 base = vec3(pos.x, pos.y, 0.0);
    vec4 baseGP = instanceMatrix * vec4(base, 1.0);

    float noise = snoise(baseGP.xyz * 0.1 + uTime * 0.5);
    noise = smoothstep(-1.0, 1.0, noise);
    float swingX = sin(uTime * 2.0 + noise * 6.28318) * pow(pos.z, 2.0);
    float swingY = cos(uTime * 2.0 + noise * 6.28318) * pow(pos.z, 2.0);
    pos.x += swingX * uSway;
    pos.y += swingY * uSway;

    vHeight = pos.z;
    vWorldPos = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * vWorldPos;
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D uAlphaMap;
  uniform float uEmissiveIntensity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uEmissive;
  uniform float uFogNear;
  uniform float uFogFar;

  varying vec2 vUv;
  varying float vHeight;
  varying vec4 vWorldPos;

  void main() {
    float alpha = texture2D(uAlphaMap, vUv).r;
    if (alpha < 0.55) discard;

    // Depth-based color — tip vs root
    float depthFactor = smoothstep(0.2, 1.0, 1.0 - vHeight);
    vec3 baseColor = mix(uColorA, uColorB, depthFactor);

    vec3 color = baseColor + uEmissive * uEmissiveIntensity;

    // Distance fog
    float dist = length(vWorldPos.xyz);
    float fogNormal = clamp((dist - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
    color = mix(color, vec3(1.0), fogNormal);

    // Slight screen-blend fog for glow
    float fogScreen = clamp((dist - uFogNear) / (uFogFar - uFogNear), 0.0, 0.01);
    color = color + vec3(1.0) * fogScreen;

    gl_FragColor = vec4(color, 1.0);
  }
`

interface GrassProps {
  bW?: number
  bH?: number
  joints?: number
  count?: number
  meshRef: React.RefObject<Mesh | null>
  sway?: number
}

export const Grass = memo(function Grass({
  bW = 0.15,
  bH = 1,
  joints = 5,
  count = 5000,
  meshRef,
  sway = 0.2,
}: GrassProps) {
  const instances = useRef<InstancedMesh>(null!)
  const materialRef = useRef<ShaderMaterial>(null!)
  const alphaMap = useTexture('/assets/blade_a.jpg')

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(bW, bH, 2, joints)
    geo.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -bH / 2, 0))
    geo.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2))

    // Fold center vertices upward for dimension
    const verts = geo.attributes.position.array as Float32Array
    for (let i = 0; i < verts.length; i += 3) {
      if (verts[i + 0] === 0) verts[i + 1] = bW / 2
    }
    return geo
  }, [bW, bH, joints])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSway: { value: sway },
      uAlphaMap: { value: alphaMap },
      uColorA: { value: new THREE.Color('#d62a58') },
      uColorB: { value: new THREE.Color('#1c1a3d') },
      uEmissive: { value: new THREE.Color('#d1215e') },
      uEmissiveIntensity: { value: 0.28 },
      uFogNear: { value: 9.2 },
      uFogFar: { value: 25 },
    }),
    [sway, alphaMap],
  )

  useFrame(({ clock }) => {
    const mat = materialRef.current
    if (!mat) return
    mat.uniforms.uTime.value = clock.elapsedTime
    mat.uniforms.uEmissiveIntensity.value = Math.cos(clock.elapsedTime * 0.1) * 0.09 + 0.4
  })

  return (
    <>
      <instancedMesh ref={instances} args={[geometry, undefined, count]} receiveShadow>
        <shaderMaterial
          ref={materialRef}
          side={THREE.DoubleSide}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </instancedMesh>

      <Sampler
        mesh={meshRef}
        instances={instances}
        count={count}
        transform={({ dummy, sampledMesh, position, normal }) => {
          const scale = randomInRange(0.65, 1)
          const rotation = randomInRange(0.01, 0.3)
          sampledMesh.localToWorld(position)
          dummy.position.copy(position)
          dummy.lookAt(normal.clone().add(position))
          dummy.scale.setScalar(scale)
          dummy.rotateOnAxis(normal, randomInRange(-rotation, rotation))
        }}
      />
    </>
  )
})
