uniform float uTime;
uniform float uSway;
uniform float uWindSpeed;
uniform vec3 uAngularVelocity;
uniform float uRotWindStrength;
uniform float uRotSwayAtten;
varying vec2 vUv;
varying float vHeight;
varying vec4 vWorldPos;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

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

  vec2 ambientWind = vec2(swingX, swingY) * uSway;
  vec2 rotationalWind = vec2(rotWindX, rotWindY) * heightFactor * uRotWindStrength;

  // Fade out ambient sway entirely as apparent wind ramps up so max velocity
  // leaves only the velocity-driven motion.
  float rotationalMagnitude = length(rotationalWind);
  float rotationalInfluence = clamp(rotationalMagnitude * uRotSwayAtten * 2.0, 0.0, 1.0);
  vec2 mergedAmbientWind = ambientWind * (1.0 - rotationalInfluence);

  vec2 totalWind = mergedAmbientWind + rotationalWind;
  float dx = totalWind.x;
  float dy = totalWind.y;
  pos.x += dx;
  pos.y += dy;

  vHeight = pos.z;
  vWorldNormal = normalize(worldBase);

  // Conserve blade length: lateral displacement pulls the tip toward the surface
  pos.z = sqrt(max(pos.z * pos.z - dx * dx - dy * dy, 0.0));
  vWorldPosition = (modelMatrix * instanceMatrix * vec4(pos, 1.0)).xyz;
  vWorldPos = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * vWorldPos;
}
