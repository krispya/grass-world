uniform float uTime;
uniform float uSway;
uniform float uWindSpeed;
uniform vec3 uAngularVelocity;
uniform float uRotWindStrength;
uniform float uRotSwayAtten;
varying vec2 vUv;
varying float vHeight;
varying vec4 vWorldPos;

#include "../../../shaders/noise.glsl"

void main() {
  vUv = uv;
  vec3 pos = position;
  vec3 base = vec3(pos.x, pos.y, 0.0);
  vec4 baseGP = instanceMatrix * vec4(base, 1.0);
  float heightFactor = pow(pos.z, 2.0);

  // Ambient noise-based sway
  float t = uTime * uWindSpeed;
  float noise = snoise(baseGP.xyz * 0.1 + t);
  noise = smoothstep(-1.0, 1.0, noise);
  float swingX = sin(t * 4.0 + noise * 6.28318) * heightFactor;
  float swingY = cos(t * 4.0 + noise * 6.28318) * heightFactor;

  // Rotational wind: apparent wind = -surfaceVel = cross(pos, ω)
  // Use world-space position so it's correct regardless of planet orientation
  vec3 worldBase = (modelMatrix * instanceMatrix * vec4(base, 1.0)).xyz;
  vec3 apparentWind = cross(worldBase, uAngularVelocity);

  // Project apparent wind into blade's local tangent axes (in world space)
  vec3 localX = normalize((modelMatrix * instanceMatrix * vec4(1.0, 0.0, 0.0, 0.0)).xyz);
  vec3 localY = normalize((modelMatrix * instanceMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
  float rotWindX = dot(apparentWind, localX);
  float rotWindY = dot(apparentWind, localY);

  // Attenuate noise sway when rotational wind dominates
  float rotMag = length(vec2(rotWindX, rotWindY));
  float swayAtten = 1.0 / (1.0 + rotMag * uRotSwayAtten);

  float dx = swingX * uSway * swayAtten + rotWindX * heightFactor * uRotWindStrength;
  float dy = swingY * uSway * swayAtten + rotWindY * heightFactor * uRotWindStrength;
  pos.x += dx;
  pos.y += dy;

  vHeight = pos.z;

  // Conserve blade length: lateral displacement pulls the tip toward the surface
  pos.z = sqrt(max(pos.z * pos.z - dx * dx - dy * dy, 0.0));
  vWorldPos = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * vWorldPos;
}
