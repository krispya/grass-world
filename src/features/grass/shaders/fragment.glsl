uniform float uEmissiveIntensity;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uEmissive;
uniform float uFogNear;
uniform float uFogFar;
uniform samplerCube uEnvMap;
uniform float uEnvMapIntensity;
uniform vec3 uRimColor;
uniform float uRimIntensity;
uniform float uRimPower;
uniform vec3 uRimDirection;

varying vec2 vUv;
varying float vHeight;
varying vec4 vWorldPos;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main() {
  float depthFactor = smoothstep(0.2, 1.0, 1.0 - vHeight);
  vec3 baseColor = mix(uColorA, uColorB, depthFactor);
  vec3 color = baseColor + uEmissive * uEmissiveIntensity;

  vec3 envColor = textureCube(uEnvMap, vWorldNormal).rgb;
  float envFade = smoothstep(0.4, 0.0, vHeight);
  color = mix(color, envColor, uEnvMapIntensity * envFade);

  // Rim lighting: corona on silhouette edges, biased toward upper-left
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float rim = 1.0 - max(dot(viewDir, vWorldNormal), 0.0);
  rim = pow(rim, uRimPower);
  float rimTip = smoothstep(0.0, 0.3, vHeight);
  float rimBias = max(dot(vWorldNormal, normalize(uRimDirection)), 0.0);
  color += uRimColor * rim * uRimIntensity * rimTip * rimBias;

  float dist = length(vWorldPos.xyz);
  float fogNormal = clamp((dist - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
  color = mix(color, vec3(1.0), fogNormal);

  float fogScreen = clamp((dist - uFogNear) / (uFogFar - uFogNear), 0.0, 0.01);
  color = color + vec3(1.0) * fogScreen;

  gl_FragColor = vec4(color, 1.0);
}
