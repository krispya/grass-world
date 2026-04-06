varying vec3 vWorldPos;
uniform float uTime;
uniform float uNebulaEnabled;
uniform float uNebulaOpacity;
uniform float uNebulaPulseMin;
uniform float uNebulaPulseMax;
uniform float uNebulaPulseSpeed;

#include "../../../../shaders/noise.glsl"
#include "../../../../shaders/analytic-hemisphere.glsl"
#include "../../nebula/shaders/nebula.glsl"

void main() {
  vec3 dir = normalize(vWorldPos);
  vec3 hemisphere = getAnalyticEnvironmentColor(vWorldPos);
  vec3 color = hemisphere;

  if (uNebulaEnabled > 0.5) {
    color += getNebulaColor(
      dir,
      uTime,
      uNebulaOpacity,
      uNebulaPulseMin,
      uNebulaPulseMax,
      uNebulaPulseSpeed
    );
  }

  gl_FragColor = vec4(color, 1.0);
}
