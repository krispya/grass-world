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
