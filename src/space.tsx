import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Environment, Stars } from '@react-three/drei'
import * as THREE from 'three'

export function Space() {
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uAlpha.value = Math.sin(clock.elapsedTime * 0.1) * 0.4 + 0.4
    }
  })

  return (
    <>
      <Environment frames={Infinity} background resolution={256}>
        <mesh scale={100}>
          <sphereGeometry args={[1, 64, 64]} />
          <shaderMaterial
            ref={matRef}
            side={THREE.BackSide}
            uniforms={{
              uColorBase: { value: new THREE.Color('#312a49') },
              uColorA: { value: new THREE.Color('hotpink') },
              uColorB: { value: new THREE.Color('#447') },
              uAlpha: { value: 0.8 },
              uOrigin: { value: new THREE.Vector3(100, 100, 100) },
              uFar: { value: 300 },
            }}
            vertexShader={/* glsl */ `
              varying vec3 vWorldPos;
              void main() {
                vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={/* glsl */ `
              uniform vec3 uColorBase;
              uniform vec3 uColorA;
              uniform vec3 uColorB;
              uniform float uAlpha;
              uniform vec3 uOrigin;
              uniform float uFar;
              varying vec3 vWorldPos;
              void main() {
                float d = clamp(distance(vWorldPos, uOrigin) / uFar, 0.0, 1.0);
                vec3 depthColor = mix(uColorA, uColorB, d);
                vec3 color = mix(uColorBase, depthColor, uAlpha);
                gl_FragColor = vec4(color, 1.0);
              }
            `}
          />
        </mesh>
      </Environment>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
    </>
  )
}
