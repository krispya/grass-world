uniform vec3 uHemisphereColorBase;
uniform vec3 uHemisphereColorA;
uniform vec3 uHemisphereColorB;
uniform float uHemisphereAlpha;
uniform vec3 uHemisphereOrigin;
uniform float uHemisphereFar;

const float HEMISPHERE_CAPTURE_RADIUS = 100.0;

vec3 getAnalyticHemisphereColor(vec3 worldPos) {
  float d = clamp(distance(worldPos, uHemisphereOrigin) / uHemisphereFar, 0.0, 1.0);
  vec3 depthColor = mix(uHemisphereColorA, uHemisphereColorB, d);
  return mix(uHemisphereColorBase, depthColor, uHemisphereAlpha);
}

vec3 getAnalyticEnvironmentColor(vec3 dir) {
  return getAnalyticHemisphereColor(normalize(dir) * HEMISPHERE_CAPTURE_RADIUS);
}
