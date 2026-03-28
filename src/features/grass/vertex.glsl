uniform float uTime;
uniform float uSway;
varying vec2 vUv;
varying float vHeight;
varying vec4 vWorldPos;

#include "../../shaders/noise.glsl"

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
