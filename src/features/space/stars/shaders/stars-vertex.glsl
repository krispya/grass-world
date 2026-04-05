uniform float uTime;
uniform float uTwinkleAmplitude;

attribute float size;
attribute float twinkle;
attribute float tintAmount;

varying vec3 vColor;
varying float vBrightness;
varying float vTintAmount;

void main() {
  vColor = color;
  vTintAmount = tintAmount;

  float phase = dot(position, vec3(12.9898, 78.233, 45.164));
  float pulse = sin(uTime * (1.5 + twinkle * 2.0) + phase);
  vBrightness = 1.0 + twinkle * uTwinkleAmplitude * pulse;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (300.0 / -mvPosition.z) * vBrightness;
  gl_Position = projectionMatrix * mvPosition;
}
